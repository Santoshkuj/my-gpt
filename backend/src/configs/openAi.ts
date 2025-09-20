import {OpenAI} from "openai"

const openai = new OpenAI({
    apiKey: process.env.GEMINI_APIKEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export default openai