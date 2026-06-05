import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SessionFlashcardsSection({ userProfile, onSessionSelect }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [backfilling, setBackfilling] = useState(false);

  const { data: mediaLibrary = [], isLoading } = useQuery({
    queryKey: ['mediaLibraryVocab', userProfile?.language],
    queryFn: () => base44.entities.MediaLibrary.filter({ language: userProfile.language, is_active: true }),
    enabled: !!userProfile?.language,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  // Auto-backfill: extract vocab for any video that has a transcript but no session_vocab_words
  useEffect(() => {
    if (isLoading || backfilling) return;
    const videosNeedingExtraction = mediaLibrary.filter(
      m => (m.processed_transcript?.length > 0 || m.transcript_phonetics?.trim()) && !(m.session_vocab_words?.length > 0)
    );
    if (videosNeedingExtraction.length === 0) return;

    const runBackfill = async () => {
      setBackfilling(true);
      for (const video of videosNeedingExtraction) {
        try {
          // Build best available transcript text
          let fullText = '';
          if (video.processed_transcript?.length > 0) {
            fullText = video.processed_transcript
              .map(s => [s.transliteration, s.text].filter(Boolean).join(' '))
              .join(' ');
          }
          if (!fullText.trim() && video.transcript_phonetics) {
            fullText = video.transcript_phonetics;
          }
          if (!fullText.trim()) continue;

          const lang = video.language || 'hebrew';
          const langCap = lang.charAt(0).toUpperCase() + lang.slice(1);
          const result = await base44.integrations.Core.InvokeLLM({
            prompt: `You are a language teacher. Extract 8-12 important vocabulary words from this ${langCap} learning transcript. Pick meaningful content words (nouns, verbs, adjectives) that a learner should know. Transcript: "${fullText.slice(0, 4000)}". Return a JSON object with a "words" array. Each item must have: phonetic (Latin romanization), translation (English meaning, 1-4 words), hebrew (Hebrew script).`,
            response_json_schema: {
              type: 'object',
              properties: {
                words: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      phonetic: { type: 'string' },
                      translation: { type: 'string' },
                      hebrew: { type: 'string' }
                    }
                  }
                }
              }
            }
          });
          const words = result?.words || [];
          if (words.length > 0) {
            await base44.entities.MediaLibrary.update(video.id, { session_vocab_words: words });
          }
        } catch (e) {
          console.error('Backfill failed for', video.title, e);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['mediaLibraryVocab'] });
      setBackfilling(false);
    };
    runBackfill();
  }, [isLoading, mediaLibrary.length]);

  // Show all videos, sorted by default_day
  const allVideos = mediaLibrary
    .sort((a, b) => (a.default_day || 999) - (b.default_day || 999));

  if (isLoading) return null;
  if (!backfilling && allVideos.length === 0) return null;

  const handleSelectVideo = (media) => {
    const words = (media.session_vocab_words || []).map(w => ({
      word: w.hebrew || w.phonetic,
      phonetic: w.phonetic,
      translation: w.translation,
    }));
    if (onSessionSelect) {
      onSessionSelect(words, `${media.title} words`);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: '#3d4a2e', fontFamily: 'Jost, sans-serif' }}>
        📖 Video Word Folders
        {backfilling && (
          <span className="flex items-center gap-1 text-xs font-normal text-amber-600">
            <Loader2 className="w-3 h-3 animate-spin" />
            Building folders…
          </span>
        )}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allVideos.map((media) => {
          const wordCount = media.session_vocab_words?.length || 0;
          const isReady = wordCount > 0;
          return (
            <button
              key={media.id}
              onClick={() => isReady && handleSelectVideo(media)}
              disabled={!isReady}
              className={`bg-white/60 border border-stone-200 rounded-xl flex items-center justify-between px-4 py-3 transition-all text-left ${isReady ? 'hover:bg-white/80 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base flex-shrink-0">📹</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#3d4a2e' }}>
                    {media.title}
                  </p>
                  <p className="text-xs" style={{ color: '#9b7e5a' }}>
                    {isReady ? `${wordCount} words` : 'Building…'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 ml-2" style={{ color: '#6b7c5a' }} />
            </button>
          );
        })}

        {/* All words button */}
        <button
          onClick={() => {
            sessionStorage.setItem('pendingFlashcardWords', JSON.stringify({
              words: [],
              title: 'All Words',
              allWords: true,
            }));
            navigate('/Backpack?flashcard=all');
          }}
          className="bg-white/60 border border-stone-200 rounded-xl flex items-center justify-between px-4 py-3 hover:bg-white/80 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">⭐</span>
            <span className="font-semibold text-sm" style={{ color: '#3d4a2e' }}>
              All Words
            </span>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: '#6b7c5a' }} />
        </button>
      </div>
    </div>
  );
}