"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateProfile = void 0;
const httpUtils_1 = require("../utils/httpUtils");
const User_1 = require("../models/User");
const auth_1 = require("../auth");
const node_1 = require("better-auth/node");
const handleUpdateProfile = async (req, res) => {
    (0, httpUtils_1.setCorsHeaders)(res);
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
        const session = await auth_1.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers)
        });
        if (!session) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }
        const body = await (0, httpUtils_1.parseBody)(req);
        const { role, phoneNumber, subjects, qualifications, experiences, classes, class: studentClass, courseId, referId } = body;
        // Basic Validation
        if (!role) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Role is required' }));
            return;
        }
        const userId = session.user.id;
        const updateData = { role, phoneNumber };
        // Role specific fields
        if (role === 'teacher') {
            updateData.subjects = subjects;
            updateData.qualifications = qualifications;
            updateData.experiences = experiences;
            updateData.classes = classes;
        }
        else if (role === 'student') {
            updateData.class = studentClass; // 'class' is reserved keyword in JS/TS sometimes, strictly key 'class' in DB
            updateData.courseId = courseId;
        }
        else if (role === 'parent') {
            updateData.referId = referId;
        }
        // Update User
        const updatedUser = await User_1.User.findByIdAndUpdate(userId, updateData, { new: true });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Profile updated successfully', user: updatedUser }));
    }
    catch (error) {
        console.error('Update Profile Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
    }
};
exports.handleUpdateProfile = handleUpdateProfile;
