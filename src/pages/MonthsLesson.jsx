import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedParrot from "../components/mascot/AnimatedParrot";

const months = [
  { hebrew: "ינואר", transliteration: "yanuar", meaning: "January" },
  { hebrew: "פברואר", transliteration: "februar", meaning: "February" },
  { hebrew: "מרץ", transliteration: "merts", meaning: "March" },
  { hebrew: "אפריל", transliteration: "april", meaning: "April" },
  { hebrew: "מאי", transliteration: "mai", meaning: "May" },
  { hebrew: "יוני", transliteration: "yuni", meaning: "June" },
  { hebrew: "יולי", transliteration: "yuli", meaning: "July" },
  { hebrew: "אוגוסט", transliteration: "ogust", meaning: "August" },
  { hebrew: "ספטמבר", transliteration: "september", meaning: "September" },
  { hebrew: "אוקטובר", transliteration: "oktober", meaning: "October" },
  { hebrew: "נובמבר", transliteration: "november", meaning: "November" },
  { hebrew: "דצמבר", transliteration: "detsember", meaning: "December" },
];

export default function MonthsLesson() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const current = months[currentIndex];

  const next = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % months.length);
    setTrigger(t => t + 1);
  };

  const prev = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + months.length) % months.length);
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Months of the Year</h1>
            <p className="text-gray-500">{currentIndex + 1} of {months.length}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-amber-100"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">🗓️</span>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800 mb-2" dir="rtl">{current.hebrew}</p>
              <p className="text-xl text-amber-600 mb-2">{current.transliteration}</p>
              
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
          <Button onClick={next} className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}