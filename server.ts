import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Curated fallbacks for reliable offline/error-free livestream flow
const FALLBACK_QUOTES = [
  { q: "Doomscrolling is the thief of joy and the creator of brainrot.", a: "Daisy the Flower" },
  { q: "Small intentional habits build giant unshakeable empires.", a: "Habit Hour" },
  { q: "Your attention is your most valuable asset. Spend it on things that feed your soul.", a: "Monster Blue" },
  { q: "A habit is a rope; we weave a thread of it each day, and at last we cannot break it.", a: "Horace Mann" },
  { q: "It is easier to prevent bad habits than to break them.", a: "Benjamin Franklin" },
  { q: "Great things are done by a series of small things brought together.", a: "Vincent Van Gogh" },
  { q: "Do not let what you cannot do interfere with what you can do.", a: "John Wooden" },
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain" }
];

const FALLBACK_WORDS = [
  { word: "hábito", translation: "habit" },
  { word: "atención", translation: "attention" },
  { word: "rutina", translation: "routine" },
  { word: "flor", translation: "flower" },
  { word: "monstruo", translation: "monster" },
  { word: "crear", translation: "to create" },
  { word: "aprender", translation: "to learn" },
  { word: "agradecido", translation: "grateful" },
  { word: "sonreír", translation: "to smile" },
  { word: "mente", translation: "mind" }
];

const FALLBACK_TRUTHS = [
  "What was the most useless thing you doomscrolled for over 30 minutes today?",
  "What is a silly habit you do when you think nobody is watching?",
  "Have you ever lied about completing a daily challenge or habit?",
  "What is the most embarrassing song on your current playlist?",
  "If you had to delete all social media apps except one, which one would you keep?",
  "What is the last thing you searched for on your phone?"
];

const FALLBACK_DARES = [
  "Do 5 jump jacks right now and yell 'Habit Hour is alive!'",
  "Stand up and do a silly 10-second victory dance.",
  "Close your eyes and try to touch your nose with your pinky finger 5 times.",
  "Drink a glass of water right now and say 'Hydration check!'",
  "Strike a dramatic superhero pose and hold it for 10 seconds.",
  "Say 'Mindless scrolling is banned!' in your best opera voice."
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Proxies to bypass CORS and guarantee stream safety ---

  // 1. Quote of the Day Proxy
  app.get("/api/quote", async (req, res) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const response = await fetch("https://zenquotes.io/api/random", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return res.json({ quote: data[0].q, author: data[0].a });
        }
      }
      throw new Error("Invalid response structure or status from ZenQuotes");
    } catch (error) {
      console.warn("ZenQuotes proxy failed, returning cheerful fallback:", error);
      const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      return res.json({ quote: fallback.q, author: fallback.a, isFallback: true });
    }
  });

  // Helper to fetch english meaning from Free Dictionary API
  async function fetchEnglishMeaning(englishWord: string): Promise<string> {
    if (!englishWord || englishWord === "Translation unavailable") return "";
    try {
      let cleanWord = englishWord.trim().toLowerCase();
      // Remove "to " if it's a verb
      if (cleanWord.startsWith("to ")) {
        cleanWord = cleanWord.slice(3).trim();
      }
      // Keep only letters/spaces
      cleanWord = cleanWord.replace(/[^a-zA-Z\s]/g, "").trim();
      if (!cleanWord) return "";

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.meanings?.[0]?.definitions?.[0]?.definition) {
          return data[0].meanings[0].definitions[0].definition;
        }
      }
    } catch (error) {
      console.warn("Failed to fetch dictionary definition:", error);
    }
    return "";
  }

  // 2. Word of the Day & Translation Proxy
  app.get("/api/word", async (req, res) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
 
      // Fetch random Spanish word
      const wordResponse = await fetch("https://random-word-api.herokuapp.com/word?lang=es", { signal: controller.signal });
      clearTimeout(timeoutId);
 
      if (!wordResponse.ok) throw new Error("Failed to fetch Spanish word");
 
      const wordData = await wordResponse.json();
      const rawWord = Array.isArray(wordData) ? wordData[0] : wordData;
 
      if (!rawWord) throw new Error("No word returned from word API");
 
      // Normalize word (remove special characters if any)
      const sanitizedWord = encodeURIComponent(rawWord.trim().toLowerCase());
 
      // Try translating using MyMemory Translation API
      const translateController = new AbortController();
      const translateTimeoutId = setTimeout(() => translateController.abort(), 4000);
 
      const translateResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${sanitizedWord}&langpair=es|en`,
        { signal: translateController.signal }
      );
      clearTimeout(translateTimeoutId);
 
      let translation = "Translation unavailable";
      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        if (translateData && translateData.responseData && translateData.responseData.translatedText) {
          translation = translateData.responseData.translatedText;
        }
      }

      // Fetch the English definition of the translated word
      const meaning = await fetchEnglishMeaning(translation);
 
      return res.json({ word: rawWord, translation, meaning });
    } catch (error) {
      console.warn("Spanish Word proxy failed, returning customized fallback:", error);
      const fallback = FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
      const meaning = await fetchEnglishMeaning(fallback.translation);
      return res.json({ word: fallback.word, translation: fallback.translation, meaning, isFallback: true });
    }
  });

  // 3. Truth or Dare Proxy
  app.get("/api/truthordare", async (req, res) => {
    const type = req.query.type === "dare" ? "dare" : "truth";
    const targetUrl = type === "dare" ? "https://api.truthordarebot.xyz/v1/dare" : "https://api.truthordarebot.xyz/v1/truth";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.question) {
          return res.json({ type, question: data.question });
        }
      }
      throw new Error("Invalid response structure from Truth or Dare API");
    } catch (error) {
      console.warn(`Truth/Dare API (${type}) failed, returning quirky fallback:`, error);
      const list = type === "dare" ? FALLBACK_DARES : FALLBACK_TRUTHS;
      const question = list[Math.floor(Math.random() * list.length)];
      return res.json({ type, question, isFallback: true });
    }
  });

  // --- Serve Frontend ---
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Habit Hour Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
