import {
    BlobServiceClient,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    StorageSharedKeyCredential
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.config/.env') });

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || "uploads";

if (!AZURE_STORAGE_CONNECTION_STRING) {
    console.warn("⚠️ AZURE_STORAGE_CONNECTION_STRING is missing in .env");
}

let blobServiceClient;
let containerClient;

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
        containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

        const exists = await containerClient.exists();
        if (!exists) {
            console.log(`Creating container: ${CONTAINER_NAME}`);
            await containerClient.create({ access: "blob" });
        }
    } catch (error) {
        console.error("Error initializing Azure Storage:", error.message);
    }
}

export const uploadFileToAzure = async (fileBuffer, originalName, mimeType) => {
    await initAzureStorage();

    const extension = originalName.split(".").pop();
    const blobName = `${uuidv4()}.${extension}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: { blobContentType: mimeType },
        });

        // Return structured data including the blobName, so frontend can request SAS later if needed
        return {
            url: blockBlobClient.url,
            blobName: blobName
        };
    } catch (error) {
        console.error("Error uploading file to Azure:", error.message);
        throw new Error("File upload failed");
    }
};

export const generateSasUrl = (blobName) => {
    try {
        const { accountName, accountKey } = getAccountCredentials();
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName: CONTAINER_NAME,
                blobName,
                permissions: BlobSASPermissions.parse("r"), // READ ONLY
                expiresOn: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
            },
            sharedKeyCredential
        ).toString();

        return `https://${accountName}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}?${sasToken}`;
    } catch (error) {
        console.error("Error generating SAS URL:", error.message);
        throw new Error("Could not generate SAS URL");
    }
};

export const deleteBlobFromAzure = async (blobName) => {
    await initAzureStorage();

    try {
        console.log(blobName, "blobName")
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const exists = await blockBlobClient.exists();

        if (!exists) {
            return { success: false, message: "Blob not found" };
        }

        await blockBlobClient.delete();
        return { success: true, message: "Blob deleted successfully" };
    } catch (error) {
        console.error("Error deleting blob from Azure:", error.message);
        throw new Error("Blob deletion failed");
    }
};
