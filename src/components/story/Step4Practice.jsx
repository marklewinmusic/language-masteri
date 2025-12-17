import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, Smile } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";

export default function Step4Practice({ story, onComplete }) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Simple exercises - listening to image matching
  const exercises = [
    {
      type: "listening_image",
      audio_word: story.story_vocab_core[0]?.word_he,
      options: [
        { image: "🏠", word: story.story_vocab_core[0]?.word_he, correct: true },
        { image: "🚗", word: "מכונית", correct: false },
        { image: "🌳", word: "עץ", correct: false },
      ]
    },
    {
      type: "listening_image",
      audio_word: story.story_vocab_core[1]?.word_he || "שלום",
      options: [
        { image: "👋", word: story.story_vocab_core[1]?.word_he || "שלום", correct: true },
        { image: "🎵", word: "מוזיקה", correct: false },
        { image: "📚", word: "ספר", correct: false },
      ]
    }
  ];

  const resultMutation = useMutation({
    mutationFn: (data) => base44.entities.PracticeResult.create(data),
  });

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'he-IL';
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    
    if (option.correct) {
      setFeedback("nice");
      setTimeout(() => {
        resultMutation.mutate({
          story_id: story.story_id,
          exercise_type: exercises[currentExercise].type,
          completed: true,
          attempts: 1
        });

        if (currentExercise < exercises.length - 1) {
          setCurrentExercise(currentExercise + 1);
          setSelectedAnswer(null);
          setFeedback(null);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback("almost");
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const exercise = exercises[currentExercise];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-2">Step 4: Light Practice</h2>
        <p className="text-white/60 text-sm">
          Exercise {currentExercise + 1} of {exercises.length}
        </p>
      </div>

      <motion.div
        key={currentExercise}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <p className="text-white/60 mb-4">Tap what you hear:</p>
          <button
            onClick={() => speakWord(exercise.audio_word)}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 flex items-center justify-center mx-auto"
          >
            <Volume2 className="w-10 h-10 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {exercise.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={`aspect-square rounded-2xl text-6xl flex items-center justify-center transition-all ${
                selectedAnswer === option
                  ? option.correct
                    ? "bg-green-500/30 border-2 border-green-500"
                    : "bg-red-500/30 border-2 border-red-500"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {option.image}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center py-3 rounded-xl ${
                feedback === "nice"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Smile className="w-5 h-5" />
                <span className="font-medium">
                  {feedback === "nice" ? "Nice!" : "Almost! Try again"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}