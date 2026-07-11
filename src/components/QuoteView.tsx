import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, RefreshCw, Quote as QuoteIcon } from "lucide-react";
import logoImg from "../assets/images/habit-hour-logo.png";

interface QuoteData {
  quote: string;
  author: string;
  isFallback?: boolean;
}

interface QuoteViewProps {
  onBack: () => void;
}

const LOCAL_QUOTES = [
  { quote: "Doomscrolling is the thief of joy and the creator of brainrot.", author: "Daisy the Flower" },
  { quote: "Small intentional habits build giant unshakeable empires.", author: "Habit Hour" },
  { quote: "Your attention is your most valuable asset. Spend it on things that feed your soul.", author: "Monster Blue" },
  { quote: "A habit is a rope; we weave a thread of it each day, and at last we cannot break it.", author: "Horace Mann" },
  { quote: "It is easier to prevent bad habits than to break them.", author: "Benjamin Franklin" },
  { quote: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
  { quote: "Do not let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "What you do makes a difference, and you have to decide what kind of difference you want to make.", author: "Jane Goodall" },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { quote: "Focus is a muscle, and mindful presence is the ultimate gym.", author: "Habit Hour" },
  { quote: "In a world full of algorithms, choose to be a human.", author: "Mindful Explorer" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Proverb" },
  { quote: "Your daily habits are the bricks of your future self.", author: "Habit Hour" },
  { quote: "Mindfulness isn't difficult, we just need to remember to do it.", author: "Sharon Salzberg" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { quote: "A year from now you may wish you had started today.", author: "Karen Lamb" }
];

export default function QuoteView({ onBack }: QuoteViewProps) {
  const [data, setData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quote").catch(() => null);
      if (res && res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        const randomQuote = LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)];
        setData({
          quote: randomQuote.quote,
          author: randomQuote.author,
          isFallback: true
        });
      }
    } catch (err: any) {
      console.warn("API Quote fetch failed, using beautiful local fallback:", err);
      const randomQuote = LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)];
      setData({
        quote: randomQuote.quote,
        author: randomQuote.author,
        isFallback: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
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

      {/* Main Quote Card - Elongated & Compact Header Spacing */}
      <div className="relative bg-[#EF4444] rounded-3xl border-8 border-gray-900 p-6 md:p-10 shadow-[12px_12px_0_rgba(0,0,0,1)] text-white min-h-[340px] flex flex-col justify-between">
        <div className="absolute inset-2 border-4 border-dashed border-white/40 rounded-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center h-full justify-center space-y-4">
          <div className="p-3 bg-white text-gray-900 rounded-full border-4 border-gray-900 shadow-[3px_3px_0_#000]">
            <QuoteIcon className="w-6 h-6 md:w-8 md:h-8 fill-current" />
          </div>

          <h2 
            className="text-xl md:text-2xl font-extrabold tracking-tight select-none text-white/90"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Quote of the Day
          </h2>

          <div className="w-full h-0.5 bg-white/20 rounded-full" />

          {loading ? (
            <div className="flex flex-col items-center py-10 space-y-3">
              <RefreshCw className="w-10 h-10 animate-spin text-white" />
              <p className="font-bold text-base">Summoning inspiration...</p>
            </div>
          ) : error ? (
            <div className="py-6">
              <p className="text-lg font-bold bg-black/20 p-4 rounded-xl border-2 border-white/30">{error}</p>
            </div>
          ) : (
            <div className="space-y-6 w-full py-2">
              <motion.p 
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-lg md:text-2xl lg:text-3xl font-extrabold italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] leading-relaxed max-w-3xl mx-auto"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                "{data?.quote}"
              </motion.p>
              
              <div className="flex flex-col items-center gap-2">
                <span className="px-4 py-1.5 bg-white text-gray-900 rounded-full font-bold text-sm border-2 border-gray-900 shadow-[3px_3px_0_rgba(0,0,0,1)]">
                  — {data?.author || "Unknown"}
                </span>
                {data?.isFallback && (
                  <span className="text-[10px] text-rose-200 font-mono">
                    (Offline mode: displaying curated stream helper quote)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons inside the card */}
          {!loading && (
            <button
              onClick={fetchQuote}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#FCD34D] text-gray-900 rounded-xl border-4 border-gray-900 hover:bg-white transition-all font-extrabold shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <RefreshCw className="w-4 h-4" /> Get Another Quote
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
