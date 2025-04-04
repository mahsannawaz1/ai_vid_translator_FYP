const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { UPLOAD_DIR } = require("./constants");
const Video = require("./models/Video");
const {
    extractAudio,
    deleteVideo,
    getTestVideo,
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

// Upload video
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

// Extract audio
router.get("/extract-audio/:id", extractAudio);

// Delete video
router.delete("/video/:id", deleteVideo);

// Serve test video
router.get("/test-video", getTestVideo);

module.exports = router;
