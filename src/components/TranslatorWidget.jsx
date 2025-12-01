import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, X, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function TranslatorWidget() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const createWordMutation = useMutation({
    mutationFn: (wordData) => base44.entities.Word.create(wordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordRatings'] });
      toast.success("Added to backpack! 🎒");
      setTranslation(null);
      setInputText("");
    },
  });

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const isHebrew = /[\u0590-\u05FF]/.test(inputText);
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: isHebrew 
          ? `Translate this Hebrew text to English and provide transliteration: "${inputText}"`
          : `Translate this English text to Hebrew with vowels (nikkud), and provide transliteration: "${inputText}"`,
        response_json_schema: {
          type: "object",
          properties: {
            hebrew: { type: "string", description: "Hebrew text with vowels/nikkud" },
            english: { type: "string", description: "English meaning" },
            transliteration: { type: "string", description: "How to pronounce it" }
          }
        }
      });
      
      setTranslation(result);
    } catch (e) {
      toast.error("Translation failed");
    }
    setIsTranslating(false);
  };

  const handleAddToBackpack = () => {
    if (!translation) return;
    
    createWordMutation.mutate({
      word: translation.hebrew,
      translation: translation.english,
      phonetic: translation.transliteration,
      category: "wordbank",
      times_practiced: 0,
      mastered: false,
    });
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Languages className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 left-4 z-50 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex gap-2 mb-3">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="English or Hebrew..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
              />
              <Button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isTranslating}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Go"}
              </Button>
            </div>

            {translation && (
              <>
                <div className="bg-white/5 rounded-xl p-3 mb-3 text-center">
                  <p className="text-cyan-400 text-xl font-bold" dir="rtl">{translation.hebrew}</p>
                  <p className="text-white/60 text-sm">{translation.transliteration}</p>
                  <p className="text-green-400 mt-1">{translation.english}</p>
                </div>

                <Button
                  onClick={handleAddToBackpack}
                  disabled={createWordMutation.isPending}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                >
                  {createWordMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Add to Backpack
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}