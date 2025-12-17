import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Step3Vocab({ story, progress, onComplete }) {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine backpack words with core vocab
  const allVocab = [
    ...(progress.words_added_to_backpack || []).map(word => {
      const coreWord = story.story_vocab_core.find(v => v.word_he === word);
      return coreWord || { word_he: word, transliteration: word, meaning_en: "Meaning from story" };
    }),
    ...story.story_vocab_core.filter(v => 
      !(progress.words_added_to_backpack || []).includes(v.word_he)
    )
  ].slice(0, 8);

  const exposureMutation = useMutation({
    mutationFn: async (word) => {
      const existing = await base44.entities.VocabExposure.filter({ 
        word_he: word,
        created_by: (await base44.auth.me()).email 
      });
      
      if (existing.length > 0) {
        return await base44.entities.VocabExposure.update(existing[0].id, {
          exposure_count: (existing[0].exposure_count || 1) + 1
        });
      } else {
        return await base44.entities.VocabExposure.create({
          word_he: word,
          story_id: story.story_id,
          exposure_count: 1
        });
      }
    },
  });

  const handleNext = () => {
    const currentWord = allVocab[currentIndex];
    exposureMutation.mutate(currentWord.word_he);

    if (currentIndex < allVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'he-IL';
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const currentWord = allVocab[currentIndex];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-2">Step 3: Vocabulary</h2>
        <p className="text-white/60 text-sm">
          {currentIndex + 1} of {allVocab.length} words
        </p>
        <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
            style={{ width: `${((currentIndex + 1) / allVocab.length) * 100}%` }}
          />
        </div>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 mb-6 text-center"
      >
        <button
          onClick={() => speakWord(currentWord.word_he)}
          className="w-16 h-16 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center mx-auto mb-6 transition-all"
        >
          <Volume2 className="w-8 h-8 text-white" />
        </button>

        <h3 className="text-white text-4xl font-bold mb-4" dir="rtl">
          {currentWord.word_he}
        </h3>

        <p className="text-cyan-400 text-xl mb-4">
          {currentWord.transliteration}
        </p>

        <p className="text-green-400 text-2xl font-medium">
          {currentWord.meaning_en}
        </p>
      </motion.div>

      <Button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {currentIndex < allVocab.length - 1 ? "Next Word →" : "Continue to Practice →"}
      </Button>
    </div>
  );
}