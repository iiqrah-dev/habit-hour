import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Dices, AlertTriangle, Shield, Flame } from "lucide-react";
import logoImg from "../assets/images/habit-hour-logo.png";

interface TruthOrDareViewProps {
  onBack: () => void;
}

const LOCAL_TRUTHS = [
  "What was the most useless thing you doomscrolled for over 30 minutes today?",
  "What is a silly habit you do when you think nobody is watching?",
  "Have you ever lied about completing a daily challenge or habit?",
  "What is the most embarrassing song on your current playlist?",
  "If you had to delete all social media apps except one, which one would you keep?",
  "What is the last thing you searched for on your phone?",
  "How many times did you unlock your phone today so far?",
  "What is the longest time you've gone without checking your phone this week?",
  "What is your ultimate guilty pleasure video on YouTube?",
  "If your phone screen-time report was shown to your parents/friends, how embarrassed would you be?",
  "What is the most useless purchase you have ever made online?",
  "Have you ever pretended to be texting someone just to look busy?"
];

const LOCAL_DARES = [
  "Do 5 jumping jacks right now and yell 'Habit Hour is alive!'",
  "Stand up and do a silly 10-second victory dance.",
  "Close your eyes and try to touch your nose with your pinky finger 5 times.",
  "Drink a glass of water right now and say 'Hydration check!'",
  "Strike a dramatic superhero pose and hold it for 10 seconds.",
  "Say 'Mindless scrolling is banned!' in your best opera voice.",
  "Close your phone, put it in another room, and sit in silence for exactly 1 minute.",
  "Do a 10-second slow-motion walk like you are on the moon.",
  "Stretch your arms high above your head and take three deep, loud belly breaths.",
  "Look in the mirror (or a blank screen) and give yourself a cheesy double finger gun wink.",
  "Scribble a goofy smiley face on a scrap piece of paper and tape it to your desk.",
  "Stand on one foot for 15 seconds while humming your favorite song."
];

export default function TruthOrDareView({ onBack }: TruthOrDareViewProps) {
  const [selectedType, setSelectedType] = useState<"truth" | "dare" | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinChoice, setSpinChoice] = useState<"truth" | "dare">("truth");

  const rollAndFetch = async (forcedType?: "truth" | "dare") => {
    setLoading(true);
    setQuestion(null);
    
    let typeToFetch: "truth" | "dare";

    if (forcedType) {
      typeToFetch = forcedType;
      setSelectedType(forcedType);
      setIsSpinning(false);
    } else {
      setIsSpinning(true);
      let currentFlash: "truth" | "dare" = "truth";
      const interval = setInterval(() => {
        currentFlash = currentFlash === "truth" ? "dare" : "truth";
        setSpinChoice(currentFlash);
      }, 100);

      await new Promise((resolve) => setTimeout(resolve, 1200));
      clearInterval(interval);

      typeToFetch = Math.random() > 0.5 ? "truth" : "dare";
      setSpinChoice(typeToFetch);
      setSelectedType(typeToFetch);
      setIsSpinning(false);
    }

    try {
      const res = await fetch(`/api/truthordare?type=${typeToFetch}`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setQuestion(data.question);
      } else {
        const list = typeToFetch === "dare" ? LOCAL_DARES : LOCAL_TRUTHS;
        const randomItem = list[Math.floor(Math.random() * list.length)];
        setQuestion(randomItem);
      }
    } catch (err) {
      console.warn("API Truth or Dare fetch failed, using beautiful local fallback:", err);
      const list = typeToFetch === "dare" ? LOCAL_DARES : LOCAL_TRUTHS;
      const randomItem = list[Math.floor(Math.random() * list.length)];
      setQuestion(randomItem);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    rollAndFetch();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-4xl mx-auto px-4 py-4"
    >
      {/* Header with mini logo and back button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mb-6 pb-4 border-b-4 border-gray-900">
        <div className="flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="Habit Hour Logo" 
            className="w-16 h-16 object-contain rounded-xl border-3 border-gray-900 shadow-[3px_3px_0_rgba(0,0,0,1)] bg-white" 
          />
          <div>
            <h1 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Habit Hour
            </h1>
            <p className="text-xs font-bold text-gray-500">Anti-brainrot ritual</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl border-4 border-gray-900 hover:bg-white hover:text-gray-900 transition-all font-bold shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-1 text-sm"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      {/* Main Container - Elongated & Spaced Perfectly */}
      <div className="relative bg-white-500 rounded-3xl border-8 border-gray-900 p-6 md:p-10 shadow-[12px_12px_0_rgba(0,0,0,1)] text-gray-900 min-h-[340px] flex flex-col justify-between">
        <div className="absolute inset-2 border-4 border-dashed border-white/50 rounded-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center h-full justify-center space-y-4">
          <div className="p-3 bg-white text-rose-500 rounded-full border-4 border-gray-900 shadow-[3px_3px_0_#000]">
            <Dices className="w-6 h-6 md:w-8 md:h-8 text-rose-600 animate-bounce" />
          </div>

          <h2 
            className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900/90"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Habit Hour Truth or Dare
          </h2>

          <div className="w-full h-0.5 bg-black/10 rounded-full" />

          {/* Spinner Selection Box */}
          {isSpinning ? (
            <div className="py-10 flex flex-col items-center space-y-3">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className={`px-8 py-4 rounded-2xl border-6 border-gray-900 text-2xl md:text-3xl font-black uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] ${
                  spinChoice === "truth" ? "bg-blue-400 text-white" : "bg-red-500 text-white"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {spinChoice}
              </motion.div>
              <p className="font-bold text-sm text-gray-800 animate-pulse">Rolling the destiny dice...</p>
            </div>
          ) : (
            <div className="w-full space-y-4 py-2">
              {selectedType && (
                <div className="flex justify-center">
                  <span
                    className={`px-6 py-2 rounded-2xl border-4 border-gray-900 text-lg font-black uppercase tracking-wide shadow-[3px_3px_0_rgba(0,0,0,1)] flex items-center gap-2 ${
                      selectedType === "truth" ? "bg-blue-400 text-white" : "bg-red-500 text-white"
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {selectedType === "truth" ? (
                      <>
                        <Shield className="w-4 h-4 fill-current" /> TRUTH
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4 fill-current" /> DARE
                      </>
                    )}
                  </span>
                </div>
              )}

              {/* Question Display Card */}
              <div className="bg-white rounded-2xl border-4 border-gray-900 p-6 md:p-8 min-h-[140px] flex items-center justify-center shadow-[6px_6px_0_rgba(0,0,0,1)] relative overflow-hidden max-w-2xl mx-auto w-full">
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-sm text-gray-600">Drawing the challenge...</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={question || ""}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="text-lg md:text-2xl font-extrabold text-gray-900 leading-relaxed"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {question}
                    </motion.p>
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}

          {/* Action Row */}
          {!isSpinning && !loading && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-2">
              <button
                onClick={() => rollAndFetch()}
                className="w-full sm:w-auto px-6 py-3.5 bg-gray-900 text-white rounded-2xl border-4 border-gray-900 hover:bg-[#FCD34D] hover:text-gray-900 transition-colors font-extrabold shadow-[4px_4px_0_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                🎲 Random Roll
              </button>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => rollAndFetch("truth")}
                  className="flex-1 sm:flex-none px-4 py-3 bg-blue-400 text-white rounded-xl border-4 border-gray-900 hover:bg-white hover:text-blue-500 font-extrabold shadow-[3px_3px_0_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Force Truth
                </button>
                <button
                  onClick={() => rollAndFetch("dare")}
                  className="flex-1 sm:flex-none px-4 py-3 bg-red-500 text-white rounded-xl border-4 border-gray-900 hover:bg-white hover:text-red-500 font-extrabold shadow-[3px_3px_0_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Force Dare
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
