import { pipeline } from "@xenova/transformers";

let embedder = null;

export async function loadSemanticModel() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("✅ Semantic model loaded");
  }
  return embedder;
}

export async function embed(text) {
  const model = await loadSemanticModel();
  const output = await model(text, {
    pooling: "mean",
    normalize: true
  });
  return Array.from(output.data);
}
