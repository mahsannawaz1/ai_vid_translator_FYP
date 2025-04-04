const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Video = require("../models/Video");
const { TEST_VIDEO_PATH } = require("../constants");

// Upload controller is handled by Multer middleware in `routes/app.js`

exports.extractAudio = async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send("Video not found");

    const audioPath = video.filePath.replace(/\.[^/.]+$/, "") + ".mp3";

    ffmpeg(video.filePath)
        .output(audioPath)
        .on("end", () => {
            res.download(audioPath, () => {
                fs.unlinkSync(audioPath); // clean up
            });
        })
        .on("error", (err) => {
            console.error(err);
            res.status(500).send("Audio extraction failed");
        })
        .run();
};

exports.deleteVideo = async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send("Video not found");

    fs.unlink(video.filePath, async (err) => {
        if (err) return res.status(500).send("File deletion failed");
        await video.deleteOne();
        res.send("Video deleted successfully");
    });
};

exports.getTestVideo = (req, res) => {
    if (!fs.existsSync(TEST_VIDEO_PATH)) {
        return res.status(404).send("Test video not found");
    }
    res.download(TEST_VIDEO_PATH);
};