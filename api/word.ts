
// api/word.ts

const WORDS = [
  {
    word: "hábito",
    translation: "habit",
    meaning: "A repeated action that shapes your daily life."
  },
  {
    word: "constancia",
    translation: "consistency",
    meaning: "The ability to continue something steadily over time."
  },
  {
    word: "disciplina",
    translation: "discipline",
    meaning: "The practice of controlling yourself to achieve a goal."
  },
  {
    word: "enfoque",
    translation: "focus",
    meaning: "The ability to concentrate attention on something important."
  },
  {
    word: "propósito",
    translation: "purpose",
    meaning: "A reason or intention behind an action."
  },
  {
    word: "crecimiento",
    translation: "growth",
    meaning: "The process of developing and improving."
  },
  {
    word: "aprendizaje",
    translation: "learning",
    meaning: "The process of gaining knowledge or skills."
  },
  {
    word: "curiosidad",
    translation: "curiosity",
    meaning: "A desire to learn, explore, and understand."
  },
  {
    word: "gratitud",
    translation: "gratitude",
    meaning: "The feeling of appreciating what you have."
  },
  {
    word: "serenidad",
    translation: "serenity",
    meaning: "A peaceful and calm state of mind."
  },

  {
    word: "sobremesa",
    translation: "conversation after a meal",
    meaning: "The Spanish tradition of staying at the table talking after eating."
  },
  {
    word: "saudade",
    translation: "deep longing",
    meaning: "A nostalgic feeling of missing something or someone."
  },
  {
    word: "duende",
    translation: "creative spirit",
    meaning: "A mysterious artistic inspiration or emotional power."
  },
  {
    word: "desvelo",
    translation: "sleeplessness / dedication",
    meaning: "A state of losing sleep because of effort, care, or passion."
  },
  {
    word: "alegría",
    translation: "joy",
    meaning: "A feeling of happiness and delight."
  },
  {
    word: "ilusión",
    translation: "hope / excitement",
    meaning: "A positive feeling of anticipation for something."
  },
  {
    word: "chispa",
    translation: "spark",
    meaning: "A small burst of energy, creativity, or personality."
  },
  {
    word: "brillo",
    translation: "shine",
    meaning: "A quality that makes something stand out."
  },
  {
    word: "esencia",
    translation: "essence",
    meaning: "The fundamental nature of something."
  },
  {
    word: "huella",
    translation: "footprint / mark",
    meaning: "A lasting impression left behind."
  },

  {
    word: "fluir",
    translation: "to flow",
    meaning: "To move naturally without forcing things."
  },
  {
    word: "renacer",
    translation: "to be reborn",
    meaning: "To start again with renewed energy."
  },
  {
    word: "atreverse",
    translation: "to dare",
    meaning: "To have courage to try something."
  },
  {
    word: "soñar",
    translation: "to dream",
    meaning: "To imagine possibilities and hopes."
  },
  {
    word: "crear",
    translation: "to create",
    meaning: "To bring something new into existence."
  },
  {
    word: "descubrir",
    translation: "to discover",
    meaning: "To find something previously unknown."
  },
  {
    word: "transformar",
    translation: "to transform",
    meaning: "To create a meaningful change."
  },

  {
    word: "luz",
    translation: "light",
    meaning: "Something that represents clarity or hope."
  },
  {
    word: "alma",
    translation: "soul",
    meaning: "The inner emotional or spiritual self."
  },
  {
    word: "mente",
    translation: "mind",
    meaning: "The part responsible for thoughts and awareness."
  },
  {
    word: "calma",
    translation: "calm",
    meaning: "A peaceful state without stress."
  },
  {
    word: "equilibrio",
    translation: "balance",
    meaning: "A stable state between different parts of life."
  },
  {
    word: "armonía",
    translation: "harmony",
    meaning: "A pleasing balance between different elements."
  },

  {
    word: "guay",
    translation: "cool",
    meaning: "Spanish slang meaning something is great or impressive."
  },
  {
    word: "chido",
    translation: "cool",
    meaning: "Mexican slang meaning awesome or nice."
  },
  {
    word: "chévere",
    translation: "cool / great",
    meaning: "A common slang word meaning something enjoyable."
  },
  {
    word: "vale",
    translation: "okay / alright",
    meaning: "A common Spanish expression meaning agreement."
  },
  {
    word: "venga",
    translation: "come on / let's go",
    meaning: "An expression used for encouragement or agreement."
  },
  {
    word: "qué onda",
    translation: "what's up",
    meaning: "A casual greeting in some Spanish-speaking countries."
  },
  {
    word: "tranqui",
    translation: "chill / relaxed",
    meaning: "Shortened slang form of tranquilo."
  },
  {
    word: "curro",
    translation: "job / work",
    meaning: "Informal Spanish word for work."
  },
  {
    word: "pasta",
    translation: "money",
    meaning: "Informal Spanish slang for money."
  },
  {
    word: "tío",
    translation: "dude / guy",
    meaning: "Informal way to refer to someone in Spain."
  }
];

export default function handler(req, res) {
  const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  res.status(200).json(randomWord);
}