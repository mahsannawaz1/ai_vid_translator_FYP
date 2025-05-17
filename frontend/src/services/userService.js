import axios from 'axios'

export const registerUser = async(payload) => {
    const origin = process.env.REACT_APP_API_URL;
    try {
        const response = await axios.post(
            `${origin}/api/register`,
            payload,
            {
                headers: {
                'Content-Type': 'application/json',
                },
            }
            );
        return response.data;
    } catch (error) {
        console.error("Error generating offer check:", error);
        throw error;
    }
}
