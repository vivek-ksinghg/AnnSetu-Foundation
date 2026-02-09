import { chatbotData } from "./chatbotData.js";
import { embed } from "./semanticModel.js";

export async function prepareData() {
  for (const item of chatbotData) {
    if (!item.embedding) {
      item.embedding = await embed(item.intent);
    }
  }
  console.log("✅ Chatbot data embedded");
}
