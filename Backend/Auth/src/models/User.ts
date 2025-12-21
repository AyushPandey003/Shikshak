import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
}, { discriminatorKey: 'role', timestamps: true, collection: 'user' });

const User = mongoose.model('User', userSchema);

// Teacher Discriminator
const Teacher = User.discriminator('teacher', new mongoose.Schema({
    subjects: [String],
    qualifications: [String],
    experiences: [String],
    classes: [String],
}));

// Student Discriminator
const Student = User.discriminator('student', new mongoose.Schema({
    class: String,
    courses: [String],
}));

// Parent Discriminator
const Parent = User.discriminator('parent', new mongoose.Schema({
    referId: String,
}));

export { User, Teacher, Student, Parent };
