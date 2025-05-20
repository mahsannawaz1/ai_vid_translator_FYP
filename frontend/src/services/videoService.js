import axios from 'axios'
import { getToken } from './userService';
import subtitlesParser from 'subtitles-parser';

export const uploadVideo = async(payload) => {
    const origin = process.env.REACT_APP_API_URL;
    try {
        const response = await axios.post(
            `${origin}/api/upload`,
            payload,
            {
                headers: {
                "Content-Type": "multipart/form-data",
                'Authorization':`Bearer ${getToken()}`
                },
            }
            );
        return response.data;
    } catch (error) {
        console.error("Error uploading the video:", error);
        throw error;
    }
}

export const translateAudio = async(videoId,payload) => {
    const origin = process.env.REACT_APP_API_URL;
    try {
        const response = await axios.post(
            `${origin}/api/translate-audio/${videoId}`,
            payload,
            {
                headers: {
                "Content-Type": "application/json",
                'Authorization':`Bearer ${getToken()}`
                },
            }
            );
        return response.data;
    } catch (error) {
        console.error("Error translating the video:", error);
        throw error;
    }
}

export const getTranslation = async(payload) => {
    const origin = process.env.REACT_APP_API_URL;
    try {
        const response = await axios.post(
            `${origin}/download`,
            payload,
            {
                headers: {
                "Content-Type": "application/json",
                'Authorization':`Bearer ${getToken()}`
                },
            }
            );
        return response.data;
    } catch (error) {
        console.error("Error uploading the video:", error);
        throw error;
    }
}

export const dashboardDetails = async ()=>{
    const origin = process.env.REACT_APP_API_URL;
    const res = await axios.get(
        `${origin}/api/videos`,
        { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${getToken()}`
            },
        }
    )
    return res
}

export const getFile = (fullPath) => {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const filename = fullPath?.split("\\").pop();
    return `${baseUrl}/temp/${encodeURIComponent(filename)}`;
};

// export const extractSubtitles = async (subtitleFilePath) => {
//     const filename = subtitleFilePath.split("\\").pop(); // get filename only
//         const res = await fetch(`/temp/${encodeURIComponent(filename)}`);
//         const srt = await res.text();
//         const parsed = parse(srt);
//         const cleaned = parsed
//             .filter(line => line.type === "cue")
//             .map((line, i) => ({
//                 index: i + 1,
//                 start: msToTime(line.data.start),
//                 end: msToTime(line.data.end),
//                 text: line.data.text
//             }));

//         return cleaned
// }
export const extractSubtitles = async (subtitleFilePath) => {
    const filename = subtitleFilePath.split("\\").pop();
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/temp/${encodeURIComponent(filename)}`);
    const srtText = await res.text();
    const parsed = subtitlesParser.fromSrt(srtText, true);
    console.log(parsed)
    return parsed
}

export const msToSrtTime = (ms) => {
    const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    const msPart = String(ms % 1000).padStart(3, '0');
    return `${h}:${m}:${s}`;
}