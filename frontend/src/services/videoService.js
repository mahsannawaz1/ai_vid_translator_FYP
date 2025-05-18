import axios from 'axios'
import { getToken } from './userService';

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

export const translateAudio = async(videoId,channelId) => {
    const origin = process.env.REACT_APP_API_URL;
    try {
        const response = await axios.post(
            `${origin}/api/translate-audio/${videoId}`,
            {
                channelId
            },
            {
                headers: {
                "Content-Type": "application/json",
                'Authorization':`Bearer ${getToken()}`
                },
            }
            );
        return response.data;
    } catch (error) {
        console.error("Error translating the audio:", error);
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