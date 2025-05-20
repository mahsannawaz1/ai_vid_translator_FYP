const mongoose = require("mongoose");

const subtitleSchema = new mongoose.Schema({
    originalName: String,
    filePath: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    outputFileName: {
        type:String,
        default: null
    },
    outputFilePath: {
        type:String,
        default: null
    },
    outputFileUploadedAt: {
        type: Date,
        default: null
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    sourceLang: String,
    targetLang: String
});

module.exports = mongoose.model("Subtitles", subtitleSchema);