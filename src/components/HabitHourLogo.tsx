import { motion } from "motion/react";
import logoImg from "../assets/images/habit-hour-logo.png";

export default function HabitHourLogo() {
  return (
    <motion.div
      className="flex flex-col items-center select-none cursor-pointer"
      whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 12 },
        rotate: { type: "keyframes", duration: 0.5, ease: "easeInOut" }
      }}
    >
      <img
        src={logoImg}
        alt="Habit Hour Logo"
        className="w-full max-w-[280px] md:max-w-[340px] drop-shadow-[0_8px_0_rgba(0,0,0,0.15)] rounded-2xl"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
}
