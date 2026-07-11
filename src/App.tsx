import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Quote as QuoteIcon, 
  Gamepad2, 
  Languages, 
  BookOpen, 
  Palette, 
  Laugh, 
  Sparkles,
  Dice5, 
  Heart, 
  Youtube, 
  Instagram,
  ExternalLink,
  Pen,
} from "lucide-react";

import { ActiveView } from "./types";
import HabitHourLogo from "./components/HabitHourLogo";
import QuoteView from "./components/QuoteView";
import WordView from "./components/WordView";
import ArtView from "./components/ArtView";
import TruthOrDareView from "./components/TruthOrDareView";
import GratitudeView from "./components/GratitudeView";

// Playful procedural lofi audio generator using the Web Audio API
// This allows a complete, offline-safe interactive music tool directly on the site!
class LofiSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;

  start() {
    if (this.isPlaying) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      // Add a lowpass filter to make it sound warm/muffled (lofi vibe)
      const biquadFilter = this.ctx.createBiquadFilter();
      biquadFilter.type = "lowpass";
      biquadFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

      this.gainNode.connect(biquadFilter);
      biquadFilter.connect(this.ctx.destination);
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime); // low volume
      this.isPlaying = true;

      // Play soft jazz/lofi chords progressively
      // Chords progress: Cmaj7 -> Am7 -> Dm7 -> G7
      const progression = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
        [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
        [293.66, 349.23, 440.00, 587.33], // Dm7   (D4, F4, A4, D5)
        [196.00, 246.94, 293.66, 392.00]  // G7    (G3, B3, D4, G4)
      ];

      let chordIndex = 0;
      const playChord = () => {
        if (!this.ctx || !this.gainNode) return;
        const now = this.ctx.currentTime;
        const notes = progression[chordIndex];

        // Resume context if suspended
        if (this.ctx.state === "suspended") {
          this.ctx.resume();
        }

        // Stop and disconnect previous notes
        this.oscillators.forEach(osc => {
          try { 
            osc.stop(); 
            osc.disconnect();
          } catch (e) {}
        });
        this.oscillators = [];

        notes.forEach(freq => {
          if (!this.ctx || !this.gainNode) return;
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          
          const oscGain = this.ctx.createGain();
          oscGain.gain.setValueAtTime(0, now);
          oscGain.gain.linearRampToValueAtTime(0.3, now + 1.5);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);

          osc.connect(oscGain);
          oscGain.connect(this.gainNode);
          osc.start(now);
          osc.stop(now + 4.9);
          
          // Cleanup node after sound completes
          setTimeout(() => {
            try {
              osc.disconnect();
              oscGain.disconnect();
            } catch (e) {}
          }, 5000);

          this.oscillators.push(osc);
        });

        chordIndex = (chordIndex + 1) % progression.length;
      };

      playChord();
      this.intervalId = setInterval(playChord, 5000);
    } catch (e) {
      console.warn("Web Audio API is not supported or blocked:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.oscillators.forEach(osc => {
      try { 
        osc.stop(); 
        osc.disconnect();
      } catch (e) {}
    });
    this.oscillators = [];
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }

  getPlaying() {
    return this.isPlaying;
  }
}

const synthInstance = new LofiSynth();

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("home");
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      synthInstance.stop();
    };
  }, []);

  return (
    <div className="graph-bg min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      {/* BACKGROUND FLOATING GRAPHICS */}
      <div className="absolute top-1/4 left-10 opacity-20 pointer-events-none select-none hidden md:block">
        <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute bottom-1/4 right-12 opacity-20 pointer-events-none select-none hidden md:block">
        <Heart className="w-12 h-12 text-rose-400 animate-bounce" />
      </div>

      {/* HEADER SECTION - ONLY ON HOME */}
      {activeView === "home" && (
        <header className="relative w-full max-w-6xl mx-auto px-4 pt-6 md:pt-10 flex items-center justify-center z-20">
          <HabitHourLogo />
        </header>
      )}

      {/* VIEW ROUTER (MAIN SCREEN OR SUB-PAGES) */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 z-10 flex items-center justify-center">
        {activeView === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full"
          >
            {/* LEFT HAND PANEL: ABOUT & PLAYLIST */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* About Box */}
              <motion.div
                className="bg-[#FCD34D] rounded-[32px] border-[6px] border-gray-900 p-6 md:p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {/* Floating Dashed Inner Border */}
                <div className="absolute inset-1.5 border-[4px] border-dashed border-gray-900/10 rounded-[24px] pointer-events-none" />

                {/* Offset Header Tab */}
                <div className="inline-block px-5 py-2 bg-gray-900 text-white font-extrabold text-sm rounded-2xl border-4 border-gray-900 shadow-[3px_3px_0_#FCD34D] mb-5 select-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  About Habit Hour
                </div>

                {/* Description text */}
                <p 
                  className="text-gray-900 text-base md:text-lg font-bold leading-relaxed tracking-wide select-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Habit Hour is a follow along anti-brainrot ritual livestream created by 
                   <span>
                   <a
                  href="https://www.youtube.com/iiqrah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-black text-black-300 hover:text-white underline transition-colors"
                >
                  @iiqrah  </a> </span>
                   
                  to replace mindless doomscrolling with small intentional habits.
                </p>
              </motion.div>

              {/* Livestream Playlist Button */}
              <motion.a
                href="https://www.youtube.com/@iiqrah/streams"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full p-4 bg-gray-900 text-[#FCD34D] rounded-[24px] border-[6px] border-gray-900 shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-gray-900 transition-all font-black text-lg text-center flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-gray-900/20 rounded-[16px] pointer-events-none" />
                Watch Previous Livestreams <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </motion.a>
              
            </div>

            {/* RIGHT HAND PANEL: 8 GRID BUTTONS */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {/* 1. Quote of the Day */}
              <motion.button
                onClick={() => setActiveView("quote")}
                className="relative p-5 bg-[#EF4444] text-white rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-[#EF4444] transition-all font-black text-base text-center flex items-center justify-center gap-3 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-white/40 rounded-[16px] pointer-events-none" />
                <QuoteIcon className="w-5 h-5 fill-current" />
                Quote of the Day
              </motion.button>

              {/* 2. Wordle */}
              <motion.a
                href="https://www.nytimes.com/games/wordle/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-5 bg-[#2563EB] text-[#FCD34D] rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-[#2563EB] transition-all font-black text-base text-center flex items-center justify-center gap-3 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-yellow-300/40 rounded-[16px] pointer-events-none" />
                <Gamepad2 className="w-5 h-5" />
                Wordle <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </motion.a>

              {/* 3. Duolingo */}
              <motion.a
                href="https://www.duolingo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-5 bg-[#FCD34D] text-gray-900 rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-green-600 transition-all font-black text-base text-center flex items-center justify-center gap-3 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-gray-900/20 rounded-[16px] pointer-events-none" />
                <Languages className="w-5 h-5" />
                Duolingo <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </motion.a>

              {/* 4. Word of the Day */}
              <motion.button
                onClick={() => setActiveView("word")}
                className="relative p-5 bg-[#EF4444] text-white rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-[#EF4444] transition-all font-black text-base text-center flex items-center justify-center gap-3 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-white/40 rounded-[16px] pointer-events-none" />
                <BookOpen className="w-5 h-5" />
                Word of the Day
              </motion.button>

              {/* 5. Art */}
              <motion.button
                onClick={() => setActiveView("art")}
                className="relative p-5 bg-[#2563EB] text-white rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-[#2563EB] transition-all font-black text-base text-center flex items-center justify-center gap-3 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-white/40 rounded-[16px] pointer-events-none" />
                <Palette className="w-5 h-5" />
                Art Segment
              </motion.button>

              {/* 6. Memes of the Day */}
              <motion.a
                href="https://www.reddit.com/r/memes/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-5 bg-[#FCD34D] text-gray-900 rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-orange-600 transition-all font-black text-base text-center flex items-center justify-center gap-3 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-gray-900/20 rounded-[16px] pointer-events-none" />
                <Laugh className="w-5 h-5" />
                Memes of the Day <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </motion.a>

              {/* 7. Truth or Dare */}
              <motion.button
                onClick={() => setActiveView("truth-or-dare")}
                className="relative p-5 bg-[#EF4444] text-white rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-[#EF4444] transition-all font-black text-base text-center flex items-center justify-center gap-3 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-white/40 rounded-[16px] pointer-events-none" />
                <Dice5 className="w-5 h-5" />
                Truth or Dare
              </motion.button>

              {/* 8. Gratitude Journal */}
              <motion.button
                onClick={() => setActiveView("gratitude")}
                className="relative p-5 bg-[#2563EB] text-[#FCD34D] rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-y-1 hover:bg-white hover:text-[#2563EB] transition-all font-black text-base text-center flex items-center justify-center gap-3 cursor-pointer"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-1 border-3 border-dashed border-yellow-300/40 rounded-[16px] pointer-events-none" />
                <Pen className="w-5 h-5 fill-current animate-pulse text-[#FCD34D] group-hover:text-red-500" />
                Gratitude Journal
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeView === "quote" && (
          <div className="w-full">
            <QuoteView onBack={() => setActiveView("home")} />
          </div>
        )}

        {activeView === "word" && (
          <div className="w-full">
            <WordView onBack={() => setActiveView("home")} />
          </div>
        )}

        {activeView === "art" && (
          <div className="w-full">
            <ArtView onBack={() => setActiveView("home")} />
          </div>
        )}

        {activeView === "truth-or-dare" && (
          <div className="w-full">
            <TruthOrDareView onBack={() => setActiveView("home")} />
          </div>
        )}

        {activeView === "gratitude" && (
          <div className="w-full">
            <GratitudeView onBack={() => setActiveView("home")} />
          </div>
        )}
      </main>

      {/* FOOTER BANNER SECTION */}
      <footer className="relative w-full z-10 select-none">
        {/* Compact Yellow Banner */}
        <div className="w-full bg-[#FCD34D] border-t-6 border-gray-900 py-3 px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-gray-900 font-extrabold text-[11px] sm:text-xs">
          <a
            href="https://youtube.com/iiqrah"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline decoration-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Youtube className="w-4 h-4 text-red-600 fill-current" /> youtube.com/iiqrah
          </a>
          
          <span className="text-gray-900/30 font-bold">•</span>

          <a
            href="https://patreon.com/iiqrah"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline decoration-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="text-gray-900 font-black">P</span> patreon.com/iiqrah
          </a>

          <span className="text-gray-900/30 font-bold">•</span>

          <a
            href="https://instagram.com/iiqrahCreations"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline decoration-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Instagram className="w-4 h-4 text-pink-600" /> instagram.com/iiqrahCreations
          </a>
        </div>
      </footer>

    </div>
  );
}
