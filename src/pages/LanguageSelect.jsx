import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const languages = [
  { id: "hebrew", name: "Hebrew", emoji: "🇮🇱", active: true },
  { id: "english", name: "English", emoji: "🇺🇸", active: true },
  { id: "spanish", name: "Spanish", emoji: "🇪🇸", active: true },
  { id: "french", name: "French", emoji: "🇫🇷", active: false },
  { id: "portuguese", name: "Portuguese", emoji: "🇧🇷", active: false },
  { id: "italian", name: "Italian", emoji: "🇮🇹", active: false },
];

export default function LanguageSelect() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    document.title = "Choose Language - Lashon Languages";
  }, []);

  const selectLanguageMutation = useMutation({
    mutationFn: async (language) => {
      const currentUser = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        return await base44.entities.UserProfile.update(profiles[0].id, { language });
      }
      return await base44.entities.UserProfile.create({ 
        language, 
        current_day: 1,
        is_new_user: true
      });
    },
    onSuccess: async () => {
      const currentUser = await base44.auth.me();
      await queryClient.invalidateQueries({ queryKey: ['userProfile', currentUser?.email] });
      navigate(createPageUrl("AvatarSelect"));
    },
  });

  const handleSelect = (lang) => {
    if (!lang.active) {
      setShowComingSoon(true);
      return;
    }
    setSelectedLanguage(lang.id);
  };

  const handleContinue = () => {
    if (!selectedLanguage) {
      toast.error("Please select a language");
      return;
    }
    selectLanguageMutation.mutate(selectedLanguage);
  };

  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 text-center"
        >
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold text-white mb-3">Coming Soon!</h2>
          <p className="text-white/80 text-lg mb-8">
            This language is not available yet. We're working hard to bring it to you soon!
          </p>
          <Button
            onClick={() => setShowComingSoon(false)}
            className="w-full py-4 text-lg font-bold bg-white text-purple-600 hover:bg-white/90"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Choose your language
          </h1>
          <p className="text-xl text-white/90">
            Start your learning journey
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {languages.map((lang) => (
            <motion.button
              key={lang.id}
              onClick={() => handleSelect(lang)}
              whileHover={{ scale: lang.active ? 1.05 : 1 }}
              whileTap={{ scale: lang.active ? 0.95 : 1 }}
              className={`relative p-8 rounded-3xl backdrop-blur-sm border-2 transition-all ${
                selectedLanguage === lang.id
                  ? 'bg-white/20 border-white/60'
                  : lang.active
                  ? 'bg-white/10 border-white/20 hover:border-white/40'
                  : 'bg-white/5 border-white/10 opacity-50 cursor-pointer'
              }`}
            >
              <div className="text-7xl mb-3">{lang.emoji}</div>
              <p className="text-white font-semibold text-lg">{lang.name}</p>
              {!lang.active && (
                <p className="text-white/60 text-xs mt-1">Coming Soon</p>
              )}
            </motion.button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedLanguage || selectLanguageMutation.isPending}
          className="w-full py-6 text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg disabled:opacity-50"
        >
          {selectLanguageMutation.isPending ? "Starting..." : "Continue"}
        </Button>
      </motion.div>
    </div>
  );
}