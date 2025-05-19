const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Video = require("../models/Video");
const Subtitles = require("../models/Subtitles");
const { TEST_VIDEO_PATH, languageMap } = require("../constants");
const { OpenAI } = require("openai");
const { exec } = require('child_process');
const langs = require('langs');
const fsPromises = require("fs/promises");

require("dotenv").config();

// OpenAI API Client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { UPLOAD_DIR } = require("../constants");

// Create uploads dir if not exist
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

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

async function transcribeAudio(audioPath, language) {
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
            // language: "en",
            language: language,
            response_format: "verbose_json"
        });
        

        // return response.text; // Transcribed text; use when no timestamps
        return response.segments; // Transcribed text segments; use when timestamps
    } catch (err) {
        console.error("Whisper Error:", err);
        throw err;
    }
}

async function translateText(text, sourceLanguage, targetLanguage) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                // { role: "system", content: "Translate the following text into Urdu." },
                { role: "system", content: `Translate the following ${sourceLanguage} text into ${targetLanguage}. Respond only with the translation.`},
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

// ? We don't specify the language, it infers it
async function textToSpeech(text, id) {
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

        const finalAudioPath = path.join(__dirname, `../public/translated_audio_${id}.mp3`);
        await mergeAudioFiles(audioFiles, finalAudioPath);

        return finalAudioPath;
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

function replaceAudio(inputVideoPath, inputAudioPath, outputVideoPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i "${inputVideoPath}" -i "${inputAudioPath}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac "${outputVideoPath}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(`FFmpeg Error: ${error.message}`);
        return;
      }
      if (stderr && !stderr.toLowerCase().includes('deprecated')) {
        console.warn(`FFmpeg stderr:\n${stderr}`);
      }
      resolve();
    });
  });
}

function sendProgressUpdate(message, channelId, io) {
    try {
        if (channelId && io)
        {
            io.to(channelId).emit('channel-message', message);
            console.log(`Sent message: ${message}\nOver ${channelId}`)
        }
        else {
            throw new Error(`Either channelId or socket.io invalid:\n\tchannelId: ${channelId}\n\tsocket.io: ${io}`);
        }
    }
    catch (err) {
        console.warn(`When sending progress update via RTC: ${err}` )
    }
}

function secondsToSRTTime(sec) {
    const hours = String(Math.floor(sec / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const seconds = String(Math.floor(sec % 60)).padStart(2, '0');
    const milliseconds = String(Math.floor((sec % 1) * 1000)).padStart(3, '0');
    return `${hours}:${minutes}:${seconds},${milliseconds}`;
}

function generateSRT(segments) {
    return segments.map((seg, i) => {
        const start = secondsToSRTTime(seg.start);
        const end = secondsToSRTTime(seg.end);
        const text = seg.text.trim();
        return `${i + 1}\n${start} --> ${end}\n${text}\n`;
    }).join('\n');
}

// async function saveSRTFromWhisper(response, outputPath) {
//     if (!response.segments || !Array.isArray(response.segments)) {
//         throw new Error('No segments found in the Whisper response');
//     }

//     const srtContent = generateSRT(response.segments);
//     fs.writeFileSync(outputPath, srtContent, 'utf-8');
//     console.log(`SRT file saved to ${path.resolve(outputPath)}`);
// }

async function createAndSaveSRTInDB(video, path) {
    const subtitles = new Subtitles({
        originalName: video.originalName,
        filePath: path,
        video: video._id
    });

    await subtitles.save();
    return subtitles;
}

async function applySubtitlesToVideo(inputVideoPath, subtitlesPath) {
    const tempOutput = inputVideoPath.replace(/\.[^/.]+$/, "") + "_temp.mp4";
    // const cmd = `ffmpeg -y -i "${inputVideoPath}" -i "${subtitlesPath}" -c copy -c:s mov_text "${tempOutput}"`;
    // const cmd = `ffmpeg -y -i "${inputVideoPath}" -vf "subtitles='${subtitlesPath.replace(/\\/g, '\\\\')}'" -c:a copy "${tempOutput}"`;

    // const fixedSubtitlesPath = subtitlesPath.replace(/\\/g, '/'); // <-- safer
    // const cmd = `ffmpeg -y -i "${inputVideoPath}" -vf "subtitles='${fixedSubtitlesPath}'" -c:a copy "${tempOutput}"`;

    // const fixedSubtitlesPath = subtitlesPath.replace(/\\/g, '/'); // Convert to forward slashes for FFmpeg
    // const quotedPath = `"${fixedSubtitlesPath}"`; // Quote entire path
    // const cmd = `ffmpeg -y -i "${inputVideoPath}" -vf "subtitles=${quotedPath}" -c:a copy "${tempOutput}"`;

    const ffmpegSafePath = subtitlesPath
        .replace(/\\/g, '/')      // backslashes ➝ forward slashes
        .replace(/:/, '\\:');     // escape colon (only first colon for Windows drive letter)

    const cmd = `ffmpeg -y -i "${inputVideoPath}" -vf "subtitles='${ffmpegSafePath}'" -c:a copy "${tempOutput}"`;



    // try {
    //     const { stdout, stderr } = await exec(cmd);
    //     if (stderr) {
    //         console.log(`FFmpeg stderr:\n${stderr}`);
    //     }

        // await fs.rename(tempOutput, inputVideoPath);
        // console.log(`Subtitles embedded and ${inputVideoPath} replaced.`);
    //     return inputVideoPath;
    // } catch (err) {
    //     console.error("FFmpeg error:", err.message);
    //     throw err;
    // }
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
        if (error) {
            reject(`FFmpeg Error: ${error.message}`);
            return;
        }
        if (stderr && !stderr.toLowerCase().includes('deprecated')) {
            console.warn(`FFmpeg stderr:\n${stderr}`);
        }
        resolve();
        });
    });
}

// const languageMap = {
//   en: "English",
//   ur: "Urdu",
//   es: "Spanish",
//   fr: "French",
//   de: "German",
//   zh: "Chinese",
//   hi: "Hindi",
//   ru: "Russian",
//   ar: "Arabic",
//   pt: "Portuguese",
//   // Add more as needed
// }
function getLanguageName(code, fallback) {
    if (!code || code.length != 2) {
        return fallback;
    }
    return languageMap[code.toLowerCase()] || fallback;
}

exports.getTranslatedAudio = async (req, res) => {
    try {
        console.log(`Source: ${req.body.originalLang}\nTarget: ${req.body.targetLang}`);

        const fellback = {
            sourceLang: false,
            targetLang: false
        };

        const sourceLanguage = getLanguageName(req.body.originalLang, "English");
        const targetLanguage = getLanguageName(req.body.targetLang, "Urdu");

        console.log(`Source: ${sourceLanguage}\nTarget: ${targetLanguage}`);

        let originalCode = (req.body.originalLang) ? req.body.originalLang.toLowerCase() : "en";
        if (originalCode != "en" && sourceLanguage == "English") {
            originalCode = "en";
            fellback.sourceLang = true;
        }

        let targetCode = (req.body.targetLang) ? req.body.targetLang.toLowerCase() : "ur";
        if (targetCode != "ur" && targetLanguage == "Urdu") {
            targetCode = "ur";
            fellback.targetLang = true;
        }

        if (fellback.sourceLang || fellback.targetLang) {
            console.error(`Given languages not recognized! ${fellback} \n\tSource: ${req.body.originalLang.toLowerCase()}\n\tTarget: ${req.body.targetLang}\n`);
        }

        // ^ RTC init
        const io = req.app.get('io');
        const channelId = req.body.channelId;
        const message = {
            type: 'status',
            text: 'Video processing started',
        };
        // * The channelId and socket.io are passed in the request.
        // * Make sure to implement this properly on the client side

        // ^ Video upload
        // const file = req.file;
        // if (!file) return res.status(400).send("No file uploaded");
    
        // const newVideo = new Video({
        //     originalName: file.originalname,
        //     filePath: file.path,
        // });
    
        // message.text = "Uploading Video";
        // sendProgressUpdate(message, channelId, io);

        // await newVideo.save();

        // ^ Retrieve Video from DB
        
        message.text = "Retriving video from DB";
        sendProgressUpdate(message, channelId, io);
        
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).send("Video not found");
        // ? just to make sure that it has been uploaded to the database
        // TODO optimize everything

        // ^ Generate Audio Path
        const audioPath = video.filePath.replace(/\.[^/.]+$/, "") + ".mp3";

        // ^ Extract Audio from Video
        
        message.text = "Extracting Audio";
        sendProgressUpdate(message, channelId, io);

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
        
        message.text = "Transcribing Audio";
        sendProgressUpdate(message, channelId, io);

        const segments = await transcribeAudio(audioPath, originalCode);
        if (!segments || !segments.length) return res.status(500).send("Transcription failed! No transcribed segments");

        const originalSRT = generateSRT(segments);
        fs.writeFileSync((video.filePath.replace(/\.[^/.]+$/, "") + ".srt"), originalSRT, 'utf-8');
        console.log(`SRT file saved to ${(path.resolve(video.filePath.replace(/\.[^/.]+$/, "") + ".srt"))}`);

        // * now save SRT
        const subtitles = await createAndSaveSRTInDB(video, (video.filePath.replace(/\.[^/.]+$/, "") + ".srt"));

        // ^ Translate segment-by-segment and preserve timing
        
        message.text = "Translating Audio";
        sendProgressUpdate(message, channelId, io);

        let translatedText = "";
        let srtEntries = [];

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

                const translated = await translateText(seg.text.trim(), sourceLanguage, targetLanguage);
                translatedText += translated;

                // Pause detection
                if (i < segments.length - 1) {
                    const next = segments[i + 1];
                    const gap = next.start - seg.end;
                    if (gap > 0.5) {
                        translatedText += `[PAUSE:${gap.toFixed(1)}]`;
                    }
                }

                const start = secondsToSRTTime(seg.start);
                const end = secondsToSRTTime(seg.end);
                srtEntries.push(`${i + 1}\n${start} --> ${end}\n${translated}\n`);

                translatedText += " ";
            }
        }
        if (!translatedText) {
            console.error(`Translation Failed! No complete translated text! Text: \n{\n${translatedText}\n}`);
            res.status(500).send("Translation failed! No complete translated text!");
        }
        const srtContent = srtEntries.join('\n');
        fs.writeFileSync((video.filePath.replace(/\.[^/.]+$/, "") + "_translated.srt"), srtContent, 'utf-8');
        console.log(`Translated SRT saved to ${(video.filePath.replace(/\.[^/.]+$/, "") + "_translated.srt")}`);

        subtitles.sourceLang = originalCode;
        subtitles.targetLang = targetCode;
        subtitles.outputFileName = path.basename((video.filePath.replace(/\.[^/.]+$/, "") + "_translated.srt"));
        subtitles.outputFilePath = (video.filePath.replace(/\.[^/.]+$/, "") + "_translated.srt");
        subtitles.outputFileUploadedAt = new Date();
        await subtitles.save();

        // * End

        // ^ Convert Translated Text to Speech (TTS)
        
        message.text = "Synthesizing Translated Audio";
        sendProgressUpdate(message, channelId, io);

        const audioUrl = await textToSpeech(translatedText, req.params.id);
        if (!audioUrl) return res.status(500).send("TTS failed");
        console.log("Audio translated path: " + audioUrl)

        // // ^ Respond with Transcription, Translation, and TTS Audio File URL
        // res.json({ 
        //     transcript: segments,
        //     translation: translatedText, 
        //     audioUrl
        // });

        // ^ replace then audio in the video
        
        message.text = "Replacing Audio";
        sendProgressUpdate(message, channelId, io);

        console.log("Replacing audio")
        const translatedVideoPath = video.filePath.replace(/\.[^/.]+$/, "") + "_translated.mp4";
        // await replaceAudio(video.filePath, audioUrl, video.filePath.replace(/\.[^/.]+$/, "") + "_translated.mp4")
        await replaceAudio(video.filePath, audioUrl, translatedVideoPath)
        console.log("Audio replaced path: " + translatedVideoPath)

        // if (req.body.applySubtitles) {
        //     console.log("Applying subtitles");
        //     message.text = "Applying Subtitles";
        //     sendProgressUpdate(message, channelId, io);
        //     applySubtitlesToVideo(translatedVideoPath, subtitles.outputFilePath)
        //         .then(
        //             async () => {
        //                 await fsPromises.rename((translatedVideoPath.replace(/\.[^/.]+$/, "") + "_temp.mp4"), translatedVideoPath);
        //                 console.log(`Subtitles embedded and ${translatedVideoPath} replaced.`);
        //             }
        //         );
        // }
        if (req.body.applySubtitles) {
            console.log("Applying subtitles");
            message.text = "Applying Subtitles";
            sendProgressUpdate(message, channelId, io);

            try {
                await applySubtitlesToVideo(translatedVideoPath, subtitles.outputFilePath);
                await fsPromises.rename(
                    translatedVideoPath.replace(/\.[^/.]+$/, "") + "_temp.mp4",
                    translatedVideoPath
                );
                console.log(`Subtitles embedded and ${translatedVideoPath} replaced.`);
            } catch (err) {
                console.error("Error applying subtitles:", err);
            }
        }


        // ^ Update the video object in db
        console.log("Saving translated video");
        video.sourceLang = originalCode;
        video.targetLang = targetCode;
        video.outputFileName = path.basename(translatedVideoPath);
        video.outputFilePath = translatedVideoPath;
        video.outputFileUploadedAt = new Date();
        await video.save();

        // ^ return the video to the client

        // message.text = "Sending Translated Video";
        // sendProgressUpdate(message, channelId, io);

        // res.download(translatedVideoPath, () => {
        //     // // fs.unlinkSync(audioUrl); // clean up
        //     console.log("Response sent")
        // });
        // ? We are separating Downloading, Translating, and Uploading

        console.log("Video translated and stored in DB");

        message.text = "Video Translated and ready for download!";
        sendProgressUpdate(message, channelId, io);

        if (fellback.sourceLang || fellback.targetLang) {
            res.status(400).send({
                video,
                subtitles,
                user: req.user,
                failure: fellback
            });
        }

        res.status(200).send({
            video,
            subtitles,
            user: req.user
        });

        // TODO 2: delete translations?
    } catch (err) {
        console.error("Couldn't translate audio: ", err);
        res.status(500).send(`Couldn't translate audio: ${err}`);
    }
};

exports.downloadTranslatedVideo = async (req, res) => {
    try {
        const user = req.user;
        const video = req.body.video;
        if (user._id != video.user) {
            throw new Error("User doesn't have permission to acces the video!");
        }
        const videoInDB = await Video.findById(video._id);
        if (video.outputFilePath != videoInDB.outputFilePath) {
            throw new Error("Mismatching output file paths!");
        }
        res.download(
            video.outputFilePath,
            () => {
                console.log("File sent");
            }
        );
    }
    catch (err) {
        console.error(`Couldn't send the video to client! Error: ${err}`);
        res.status(500).send(`Couldn't send the video to client! Error: ${err}`);
    }
}

exports.getAllVideos = async (req, res) => {
    try {
        const user = req.user;
        const videos = await Video.find({
            "user": req.user._id
        });
        res.status(200).send(videos);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}
