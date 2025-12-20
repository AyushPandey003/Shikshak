"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parent = exports.Student = exports.Teacher = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    image: String,
    role: {
        type: String,
        enum: ['user', 'teacher', 'student', 'parent'],
        default: 'user', // Default role until updated
    },
    phoneNumber: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { discriminatorKey: 'role', timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
// Teacher Discriminator
const Teacher = User.discriminator('teacher', new mongoose_1.default.Schema({
    subjects: [String],
    qualifications: [String],
    experiences: [String],
    classes: [String],
}));
exports.Teacher = Teacher;
// Student Discriminator
const Student = User.discriminator('student', new mongoose_1.default.Schema({
    class: String,
    courseId: String,
}));
exports.Student = Student;
// Parent Discriminator
const Parent = User.discriminator('parent', new mongoose_1.default.Schema({
    referId: String,
}));
exports.Parent = Parent;
