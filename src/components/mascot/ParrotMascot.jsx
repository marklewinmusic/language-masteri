import React from "react";
import { motion } from "framer-motion";

export default function ParrotMascot({ size = "md", message, className = "" }) {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-violet-100 text-sm text-gray-700 max-w-48 text-center relative"
        >
          {message}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-violet-100 rotate-45" />
        </motion.div>
      )}
      <motion.svg
        viewBox="0 0 100 100"
        className={sizes[size]}
        initial={{ rotate: -5 }}
        animate={{ rotate: 5 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5, ease: "easeInOut" }}
      >
        {/* Body */}
        <motion.ellipse
          cx="50"
          cy="55"
          rx="25"
          ry="30"
          fill="url(#bodyGradient)"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 1.02 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.3 }}
        />
        
        {/* Wing */}
        <motion.path
          d="M 30 50 Q 15 55 20 70 Q 30 65 35 55 Z"
          fill="url(#wingGradient)"
          initial={{ rotate: 0 }}
          animate={{ rotate: -10 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.2, ease: "easeInOut" }}
          style={{ transformOrigin: "35px 55px" }}
        />
        
        {/* Head */}
        <circle cx="50" cy="28" r="18" fill="url(#headGradient)" />
        
        {/* Crest/Feathers on head */}
        <motion.g
          initial={{ rotate: -5 }}
          animate={{ rotate: 5 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.3 }}
          style={{ transformOrigin: "50px 15px" }}
        >
          <ellipse cx="45" cy="12" rx="3" ry="8" fill="#FF6B6B" />
          <ellipse cx="50" cy="10" rx="3" ry="10" fill="#FFE66D" />
          <ellipse cx="55" cy="12" rx="3" ry="8" fill="#4ECDC4" />
        </motion.g>
        
        {/* Eyes */}
        <circle cx="43" cy="25" r="5" fill="white" />
        <circle cx="57" cy="25" r="5" fill="white" />
        <motion.circle
          cx="44"
          cy="25"
          r="3"
          fill="#1a1a2e"
          animate={{ cx: [44, 45, 44] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.circle
          cx="58"
          cy="25"
          r="3"
          fill="#1a1a2e"
          animate={{ cx: [58, 59, 58] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        {/* Eye sparkle */}
        <circle cx="45" cy="24" r="1" fill="white" />
        <circle cx="59" cy="24" r="1" fill="white" />
        
        {/* Beak */}
        <motion.path
          d="M 50 30 L 58 35 L 50 38 Z"
          fill="#FF9F43"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 1.1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 }}
          style={{ transformOrigin: "50px 35px" }}
        />
        
        {/* Tail feathers */}
        <motion.g
          initial={{ rotate: -3 }}
          animate={{ rotate: 3 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.4 }}
          style={{ transformOrigin: "50px 85px" }}
        >
          <ellipse cx="40" cy="85" rx="4" ry="12" fill="#FF6B6B" />
          <ellipse cx="50" cy="88" rx="4" ry="14" fill="#4ECDC4" />
          <ellipse cx="60" cy="85" rx="4" ry="12" fill="#FFE66D" />
        </motion.g>
        
        {/* Feet */}
        <path d="M 42 82 L 38 90 M 42 82 L 42 90 M 42 82 L 46 90" stroke="#FF9F43" strokeWidth="2" strokeLinecap="round" />
        <path d="M 58 82 L 54 90 M 58 82 L 58 90 M 58 82 L 62 90" stroke="#FF9F43" strokeWidth="2" strokeLinecap="round" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#44A08D" />
          </linearGradient>
          <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f5576c" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}