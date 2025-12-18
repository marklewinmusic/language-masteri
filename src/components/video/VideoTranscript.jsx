import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VideoTranscript({ videoId, videoUrl }) {
  const [expanded, setExpanded] = useState(false);
  const [video, setVideo] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadVideo();
  }, [videoId, videoUrl]);

  const loadVideo = async () => {
    try {
      const videos = await base44.entities.Video.filter({ video_url: videoUrl });
      if (videos.length > 0) {
        setVideo(videos[0]);
        // If no transcript and not failed, start transcription
        if (!videos[0].transcript_status || videos[0].transcript_status === "failed") {
          startTranscription(videos[0].id);
        }
      } else {
        // Create video entry
        const newVideo = await base44.entities.Video.create({
          video_url: videoUrl,
          title: videoId || "Untitled",
          transcript_status: "processing"
        });
        setVideo(newVideo);
        startTranscription(newVideo.id);
      }
    } catch (e) {
      console.error("Failed to load video", e);
    }
  };

  const startTranscription = async (id) => {
    setTranscribing(true);
    try {
      // Use LLM with audio context to transcribe
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Transcribe this Hebrew video. Provide the full Hebrew transcript with proper formatting.
        Video URL: ${videoUrl}
        
        Return the transcript in clean Hebrew text, organized in paragraphs.`,
        file_urls: [videoUrl],
        response_json_schema: {
          type: "object",
          properties: {
            transcript: { type: "string" }
          }
        }
      });

      await base44.entities.Video.update(id, {
        transcript_text: result.transcript,
        transcript_status: "complete",
        transcript_generated_at: new Date().toISOString()
      });

      setVideo(prev => ({
        ...prev,
        transcript_text: result.transcript,
        transcript_status: "complete"
      }));
      toast.success("Transcript generated!");
    } catch (e) {
      await base44.entities.Video.update(id, {
        transcript_status: "failed"
      });
      toast.error("Transcription failed");
    }
    setTranscribing(false);
  };

  if (!video) return null;

  const isProcessing = video.transcript_status === "processing" || transcribing;
  const hasTranscript = video.transcript_status === "complete" && video.transcript_text;

  return (
    <div className="mt-4">
      <Button
        onClick={() => setExpanded(!expanded)}
        variant="outline"
        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Transcript generating...
          </>
        ) : hasTranscript ? (
          <>
            {expanded ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
            {expanded ? "Hide transcript" : "Show transcript"}
          </>
        ) : (
          "No transcript available"
        )}
      </Button>

      <AnimatePresence>
        {expanded && hasTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4 max-h-96 overflow-y-auto"
            dir="rtl"
          >
            <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
              {video.transcript_text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}