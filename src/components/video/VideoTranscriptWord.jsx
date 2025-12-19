import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Plus } from "lucide-react";

export default function VideoTranscriptWord({ 
  word, 
  hebrew,
  transliteration,
  english,
  onEdit,
  onAddToBackpack,
  className = ""
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(word);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  const handleSave = () => {
    if (value.trim() && value !== word && onEdit) {
      onEdit(value.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(word);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`inline-block bg-white/20 border border-cyan-400 rounded px-1 outline-none ${className}`}
        style={{ width: `${Math.max(value.length * 8 + 10, 40)}px` }}
      />
    );
  }

  return (
    <span className="relative inline-block">
      <span
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={`cursor-pointer hover:bg-cyan-500/30 px-1 rounded transition-all ${className}`}
      >
        {word}
      </span>
      
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-50 mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-xl overflow-hidden"
            style={{ minWidth: "150px" }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                setIsEditing(true);
              }}
              className="w-full px-3 py-2 text-left text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                if (onAddToBackpack) {
                  onAddToBackpack({ word, hebrew, transliteration, english });
                }
              }}
              className="w-full px-3 py-2 text-left text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add to Backpack
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}