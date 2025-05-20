const path = require("path");

module.exports = {
    UPLOAD_DIR: path.join(__dirname, "..", "public", "temp"),
    TEST_VIDEO_PATH: path.join(__dirname, "..", "public/temp", "test.mp4"),
    languageMap: {
        en: "English",
        ur: "Urdu",
        es: "Spanish",
        fr: "French",
        de: "German",
        zh: "Chinese",
        hi: "Hindi",
        ru: "Russian",
        ar: "Arabic",
        pt: "Portuguese",
        // Add more as needed
    },
};
