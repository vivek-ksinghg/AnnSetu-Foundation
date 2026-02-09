

import { chatbotData } from "./chatbotData.js";
import { semanticReply } from "./semanticEngine.js";
import { prepareData } from "./prepareData.js";

let isReady = false;

export const chatbotReply = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Please ask a question." });
  }

  if (!isReady) {
    await prepareData();
    isReady = true;
  }

  const { score, answer } = await semanticReply(message, chatbotData);

  // 🔐 Confidence gate
  if (score < 0.45) {
    return res.json({
      reply: "Sorry, I can answer questions related to the AnnSetu platform only.",
      source: "policy"
    });
  }

  return res.json({
    reply: answer,
    source: "semantic",
    confidence: score.toFixed(2)
  });
};




// 


// import {GoogleGenAI} from "@google/genai";

// /**
//  * ANNSETU SYSTEM PROMPT
//  */
// const ANNSETU_SYSTEM_PROMPT = `
// You are "Annsetu Assistant", an AI chatbot created ONLY for the Annsetu
// food waste management and redistribution platform.

// ABOUT ANNSETU:
// Annsetu is a platform that connects food donors, verified NGOs, and
// volunteers to reduce food waste and distribute surplus food to needy people.

// YOU CAN HELP WITH:
// - How to donate food on Annsetu
// - NGO registration and verification process
// - Volunteer registration and duties
// - Login, dashboard, and account-related help
// - Food pickup, delivery, and safety guidelines
// - Annsetu rules, FAQs, and general usage help

// STRICT RULES:
// - ONLY answer questions related to Annsetu
// - DO NOT answer coding, programming, DSA, politics, exams, or personal questions
// - If the question is unrelated, reply EXACTLY:
// "Sorry, I can only help with Annsetu-related questions."

// RESPONSE STYLE:
// - Friendly and respectful
// - Simple English, Hindi, or Hinglish (match user language)
// - Clear and step-by-step when needed
// - Do NOT invent features or promises

// You are NOT a general AI chatbot.
// You are a platform-specific assistant for Annsetu.
// `;

// export const chatbotReply = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message || !message.trim()) {
//       return res.status(400).json({
//         success: false,
//         reply: "Message is required"
//       });
//     }

//     // Initialize Gemini
//     const genAI = new GoogleGenAI({
//       apiKey: process.env.GEMINI_KEY,
//     });

//     // Generate response
//     const response = await genAI.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `${ANNSETU_SYSTEM_PROMPT}\n\nUser Question: ${message}`
//             }
//           ]
//         }
//       ],
//     });

//     const reply = response.text || 
//       "Sorry, I can only help with Annsetu-related questions.";

//     return res.status(200).json({
//       success: true,
//       reply
//     });

//   } catch (error) {
//     console.error("Annsetu Chatbot Error:", error);

//     return res.status(500).json({
//       success: false,
//       reply: "⚠️ Something went wrong. Please try again."
//     });
//   }
// };
