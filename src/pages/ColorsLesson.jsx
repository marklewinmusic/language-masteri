import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import GameHeader from "../components/game/GameHeader";
import QuickAddWordWidget from "../components/QuickAddWordWidget";

const colors = [
  { hebrew: "אָדוֹם", transliteration: "adom", meaning: "red", color: "#EF4444" },
  { hebrew: "כָּחוֹל", transliteration: "kachol", meaning: "blue", color: "#3B82F6" },
  { hebrew: "יָרוֹק", transliteration: "yarok", meaning: "green", color: "#22C55E" },
  { hebrew: "צָהוֹב", transliteration: "tsahov", meaning: "yellow", color: "#EAB308" },
  { hebrew: "כָּתוֹם", transliteration: "katom", meaning: "orange", color: "#F97316" },
  { hebrew: "סָגוֹל", transliteration: "sagol", meaning: "purple", color: "#A855F7" },
  { hebrew: "וָרוֹד", transliteration: "varod", meaning: "pink", color: "#EC4899" },
  { hebrew: "לָבָן", transliteration: "lavan", meaning: "white", color: "#F3F4F6" },
  { hebrew: "שָׁחוֹר", transliteration: "shachor", meaning: "black", color: "#1F2937" },
  { hebrew: "חוּם", transliteration: "chum", meaning: "brown", color: "#92400E" },
  { hebrew: "אָפוֹר", transliteration: "afor", meaning: "gray", color: "#6B7280" },
  { hebrew: "זָהָב", transliteration: "zahav", meaning: "gold", color: "#D97706" },
];

export default function ColorsLesson() {
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorRatings, setColorRatings] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.list();
      return profiles[0] || null;
    },
  });

  const { data: userCoins } = useQuery({
    queryKey: ['userCoins'],
    queryFn: async () => {
      const coins = await base44.entities.UserCoins.list();
      return coins[0] || { coins: 0 };
    },
  });

  const { data: progress } = useQuery({
    queryKey: ['lessonProgress', 'ColorsLesson'],
    queryFn: () => base44.entities.LessonProgress.filter({ lesson_name: 'ColorsLesson' }),
  });

  const createWordMutation = useMutation({
    mutationFn: (wordData) => base44.entities.Word.create(wordData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wordRatings'] }),
  });

  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      const existing = progress?.[0];
      if (existing) {
        return base44.entities.LessonProgress.update(existing.id, { completed: true });
      }
      return base44.entities.LessonProgress.create({ lesson_name: 'ColorsLesson', completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonProgress'] });
      toast.success("Colors lesson completed! ✓");
    },
  });

  const handleRating = async (color, rating) => {
    setColorRatings(prev => ({ ...prev, [color.meaning]: rating }));
    
    // Save to backpack
    await createWordMutation.mutateAsync({
      word: color.hebrew,
      translation: color.meaning,
      phonetic: color.transliteration,
      category: "wordbank",
      times_practiced: rating,
      mastered: rating >= 5,
    });
    
    toast.success(`Saved "${color.meaning}" with rating ${rating}!`);
    
    // Check if all colors rated
    const newRatings = { ...colorRatings, [color.meaning]: rating };
    if (Object.keys(newRatings).length === colors.length) {
      completeLessonMutation.mutate();
    }
  };

  const ratedCount = Object.keys(colorRatings).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GameHeader profile={userProfile} coins={userCoins?.coins} onBuyCoins={() => {}} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to={createPageUrl("Home")} className="text-white/60 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">🎨 Learn Colors</h1>
            <p className="text-white/60">Tap a color to see Hebrew • Rate 1-5 to save</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-white/60 text-sm mb-2">
            <span>{ratedCount} of {colors.length} rated</span>
            {ratedCount === colors.length && (
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Complete!
              </span>
            )}
          </div>
          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(ratedCount / colors.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {colors.map((color) => {
            const isRated = colorRatings[color.meaning] !== undefined;
            const rating = colorRatings[color.meaning];
            
            return (
              <motion.button
                key={color.meaning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedColor(color)}
                className={`relative rounded-2xl p-4 transition-all border-2 ${
                  isRated 
                    ? "border-green-500/50" 
                    : "border-white/10 hover:border-cyan-400/50"
                }`}
                style={{ backgroundColor: color.color }}
              >
                <p className={`text-center font-bold capitalize text-lg ${
                  ['white', 'yellow', 'gold'].includes(color.meaning) ? 'text-gray-800' : 'text-white'
                }`}>
                  {color.meaning}
                </p>
                
                {isRated && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                    {rating}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected Color Detail */}
        <AnimatePresence>
          {selectedColor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedColor(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm"
              >
                {/* Color swatch */}
                <div 
                  className="w-24 h-24 rounded-2xl mx-auto mb-4 shadow-lg"
                  style={{ backgroundColor: selectedColor.color }}
                />
                
                <div className="text-center mb-6">
                  <p className="text-white/60 text-sm mb-1 capitalize">{selectedColor.meaning}</p>
                  <p className="text-4xl font-bold text-cyan-400" dir="rtl">{selectedColor.hebrew}</p>
                  <p className="text-white/80 text-lg">{selectedColor.transliteration}</p>
                </div>

                {/* Rating */}
                <p className="text-white/60 text-sm text-center mb-3">How well do you know this color?</p>
                <div className="flex gap-2 justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const currentRating = colorRatings[selectedColor.meaning];
                    return (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRating(selectedColor, num)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          currentRating === num
                            ? num === 5 
                              ? "bg-green-500 text-white" 
                              : "bg-cyan-500 text-white"
                            : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                      >
                        {num}
                      </motion.button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => setSelectedColor(null)}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complete button */}
        {ratedCount === colors.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              onClick={() => navigate(createPageUrl("ColorsTest"))}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 py-6 text-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Take the Test
            </Button>
          </motion.div>
        )}
      </div>

      <QuickAddWordWidget />
    </div>
  );
}