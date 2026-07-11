import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, BookOpen, Heart, ExternalLink } from "lucide-react";
import logoImg from "../assets/images/habit-hour-logo.png";

interface GratitudeViewProps {
  onBack: () => void;
}

export default function GratitudeView({ onBack }: GratitudeViewProps) {
  const [grateful1, setGrateful1] = useState("");
  const [grateful2, setGrateful2] = useState("");
  const [grateful3, setGrateful3] = useState("");
  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");
  const [bestThing, setBestThing] = useState("");
  const [feeling, setFeeling] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !grateful1.trim() ||
      !grateful2.trim() ||
      !grateful3.trim() ||
      !person1.trim() ||
      !person2.trim() ||
      !bestThing.trim() ||
      !feeling.trim()
    ) {
      setValidationError("Please fill in all fields to complete today's entry!");
      return;
    }
    setValidationError(null);
    setShowSuccess(true);
  };

  const handleReset = () => {
    setGrateful1("");
    setGrateful2("");
    setGrateful3("");
    setPerson1("");
    setPerson2("");
    setBestThing("");
    setFeeling("");
    setShowSuccess(false);
    setValidationError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-6xl mx-auto px-4 py-4 space-y-6"
    >
      {/* Header with mini logo and back button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mb-4 pb-4 border-b-4 border-gray-900">
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
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl border-4 border-gray-900 hover:bg-white hover:text-gray-900 transition-all font-bold shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-1 text-sm cursor-pointer"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      {/* Main Grid: Left Side Sidebar Cards & Right Side Notebook Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ABOUT / METHOD / PHYSICAL BOOK PITCH */}
        <div className="lg:col-span-5 space-y-6">
          {/* Gratitude Journal Pitch Card (Coral) */}
          <div className="relative bg-[#FB7185] rounded-[32px] border-[6px] border-gray-900 p-6 md:p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] overflow-hidden">
            <div className="absolute inset-1.5 border-[4px] border-dashed border-white/20 rounded-[24px] pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <Heart className="w-7 h-7 fill-current text-white animate-pulse" />
                Gratitude Journal
              </h2>
              <p className="text-white text-sm font-bold leading-relaxed tracking-wide select-none">
                The 100 Days Gratitude Journal is a guided physical journal to help you build a daily gratitude practice. Based on the 3-2-1 method — write 3 things you're grateful for, 2 people you appreciate, and 1 best moment of your day.
              </p>
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 text-white rounded-full text-xs font-black border border-white/30 tracking-wide select-none">
                ✨ 100 days of intentional practice
              </div>
            </div>
          </div>

          {/* Get the Physical Journal Link Card (Yellow) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-[#FCD34D] rounded-[24px] border-[6px] border-gray-900 shadow-[6px_6px_0_rgba(0,0,0,1)] active:shadow-none overflow-hidden"
          >
            <a
              href="https://linktr.ee/100daysgratitude"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 px-6 text-gray-900 font-black text-lg transition-all"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <BookOpen className="w-5 h-5" /> Get the Physical Journal <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </motion.div>

          {/* The 3-2-1 Method details (Blue Card) */}
          <div className="bg-[#2563EB] rounded-[24px] border-[6px] border-gray-900 p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="relative z-10 space-y-4 text-white">
              <h3 className="text-xl font-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                The 3-2-1 Method
              </h3>
              <ul className="space-y-3 text-sm font-bold">
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-black">3</span>
                  things you are grateful for
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-black">2</span>
                  people you are grateful for
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-black">1</span>
                  best thing about today
                </li>
                <li className="flex items-center gap-2.5 pl-1 text-blue-200">
                  <span>+</span> a feeling check-in
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRY IT DIGITALLY NOTEBOOK */}
        <div className="lg:col-span-7">
          <div className="bg-[#FDFBF7] rounded-[32px] border-[6px] border-gray-900 p-6 md:p-8 shadow-[12px_12px_0_rgba(0,0,0,1)] relative min-h-[600px] flex flex-col justify-between">
            
            {/* Header Area inside Notebook */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-6">
                <h3 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Try it Digitally
                </h3>
                <span className="px-3 py-1 bg-[#FEF3C7] text-amber-800 rounded-full text-xs font-bold border border-amber-300">
                  Today's Entry
                </span>
              </div>

              <AnimatePresence mode="wait">
                {!showSuccess ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* SECTION 1: 3 THINGS I AM GRATEFUL FOR */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-[#FB7185] uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        3 THINGS I AM GRATEFUL FOR
                      </h4>
                      <div className="space-y-3.5">
                        {[
                          { val: grateful1, set: setGrateful1, num: 1 },
                          { val: grateful2, set: setGrateful2, num: 2 },
                          { val: grateful3, set: setGrateful3, num: 3 },
                        ].map((item) => (
                          <div key={item.num} className="flex items-center gap-3 w-full pb-1">
                            <div className="w-7 h-7 rounded-full border-2 border-gray-900 bg-[#FCD34D] flex items-center justify-center font-black text-gray-900 text-xs flex-shrink-0">
                              {item.num}
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="Something you appreciate today..."
                              value={item.val}
                              onChange={(e) => item.set(e.target.value)}
                              className="flex-grow bg-transparent text-gray-900 placeholder-gray-400/70 font-bold text-xs md:text-sm focus:outline-none pb-1 border-b-2 border-dashed border-gray-300 focus:border-rose-400 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 2: 2 PEOPLE I AM GRATEFUL FOR */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-[#2563EB] uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        2 PEOPLE I AM GRATEFUL FOR
                      </h4>
                      <div className="space-y-3.5">
                        {[
                          { val: person1, set: setPerson1, num: 1 },
                          { val: person2, set: setPerson2, num: 2 },
                        ].map((item) => (
                          <div key={item.num} className="flex items-center gap-3 w-full pb-1">
                            <div className="w-7 h-7 rounded-full border-2 border-gray-900 bg-[#FCD34D] flex items-center justify-center font-black text-gray-900 text-xs flex-shrink-0">
                              {item.num}
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="Someone who made a difference..."
                              value={item.val}
                              onChange={(e) => item.set(e.target.value)}
                              className="flex-grow bg-transparent text-gray-900 placeholder-gray-400/70 font-bold text-xs md:text-sm focus:outline-none pb-1 border-b-2 border-dashed border-gray-300 focus:border-blue-400 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 3: 1 BEST THING ABOUT TODAY */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        1 BEST THING ABOUT TODAY
                      </h4>
                      <div className="flex items-center gap-3 w-full pb-1">
                        <div className="w-7 h-7 rounded-full border-2 border-gray-900 bg-[#FCD34D] flex items-center justify-center font-black text-gray-900 text-xs flex-shrink-0">
                          1
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="The highlight of your day..."
                          value={bestThing}
                          onChange={(e) => setBestThing(e.target.value)}
                          className="flex-grow bg-transparent text-gray-900 placeholder-gray-400/70 font-bold text-xs md:text-sm focus:outline-none pb-1 border-b-2 border-dashed border-gray-300 focus:border-gray-900 transition-colors"
                        />
                      </div>
                    </div>

                    {/* SECTION 4: HOW AM I FEELING */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        HOW AM I FEELING?
                      </h4>
                      <textarea
                        required
                        rows={2}
                        placeholder="Check in with yourself — any emotion is valid..."
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                        className="w-full bg-transparent text-gray-900 placeholder-gray-400/70 font-bold text-xs md:text-sm focus:outline-none p-4 border-2 border-dashed border-gray-400 rounded-2xl focus:border-teal-500 transition-colors resize-none"
                      />
                    </div>

                    {validationError && (
                      <p className="text-red-500 text-xs font-black">
                        ⚠️ {validationError}
                      </p>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl border-4 border-gray-900 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-1 transition-all font-black text-base flex items-center justify-center gap-2 cursor-pointer"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      <Heart className="w-5 h-5 fill-current" /> Complete Today's Entry
                    </button>
                  </motion.form>
                ) : (
                  /* SUCCESS STATE SCREEN (Screenshot 2) */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      <Heart className="w-24 h-24 text-[#FB7185] fill-current" />
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        You did it!
                      </h3>
                      <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-sm mx-auto">
                        That felt good, right? Imagine doing this every day in a beautiful physical journal.
                      </p>
                    </div>

                    {/* RED/CORAL MOTIVATIONAL NUDGE BUTTON */}
                    <div className="pt-2">
                      <a
                        href="https://linktr.ee/100daysgratitude"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FB7185] hover:bg-[#F43F5E] text-white rounded-2xl border-4 border-gray-900 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-1 transition-all font-black text-base"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        <BookOpen className="w-5 h-5" /> Get the Journal <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-sm font-bold text-gray-400 hover:text-gray-900 underline transition-colors cursor-pointer pt-4"
                    >
                      Start over
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
