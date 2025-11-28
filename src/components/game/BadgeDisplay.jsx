import React from "react";
import { motion } from "framer-motion";

const allBadges = {
  grocery_guru: { name: "Grocery Guru", emoji: "🛒", color: "from-green-400 to-emerald-500" },
  shabbat_expert: { name: "Shabbat Expert", emoji: "🕯️", color: "from-purple-400 to-violet-500" },
  gym_rat: { name: "Gym Rat", emoji: "💪", color: "from-orange-400 to-red-500" },
  word_master: { name: "Word Master", emoji: "📚", color: "from-blue-400 to-cyan-500" },
  streak_warrior: { name: "Streak Warrior", emoji: "🔥", color: "from-yellow-400 to-orange-500" },
  social_butterfly: { name: "Social Butterfly", emoji: "🦋", color: "from-pink-400 to-rose-500" },
  first_date: { name: "First Date", emoji: "💕", color: "from-red-400 to-pink-500" },
  polyglot: { name: "Polyglot", emoji: "🌍", color: "from-teal-400 to-cyan-500" },
};

export default function BadgeDisplay({ earnedBadges = [], size = "md" }) {
  const sizes = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-4xl",
  };

  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(allBadges).map(([id, badge]) => {
        const isEarned = earnedBadges.includes(id);
        return (
          <motion.div
            key={id}
            whileHover={{ scale: 1.1 }}
            className={`${sizes[size]} rounded-xl flex items-center justify-center transition-all ${
              isEarned
                ? `bg-gradient-to-br ${badge.color} shadow-lg`
                : 'bg-white/10 opacity-40'
            }`}
            title={badge.name}
          >
            <span className={isEarned ? '' : 'grayscale'}>{badge.emoji}</span>
          </motion.div>
        );
      })}
    </div>
  );
}