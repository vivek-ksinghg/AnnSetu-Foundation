import express from "express";

import { chatbotReply } from "./controller.js";

const  chatBoatRouter= express.Router();

// Chatbot main route
chatBoatRouter.post("/chat", chatbotReply);

export default chatBoatRouter;


