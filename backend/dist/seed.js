"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const seedAdmin = async () => {
    try {
        await (0, db_1.default)();
        const adminEmail = 'admin@edunest.com';
        const adminExists = await User_1.default.findOne({ email: adminEmail });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }
        await User_1.default.create({
            name: 'Super Admin',
            email: adminEmail,
            password: 'adminpassword123',
            role: 'SUPER_ADMIN',
        });
        console.log('Super Admin created successfully');
        console.log('Email: admin@edunest.com');
        console.log('Password: adminpassword123');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};
seedAdmin();
