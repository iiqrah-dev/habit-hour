import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Instagram, 
  Sparkles,
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  User, 
  ExternalLink,
  Calendar,
  RotateCcw,
  PenTool
} from "lucide-react";
import { ArtItem } from "../types";
import logoImg from "../assets/images/habit-hour-logo.png";
import profileImg from "../assets/images/profile.png";
import art01 from "../assets/images/art/art-01.jpg";
import art02 from "../assets/images/art/art-02.jpg";
import art03 from "../assets/images/art/art-03.jpg";
import art04 from "../assets/images/art/art-04.jpg";

const STATIC_ART_GALLERY: ArtItem[] = [
  {
    id: "art-1",
    title: "Midnight Flower Doodle",
    date: "July 2026",
    caption: "Simple, mindful floral lines to slow down the mind.",
    url: art01
  },
  {
    id: "art-2",
    title: "The Brainrot Monster",
    date: "July 2026",
    caption: "A cute monster eating social media notifications.",
    url: art02  },
  {
    id: "art-3",
    title: "Sunset Serotonin",
    date: "July 2026",
    caption: "Warm color experimental gradient horizon.",
    url: art03
  },
  {
    id: "art-4",
    title: "Habit Loops in Pastel",
    date: "July 2026",
    caption: "Pastel shapes reflecting a calm daily schedule.",
    url: art04
  }
];

interface ArtViewProps {
  onBack: () => void;
}

// SPIRAL WIRE BINDING COMPONENT (Highly authentic wire hoops matching physical images)
function SpiralBinding({ side }: { side: "left" | "right" | "center" }) {
  const loopsCount = 18;
  return (
    <div 
      className={`absolute top-2 bottom-2 flex flex-col justify-between py-1 z-30 pointer-events-none ${
        side === "left" ? "left-0 -translate-x-[2px] h-[95%]" :
        side === "right" ? "right-0 translate-x-[2px] h-[95%]" :
        "left-1/2 -translate-x-1/2 h-[96%]"
      }`}
    >
      {Array.from({ length: loopsCount }).map((_, i) => (
        <div key={i} className="flex items-center relative" style={{ height: "18px" }}>
          {side === "left" && (
            <>
              {/* Punched hole in paper/cover */}
              <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-600 shadow-inner" />
              {/* Double looped wire binder hoop going off the edge */}
              <div className="absolute right-0 w-8 h-4 rounded-full border-[3.5px] border-gray-950 bg-transparent -mr-5 shadow-sm" />
              <div className="absolute right-0 w-8 h-4 rounded-full border-[3.5px] border-gray-950 bg-transparent -mr-5 translate-y-[2px] opacity-20" />
            </>
          )}
          {side === "right" && (
            <>
              {/* Double looped wire binder hoop going off the edge */}
              <div className="absolute left-0 w-8 h-4 rounded-full border-[3.5px] border-gray-950 bg-transparent -ml-5 shadow-sm" />
              <div className="absolute left-0 w-8 h-4 rounded-full border-[3.5px] border-gray-950 bg-transparent -ml-5 translate-y-[2px] opacity-20" />
              {/* Punched hole in paper/cover */}
              <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-600 shadow-inner" />
            </>
          )}
          {side === "center" && (
            <div className="flex items-center justify-between w-8">
              {/* Left page punched hole */}
              <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-600 shadow-inner" />
              {/* Middle metal binder ring */}
              <div className="w-5 h-3.5 rounded-full border-[3px] border-gray-900 bg-transparent transform -rotate-12 -mx-1 shadow-xs" />
              {/* Right page punched hole */}
              <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-600 shadow-inner" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ArtView({ onBack }: ArtViewProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0 = Closed Front Cover, 9 = Closed Back Cover
  const [direction, setDirection] = useState<"next" | "prev">("next");

  // Interactive Doodle board state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#111827");
  const [brushWidth, setBrushWidth] = useState(4);

  // Responsive listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keep track of the drawn artwork data to preserve across page changes
  const canvasDataRef = useRef<string | null>(null);

  // Restore canvas drawing when mounting or on current page change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvasDataRef.current) {
      const img = new Image();
      img.onload = () => {
        // Clear before redrawing to prevent double rendering artifacts
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = canvasDataRef.current;
    }
  }, [currentPage, isMobile]);

  // Set up logical pages structure (Doodle Pad moved to the front right after About)
  // Page 0: Front Cover (Closed)
  // Page 1: About the Artist (Opened Left)
  // Page 2: Interactive Mindful Sketchpad (Opened Right)
  // Page 3-8: Artworks (Pages 3 to 8)
  // Page 9: Back Cover (Closed)
 const pages: Array<{
  type: "front-cover" | "about" | "doodle-pad" | "art" | "back-cover";
  artData?: ArtItem;
}> = [
  { type: "front-cover" },
  { type: "about" },
  { type: "doodle-pad" },

  ...STATIC_ART_GALLERY.map((art) => ({
    type: "art" as const,
    artData: art,
  })),

  { type: "back-cover" }
];

  const totalPages = pages.length;

  const handleNext = () => {
    setDirection("next");
    if (isMobile) {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (currentPage === 0) {
        setCurrentPage(1);
      } else if (currentPage === totalPages - 2) {
        setCurrentPage(totalPages - 1);
      } else if (currentPage < totalPages - 2) {
        setCurrentPage(currentPage + 2);
      }
    }
  };

  const handlePrev = () => {
    setDirection("prev");
    if (isMobile) {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      if (currentPage === totalPages - 1) {
        setCurrentPage(totalPages - 3);
      } else if (currentPage === 1) {
        setCurrentPage(0);
      } else if (currentPage > 1) {
        setCurrentPage(currentPage - 2);
      }
    }
  };

  const isClosedFront = currentPage === 0;
  const isClosedBack = currentPage === totalPages - 1;
  const isBookOpen = !isClosedFront && !isClosedBack;

  // Interactive doodle board canvas controls
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushWidth;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        canvasDataRef.current = canvas.toDataURL();
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasDataRef.current = null;
  };

  // Ultra-subtle, smooth, premium slide-and-fade transitions for optimal feel
  const pageFlipVariants = {
    initial: (dir: "next" | "prev") => ({
      opacity: 0,
      x: dir === "next" ? 12 : -12,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: (dir: "next" | "prev") => ({
      opacity: 0,
      x: dir === "next" ? -12 : 12,
      transition: {
        duration: 0.18
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mb-2 pb-4 border-b-4 border-gray-900">
        <div className="flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="Habit Hour Logo" 
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl border-3 border-gray-900 shadow-[3px_3px_0_rgba(0,0,0,1)] bg-white" 
          />
          <div>
            <h1 className="text-lg sm:text-xl font-black text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Habit Hour
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 font-mono">Anti-brainrot ritual</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl border-4 border-gray-900 hover:bg-white hover:text-gray-900 transition-all font-bold shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-1 text-xs sm:text-sm cursor-pointer"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>

      {/* Sketchbook Container */}
      <div className="relative w-full flex flex-col items-center py-2 sm:py-4">
        
        {/* SKETCHBOOK CONTAINER */}
        <div 
          className={`w-full transition-all duration-500 relative ${
            isMobile 
              ? "max-w-md" 
              : isBookOpen 
                ? "max-w-5xl" 
                : "max-w-md"
          }`}
        >
          {/* Cover ring binder spine - only shown when book is open on desktop */}
          {!isMobile && isBookOpen && (
            <SpiralBinding side="center" />
          )}

          {/* SPREAD BACKGROUND SHADOW SHELL */}
          <div className="bg-gray-950/15 rounded-[36px] absolute inset-1 translate-x-3 translate-y-3 pointer-events-none z-0" />

          {/* ACTUAL BOOK */}
          <div className="relative z-10 w-full">
            <AnimatePresence mode="wait" custom={direction}>
              
              {/* CLOSED FRONT COVER (Styled perfectly matching your reference photo) */}
              {isClosedFront ? (
                <motion.div
                  key="front-cover"
                  custom={direction}
                  variants={pageFlipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onClick={handleNext}
                  className="w-full bg-white rounded-[32px] border-8 border-gray-950 flex flex-col h-[510px] lg:h-[580px] shadow-[8px_8px_0_rgba(0,0,0,1)] cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden select-none"
                >
                  {/* Authentic Spiral Binder wire loop column overlapping left edge */}
                  <SpiralBinding side="left" />

                  {/* TOP 60% HEIGHT COVER PORTION (Coral/Orange block with hand-drawn wavy lines) */}
                  <div className="w-full h-[62%] bg-[#FE6F61] relative border-b-6 border-gray-950 flex items-center justify-center pl-8">
                    
                    {/* Hand-drawn vertical yellow stripes (Vector precision matching reference) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
                      {/* Generates slightly irregular, hand-drawn wobbly lines matching the reference */}
                      <path d="M 45,-10 Q 55,75 42,150 T 48,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                      <path d="M 85,-10 Q 80,85 90,155 T 82,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                      <path d="M 125,-10 Q 130,70 120,140 T 128,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                      <path d="M 165,-10 Q 160,95 170,165 T 162,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                      <path d="M 205,-10 Q 212,65 200,150 T 208,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                      <path d="M 245,-10 Q 240,80 250,145 T 242,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                      <path d="M 285,-10 Q 295,75 282,155 T 288,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                      <path d="M 325,-10 Q 320,90 330,160 T 322,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                      <path d="M 365,-10 Q 372,70 360,140 T 368,310" stroke="#FCD34D" strokeWidth="10" fill="none" opacity="0.95" />
                    </svg>

                    {/* Cute sticker tag
                    <div className="absolute top-4 right-4 bg-yellow-300 text-gray-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md border-2 border-gray-950 shadow-md">
                      Live Art Vol. I
                    </div> */}
                  </div>

                  {/* BOTTOM 38% HEIGHT COVER PORTION (Pristine White with editorial text layout matching your photo) */}
                  <div className="w-full flex-grow bg-white flex flex-col justify-between p-6 sm:p-8 pl-16 sm:pl-24 text-left relative z-20">
                    
                    <div className="space-y-2">
                      {/* Bold "MY SKETCHBOOK" in premium custom uppercase display font */}
                      <h2 
                        className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-none uppercase"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        My Sketchbook
                      </h2>

                      {/* Pink decorative line matching the reference */}
                      <div className="w-2/3 h-1.5 bg-[#FE6F61] rounded-full" />

                      {/* "Habit Hour artwork collection" subtitle */}
                      <p className="text-sm sm:text-base font-medium text-gray-800 leading-tight">
                        Habit Hour artwork collection
                      </p>
                    </div>

                    {/* Lower left "@iiqrahCreations" label */}
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 pt-3">
                      <span>@iiqrahCreations</span>
                      <span className="text-[10px] bg-yellow-300 text-gray-900 px-3 py-1.5 rounded-xl border-2 border-gray-950 font-black flex items-center gap-1.5 shadow-sm">
                        Open Sketchbook <BookOpen className="w-3.5 h-3.5 animate-pulse" />
                      </span>
                    </div>

                  </div>
                </motion.div>
              ) : isClosedBack ? (
                
                /* CLOSED BACK COVER (Styled exactly matching your reference photo) */
                <motion.div
                  key="back-cover"
                  custom={direction}
                  variants={pageFlipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full bg-white rounded-[32px] border-8 border-gray-950 p-8 text-center flex flex-col justify-between items-center h-[510px] lg:h-[580px] shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden select-none"
                >
                  {/* Spiral wire binder overlapping right edge */}
                  <SpiralBinding side="right" />

                  {/* Center Content Plugs mapped perfectly matching picture */}
                  <div className="my-auto space-y-12 max-w-sm">
                    
                    {/* Instagram Follow plug */}
                    <div className="space-y-3">
                      <p className="text-gray-950 font-extrabold text-base tracking-wide leading-tight">
                        To view more artwork:
                      </p>
                      <p className="text-gray-950 font-black text-lg tracking-normal">
                        Follow: <span className="underline decoration-[#FE6F61] decoration-3 text-rose-600">
                          
                          <a 
                        href="https://www.instagram.com/iiqrahcreations" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block text-blue-600 hover:text-blue-800 underline text-lg font-black tracking-wide"
                      >
                        @iiqrahCreations
                      </a>
                      </span>
                      </p>
                    </div>


{/* iColour coloring book plug */}
                    <div className="space-y-3">
                      <p className="text-gray-950 font-extrabold text-base tracking-wide leading-tight">
                        To buy iColour book:
                      </p>
                      <p className="text-gray-950 font-black text-lg tracking-normal">
                        Visit: <span className="underline decoration-[#FE6F61] decoration-3 text-rose-600">
                          
                          <a 
                        href="https://linktr.ee/icolour" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block text-blue-600 hover:text-blue-800 underline text-lg font-black tracking-wide"
                      >
                        linktr.ee/icolour
                      </a>
                      </span>
                      </p>
                    </div>

                  </div>

                  {/* Button at bottom matching picture pill outline shape */}
                  <div className="w-full pt-4">
                    <button
                      onClick={() => {
                        setDirection("prev");
                        setCurrentPage(0);
                      }}
                      className="px-8 py-2.5 bg-white hover:bg-[#FE6F61] hover:text-white text-gray-950 font-black text-sm rounded-full border-[3px] border-gray-950 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                    >
                      Restart Sketchbook
                    </button>
                    <p className="text-[9px] text-gray-400 font-mono font-bold tracking-widest mt-4 uppercase">
                      Habit Hour Series • 2026
                    </p>
                  </div>

                </motion.div>
              ) : (
                
                /* OPEN SKETCHBOOK SPREADS (Pristine paper texture with soft curled shadow shading) */
                <motion.div
                  key={`open-${currentPage}`}
                  custom={direction}
                  variants={pageFlipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full bg-[#FCFAF6] rounded-[32px] border-[6px] border-gray-950 shadow-[10px_10px_0_rgba(0,0,0,1)] h-[510px] lg:h-[580px] relative overflow-hidden flex flex-col lg:flex-row select-none"
                >
                  {/* Soft Watercolor Rough Artist Paper Grain texture overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-20 opacity-[0.25]" 
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0) 8%, rgba(255,255,255,0) 92%, rgba(0,0,0,0.08) 100%),
                        radial-gradient(circle, rgba(0,0,0,0.06) 0.5px, transparent 1.2px)
                      `,
                      backgroundSize: "100% 100%, 8px 8px"
                    }}
                  />

                  {/* SPREAD PAGES */}
                  <div className="w-full flex flex-col lg:flex-row relative z-10 flex-grow h-full">
                    {isMobile ? (
                      /* Mobile: single page view stretching fully */
                      <div className="w-full p-4 flex flex-col justify-between h-full">
                        {renderIndividualPage(pages[currentPage], currentPage)}
                      </div>
                    ) : (
                      /* Desktop: left-and-right spreads with central binding overlap */
                      <div className="w-full grid grid-cols-2 h-full">
                        
                        {/* LEFT PAGE */}
                        <div className="p-6 pr-10 border-r-2 border-dashed border-gray-300/40 flex flex-col justify-between h-full relative">
                          {renderIndividualPage(pages[currentPage], currentPage)}
                        </div>

                        {/* RIGHT PAGE */}
                        <div className="p-6 pl-10 flex flex-col justify-between h-full relative">
                          {currentPage + 1 < totalPages - 1 ? (
                            renderIndividualPage(pages[currentPage + 1], currentPage + 1)
                          ) : (
                            <div className="flex flex-col items-center justify-center my-auto text-gray-300 font-bold">
                              [End of Spreads]
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CONTROLS BAR FOR TURNING PAGES */}
        <div className="flex items-center justify-between w-full max-w-xl mt-6 px-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`flex items-center gap-1 px-2.5 py-2 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-xl border-3 border-gray-900 hover:bg-white hover:text-gray-900 transition-all font-black text-[10px] sm:text-xs shadow-[3px_3px_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none cursor-pointer ${
              currentPage === 0 ? "opacity-30 pointer-events-none" : ""
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Prev</span> Page
          </button>

          <span 
            className="text-[10px] sm:text-xs font-black bg-[#FCD34D] text-gray-900 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-xl border-3 border-gray-900 shadow-[3px_3px_0_rgba(0,0,0,1)] select-none font-mono"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            📖 <span className="hidden xs:inline">PAGE </span>{isMobile ? currentPage + 1 : `${currentPage + 1}-${Math.min(currentPage + 2, totalPages)}`} OF {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`flex items-center gap-1 px-2.5 py-2 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-xl border-3 border-gray-900 hover:bg-white hover:text-gray-900 transition-all font-black text-[10px] sm:text-xs shadow-[3px_3px_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none cursor-pointer ${
              currentPage === totalPages - 1 ? "opacity-30 pointer-events-none" : ""
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="hidden xs:inline">Next</span> Page <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );

  // INDIVIDUAL PAGE CONTENT ROUTER
  function renderIndividualPage(page: typeof pages[0], index: number) {
    switch (page.type) {
      case "about":
        return (
          <div className="flex flex-col justify-between h-full space-y-2 lg:space-y-4">
            <div className="space-y-2 lg:space-y-4 text-gray-900">
              
              {/* Heading header */}
              <div className="flex items-center gap-2.5 border-b-2 border-gray-200 pb-2">
                <div className="p-2 bg-yellow-300 rounded-lg border-2 border-gray-900 shadow-[2px_2px_0_#000]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    About the Artist
                  </h3>
                  <p className="text-[9px] font-mono text-gray-400 font-bold uppercase">PAGE {index + 1} • THE INTRO</p>
                </div>
              </div>

              {/* Hand-drawn Circular Avatar Circle Frame (Uneven, sketchy lines) */}
              <div className="flex justify-center py-1 sm:py-2">
                <div className="relative">
                  {/* Hand sketched double circles */}
                  <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-gray-400 animate-pulse" />
                  
                  {/* Face photo placeholder container */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-950 overflow-hidden relative shadow-[4px_4px_0_rgba(0,0,0,1)] bg-white">
  <img
    src={profileImg}
    alt="Iqrah"
    className="w-full h-full object-cover"
  />


</div>
                </div>
              </div>

              {/* Hand-written cursive bio in beautiful script handwriting */}
              <div className="space-y-1 px-2 select-text">
                <p
  className="leading-snug tracking-wide text-left"
  style={{
    fontFamily: "'Playpen Sans', cursive",
    fontWeight: 400,
    fontSize: "clamp(0.8rem, 1.8vw, 1.1rem)"
  }}
>
                  Hello, reader! 
                </p> 

                <div className="h-2" />
                  
                <p
  className="leading-snug tracking-wide text-left"
  style={{
    fontFamily: "'Playpen Sans', cursive",
    fontWeight: 400,
    fontSize: "clamp(0.8rem, 1.8vw, 1.1rem)"
  }}
>
                  My name is Iqrah, I go by i-iqrah. 
                  The art segment of the livestream is supposed to be a chill low-pressure space to just create art and enjoy the process. Hope you like them!
                </p>
              </div>

              <div className="h-2" />

              {/* Autograph signature */}
              <div className="pt-1 text-right">
                <div className="inline-block relative">
                  <span 
                    className="text-2xl sm:text-3xl lg:text-2xl text-rose-500 font-black tracking-wider relative z-10"
                    style={{ fontFamily: "'Playpen Sans', cursive" }}
                  >
                    iiqrah ✨
                  </span>
                  {/* Highlight bar under signature */}
                  <div className="absolute h-1.5 bg-yellow-300 left-0 right-0 bottom-1 -rotate-2 rounded-full z-0" />
                </div>
              </div>

            </div>

            {/* Book footer */}
            <div className="flex items-center justify-between text-[9px] text-gray-400 border-t border-gray-200/60 pt-2 font-mono uppercase font-bold tracking-wider">
              <span>Habit Hour Live Ritual</span>
              <span>Page {index + 1}</span>
            </div>
          </div>
        );

      case "doodle-pad":
        return (
          <div className="flex flex-col justify-between h-full space-y-2">
            <div className="space-y-2 text-gray-900 flex-grow flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-gray-200 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-200 rounded-lg border-2 border-gray-950 shadow-[2px_2px_0_#000]">
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm lg:text-base font-black uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Mindful Sketchpad
                    </h3>
                    <p className="text-[8px] font-mono text-gray-400 font-bold uppercase">PAGE {index + 1} • DRAW YOUR MIND</p>
                  </div>
                </div>
                
                {/* Clear sketch */}
                <button
                  onClick={clearCanvas}
                  className="p-1 sm:p-1.5 bg-gray-100 hover:bg-rose-100 text-gray-700 hover:text-rose-600 rounded-lg border-2 border-gray-950 transition-colors shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1 text-[9px] sm:text-[10px] font-black"
                  title="Clear sketch pad"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Clear
                </button>
              </div>

              <p className="text-[10px] sm:text-[11px] font-bold text-gray-600 leading-tight">
                Try it out! Use your mouse or finger to doodle. Scribbling in loops is a clinically simple way to reclaim presence.
              </p>

              {/* CANVAS SKETCHPAD (Fills available space dynamically) */}
              <div className="relative w-full flex-grow min-h-[180px] bg-stone-50 rounded-2xl border-3 border-dashed border-gray-400 overflow-hidden shadow-inner cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ touchAction: "none" }}
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Toolkit Controls */}
              <div className="flex items-center justify-between gap-2 bg-[#FCFAF6] p-1.5 sm:p-2 rounded-xl border-2 border-gray-950 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-gray-500">Colour:</span>
                  <div className="flex gap-0.5 sm:gap-1">
                    {["#2b251c", "#fff6ea", "#ff6464", "#2a5fbf", "#fed25f", "#b9db6b", "#e2a9f1"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setBrushColor(color)}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-gray-950 transition-transform ${
                          brushColor === color ? "scale-110 ring-2 ring-yellow-400" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-gray-500 font-mono">Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushWidth}
                    onChange={(e) => setBrushWidth(Number(e.target.value))}
                    className="w-12 sm:w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-gray-950"
                  />
                </div>
              </div>

            </div>

            {/* Book footer */}
            <div className="flex items-center justify-between text-[9px] text-gray-400 border-t border-gray-200/60 pt-1.5 font-mono uppercase font-bold tracking-wider">
              <span>Interactive Zone</span>
              <span>Page {index + 1}</span>
            </div>
          </div>
        );

      case "art": {
        const art = page.artData;
        if (!art) return null;

        const isLeftPage = index % 2 === 1;
        const insetClass = isMobile 
          ? "-inset-4 rounded-2xl" 
          : isLeftPage
            ? "-top-6 -bottom-6 -left-6 -right-10 rounded-l-[26px]"
            : "-top-6 -bottom-6 -left-10 -right-6 rounded-r-[26px]";

        return (
          <div className="flex flex-col justify-between h-full relative">
            
            {/* FULL-BLEED ARTWORK SPREAD ACROSS THE ENTIRE PAGE WITH NO MARGINAL FRAMES */}
            <div className={`absolute ${insetClass} overflow-hidden border border-gray-950/20 shadow-inner z-0`}>
              <img
                src={art.url}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              
              {/* Soft dark gradient layer over full image for high contrast readability of overlay text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 z-10" />
            </div>

            {/* FLOATING WATEMARK TAG (Top-Left overlay) */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
                <span className="text-[8px] sm:text-[9px] font-bold text-white bg-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg  flex items-center gap-1 shrink-0 font-mono">
                @iiqrahCreations
              </span>
            </div>

            {/* FLOATING CAPTIONS & DATA (Bottom overlay) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 text-white z-20 flex flex-col gap-1.5 sm:gap-2 bg-gradient-to-t from-black/80 to-transparent pt-8 rounded-b-2xl">
              
              <div className="flex items-end justify-between gap-3">
                {/* Calendar Stamp */}
                <span className="text-[8px] sm:text-[9px] font-bold text-rose-300 bg-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-white/15 flex items-center gap-1 shrink-0 font-mono">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400" /> {art.date}
                </span>
              </div>

              {/* Optional Text Link bottom center
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[8px] sm:text-[10px] lg:text-xs">
                <a
                  href="https://instagram.com/iiqrahCreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-black text-yellow-300 hover:text-white underline transition-colors"
                >
                  View drawing process ↗
                </a>
      
              </div> */}

            </div>

            {/* Ghost spacer to reserve exact height bounds */}
            <div className="invisible pointer-events-none p-4 select-none">
              Reserving bounds
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  }
}
