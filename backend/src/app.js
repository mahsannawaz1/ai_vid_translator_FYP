const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const { UPLOAD_DIR } = require("./constants");
const Video = require("./models/Video");
const {
    extractAudio,
    deleteVideo,
    getTestVideo,
    getTranslatedAudio,
} = require("./controllers/videoController");

const router = express.Router();

// Create uploads dir if not exist
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the video
 *         originalName:
 *           type: string
 *           description: The original name of the uploaded video
 *         filePath:
 *           type: string
 *           description: The path where the video is stored
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Uploads a video file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: video
 *         type: file
 *         required: true
 *         description: The video file to upload
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       400:
 *         description: No file uploaded
 */
router.post("/upload", upload.single("video"), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    const newVideo = new Video({
        originalName: file.originalname,
        filePath: file.path,
    });

    await newVideo.save();
    res.status(200).json({ message: "Video uploaded", id: newVideo._id });
});

/**
 * @swagger
 * /extract-audio/{id}:
 *   get:
 *     summary: Extracts audio from a video
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video
 *     responses:
 *       200:
 *         description: Audio file extracted and sent
 *       404:
 *         description: Video not found
 *       500:
 *         description: Extraction failed
 */
router.get("/extract-audio/:id", extractAudio);

router.get("/translate-audio/:id", getTranslatedAudio);

/**
 * @swagger
 * /video/{id}:
 *   delete:
 *     summary: Deletes a video
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video to delete
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 */
router.delete("/video/:id", deleteVideo);

/**
 * @swagger
 * /test-video:
 *   get:
 *     summary: Serves a test video
 *     responses:
 *       200:
 *         description: Returns a test video
 */
router.get("/test-video", getTestVideo);

module.exports = router;
