import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Volume2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ParrotMascot from "../components/mascot/ParrotMascot";
import SoundWave from "../components/practice/SoundWave";

export default function Sentences() {
  const [mode, setMode] = useState("list");
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  const { data: sentences = [], isLoading } = useQuery({
    queryKey: ['sentences'],
    queryFn: () => base44.entities.Word.filter({ category: "sentences" }, "-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Word.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentences'] });
    },
  });

  const handleRate = async (id, rating) => {
    await updateMutation.mutateAsync({
      id,
      data: { times_practiced: rating, mastered: rating >= 5 },
    });
  };

  const playAudio = (sentence) => {
    if (sentence.audio_url) {
      const audio = new Audio(sentence.audio_url);
      audio.play();
    }
  };

  const startFlashcards = () => {
    setCurrentIndex(0);
    setMode("flashcards");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SoundWave isPlaying={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <ParrotMascot size="sm" message="Practice sentences!" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Sentences
              </h1>
              <p className="text-gray-500">Practice full sentences and phrases</p>
            </div>
          </div>
        </motion.div>

        {sentences.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20"
          >
            <ParrotMascot size="lg" message="No sentences yet! Add some from videos." className="mb-4" />
          </motion.div>
        ) : mode === "list" ? (
          <div>
            <div className="bg-gradient-to-r from-violet-500 to-blue-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Ready to practice?</h2>
                  <p className="text-white/80">Test yourself with sentence flashcards</p>
                </div>
                <Button 
                  onClick={startFlashcards}
                  className="bg-white text-violet-600 hover:bg-violet-50 rounded-xl px-6"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Flashcards
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              {[5, 4, 3, 2, 1, 0].map(level => {
                const levelSentences = sentences.filter(s => (s.times_practiced || 0) === level);
                if (levelSentences.length === 0) return null;
                const levelLabels = {
                  5: { label: "⭐ Mastered", bg: "bg-green-50", border: "border-green-200" },
                  4: { label: "🔥 Almost There", bg: "bg-emerald-50", border: "border-emerald-200" },
                  3: { label: "💪 Getting Better", bg: "bg-blue-50", border: "border-blue-200" },
                  2: { label: "📚 Learning", bg: "bg-violet-50", border: "border-violet-200" },
                  1: { label: "🌱 Just Started", bg: "bg-purple-50", border: "border-purple-200" },
                  0: { label: "✨ New", bg: "bg-gray-50", border: "border-gray-200" },
                };
                return (
                  <div key={level}>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">{levelLabels[level].label} ({levelSentences.length})</h3>
                    <div className="space-y-2">
                      {levelSentences.map((sentence) => (
                        <motion.div
                          key={sentence.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`${levelLabels[level].bg} ${levelLabels[level].border} border-2 rounded-2xl px-4 py-3 flex items-center justify-between`}
                        >
                          <button 
                            onClick={() => sentence.audio_url && playAudio(sentence)}
                            className="flex-1 text-left flex items-center gap-3 hover:opacity-80"
                          >
                            <span className="font-medium text-gray-700">{sentence.phonetic}</span>
                            <span className="text-lg font-bold text-violet-600" dir="rtl">{sentence.word}</span>
                            <span className="text-gray-400 text-sm">({sentence.translation})</span>
                            {sentence.audio_url && <Volume2 className="w-3 h-3 text-gray-400" />}
                          </button>
                          <div className="flex gap-1 ml-2 border-l border-gray-200 pl-2">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                key={num}
                                onClick={() => handleRate(sentence.id, num)}
                                className={`w-6 h-6 rounded-full text-xs font-bold transition-all hover:scale-110 ${
                                  (sentence.times_practiced || 0) >= num 
                                    ? "bg-violet-500 text-white" 
                                    : "bg-white border border-gray-300 text-gray-500 hover:border-violet-400 hover:text-violet-500"
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => setMode("list")}
              variant="outline"
              className="mb-4 border-2 border-violet-200 hover:border-violet-300 rounded-xl"
            >
              ← Back to Sentence List
            </Button>
            <div className="text-center text-gray-500 mb-4">
              {currentIndex + 1} / {sentences.length}
            </div>
            <AnimatePresence mode="wait">
              {sentences[currentIndex] && (
                <motion.div
                  key={sentences[currentIndex].id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-2xl border border-violet-100 shadow-lg p-8 text-center"
                >
                  <p className="text-2xl font-bold text-violet-600 mb-4" dir="rtl">{sentences[currentIndex].word}</p>
                  <p className="text-lg text-gray-600 mb-2">{sentences[currentIndex].phonetic}</p>
                  <p className="text-gray-500 mb-6">{sentences[currentIndex].translation}</p>
                  {sentences[currentIndex].audio_url && (
                    <Button onClick={() => playAudio(sentences[currentIndex])} variant="outline" className="mb-6">
                      <Volume2 className="w-4 h-4 mr-2" /> Play Audio
                    </Button>
                  )}
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        onClick={() => {
                          handleRate(sentences[currentIndex].id, num);
                          setCurrentIndex(prev => (prev + 1) % sentences.length);
                        }}
                        className={`w-10 h-10 rounded-full text-sm font-bold transition-all hover:scale-110 ${
                          (sentences[currentIndex].times_practiced || 0) >= num 
                            ? "bg-violet-500 text-white" 
                            : "bg-gray-100 border border-gray-300 text-gray-500 hover:border-violet-400"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}