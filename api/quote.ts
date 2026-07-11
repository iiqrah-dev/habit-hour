// api/quote.ts

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

export default async function handler(req, res) {
  try {
    const response = await fetch("https://zenquotes.io/api/random");

    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return res.status(200).json({
          quote: data[0].q,
          author: data[0].a
        });
      }
    }

    throw new Error("Invalid quote response");

  } catch (error) {
    console.warn("Quote API failed, using fallback:", error);

    const fallback =
      FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];

    return res.status(200).json({
      quote: fallback.q,
      author: fallback.a,
      isFallback: true
    });
  }
}