// infra/emailService.js
import { google } from "googleapis";

// Gmail API configuration - uses OAuth2
// You need to set these environment variables:
// GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER_EMAIL

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

/**
 * Creates a raw email message in base64url format
 */
function createRawEmail({ to, subject, body }) {
    const emailLines = [
        `To: ${to}`,
        `From: ${process.env.GMAIL_USER_EMAIL}`,
        `Subject: ${subject}`,
        "Content-Type: text/html; charset=utf-8",
        "",
        body,
    ];

    const email = emailLines.join("\r\n");
    // Base64url encode the email
    return Buffer.from(email)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * Sends an email using Gmail API
 */
export async function sendEmailViaGmail({ to, subject, body }) {
    try {
        const raw = createRawEmail({ to, subject, body });

        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: raw,
            },
        });

        console.log(`✅ Email sent successfully to ${to}. Message ID: ${response.data.id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error.message);
        throw error;
    }
}

/**
 * Sends module notification email to enrolled students
 * @param {string} module_id - The ID of the created module
 * @param {string} course_id - The ID of the course
 */
export async function sendModuleNotificationEmail(module_id, course_id) {
    // Import mongoose to query the database
    const mongoose = await import("mongoose");

    // Connect to Courses database to get course and module details
    const coursesDbUri = process.env.COURSES_MONGO_URI || "mongodb://localhost:27017/shikshak_courses";
    const coursesConnection = mongoose.createConnection(coursesDbUri);

    try {
        // Define schemas for the courses database
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

        const Course = coursesConnection.model("Course", courseSchema);
        const Module = coursesConnection.model("Module", moduleSchema);

        // Fetch module and course details
        const module = await Module.findById(module_id);
        const course = await Course.findById(course_id);

        if (!module || !course) {
            console.log(`⚠️ Module or Course not found. Module ID: ${module_id}, Course ID: ${course_id}`);
            return;
        }

        const enrolledStudents = course.students_id || [];

        if (enrolledStudents.length === 0) {
            console.log(`ℹ️ No enrolled students for course: ${course.name}`);
            return;
        }

        console.log(`📧 Sending emails to ${enrolledStudents.length} enrolled students...`);

        // Send email to each enrolled student
        for (const student of enrolledStudents) {
            if (!student.email) continue;

            const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🎓 New Module Added!</h2>
          <p>Hi ${student.name || "Student"},</p>
          <p>A new module has been added to your enrolled course:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3 style="color: #1f2937; margin: 0 0 8px 0;">${module.title}</h3>
            <p style="color: #6b7280; margin: 0 0 8px 0;">${module.description || "No description available"}</p>
            <p style="color: #4b5563; margin: 0;"><strong>Course:</strong> ${course.name}</p>
            <p style="color: #4b5563; margin: 0;"><strong>Instructor:</strong> ${course.teacher_details?.name || "Unknown"}</p>
          </div>
          <p>Log in to Shikshak to start learning!</p>
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The Shikshak Team</p>
        </div>
      `;

            try {
                await sendEmailViaGmail({
                    to: student.email,
                    subject: `📚 New Module: ${module.title} - ${course.name}`,
                    body: emailBody,
                });
            } catch (emailError) {
                console.error(`Failed to send to ${student.email}:`, emailError.message);
            }
        }

        console.log(`✅ Finished sending notification emails for module: ${module.title}`);
    } finally {
        await coursesConnection.close();
    }
}

export default { sendEmailViaGmail, sendModuleNotificationEmail };
