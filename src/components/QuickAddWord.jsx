import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickAddWord() {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (wordData) => base44.entities.Word.create(wordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordbank'] });
      toast.success("Word added!");
      setWord("");
      setMeaning("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!word.trim()) return;
    addMutation.mutate({
      word: word,
      translation: meaning,
      phonetic: word,
      category: "wordbank",
      difficulty: "beginner",
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-2 bg-white rounded-xl shadow-lg border border-violet-200 p-4 w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-violet-700 text-sm">Quick Add Word</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                placeholder="Word (transliteration)"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Meaning (optional)"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                className="text-sm"
              />
              <Button 
                type="submit" 
                disabled={!word.trim() || addMutation.isPending}
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add to Word Bank
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full h-12 w-12 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 shadow-lg"
      >
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </Button>
    </div>
  );
}