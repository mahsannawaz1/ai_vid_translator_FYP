const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.DATABASE_URL;
        if (!uri) throw new Error("MONGO_URI is not defined in .env file");

        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;