import connectDB from './config/db.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    await connectDB();
    const users = await User.find({});
    console.log("Users in DB:", users);
    process.exit(0);
}

run();
