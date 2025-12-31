import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LearningCompanion - A persistent avatar that appears inline throughout learning
 * Not a widget, not floating - embedded directly into content
 * 
 * Props:
 * - expression: "happy" | "proud" | "tired" | "sad" | "focused" | "surprised" | "sleepy" | "watchful" | "neutral"
 * - gear: array of gear items ["sunglasses", "hat", "headphones", "crown", etc.]
 * - size: "sm" | "md" | "lg" | "xl"
 * - message: optional speech bubble text
 * - position: "left" | "right" | "center"
 */

const expressions = {
  happy: {
    eyes: "⚫⚫",
    mouth: "😊",
    eyeOffset: "0, 0",
    cheeks: "🌸"
  },
  proud: {
    eyes: "⚫⚫",
    mouth: "😄",
    eyeOffset: "0, -2",
    cheeks: "✨",
    sparkles: true
  },
  tired: {
    eyes: "😑",
    mouth: "😐",
    eyeOffset: "0, 2",
    cheeks: "💤"
  },
  sad: {
    eyes: "😢",
    mouth: "😔",
    eyeOffset: "0, 2",
    cheeks: ""
  },
  focused: {
    eyes: "👀",
    mouth: "😤",
    eyeOffset: "0, 0",
    cheeks: "💪"
  },
  surprised: {
    eyes: "😲",
    mouth: "😮",
    eyeOffset: "0, -3",
    cheeks: "💦"
  },
  sleepy: {
    eyes: "😪",
    mouth: "😴",
    eyeOffset: "0, 3",
    cheeks: "💤"
  },
  watchful: {
    eyes: "👁️",
    mouth: "🙂",
    eyeOffset: "0, 0",
    cheeks: ""
  },
  neutral: {
    eyes: "⚫⚫",
    mouth: "😊",
    eyeOffset: "0, 0",
    cheeks: ""
  }
};

const gearItems = {
  sunglasses: "🕶️",
  hat: "🎩",
  headphones: "🎧",
  crown: "👑",
  party_hat: "🎉",
  flower: "🌸",
  star: "⭐",
  fire: "🔥"
};

const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-48 h-48",
  xl: "w-64 h-64"
};

export default function LearningCompanion({ 
  expression = "neutral",
  gear = [],
  size = "md",
  message = null,
  position = "center",
  className = "",
  animate = true
}) {
  const [showSparkles, setShowSparkles] = useState(false);
  const currentExpression = expressions[expression] || expressions.neutral;

  useEffect(() => {
    if (currentExpression.sparkles) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [expression]);

  const positionClass = {
    left: "mx-0 mr-auto",
    right: "mx-0 ml-auto",
    center: "mx-auto"
  }[position];

  const CompanionBody = () => (
    <div className={`${sizeClasses[size]} ${positionClass} ${className} relative flex items-center justify-center`}>
      {/* Sparkles effect */}
      <AnimatePresence>
        {showSparkles && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  x: [0, (i % 3 - 1) * 40],
                  y: [0, Math.floor(i / 3) * 40 - 20],
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="absolute text-2xl pointer-events-none"
                style={{ left: '50%', top: '50%' }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main avatar body - cute bunny/character shape */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
      >
        {/* Ears */}
        <ellipse cx="60" cy="50" rx="20" ry="45" fill="#FFE4E8" />
        <ellipse cx="60" cy="50" rx="12" ry="35" fill="#FFB3C1" />
        <ellipse cx="140" cy="50" rx="20" ry="45" fill="#FFE4E8" />
        <ellipse cx="140" cy="50" rx="12" ry="35" fill="#FFB3C1" />

        {/* Head */}
        <circle cx="100" cy="100" r="55" fill="#FFF" stroke="#FFE4E8" strokeWidth="3" />

        {/* Eyes */}
        <g>
          <circle cx="80" cy="95" r="8" fill="#000" />
          <circle cx="82" cy="93" r="3" fill="#FFF" />
          <circle cx="120" cy="95" r="8" fill="#000" />
          <circle cx="122" cy="93" r="3" fill="#FFF" />
        </g>

        {/* Cheeks */}
        <circle cx="65" cy="105" r="8" fill="#FFB3C1" opacity="0.6" />
        <circle cx="135" cy="105" r="8" fill="#FFB3C1" opacity="0.6" />

        {/* Nose */}
        <ellipse cx="100" cy="105" rx="6" ry="4" fill="#FFB3C1" />

        {/* Mouth based on expression */}
        {expression === "happy" && (
          <path d="M 85 115 Q 100 125 115 115" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {expression === "proud" && (
          <path d="M 85 115 Q 100 130 115 115" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
        {expression === "tired" && (
          <line x1="85" y1="115" x2="115" y2="115" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        )}
        {expression === "sad" && (
          <path d="M 85 120 Q 100 115 115 120" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {expression === "focused" && (
          <path d="M 85 115 L 115 115" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        )}
        {expression === "surprised" && (
          <circle cx="100" cy="118" r="6" fill="#000" />
        )}
        {expression === "sleepy" && (
          <>
            <path d="M 75 95 L 85 95" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <path d="M 115 95 L 125 95" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {expression === "watchful" && (
          <path d="M 85 115 Q 100 120 115 115" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {expression === "neutral" && (
          <path d="M 85 115 Q 100 120 115 115" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Body */}
        <ellipse cx="100" cy="165" rx="45" ry="35" fill="#FFF" stroke="#FFE4E8" strokeWidth="3" />

        {/* Arms */}
        <ellipse cx="60" cy="155" rx="12" ry="25" fill="#FFF" stroke="#FFE4E8" strokeWidth="2" transform="rotate(-20 60 155)" />
        <ellipse cx="140" cy="155" rx="12" ry="25" fill="#FFF" stroke="#FFE4E8" strokeWidth="2" transform="rotate(20 140 155)" />

        {/* Tail */}
        <circle cx="100" cy="195" r="12" fill="#FFF" stroke="#FFE4E8" strokeWidth="2" />
      </svg>

      {/* Gear overlay */}
      {gear.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {gear.map((item, idx) => (
            <motion.div
              key={item}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute text-4xl ${
                item === "sunglasses" ? "top-[35%]" :
                item === "hat" || item === "party_hat" || item === "crown" ? "top-[15%]" :
                item === "headphones" ? "top-[30%]" :
                "top-[20%] right-[15%]"
              }`}
              style={{ zIndex: 10 }}
            >
              {gearItems[item] || ""}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      className="flex flex-col items-center gap-4"
    >
      {animate ? (
        <motion.div
          animate={{ 
            y: [0, -8, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <CompanionBody />
        </motion.div>
      ) : (
        <CompanionBody />
      )}

      {/* Speech bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-2xl px-6 py-3 shadow-lg border-2 border-purple-200 max-w-xs"
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" />
          <p className="text-gray-800 text-center font-medium">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
}