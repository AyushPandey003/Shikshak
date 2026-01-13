// infra/emailService.js
// Industry-Grade Email Service with Security Best Practices

const { google } = require("googleapis");

// ============================================================================
// CONFIGURATION & VALIDATION
// ============================================================================

const REQUIRED_ENV_VARS = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "GMAIL_USER_EMAIL",
    "MONGO_URI"
];

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MONGODB_ID_REGEX = /^[a-fA-F0-9]{24}$/;

// Rate limiting configuration
const RATE_LIMIT = {
    maxEmailsPerMinute: 10,
    emailsThisMinute: new Map(), // Map<email, count>
    lastReset: Date.now()
};

// Retry configuration
const RETRY_CONFIG = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000
};

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

function maskEmail(email) {
    if (!email || typeof email !== 'string') return '[invalid]';
    const [local, domain] = email.split('@');
    if (!domain) return '[invalid]';
    const maskedLocal = local.substring(0, 2) + '***';
    return `${maskedLocal}@${domain}`;
}

function log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const maskedMeta = { ...meta };

    // Mask sensitive data
    if (maskedMeta.email) maskedMeta.email = maskEmail(maskedMeta.email);
    if (maskedMeta.to) maskedMeta.to = maskEmail(maskedMeta.to);

    const logEntry = {
        timestamp,
        level,
        service: 'EmailService',
        message,
        ...maskedMeta
    };

    if (level === 'ERROR') {
        console.error(JSON.stringify(logEntry));
    } else if (level === 'WARN') {
        console.warn(JSON.stringify(logEntry));
    } else {
        console.log(JSON.stringify(logEntry));
    }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateEnvironment() {
    const missing = REQUIRED_ENV_VARS.filter(v => !process.env[v]);
    if (missing.length > 0) {
        log('ERROR', 'Missing required environment variables', { missing });
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    log('INFO', 'Environment validation passed');
}

function isValidEmail(email) {
    return typeof email === 'string' && EMAIL_REGEX.test(email);
}

function isValidMongoId(id) {
    return typeof id === 'string' && MONGODB_ID_REGEX.test(id);
}

function sanitizeHtml(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================================================
// RATE LIMITING
// ============================================================================

function checkRateLimit(email) {
    const now = Date.now();

    // Reset counter every minute
    if (now - RATE_LIMIT.lastReset > 60000) {
        RATE_LIMIT.emailsThisMinute.clear();
        RATE_LIMIT.lastReset = now;
    }

    const currentCount = RATE_LIMIT.emailsThisMinute.get(email) || 0;

    if (currentCount >= RATE_LIMIT.maxEmailsPerMinute) {
        log('WARN', 'Rate limit exceeded', { email, count: currentCount });
        return false;
    }

    RATE_LIMIT.emailsThisMinute.set(email, currentCount + 1);
    return true;
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry(operation, operationName) {
    let lastError;

    for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            // Don't retry on validation errors or permanent failures
            if (error.code === 400 || error.code === 401 || error.code === 403) {
                log('ERROR', `${operationName} failed with permanent error`, {
                    attempt,
                    errorCode: error.code,
                    errorMessage: error.message
                });
                throw error;
            }

            if (attempt < RETRY_CONFIG.maxRetries) {
                const delay = Math.min(
                    RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt - 1),
                    RETRY_CONFIG.maxDelayMs
                );
                log('WARN', `${operationName} attempt ${attempt} failed, retrying in ${delay}ms`, {
                    errorMessage: error.message
                });
                await sleep(delay);
            }
        }
    }

    log('ERROR', `${operationName} failed after ${RETRY_CONFIG.maxRetries} attempts`, {
        errorMessage: lastError?.message
    });
    throw lastError;
}

// ============================================================================
// GMAIL API SETUP
// ============================================================================

let oauth2Client = null;
let gmail = null;

function initializeGmailClient() {
    if (gmail) return gmail;

    oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    gmail = google.gmail({ version: "v1", auth: oauth2Client });
    log('INFO', 'Gmail client initialized');
    return gmail;
}

// ============================================================================
// EMAIL CREATION
// ============================================================================

function createRawEmail({ to, subject, body }) {
    const fromEmail = process.env.GMAIL_USER_EMAIL;

    // RFC 2047 encoding for subject
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;

    const emailLines = [
        `MIME-Version: 1.0`,
        `To: ${to}`,
        `From: Shikshak <${fromEmail}>`,
        `Subject: ${encodedSubject}`,
        `Content-Type: text/html; charset=utf-8`,
        `Content-Transfer-Encoding: base64`,
        `List-Unsubscribe: <mailto:${fromEmail}?subject=Unsubscribe>`,
        `X-Priority: 3`,
        ``,
        Buffer.from(body).toString('base64')
    ];

    const email = emailLines.join("\r\n");
    return Buffer.from(email)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

// ============================================================================
// SEND EMAIL FUNCTION
// ============================================================================

async function sendEmailViaGmail({ to, subject, body }) {
    // Input validation
    if (!isValidEmail(to)) {
        log('ERROR', 'Invalid email address', { to });
        throw new Error(`Invalid email address: ${maskEmail(to)}`);
    }

    if (!subject || typeof subject !== 'string' || subject.length > 998) {
        log('ERROR', 'Invalid subject line');
        throw new Error('Invalid subject line');
    }

    // Rate limiting
    if (!checkRateLimit(to)) {
        throw new Error(`Rate limit exceeded for ${maskEmail(to)}`);
    }

    // Initialize Gmail client
    const gmailClient = initializeGmailClient();

    // Send with retry
    return withRetry(async () => {
        const raw = createRawEmail({ to, subject, body });

        const response = await gmailClient.users.messages.send({
            userId: "me",
            requestBody: { raw }
        });

        log('INFO', 'Email sent successfully', {
            to,
            messageId: response.data.id,
            subject: subject.substring(0, 50)
        });

        return response.data;
    }, 'sendEmail');
}

// ============================================================================
// MONGODB CONNECTION POOL
// ============================================================================

let mongoConnection = null;
let connectionPromise = null;

async function getMongoConnection() {
    if (mongoConnection?.readyState === 1) {
        return mongoConnection;
    }

    // Prevent multiple simultaneous connection attempts
    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = (async () => {
        const mongoose = require("mongoose");
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI not configured');
        }

        mongoConnection = mongoose.createConnection(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        mongoConnection.on('error', (err) => {
            log('ERROR', 'MongoDB connection error', { errorMessage: err.message });
        });

        mongoConnection.on('connected', () => {
            log('INFO', 'MongoDB connected for email service');
        });

        // Wait for connection to be ready
        await new Promise((resolve, reject) => {
            mongoConnection.once('open', resolve);
            mongoConnection.once('error', reject);
        });

        return mongoConnection;
    })();

    try {
        const conn = await connectionPromise;
        connectionPromise = null;
        return conn;
    } catch (error) {
        connectionPromise = null;
        mongoConnection = null;
        throw error;
    }
}

// ============================================================================
// DATA FETCHING FUNCTIONS
// ============================================================================

async function getCourseData(module_id) {
    // Validate input
    if (!isValidMongoId(module_id)) {
        log('WARN', 'Invalid module_id provided', { module_id: module_id?.substring(0, 10) });
        return null;
    }

    try {
        const mongoose = require("mongoose");
        const connection = await getMongoConnection();

        const courseSchema = new mongoose.Schema({
            name: String,
            students_id: [{
                id: String,
                name: String,
                email: String,
            }],
            teacher_details: {
                name: String,
            },
        });

        const moduleSchema = new mongoose.Schema({
            title: String,
            description: String,
            course_id: mongoose.Schema.Types.ObjectId,
        });

        // Use existing models or create new ones
        const Course = connection.models.Course || connection.model("Course", courseSchema);
        const Module = connection.models.Module || connection.model("Module", moduleSchema);

        const moduleDoc = await Module.findById(module_id).lean();
        if (!moduleDoc) {
            log('WARN', 'Module not found', { module_id });
            return null;
        }

        const course = await Course.findById(moduleDoc.course_id).lean();
        if (!course) {
            log('WARN', 'Course not found for module', { module_id });
            return null;
        }

        return {
            course: {
                name: sanitizeHtml(course.name),
                teacher_name: sanitizeHtml(course.teacher_details?.name)
            },
            module: {
                title: sanitizeHtml(moduleDoc.title),
                description: sanitizeHtml(moduleDoc.description)
            },
            students: (course.students_id || []).filter(s => isValidEmail(s.email))
        };
    } catch (error) {
        log('ERROR', 'Failed to fetch course data', {
            module_id,
            errorMessage: error.message
        });
        return null;
    }
}

async function getUserAndCourseData(user_id, course_id) {
    // Validate inputs
    if (!isValidMongoId(user_id) || !isValidMongoId(course_id)) {
        log('WARN', 'Invalid IDs provided', {
            user_id: user_id?.substring(0, 10),
            course_id: course_id?.substring(0, 10)
        });
        return null;
    }

    try {
        const mongoose = require("mongoose");
        const connection = await getMongoConnection();

        const courseSchema = new mongoose.Schema({
            name: String,
            price: Number,
        });

        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
        }, { collection: 'user' });

        const Course = connection.models.Course || connection.model("Course", courseSchema);
        const User = connection.models.User || connection.model("User", userSchema);

        const [course, user] = await Promise.all([
            Course.findById(course_id).lean(),
            User.findById(user_id).lean()
        ]);

        if (!course || !user) {
            log('WARN', 'Course or user not found', { user_id, course_id });
            return null;
        }

        if (!isValidEmail(user.email)) {
            log('WARN', 'User has invalid email', { user_id });
            return null;
        }

        return {
            course: {
                name: sanitizeHtml(course.name),
                price: course.price
            },
            user: {
                name: sanitizeHtml(user.name),
                email: user.email
            }
        };
    } catch (error) {
        log('ERROR', 'Failed to fetch user and course data', {
            user_id,
            course_id,
            errorMessage: error.message
        });
        return null;
    }
}

// ============================================================================
// EMAIL NOTIFICATION FUNCTIONS
// ============================================================================

async function sendModuleNotification(students, module, course) {
    if (!Array.isArray(students) || students.length === 0) {
        log('INFO', 'No students to notify');
        return { sent: 0, failed: 0 };
    }

    log('INFO', `Sending module notifications`, {
        studentCount: students.length,
        moduleTitle: module?.title
    });

    let sent = 0;
    let failed = 0;

    for (const student of students) {
        if (!isValidEmail(student.email)) {
            log('WARN', 'Skipping invalid student email');
            failed++;
            continue;
        }

        const emailBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Module Available</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px;">Hi ${sanitizeHtml(student.name) || "Student"},</p>
            <p style="color: #6b7280; font-size: 14px;">A new module has been added to your enrolled course:</p>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 18px;">${sanitizeHtml(module.title)}</h3>
              <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px;">${sanitizeHtml(module.description) || "No description available"}</p>
              <p style="color: #4b5563; margin: 0; font-size: 14px;"><strong>Course:</strong> ${sanitizeHtml(course.name)}</p>
              <p style="color: #4b5563; margin: 0; font-size: 14px;"><strong>Instructor:</strong> ${sanitizeHtml(course.teacher_name) || "Unknown"}</p>
            </div>
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Start Learning</a>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              This email was sent by Shikshak Learning Platform.<br>
              If you no longer wish to receive these emails, you can unsubscribe.
            </p>
          </div>
        </div>
      `;

        try {
            await sendEmailViaGmail({
                to: student.email,
                subject: `New Module Added: ${module.title} - ${course.name}`,
                body: emailBody,
            });
            sent++;
        } catch (emailError) {
            log('ERROR', 'Failed to send module notification', {
                email: student.email,
                errorMessage: emailError.message
            });
            failed++;
        }
    }

    log('INFO', 'Module notification batch complete', { sent, failed });
    return { sent, failed };
}

async function sendPaymentConfirmation(user, course) {
    if (!user?.email || !isValidEmail(user.email)) {
        log('WARN', 'Invalid user email for payment confirmation');
        return false;
    }

    log('INFO', 'Sending payment confirmation', {
        email: user.email,
        courseName: course?.name
    });

    const emailBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Enrollment Successful!</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px;">Hi ${sanitizeHtml(user.name)},</p>
            <p style="color: #6b7280; font-size: 14px;">Congratulations! You have successfully enrolled in:</p>
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin: 0; font-size: 18px;">${sanitizeHtml(course.name)}</h3>
              ${course.price ? `<p style="color: #047857; margin: 8px 0 0 0; font-size: 14px;">Amount Paid: ₹${course.price}</p>` : ''}
            </div>
            <p style="color: #6b7280; font-size: 14px;">You now have full access to all course materials. Start learning today!</p>
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Go to Course</a>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              This email was sent by Shikshak Learning Platform.<br>
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      `;

    try {
        await sendEmailViaGmail({
            to: user.email,
            subject: `Enrollment Confirmed: ${course.name}`,
            body: emailBody,
        });
        return true;
    } catch (error) {
        log('ERROR', 'Failed to send payment confirmation', {
            email: user.email,
            errorMessage: error.message
        });
        return false;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Validate environment on module load (with graceful handling)
try {
    validateEnvironment();
} catch (error) {
    console.error('[EmailService] Warning: Environment validation failed -', error.message);
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    sendEmailViaGmail,
    getCourseData,
    getUserAndCourseData,
    sendModuleNotification,
    sendPaymentConfirmation
};
