// api/truthordare.ts

const FALLBACK_TRUTHS = [
  "What was the most useless thing you doomscrolled for over 30 minutes today?",
  "What is a silly habit you do when you think nobody is watching?",
  "Have you ever lied about completing a daily challenge or habit?"
];

const FALLBACK_DARES = [
  "Do 5 jump jacks right now and yell 'Habit Hour is alive!'",
  "Stand up and do a silly 10-second victory dance."
];


export default async function handler(req, res) {

  const type = req.query.type === "dare" ? "dare" : "truth";

  const url =
    type === "dare"
      ? "https://api.truthordarebot.xyz/v1/dare"
      : "https://api.truthordarebot.xyz/v1/truth";

  try {

    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      if (data?.question) {
        return res.status(200).json({
          type,
          question: data.question
        });
      }
    }

    throw new Error("Invalid response");

  } catch (error) {

    const list =
      type === "dare"
        ? FALLBACK_DARES
        : FALLBACK_TRUTHS;

    const question =
      list[Math.floor(Math.random() * list.length)];

    return res.status(200).json({
      type,
      question,
      isFallback: true
    });
  }
}