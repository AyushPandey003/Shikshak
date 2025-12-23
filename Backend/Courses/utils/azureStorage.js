import {
    BlobServiceClient,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    StorageSharedKeyCredential
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Container names for different access levels
const CONTAINERS = {
    public: process.env.AZURE_PUBLIC_CONTAINER || "public-assets",    // Thumbnails, previews, profile pics
    private: process.env.AZURE_PRIVATE_CONTAINER || "private-content" // Course videos, PDFs, exams
};

// SAS expiry times based on content category
const SAS_EXPIRY = {
    course: 24 * 60 * 60 * 1000,     // 24 hours - Course videos, materials
    exam: 30 * 60 * 1000,             // 30 minutes - Exam files (more secure)
    certificate: 7 * 24 * 60 * 60 * 1000, // 7 days - Certificates (longer access)
    default: 24 * 60 * 60 * 1000      // 24 hours - Default
};

// File categories - determines which container and expiry to use
const FILE_CATEGORIES = {
    // PUBLIC - No SAS needed, direct access
    thumbnail: { container: "public", needsSas: false },
    preview: { container: "public", needsSas: false },
    profile: { container: "public", needsSas: false },

    // PRIVATE - SAS required
    course: { container: "private", needsSas: true, expiry: "course" },
    video: { container: "private", needsSas: true, expiry: "course" },
    material: { container: "private", needsSas: true, expiry: "course" },
    exam: { container: "private", needsSas: true, expiry: "exam" },
    certificate: { container: "private", needsSas: true, expiry: "certificate" },

    // Default for unspecified
    default: { container: "private", needsSas: true, expiry: "default" }
};

if (!AZURE_STORAGE_CONNECTION_STRING) {
    console.warn("⚠️ AZURE_STORAGE_CONNECTION_STRING is missing in .env");
}

let blobServiceClient;
const containerClients = {};

// Parse connection string for SAS generation
const getAccountCredentials = () => {
    if (!AZURE_STORAGE_CONNECTION_STRING) throw new Error("Missing Connection String");

    const matches = AZURE_STORAGE_CONNECTION_STRING.match(/AccountName=([^;]+);AccountKey=([^;]+)/);
    if (!matches) throw new Error("Invalid Connection String format");

    return {
        accountName: matches[1],
        accountKey: matches[2]
    };
};

async function initAzureStorage() {
    if (blobServiceClient) return;

    try {
        blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // Initialize both containers
        for (const [type, containerName] of Object.entries(CONTAINERS)) {
            const client = blobServiceClient.getContainerClient(containerName);
            const exists = await client.exists();

            if (!exists) {
                console.log(`Creating container: ${containerName}`);
                // Public container = blob access, Private = no public access
                await client.create({
                    access: type === "public" ? "blob" : undefined
                });
            }

            containerClients[type] = client;
        }
    } catch (error) {
        console.error("Error initializing Azure Storage:", error.message);
    }
}

/**
 * Upload file to Azure with category-based routing
 * @param {Buffer} fileBuffer - File data
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type
 * @param {string} category - File category: 'thumbnail', 'preview', 'profile', 'course', 'video', 'material', 'exam', 'certificate'
 * @returns {Object} { url, blobName, category, isPublic }
 */
export const uploadFileToAzure = async (fileBuffer, originalName, mimeType, category = "default") => {
    await initAzureStorage();

    const config = FILE_CATEGORIES[category] || FILE_CATEGORIES.default;
    const containerClient = containerClients[config.container];
    const containerName = CONTAINERS[config.container];

    const extension = originalName.split(".").pop();
    const blobName = `${category}/${uuidv4()}.${extension}`; // Organize by category
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: { blobContentType: mimeType },
        });

        const { accountName } = getAccountCredentials();

        // Generate appropriate URL based on category
        let url;
        if (!config.needsSas) {
            // Public file - direct URL, never expires
            url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
        } else {
            // Private file - generate SAS URL
            url = generateSasUrl(blobName, category);
        }

        return {
            url,
            blobName,
            category,
            container: config.container,
            isPublic: !config.needsSas,
            expiresIn: config.needsSas ? SAS_EXPIRY[config.expiry] : null
        };
    } catch (error) {
        console.error("Error uploading file to Azure:", error.message);
        throw new Error("File upload failed");
    }
};

/**
 * Generate SAS URL with category-based expiry
 * @param {string} blobName - Blob name (can include path like 'course/uuid.mp4')
 * @param {string} category - File category for expiry determination
 * @returns {string} SAS URL
 */
export const generateSasUrl = (blobName, category = "default") => {
    try {
        const { accountName, accountKey } = getAccountCredentials();
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        const config = FILE_CATEGORIES[category] || FILE_CATEGORIES.default;

        // If it's a public file, return direct URL
        if (!config.needsSas) {
            const containerName = CONTAINERS[config.container];
            return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
        }

        const containerName = CONTAINERS.private;
        const expiryTime = SAS_EXPIRY[config.expiry] || SAS_EXPIRY.default;

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName,
                blobName,
                permissions: BlobSASPermissions.parse("r"), // READ ONLY
                expiresOn: new Date(Date.now() + expiryTime)
            },
            sharedKeyCredential
        ).toString();

        return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
    } catch (error) {
        console.error("Error generating SAS URL:", error.message);
        throw new Error("Could not generate SAS URL");
    }
};

/**
 * Get public URL for public files (no expiry)
 * @param {string} blobName - Blob name
 * @returns {string} Direct public URL
 */
export const getPublicUrl = (blobName) => {
    const { accountName } = getAccountCredentials();
    return `https://${accountName}.blob.core.windows.net/${CONTAINERS.public}/${blobName}`;
};

/**
 * Helper to get URL - automatically determines public vs SAS
 * @param {string} blobName - Blob name
 * @param {string} category - File category
 * @returns {string} Appropriate URL (public or SAS)
 */
export const getFileUrl = (blobName, category = "default") => {
    const config = FILE_CATEGORIES[category] || FILE_CATEGORIES.default;

    if (!config.needsSas) {
        return getPublicUrl(blobName);
    }

    return generateSasUrl(blobName, category);
};
