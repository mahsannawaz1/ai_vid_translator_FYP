require('dotenv').config({ path: './.env' });
const connectDB = require("./db/db");
const videoRoutes = require("./app");
const path = require("path");
const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());

app.use(express.json());

// Routes
app.use("/api", videoRoutes);

// Serve uploads (optional for accessing videos directly)
app.use("/uploads", express.static(path.join(__dirname, "..", "public", "uploads")));

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Video Translating API",
            version: `${process.env.VERSION || "0.0.1"}`,
            description: `API for tranlsating videos using OpenAI's tools`,
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: "Backend for AI Powered Video Translator",
            },
        ],
    },
    // apis: ["./routes/*.js", "./app.js", "./controllers/*.js", __filename],
    apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger running at http://localhost:${PORT}/swagger`);
});