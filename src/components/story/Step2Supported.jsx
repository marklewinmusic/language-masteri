import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Step2Supported({ story, progress, onComplete, onWordAdd }) {
  const [showTranslit, setShowTranslit] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!story.video_url) return;

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) return;
      
      const videoId = story.video_url.includes('youtube.com') || story.video_url.includes('youtu.be')
        ? story.video_url.split('/').pop().split('?')[0].replace('watch?v=', '')
        : null;

      if (!videoId) return;

      playerRef.current = new window.YT.Player('youtube-player-step2', {
        videoId,
        playerVars: {
          controls: 1,
          cc_load_policy: 1,
        },
      });
    };
  }, [story.video_url]);

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleAddToBackpack = () => {
    if (!selectedWord) return;
    
    const wordHe = selectedWord.trim();
    if (progress.words_added_to_backpack?.includes(wordHe)) {
      toast.info("Already in backpack");
      return;
    }

    onWordAdd(wordHe);
    toast.success(`"${wordHe}" added to backpack! 🎒`);
    setSelectedWord(null);
  };

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'he-IL';
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="mb-4">
        <h2 className="text-white font-bold text-xl mb-2">Step 2: Watch with Support</h2>
        <p className="text-white/60 text-sm">Now you can pause. Tap any word to add it to your backpack.</p>
      </div>

      <div className="mb-6">
        <div id="youtube-player-step2" className="w-full aspect-video bg-black rounded-xl" />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">Story Text</h3>
          <button
            onClick={() => setShowTranslit(!showTranslit)}
            className={`text-xs px-3 py-1 rounded-full transition-all ${
              showTranslit 
                ? "bg-cyan-500/30 text-cyan-300" 
                : "bg-white/10 text-white/50 hover:bg-white/20"
            }`}
          >
            ABC
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-4 space-y-3">
          {story.story_text_he.split('\n').map((line, idx) => (
            <div key={idx}>
              <div className="flex flex-wrap gap-1 justify-end" dir="rtl">
                {line.split(' ').map((word, widx) => (
                  <button
                    key={widx}
                    onClick={() => handleWordClick(word)}
                    className={`hover:bg-cyan-500/30 px-1 rounded transition-colors ${
                      progress.words_added_to_backpack?.includes(word.replace(/[.,!?]/g, ''))
                        ? "text-green-400"
                        : "text-white"
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {showTranslit && story.story_text_transliteration && (
                <p className="text-white/40 text-xs mt-1">
                  {story.story_text_transliteration.split('\n')[idx]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedWord && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyan-500/20 border border-cyan-500/50 rounded-xl p-4 mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => speakWord(selectedWord)}
              className="w-10 h-10 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 flex items-center justify-center"
            >
              <Volume2 className="w-4 h-4 text-cyan-300" />
            </button>
            <span className="text-white font-bold text-lg" dir="rtl">{selectedWord}</span>
          </div>
          <Button
            onClick={handleAddToBackpack}
            size="sm"
            className="bg-gradient-to-r from-green-500 to-emerald-500"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add to Backpack
          </Button>
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-white/60 text-sm">
          {progress.words_added_to_backpack?.length || 0} words in backpack
        </p>
      </div>

      <Button
        onClick={onComplete}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
      >
        Continue to Vocabulary →
      </Button>
    </div>
  );
}