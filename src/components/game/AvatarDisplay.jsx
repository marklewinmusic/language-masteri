import React from "react";
import { motion } from "framer-motion";

const avatarDetails = {
  alex: { emoji: "🧑‍🦱", color: "from-blue-500 to-cyan-500" },
  maya: { emoji: "👩‍🦰", color: "from-pink-500 to-rose-500" },
  jordan: { emoji: "👨‍🦳", color: "from-fuchsia-500 to-pink-400" },
  sam: { emoji: "🧑‍💻", color: "from-violet-500 to-purple-500" },
  zoe: { emoji: "👩‍🦱", color: "from-green-500 to-emerald-500" },
  luna: { emoji: "👩‍🦲", color: "from-indigo-500 to-purple-600" },
};

const ageAppearance = (age) => {
  if (age <= 7) return { size: "text-6xl", label: "Kid" };
  if (age <= 12) return { size: "text-7xl", label: "Child" };
  if (age <= 17) return { size: "text-8xl", label: "Teen" };
  if (age <= 21) return { size: "text-9xl", label: "Young Adult" };
  return { size: "text-9xl", label: "Adult" };
};

export default function AvatarDisplay({ profile, equippedItem, className = "" }) {
  const avatar = avatarDetails[profile?.avatar_id] || avatarDetails.alex;
  const appearance = ageAppearance(profile?.age_level || 5);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${avatar.color} blur-3xl opacity-30`}
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Avatar circle */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center shadow-2xl border-4 border-white/30`}
      >
        <span className={appearance.size}>{avatar.emoji}</span>

        {/* Equipped item */}
        {equippedItem && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-4 -right-4 text-5xl"
          >
            {equippedItem.emoji}
          </motion.div>
        )}

        {/* Age badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-1 shadow-lg">
          <span className="font-bold text-black">{profile?.age_level || 5} yrs</span>
        </div>
      </motion.div>

      {/* Name & stage */}
      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold text-white">{profile?.avatar_name || 'Avatar'}</h2>
        <p className="text-white/60">{appearance.label}</p>
      </div>
    </motion.div>
  );
}