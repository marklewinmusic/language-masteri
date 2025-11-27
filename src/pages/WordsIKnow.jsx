import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ParrotMascot from "../components/mascot/ParrotMascot";

export default function WordsIKnow() {
  const queryClient = useQueryClient();

  // Show words that are mastered (rated 5+) from any category
  const { data: allWords = [], isLoading } = useQuery({
    queryKey: ['words'],
    queryFn: () => base44.entities.Word.list(),
  });
  
  const words = allWords.filter(w => w.mastered || (w.times_practiced && w.times_practiced >= 5));

  const updateMutation = useMutation({
    mutationFn: ({ id }) => base44.entities.Word.update(id, { mastered: false, times_practiced: 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-violet-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <ParrotMascot size="sm" message="Words you've mastered!" />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Words I Know
            </h1>
            <p className="text-gray-500">{words.length} words mastered - well done!</p>
          </div>
        </div>

        {words.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100">
            <ParrotMascot size="lg" message="No mastered words yet! Rate words 5 in Pictures to add them here." />
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {words.map((word) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-100 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">{word.phonetic || word.word}</span>
                        <span className="text-lg text-gray-400" dir="rtl">{word.word}</span>
                      </div>
                      <span className="text-gray-600 text-sm">{word.translation}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateMutation.mutate({ id: word.id })}
                    className="text-gray-400 hover:text-orange-500 hover:bg-orange-50 text-xs"
                  >
                    Reset
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}