import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, RefreshCw, Volume2, Globe } from "lucide-react";
import logoImg from "../assets/images/habit-hour-logo.png";

interface WordData {
  word: string;
  translation: string;
  meaning?: string;
  isFallback?: boolean;
}

interface WordViewProps {
  onBack: () => void;
}

const LOCAL_WORDS = [
  { word: "hábito", translation: "habit" },
  { word: "atención", translation: "attention" },
  { word: "rutina", translation: "routine" },
  { word: "crear", translation: "to create" },
  { word: "aprender", translation: "to learn" },
  { word: "agradecido", translation: "grateful" },
  { word: "sonreír", translation: "to smile" },
  { word: "mente", translation: "mind" },
  { word: "saludable", translation: "healthy" },
  { word: "crecimiento", translation: "growth" },
  { word: "disciplina", translation: "discipline" },
  { word: "enfoque", translation: "focus" },
  { word: "tiempo", translation: "time" },
  { word: "esfuerzo", translation: "effort" },
  { word: "progreso", translation: "progress" },
  { word: "constancia", translation: "consistency" },
  { word: "paciencia", translation: "patience" },
  { word: "superación", translation: "self-improvement" },
  { word: "bienestar", translation: "well-being" },
  { word: "fuerza", translation: "strength" },
  { word: "voluntad", translation: "willpower" },
  { word: "propósito", translation: "purpose" },
  { word: "acción", translation: "action" },
  { word: "energía", translation: "energy" },
  { word: "sueño", translation: "dream" },
  { word: "camino", translation: "path" },
  { word: "desafío", translation: "challenge" },
  { word: "éxito", translation: "success" },
  { word: "mañana", translation: "morning" },
  { word: "organización", translation: "organization" }
];

export default function WordView({ onBack }: WordViewProps) {
  const [data, setData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchWord = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/word").catch(() => null);
      if (res && res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        const fallback = LOCAL_WORDS[Math.floor(Math.random() * LOCAL_WORDS.length)];
        setData({
          word: fallback.word,
          translation: fallback.translation,
          isFallback: true
        });
      }
    } catch (err: any) {
      console.warn("API Word fetch failed, using beautiful local fallback:", err);
      const fallback = LOCAL_WORDS[Math.floor(Math.random() * LOCAL_WORDS.length)];
      setData({
        word: fallback.word,
        translation: fallback.translation,
        isFallback: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWord();
  }, []);

  const speakWord = () => {
    if (!data?.word) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(data.word);
      utterance.lang = "es-ES";
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech is not supported in this browser.");
    }
  };

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

      {/* Word of the Day Card */}
      <div className="relative bg-[#F43F5E] rounded-3xl border-8 border-gray-900 p-6 md:p-10 shadow-[12px_12px_0_rgba(0,0,0,1)] text-white min-h-[340px] flex flex-col justify-between">
        <div className="absolute inset-2 border-4 border-dashed border-white/50 rounded-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center h-full justify-center space-y-4">
          <div className="p-3 bg-white text-gray-900 rounded-full border-4 border-gray-900 shadow-[3px_3px_0_#000]">
            <Globe className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />
          </div>

          <h2 
            className="text-xl md:text-2xl font-extrabold tracking-tight text-white/90"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Spanish Word of the Day
          </h2>

          <div className="w-full h-0.5 bg-white/20 rounded-full" />

          {loading ? (
            <div className="flex flex-col items-center py-10 space-y-3">
              <RefreshCw className="w-10 h-10 animate-spin text-white" />
              <p className="font-bold text-base">Unlocking Spanish vocabulary...</p>
            </div>
          ) : error ? (
            <div className="py-6">
              <p className="text-lg font-bold bg-black/20 p-4 rounded-xl border-2 border-white/30">{error}</p>
            </div>
          ) : (
            <div className="w-full space-y-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* Spanish Section */}
                <div className="bg-white/10 p-5 rounded-2xl border-4 border-white/20 relative flex flex-col items-center justify-center min-h-[110px]">
                  <span className="absolute -top-3.5 left-6 px-3 py-1 bg-[#FCD34D] text-gray-900 rounded-full text-[10px] font-bold border-2 border-gray-900">
                    ESPAÑOL
                  </span>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <h3 
                      className="text-3xl md:text-4xl font-black capitalize tracking-wide select-all text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {data?.word}
                    </h3>
                    
                    <button
                      onClick={speakWord}
                      disabled={isSpeaking}
                      className={`p-2 bg-white text-gray-900 hover:bg-[#FCD34D] rounded-full border-3 border-gray-900 shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all ${isSpeaking ? "animate-pulse" : ""}`}
                      title="Pronounce word"
                    >
                      <Volume2 className="w-4 h-4 text-rose-500 fill-current" />
                    </button>
                  </div>
                </div>

                {/* English Section */}
                <div className="bg-gray-900/40 p-5 rounded-2xl border-4 border-gray-900/60 relative flex flex-col items-center justify-center min-h-[110px]">
                  <span className="absolute -top-3.5 left-6 px-3 py-1 bg-blue-500 text-white rounded-full text-[10px] font-bold border-2 border-gray-900">
                    ENGLISH TRANSLATION
                  </span>
                  
                  <p 
                    className="text-2xl md:text-3xl font-extrabold capitalize text-[#FCD34D] mt-1 select-all"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {data?.translation}
                  </p>
                </div>
              </div>

              {data?.meaning && (
                <div className="bg-black/20 p-4 rounded-2xl border-4 border-dashed border-white/20 max-w-2xl mx-auto text-center relative mt-3">
                  <span className="absolute -top-3 left-6 px-3 py-0.5 bg-[#FCD34D] text-gray-900 rounded-full text-[10px] font-black border-2 border-gray-900">
                    DICTIONARY MEANING
                  </span>
                  <p className="text-sm font-semibold text-white/95 leading-relaxed pt-1">
                    "{data.meaning}"
                  </p>
                </div>
              )}

              {/* {data?.isFallback && (
                <p className="text-[10px] text-rose-200 font-mono italic">
                  (Offline mode: displaying curated stream word)
                </p>
              )} */}
            </div>
          )}

          {/* Action Buttons inside the card */}
          {!loading && (
            <button
              onClick={fetchWord}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#FCD34D] text-gray-900 rounded-xl border-4 border-gray-900 hover:bg-white transition-all font-extrabold shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <RefreshCw className="w-4 h-4" /> Get Another Word
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
