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

export const verifyUserEmail = async (token) => {
    const origin = process.env.REACT_APP_API_URL;
    await axios.post(`${origin}/api/verifyEmail`,{token})
}

export const loginUser = async (payload)=>{
    const origin = process.env.REACT_APP_API_URL;
    const res = await axios.post(
        `${origin}/api/login`,
        payload,
        { 
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    return res
}

export const getToken = ()=>{
    return localStorage.getItem("x-auth-token") || null
}

export const logOutUser = () => {
    localStorage.removeItem("x-auth-token")
}