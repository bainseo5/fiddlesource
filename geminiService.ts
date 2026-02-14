
import { GoogleGenAI } from "@google/genai";
import { Tune } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTuneInsight = async (tune: Tune): Promise<string> => {
  try {
    // Adjust prompt based on artist if specific knowledge is desired, otherwise keep general
    const artistSpecificPart = tune.artist.includes("Junior Crehan")
      ? " Mention his role as a storyteller and composer in West Clare."
      : "";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short historical and musicological insight for the traditional tune "${tune.title}" as played by "${tune.artist}". Focus on its regional context (${tune.region}), any notable characteristics of its tuning (${tune.tuning}), and its significance in traditional music history.${artistSpecificPart} Keep it to 2-3 sentences.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "Insight unavailable at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not load historical insights.";
  }
};

export const chatAboutTunes = async (history: {role: 'user' | 'model', text: string}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      config: {
        systemInstruction: "You are an expert ethnomusicologist specializing in Irish and North American traditional fiddle music. You have deep knowledge of historical source recordings, including those from O'Connor's Bar in Doolin featuring artists like Micho Russell, Peadar O’Loughlin, Willie Shannon, Paddy Killourhy, Willie Clancy, and Joe Cuneen. You understand technical aspects like regional styles and ornamentation. Answer concisely and encourage the preservation of traditional music.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to my archive right now.";
  }
};