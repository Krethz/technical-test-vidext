import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.AZURE_AI_API_KEY,
  baseURL: `https://${process.env.AZURE_API_URL}/${process.env.AZURE_DEPLOYMENT_NAME}/completions?api-version=2023-05-15`,
  defaultHeaders: { "api-key": process.env.AZURE_AI_API_KEY },
});
