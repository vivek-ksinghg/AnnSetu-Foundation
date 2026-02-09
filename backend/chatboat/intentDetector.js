

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "not",
  "is",
  "are",
  "was",
  "were",
  "be",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "from",
  "by",
  "as",
  "at",
  "it",
  "this",
  "that",
  "these",
  "those",
  "i",
  "me",
  "my",
  "you",
  "your",
  "we",
  "our",
  "they",
  "their",
  "what",
  "which",
  "when",
  "where",
  "why",
  "who",
  "how",
  "can",
  "do",
  "does",
  "did",
]);

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalizeText(text)
    .split(" ")
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => !STOPWORDS.has(w));
}

function scoreMatch(messageTokens, keywordTokens) {
  if (keywordTokens.length === 0) return 0;
  const msgSet = new Set(messageTokens);
  let matches = 0;
  for (const word of keywordTokens) {
    if (msgSet.has(word)) matches++;
  }
  return matches / keywordTokens.length;
}

export function detectIntent(message, data) {
  const messageTokens = tokenize(message);
  if (messageTokens.length === 0) return null;

  let best = { score: 0, response: null };

  for (const item of data) {
    for (const keyword of item.keywords) {
      const keywordTokens = tokenize(keyword);

      const score = scoreMatch(messageTokens, keywordTokens);
      if (score > best.score) {
        best = { score, response: item.response };
      }

      const messageText = ` ${normalizeText(message)} `;
      const keywordText = normalizeText(keyword);
      if (keywordText && messageText.includes(` ${keywordText} `)) {
        return item.response;
      }
    }
  }

  const threshold = 0.6;
  return best.score >= threshold ? best.response : null;
}
