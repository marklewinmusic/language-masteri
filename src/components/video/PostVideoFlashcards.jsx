import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const RATINGS = [
  { value: 1, label: "1", color: "#ef4444" },
  { value: 2, label: "2", color: "#f97316" },
  { value: 3, label: "3", color: "#eab308" },
  { value: 5, label: "Mastered ⭐", color: "#22c55e" },
];

export default function PostVideoFlashcards({ words, onClose, onJournal, videoTitle, userProfile }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState("intro");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState([]);

  const updateWordMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Word.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wordRatings'] }),
  });

  const createWordMutation = useMutation({
    mutationFn: (data) => base44.entities.Word.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wordRatings'] }),
  });

  const handleRate = async (word, rating) => {
    setSaving(true);
    setResults(prev => [...prev, { word, rating }]);
    if (word.id) {
      await updateWordMutation.mutateAsync({ id: word.id, data: { times_practiced: rating, mastered: rating >= 5 } });
    } else {
      await createWordMutation.mutateAsync({
        word: word.word,
        translation: word.translation,
        phonetic: word.phonetic,
        category: "wordbank",
        language: userProfile?.language || "hebrew",
        times_practiced: rating,
        mastered: rating >= 5,
        vocab_level: 0,
      });
    }
    setSaving(false);
    if (cardIdx + 1 >= words.length) {
      setStep("done");
    } else {
      setCardIdx(i => i + 1);
      setFlipped(false);
    }
  };

  const currentWord = words[cardIdx];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-white text-2xl font-bold">Great job watching!</h2>
            <p className="text-white/60 text-base">
              You just watched <span className="text-cyan-300 font-semibold">"{videoTitle}"</span>.<br/>
              Now let's lock in the key vocab words from that session.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
              <p className="text-white/80 font-semibold text-sm">How it works:</p>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>📖 Each word from the video will appear on a card</li>
                <li>👆 Tap the card to reveal the English meaning</li>
                <li>⭐ Rate how well you know it (1–Mastered)</li>
                <li>🎒 Your ratings are saved to your Backpack</li>
              </ul>
            </div>
            <p className="text-white/40 text-sm">{words.length} words to review</p>
            <button
              onClick={() => setStep("flashcards")}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              Start Flashcards →
            </button>
            <button onClick={onClose} className="text-white/30 text-sm hover:text-white/60">
              Skip for now
            </button>
          </motion.div>
        )}

        {step === "flashcards" && currentWord && (
          <motion.div
            key={`card-${cardIdx}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="max-w-md w-full space-y-6"
          >
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all"
                  style={{ width: `${(cardIdx / words.length) * 100}%` }}
                />
              </div>
              <span className="text-white/40 text-xs whitespace-nowrap">{cardIdx + 1} / {words.length}</span>
            </div>

            <p className="text-white/50 text-sm text-center">
              {!flipped ? "👆 Tap the card to reveal the meaning" : "How well do you know this word?"}
            </p>

            {/* Card */}
            <motion.div
              onClick={() => setFlipped(true)}
              whileHover={{ scale: flipped ? 1 : 1.02 }}
              whileTap={{ scale: flipped ? 1 : 0.97 }}
              className="w-full rounded-3xl cursor-pointer select-none overflow-hidden"
              style={{
                minHeight: 200,
                background: 'linear-gradient(160deg, #1e293b, #0f172a)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex flex-col items-center justify-center h-full p-8 gap-3">
                {currentWord.word && (
                  <p className="text-4xl font-bold text-cyan-300" dir="rtl" style={{ fontFamily: 'serif' }}>
                    {currentWord.word}
                  </p>
                )}
                <p className="text-white/70 text-xl">{currentWord.phonetic}</p>
                <AnimatePresence>
                  {flipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-center"
                    >
                      <p className="text-green-300 text-2xl font-bold">{currentWord.translation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!flipped && (
                  <p className="text-white/20 text-xs mt-4">tap to reveal</p>
                )}
              </div>
            </motion.div>

            {/* Rating buttons */}
            <AnimatePresence>
              {flipped && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  {RATINGS.map(r => (
                    <button
                      key={r.value}
                      onClick={() => handleRate(currentWord, r.value)}
                      disabled={saving}
                      className="flex-1 py-3 px-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                      style={{ background: `${r.color}20`, border: `1px solid ${r.color}50`, color: r.color }}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : r.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-5"
          >
            <div className="text-6xl">🎒</div>
            <h2 className="text-white text-2xl font-bold">Session Complete!</h2>
            <p className="text-white/60">
              You reviewed <span className="text-cyan-300 font-bold">{words.length} words</span> from this session.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {results.map((r, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 flex justify-between items-center border border-white/10">
                  <span className="text-white/70">{r.word.phonetic}</span>
                  <span className="font-bold" style={{ color: RATINGS.find(rt => rt.value === r.rating)?.color }}>
                    {r.rating === 5 ? "⭐ Mastered" : `Level ${r.rating}`}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {onJournal && (
                <button
                  onClick={onJournal}
                  className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #5a6b5a, #3d4a2e)' }}
                >
                  📓 Write in Journal →
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-semibold text-sm"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}