import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContinuousTranscript({ 
  transcript, 
  currentTime, 
  onSeekTo, 
  onAddWord 
}) {
  const [hoveredWord, setHoveredWord] = useState(null);

  // Flatten all words from all segments with their timestamps
  const allWords = transcript.flatMap((segment, segIdx) => {
    if (!segment.transliteration) return [];
    
    const words = segment.transliteration.split(/\s+/).filter(w => w.trim());
    const nextStart = transcript[segIdx + 1]?.start || Infinity;
    const segmentDuration = nextStart - segment.start;
    const wordDuration = segmentDuration / words.length;
    
    return words.map((word, wordIdx) => ({
      text: word,
      start: segment.start + (wordIdx * wordDuration),
      segmentIndex: segIdx
    }));
  });

  return (
    <div className="max-w-4xl mx-auto bg-white/5 rounded-2xl p-8">
      <p className="text-2xl leading-relaxed text-center" style={{ lineHeight: '2.5' }}>
        {allWords.map((wordObj, idx) => {
          const isActive = currentTime >= wordObj.start && 
                          currentTime < (allWords[idx + 1]?.start || Infinity);
          
          return (
            <span key={idx} className="relative inline-block">
              <motion.span
                onMouseEnter={() => setHoveredWord(idx)}
                onMouseLeave={() => setHoveredWord(null)}
                onClick={() => onSeekTo(wordObj.start)}
                animate={{
                  color: isActive ? '#22d3ee' : '#ffffff',
                  backgroundColor: isActive ? 'rgba(34, 211, 238, 0.2)' : 'transparent',
                  scale: isActive ? 1.1 : 1
                }}
                className="cursor-pointer hover:text-cyan-300 transition-all px-1 rounded"
                style={{ display: 'inline-block' }}
              >
                {wordObj.text}
              </motion.span>
              
              <AnimatePresence>
                {hoveredWord === idx && (
                  <motion.button
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 10 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddWord(wordObj.text);
                      setHoveredWord(null);
                    }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg px-2 py-1 shadow-lg z-50 whitespace-nowrap text-sm"
                  >
                    🎒 Add
                  </motion.button>
                )}
              </AnimatePresence>
              <span> </span>
            </span>
          );
        })}
      </p>
    </div>
  );
}