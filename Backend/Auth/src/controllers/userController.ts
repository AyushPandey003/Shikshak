import { IncomingMessage, ServerResponse } from 'http';
import { parseBody, setCorsHeaders } from '../utils/httpUtils';
import { User } from '../models/User';
import { auth } from '../auth';
import { fromNodeHeaders } from "better-auth/node";


export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        // Verify Session
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        const userId = session.user.id;
        const user = await User.findById(userId);

        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } catch (error: any) {
        console.error('Get User Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
}

export const handleUpdateProfile = async (req: IncomingMessage, res: ServerResponse) => {
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }

    try {
        // Verify Session
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        const body = await parseBody(req);
        let { role, phoneNumber, subjects, qualifications, experiences, classes, class: studentClass, classGrade, courseId, coursesEnrolled, referId } = body;

        // Basic Validation
        if (!role) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Role is required' }));
            return;
        }

        // Normalize role
        role = role.toLowerCase();

        // Fetch user first to update discriminator key correctly
        const userId = session.user.id;
        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        // Set common fields
        userToUpdate.role = role;
        if (phoneNumber) userToUpdate.phoneNumber = phoneNumber;

        // Set role-specific fields
        if (role === 'teacher') {
            if (subjects) userToUpdate.set('subjects', subjects);
            if (qualifications) userToUpdate.set('qualifications', qualifications);
            if (experiences) userToUpdate.set('experiences', experiences);
            if (classes) userToUpdate.set('classes', classes);
        } else if (role === 'student') {
            // Map frontend fields to DB fields
            const classVal = studentClass || classGrade;
            const coursesVal = coursesEnrolled || (courseId ? [courseId] : []);

            if (classVal) userToUpdate.set('class', classVal);
            if (coursesVal) userToUpdate.set('courses', coursesVal);
        } else if (role === 'parent') {
            if (referId) userToUpdate.set('referId', referId);
        }

        // Save to persist discriminator changes and new fields
        const updatedUser = await userToUpdate.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Profile updated successfully', user: updatedUser }));

    } catch (error: any) {
        console.error('Update Profile Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
};
