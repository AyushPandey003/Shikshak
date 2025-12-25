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
 * Fetches course and module data for a given module_id
 */
export async function getCourseData(module_id) {
    const mongoose = await import("mongoose");
    const coursesDbUri = process.env.COURSES_MONGO_URI || "mongodb://localhost:27017/shikshak_courses";
    const coursesConnection = mongoose.createConnection(coursesDbUri);

    try {
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

        const module = await Module.findById(module_id);
        if (!module) return null;

        const course = await Course.findById(module.course_id);
        if (!course) return null;

        return {
            course: {
                name: course.name,
                teacher_name: course.teacher_details?.name
            },
            module: {
                title: module.title,
                description: module.description
            },
            students: course.students_id || []
        };
    } finally {
        await coursesConnection.close();
    }
}

/**
 * Fetches user and course data for a given user_id and course_id
 */
export async function getUserAndCourseData(user_id, course_id) {
    const mongoose = await import("mongoose");

    // Connections
    const coursesDbUri = process.env.COURSES_MONGO_URI || "mongodb://localhost:27017/shikshak_courses";
    const authDbUri = process.env.MONGO_URI || "mongodb://localhost:27017/shikshak_auth"; // Assuming auth DB URI

    const coursesConnection = mongoose.createConnection(coursesDbUri);
    const authConnection = mongoose.createConnection(authDbUri);

    try {
        // Course Schema
        const courseSchema = new mongoose.Schema({
            name: String,
            price: Number, // Assuming price exists
        });
        const Course = coursesConnection.model("Course", courseSchema);

        // User Schema
        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
        }, { collection: 'user' });
        const User = authConnection.model("User", userSchema);

        const course = await Course.findById(course_id);
        const user = await User.findById(user_id);

        if (!course || !user) return null;

        return {
            course: {
                name: course.name,
                price: course.price
            },
            user: {
                name: user.name,
                email: user.email
            }
        };
    } finally {
        await coursesConnection.close();
        await authConnection.close();
    }
}

/**
 * Sends module notification emails to a list of students
 */
export async function sendModuleNotification(students, module, course) {
    console.log(`📧 Sending emails to ${students.length} students for module: ${module.title}`);

    for (const student of students) {
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
            <p style="color: #4b5563; margin: 0;"><strong>Instructor:</strong> ${course.teacher_name || "Unknown"}</p>
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
}

/**
 * Sends payment confirmation email
 */
export async function sendPaymentConfirmation(user, course) {
    if (!user.email) return;

    console.log(`📧 Sending payment confirmation to ${user.email} for course: ${course.name}`);

    const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">🎉 Enrollment Successful!</h2>
          <p>Hi ${user.name},</p>
          <p>You have successfully enrolled in <strong>${course.name}</strong>.</p>
          <div style="background-color: #ecfdf5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="color: #065f46; margin: 0;">We are excited to have you on board! You can now access all the course materials.</p>
          </div>
          <p>Log in to your dashboard to start learning.</p>
          <p style="color: #6b7280; font-size: 14px;">Happy Learning,<br>The Shikshak Team</p>
        </div>
      `;

    try {
        await sendEmailViaGmail({
            to: user.email,
            subject: `✅ Enrollment Confirmed: ${course.name}`,
            body: emailBody,
        });
    } catch (error) {
        console.error(`Failed to send payment email to ${user.email}:`, error.message);
    }
}

export default {
    sendEmailViaGmail,
    getCourseData,
    getUserAndCourseData,
    sendModuleNotification,
    sendPaymentConfirmation
};
