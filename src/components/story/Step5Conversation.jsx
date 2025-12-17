import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const SESSION_DURATION = 3 * 60; // 3 minutes

export default function Step5Conversation({ story, onComplete }) {
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState([]);

  const sessionMutation = useMutation({
    mutationFn: (data) => base44.entities.ConversationSession.create(data),
  });

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = async () => {
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are having a Hebrew conversation about the story: "${story.title}"

Generate a thoughtful Hebrew question that asks for opinion, not facts.
Examples:
- מה קרה בסיפור?
- עם מי הזדהית?
- מה היית עושה אחרת?

Return JSON only:
{
  "question_he": "Hebrew question",
  "question_transliteration": "transliteration"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            question_he: { type: "string" },
            question_transliteration: { type: "string" }
          }
        }
      });

      setCurrentQuestion(result);
      speakText(result.question_he);
    } catch (e) {
      toast.error("Failed to generate question");
    }
    setLoading(false);
  };

  const handleEndSession = async () => {
    await sessionMutation.mutateAsync({
      story_id: story.story_id,
      duration_seconds: SESSION_DURATION - timeRemaining,
      transcript: JSON.stringify(transcript),
      completed: true
    });
    onComplete();
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-bold text-xl">Step 5: Conversation</h2>
          <div className="text-cyan-400 font-mono text-lg">
            {formatTime(timeRemaining)}
          </div>
        </div>
        <p className="text-white/60 text-sm">Speak in Hebrew about the story</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : currentQuestion ? (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-500/20 border border-purple-500/50 rounded-2xl p-6 text-center"
          >
            <button
              onClick={() => speakText(currentQuestion.question_he)}
              className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center mx-auto mb-4"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>
            <p className="text-white text-2xl font-bold mb-2" dir="rtl">
              {currentQuestion.question_he}
            </p>
            <p className="text-white/60 text-sm">
              {currentQuestion.question_transliteration}
            </p>
          </motion.div>

          <div className="text-center">
            <p className="text-white/60 text-sm mb-4">Tap to speak your answer</p>
            <button
              className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center justify-center mx-auto"
              onClick={() => {
                toast.info("Recording feature coming soon!");
                setTimeout(generateQuestion, 2000);
              }}
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
          </div>

          <Button
            onClick={generateQuestion}
            variant="outline"
            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            Skip to Next Question
          </Button>

          <Button
            onClick={handleEndSession}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
          >
            Finish Conversation →
          </Button>
        </div>
      ) : null}
    </div>
  );
}