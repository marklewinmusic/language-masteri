import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function ContentLibraryPicker({ open, onOpenChange, onSelect, language }) {
  const [uploading, setUploading] = useState(false);

  const { data: media = [] } = useQuery({
    queryKey: ["mediaLibrary"],
    queryFn: () => base44.entities.MediaLibrary.list('title', 200),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  const filtered = media
    .filter(m => m.is_active !== false)
    .filter(m => {
      if (language) return m.language === language;
      return true;
    });

  const getThumbnail = (m) => {
    if (m.thumbnail_url) return m.thumbnail_url;
    const id = m.video_id || extractYouTubeId(m.video_url);
    if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    return null;
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const isAudio = (m) => !m.video_id && !extractYouTubeId(m.video_url) && m.video_url;

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio')) {
      toast.error("Please upload an audio file (MP3 or M4A)");
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onSelect({
        title: file.name.replace(/\.[^/.]+$/, ""),
        video_url: file_url,
        is_active: true,
        difficulty_level: "All",
        language: language || "hebrew"
      });
      onOpenChange(false);
      toast.success("Audio uploaded!");
    } catch (err) {
      toast.error("Failed to upload audio");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="mt-2 rounded-xl border border-blue-300/30 p-3 space-y-2" style={{ background: 'rgba(15,40,100,0.5)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold" style={{ color: '#93C5FD' }}>📚 Add from Library</span>
        <button onClick={() => onOpenChange(false)} className="text-stone-400 hover:text-stone-200"><X className="w-3.5 h-3.5" /></button>
      </div>

      <label className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border border-dashed border-stone-500 cursor-pointer hover:bg-white/5 transition-all">
        {uploading ? <Loader2 className="w-3.5 h-3.5 text-stone-400 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-stone-400" />}
        <span className="text-xs text-stone-400">{uploading ? 'Uploading...' : 'Upload MP3 or M4A'}</span>
        <input type="file" accept=".mp3,.m4a,audio/mpeg,audio/mp4" onChange={handleAudioUpload} disabled={uploading} className="hidden" />
      </label>

      <div className="max-h-64 overflow-y-auto space-y-1">
        {filtered.length === 0 && <p className="text-center text-stone-400 py-4 text-xs">No content found.</p>}
        {filtered.map(m => (
          <button
            key={m.id}
            onClick={() => { onSelect(m); onOpenChange(false); }}
            className="w-full flex items-center gap-2 rounded-lg p-1.5 hover:bg-white/10 transition-all text-left"
            style={{ border: '1px solid rgba(96,165,250,0.15)' }}
          >
            {isAudio(m) ? (
              <div className="w-10 h-7 rounded flex-shrink-0 flex items-center justify-center bg-white/10 text-sm">🎵</div>
            ) : getThumbnail(m) ? (
              <img src={getThumbnail(m)} alt="" className="w-10 h-7 rounded object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-7 rounded flex-shrink-0 bg-white/10 flex items-center justify-center text-sm">📹</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: '#BFDBFE' }}>{m.title}</p>
              <p className="text-stone-400 text-[10px]">{isAudio(m) ? "🎧 Audio" : "▶ Video"}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}