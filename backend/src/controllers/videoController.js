const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Video = require("../models/Video");
const { TEST_VIDEO_PATH } = require("../constants");
const { OpenAI } = require("openai");
require("dotenv").config();

// OpenAI API Client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Upload controller is handled by Multer middleware in `routes/app.js`

/**
 * @swagger
 * /extract-audio/{id}:
 *   get:
 *     summary: Extract audio from a video file
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video to extract audio from
 *     responses:
 *       200:
 *         description: Successfully extracted and downloaded audio
 *       404:
 *         description: Video not found
 *       500:
 *         description: Audio extraction failed
 */
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

/**
 * @swagger
 * /video/{id}:
 *   delete:
 *     summary: Delete a video file
 *     tags: [Videos]
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
 *       500:
 *         description: File deletion failed
 */
exports.deleteVideo = async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send("Video not found");

    fs.unlink(video.filePath, async (err) => {
        if (err) return res.status(500).send("File deletion failed");
        await video.deleteOne();
        res.send("Video deleted successfully");
    });
};

/**
 * @swagger
 * /test-video:
 *   get:
 *     summary: Download a test video file
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: Test video downloaded successfully
 *       404:
 *         description: Test video not found
 */
exports.getTestVideo = (req, res) => {
    if (!fs.existsSync(TEST_VIDEO_PATH)) {
        return res.status(404).send("Test video not found");
    }
    res.download(TEST_VIDEO_PATH);
};

async function transcribeAudio(audioPath) {
    try {
        // TODO 3: Get the language from the request
        // * Doesn't give timestamps
        // const response = await openai.audio.transcriptions.create({
        //     file: fs.createReadStream(audioPath),
        //     model: "whisper-1",
        //     language: "en", // Adjust if needed
        // });

        // * Gives timestamps
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioPath),
            model: "whisper-1",
            language: "en",
            response_format: "verbose_json"
        });
        

        // return response.text; // Transcribed text; use when no timestamps
        return response.segments; // Transcribed text segments; use when timestamps
    } catch (err) {
        console.error("Whisper Error:", err);
        throw err;
    }
}

async function translateText(text) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Translate the following text into Urdu." },
                { role: "user", content: text },
            ],
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("Translation Error:", err);
        throw err;
    }
}

function splitTextIntoChunks(text, chunkSize) {
    const chunks = [];
    let currentChunk = '';
    
    for (let char of text) {
        // Add the character to the current chunk
        currentChunk += char;
        
        // If the current chunk has reached the desired size, push it to the chunks array
        if (currentChunk.length >= chunkSize) {
            chunks.push(currentChunk);
            currentChunk = ''; // Reset the chunk
        }
    }

    // If there's any leftover text, push it as a final chunk
    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

const CHUNK_SIZE = 4096; // OpenAI's character limit for TTS

async function textToSpeech(text) {
    try {
        const textChunks = splitTextIntoChunks(text, CHUNK_SIZE);
        const audioFiles = [];

        for (let i = 0; i < textChunks.length; i++) {
            const chunk = textChunks[i];
            console.log(`Processing chunk ${i + 1}/${textChunks.length}...`);

            const response = await openai.audio.speech.create({
                model: "tts-1",
                voice: "alloy",
                input: chunk,
            });

            const publicDir = path.join(__dirname, "../public");
            if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
            }

            const chunkPath = path.join(publicDir, `audio_chunk_${i}.mp3`);
            const stream = fs.createWriteStream(chunkPath);

            
            await new Promise((resolve, reject) => {
                response.body.pipe(stream);
                response.body.on("error", reject);
                stream.on("finish", resolve);
            });

            audioFiles.push(chunkPath);
        }

        const finalAudioPath = path.join(__dirname, "../public/translated_audio.mp3");
        await mergeAudioFiles(audioFiles, finalAudioPath);

        return "/uploads/translated_audio.mp3";
    } catch (err) {
        console.error("TTS Error:", err);
        throw err;
    }
}

async function mergeAudioFiles(inputFiles, outputFile) {
    return new Promise((resolve, reject) => {
        const mergedAudio = ffmpeg();

        inputFiles.forEach((file) => {
            mergedAudio.input(file);
        });

        mergedAudio
            .on("end", async () => {
                // ✅ Cleanup: Delete chunk files after merge
                for (const file of inputFiles) {
                    fs.unlink(file, (err) => {
                        if (err) console.warn("Failed to delete chunk:", file);
                    });
                }
                resolve();
            })
            .on("error", (err) => {
                console.error("Failed to merge audio chunks:", err);
                reject(err);
            })
            .mergeToFile(outputFile, path.join(__dirname, "../temp"));
    });
}



exports.getTranslatedAudio = async (req, res) => {
    try {
        // ^ Retrieve Video from DB
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).send("Video not found");

        // ^ Generate Audio Path
        const audioPath = video.filePath.replace(/\.[^/.]+$/, "") + ".mp3";

        // ^ Extract Audio from Video
        await new Promise((resolve, reject) => {
            ffmpeg(video.filePath)
                .output(audioPath)
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        // * The following lines which have been double commented remove silence
//        // ^ Transcribe Audio using OpenAI Whisper
//        // const transcription = await transcribeAudio(audioPath);
//        // if (!transcription) return res.status(500).send("Transcription failed");
//
//        // ^ Translate Transcription to Urdu using GPT-4o
//        // const translatedText = await translateText(transcription);
//        // if (!translatedText) return res.status(500).send("Translation failed");

        // * The following pipeline preserves silence
        // ^ Transcribe Audio using Whisper with Timestamps
        const segments = await transcribeAudio(audioPath);
        if (!segments || !segments.length) return res.status(500).send("Transcription failed! No transcribed segments");

        // ^ Translate segment-by-segment and preserve timing
        let translatedText = "";

        // ? Outdated and thus commented
        // for (let i = 0; i < segments.length; i++) {
        //     const seg = segments[i];
        //     const translated = await translateText(seg.text);
        //     translatedText += translated;

        //     // Detect pauses between segments
        //     if (i < segments.length - 1) {
        //         const next = segments[i + 1];
        //         const gap = next.start - seg.end;

        //         if (gap > 0.5) {
        //             translatedText += `[PAUSE:${gap.toFixed(1)}]`; // Tag to insert silence later
        //         }
        //     }

        //     translatedText += " "; // basic space for separation
        // }
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];

            if (seg.text && typeof seg.text === "string" && seg.text.trim()) {
                console.log(`Translating segment ${i + 1}/${segments.length}: "${seg.text}"`);

                const translated = await translateText(seg.text.trim());
                translatedText += translated;

                // Pause detection
                if (i < segments.length - 1) {
                    const next = segments[i + 1];
                    const gap = next.start - seg.end;
                    if (gap > 0.5) {
                        translatedText += `[PAUSE:${gap.toFixed(1)}]`;
                    }
                }

                translatedText += " ";
            }
        }
        if (!translatedText) {
            console.error(`Translation Failed! No complete translated text! Text: \n{\n${translatedText}\n}`);
            res.status(500).send("Translation failed! No complete translated text!");
        }
        // * End

        // ^ Convert Translated Text to Speech (TTS)
        const audioUrl = await textToSpeech(translatedText);
        if (!audioUrl) return res.status(500).send("TTS failed");

        // ^ Respond with Transcription, Translation, and TTS Audio File URL
        res.json({ 
            transcript: segments,
            translation: translatedText, 
            audioUrl
        });

        // ^ return the audio to the client and delete it, disabled for testing
        // res.download(audioUrl, () => {
        //     fs.unlinkSync(audioUrl); // clean up
        // });

        // TODO 1: rather than returning the audio, attach the audio to the video and return that

        // TODO Final: After testing, enable the translated video file return and cleanup
        // TODO Error: AudioURL is absolute, change it to referential

    } catch (err) {
        console.error("Couldn't translate audio: ", err);
        res.status(500).send(`Couldn't translate audio: ${err}`);
    }
};

