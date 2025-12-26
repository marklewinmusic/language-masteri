import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const babyAvatars = [
  { id: "turtle_baby", type: "turtle", emoji: "🐢", label: "Baby Turtle" },
  { id: "rabbit_baby", type: "rabbit", emoji: "🐰", label: "Baby Rabbit" },
  { id: "boy_baby", type: "boy", emoji: "👶", label: "Baby Boy" },
  { id: "girl_baby", type: "girl", emoji: "👧", label: "Baby Girl" },
  { id: "bear_baby", type: "bear", emoji: "🐻", label: "Baby Bear" },
  { id: "fox_baby", type: "fox", emoji: "🦊", label: "Baby Fox" },
  { id: "cat_baby", type: "cat", emoji: "🐱", label: "Baby Cat" },
  { id: "chick_baby", type: "chick", emoji: "🐥", label: "Baby Chick" },
];

export default function AvatarSelect() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const createProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const existingProfiles = await base44.entities.UserProfile.list();
      if (existingProfiles.length > 0) {
        return await base44.entities.UserProfile.update(existingProfiles[0].id, profileData);
      }
      return await base44.entities.UserProfile.create(profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      navigate(createPageUrl("Home"));
      toast.success("Welcome! Let's start learning! 🌱");
    },
  });

  const handleContinue = () => {
    if (!selectedAvatar) return;
    
    createProfileMutation.mutate({
      avatar_id: selectedAvatar.id,
      avatar_type: selectedAvatar.type,
      avatar_name: selectedAvatar.label,
      growth_stage: "baby",
      age_level: 3,
      xp: 0,
      daily_streak: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Choose your baby buddy
          </h1>
          <p className="text-xl text-white/90">
            They grow as you show up 🌱
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {babyAvatars.map((avatar) => (
            <motion.button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-8 rounded-3xl bg-white/10 backdrop-blur-sm border-2 transition-all ${
                selectedAvatar?.id === avatar.id
                  ? 'border-yellow-300 shadow-[0_0_30px_rgba(253,224,71,0.6)]'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {selectedAvatar?.id === avatar.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <span className="text-lg">✓</span>
                </motion.div>
              )}
              
              <motion.div
                animate={selectedAvatar?.id === avatar.id ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="text-7xl mb-3"
              >
                {avatar.emoji}
              </motion.div>
              
              <p className="text-white font-semibold text-lg">
                {avatar.label}
              </p>
            </motion.button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedAvatar || createProfileMutation.isPending}
          className="w-full py-6 text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createProfileMutation.isPending ? "Starting..." : "Let's go!"}
        </Button>

        <p className="text-center text-white/60 text-sm mt-4">
          Don't worry — you can change this later.
        </p>
      </motion.div>
    </div>
  );
}