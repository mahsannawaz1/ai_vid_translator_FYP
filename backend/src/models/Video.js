const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    originalName: String,
    filePath: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Video", videoSchema);