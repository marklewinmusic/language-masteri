import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Step1Immersion({ story, onComplete }) {
  const [watchedFull, setWatchedFull] = useState(false);
  const [rating, setRating] = useState(null);
  const playerRef = useRef(null);
  const hasWatchedRef = useRef(false);

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

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED && !hasWatchedRef.current) {
              setWatchedFull(true);
              hasWatchedRef.current = true;
            }
          },
        },
      });
    };
  }, [story.video_url]);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating && onComplete) {
      onComplete(rating);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="mb-4">
        <h2 className="text-white font-bold text-xl mb-2">Step 1: Watch & Feel</h2>
        <p className="text-white/60 text-sm">Watch the full story once. No pausing. Just experience it.</p>
      </div>

      <div className="mb-6">
        <div id="youtube-player" className="w-full aspect-video bg-black rounded-xl" />
      </div>

      {watchedFull && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-green-400 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Video completed!</span>
          </div>

          <div>
            <p className="text-white mb-3">How much did you understand?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRating(num)}
                  className={`flex-1 h-12 rounded-xl font-bold transition-all ${
                    rating === num
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {num}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/40">
              <span>Not much</span>
              <span>Perfectly</span>
            </div>
          </div>

          {rating && (
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Continue to Step 2 →
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}