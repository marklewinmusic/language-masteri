import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoId } = await req.json();
    
    if (!videoId) {
      return Response.json({ error: 'videoId is required' }, { status: 400 });
    }

    console.log('Processing video:', videoId);

    // Step 1: Try to fetch YouTube captions
    try {
      const captionsResult = await fetchYouTubeCaptions(videoId);
      if (captionsResult && captionsResult.transcript.length > 0) {
        console.log('Found YouTube captions');
        return Response.json(captionsResult);
      }
    } catch (e) {
      console.log('YouTube captions failed:', e.message);
    }

    // Step 2: Fallback to audio transcription with Whisper
    console.log('Attempting audio transcription...');
    const transcriptionResult = await transcribeAudio(videoId);
    return Response.json(transcriptionResult);

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      error: error.message || 'Failed to process video',
      details: error.toString()
    }, { status: 500 });
  }
});

async function fetchYouTubeCaptions(videoId) {
  // Fetch video page
  const pageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  const html = await pageResponse.text();

  // Extract ytInitialPlayerResponse
  const match = html.match(/ytInitialPlayerResponse\s*=\s*({.+?})\s*;/);
  if (!match) {
    throw new Error('Could not find player response');
  }

  const playerResponse = JSON.parse(match[1]);
  const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!captionTracks || captionTracks.length === 0) {
    throw new Error('No captions available');
  }

  // Find Hebrew or English captions
  let selectedTrack = captionTracks.find(t => t.languageCode === 'he' || t.languageCode === 'iw');
  if (!selectedTrack) {
    selectedTrack = captionTracks.find(t => t.languageCode === 'en');
  }
  if (!selectedTrack) {
    selectedTrack = captionTracks[0];
  }

  // Fetch caption XML
  const captionResponse = await fetch(selectedTrack.baseUrl);
  const captionXml = await captionResponse.text();

  // Parse XML
  const textMatches = [...captionXml.matchAll(/<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]+)<\/text>/g)];
  
  const transcript = textMatches.map(match => ({
    text: decodeHtmlEntities(match[3]),
    start: parseFloat(match[1]),
    duration: parseFloat(match[2])
  }));

  return {
    transcript,
    language: selectedTrack.languageCode,
    source: 'youtube_captions'
  };
}

async function transcribeAudio(videoId) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log('Fetching audio stream from YouTube...');
  
  // Get video info to find audio URL
  const infoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const pageResponse = await fetch(infoUrl);
  const html = await pageResponse.text();
  
  // Extract player response
  const match = html.match(/ytInitialPlayerResponse\s*=\s*({.+?})\s*;/);
  if (!match) {
    throw new Error('Could not extract video info');
  }
  
  const playerResponse = JSON.parse(match[1]);
  const streamingData = playerResponse?.streamingData;
  
  if (!streamingData) {
    throw new Error('No streaming data available');
  }
  
  // Find audio-only format (lower quality for faster processing)
  const formats = [...(streamingData.formats || []), ...(streamingData.adaptiveFormats || [])];
  const audioFormat = formats.find(f => 
    f.mimeType?.includes('audio') && 
    (f.audioQuality === 'AUDIO_QUALITY_LOW' || f.audioQuality === 'AUDIO_QUALITY_MEDIUM')
  ) || formats.find(f => f.mimeType?.includes('audio'));
  
  if (!audioFormat || !audioFormat.url) {
    throw new Error('No audio stream found');
  }

  console.log('Downloading audio...');
  const audioResponse = await fetch(audioFormat.url);
  
  if (!audioResponse.ok) {
    throw new Error('Failed to download audio');
  }
  
  const audioBlob = await audioResponse.blob();
  
  // Whisper has a 25MB limit, check size
  if (audioBlob.size > 25 * 1024 * 1024) {
    throw new Error('Audio file too large (>25MB). Try a shorter video or use manual transcript paste.');
  }

  console.log(`Audio downloaded (${(audioBlob.size / 1024 / 1024).toFixed(2)}MB), transcribing...`);

  // Create form data for Whisper API
  const formData = new FormData();
  formData.append('file', audioBlob, `${videoId}.webm`);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'segment');

  // Call Whisper API
  const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!whisperResponse.ok) {
    const error = await whisperResponse.text();
    throw new Error(`Whisper API failed: ${error}`);
  }

  const whisperResult = await whisperResponse.json();

  // Format transcript
  const transcript = whisperResult.segments?.map(seg => ({
    text: seg.text.trim(),
    start: seg.start,
    duration: seg.end - seg.start
  })) || [];

  return {
    transcript,
    language: whisperResult.language || 'unknown',
    source: 'audio_transcription'
  };
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}