require('dotenv').config({ path: './.env' });
const connectDB = require("./db/db");
const videoRoutes = require("./app");
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api", videoRoutes);

// Serve uploads (optional for accessing videos directly)
app.use("/uploads", express.static(path.join(__dirname, "..", "public", "uploads")));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});