import { embed } from "./semanticModel.js";

// Cosine similarity function
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Finds best semantic answer
 */
export async function semanticReply(message, data) {
  const userVector = await embed(message);

  let bestScore = 0;
  let bestAnswer = null;

  for (const item of data) {
    const score = cosineSimilarity(userVector, item.embedding);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.response;
    }
  }

  return {
    score: bestScore,
    answer: bestAnswer
  };
}
