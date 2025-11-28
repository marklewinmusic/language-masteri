import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedParrot from "../components/mascot/AnimatedParrot";

const bodyParts = [
  { hebrew: "ראש", transliteration: "rosh", meaning: "head" },
  { hebrew: "עין", transliteration: "ayin", meaning: "eye" },
  { hebrew: "עיניים", transliteration: "einayim", meaning: "eyes" },
  { hebrew: "אוזן", transliteration: "ozen", meaning: "ear" },
  { hebrew: "אף", transliteration: "af", meaning: "nose" },
  { hebrew: "פה", transliteration: "peh", meaning: "mouth" },
  { hebrew: "שן", transliteration: "shen", meaning: "tooth" },
  { hebrew: "לשון", transliteration: "lashon", meaning: "tongue" },
  { hebrew: "צוואר", transliteration: "tzavar", meaning: "neck" },
  { hebrew: "כתף", transliteration: "katef", meaning: "shoulder" },
  { hebrew: "יד", transliteration: "yad", meaning: "hand/arm" },
  { hebrew: "אצבע", transliteration: "etzba", meaning: "finger" },
  { hebrew: "רגל", transliteration: "regel", meaning: "leg/foot" },
  { hebrew: "ברך", transliteration: "berech", meaning: "knee" },
  { hebrew: "בטן", transliteration: "beten", meaning: "stomach" },
  { hebrew: "גב", transliteration: "gav", meaning: "back" },
  { hebrew: "לב", transliteration: "lev", meaning: "heart" },
  { hebrew: "שיער", transliteration: "se'ar", meaning: "hair" },
];

export default function BodyPartsLesson() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const current = bodyParts[currentIndex];

  const next = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % bodyParts.length);
    setTrigger(t => t + 1);
  };

  const prev = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + bodyParts.length) % bodyParts.length);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to={createPageUrl("Progress")} className="text-violet-600 hover:text-violet-700 mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Schedule
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <AnimatedParrot trigger={trigger} size="sm" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Body Parts</h1>
            <p className="text-gray-500">{currentIndex + 1} of {bodyParts.length}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">🦴</span>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800 mb-2" dir="rtl">{current.hebrew}</p>
              <p className="text-xl text-blue-600 mb-2">{current.transliteration}</p>
              
              <Button
                variant="outline"
                onClick={() => setShowAnswer(!showAnswer)}
                className="mt-4"
              >
                {showAnswer ? "Hide" : "Show"} Meaning
              </Button>

              {showAnswer && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl text-gray-600 mt-4 font-medium"
                >
                  {current.meaning}
                </motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button onClick={prev} variant="outline" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <Button onClick={next} className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}