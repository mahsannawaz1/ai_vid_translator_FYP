const path = require("path");

module.exports = {
    UPLOAD_DIR: path.join(__dirname, "..", "public", "temp"),
    TEST_VIDEO_PATH: path.join(__dirname, "..", "public/temp", "test.mp4"),
};