const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
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
    outputFielUploadedAt: {
        type: Date,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("Video", videoSchema);