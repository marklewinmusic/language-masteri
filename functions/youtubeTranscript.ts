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

    try {
      // Use Innertube API (unofficial but reliable)
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const html = await response.text();
      
      // Extract ytInitialPlayerResponse
      const match = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
      if (!match) {
        return Response.json({ error: 'Could not extract player data' }, { status: 404 });
      }
      
      const playerResponse = JSON.parse(match[1]);
      const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      
      if (!captions || captions.length === 0) {
        return Response.json({ error: 'No captions available' }, { status: 404 });
      }
      
      // Get first available caption track (prefer Hebrew, then English, then any)
      const track = captions.find(t => t.languageCode === 'he') || 
                    captions.find(t => t.languageCode === 'en') || 
                    captions[0];
      
      // Fetch caption content
      const captionResponse = await fetch(track.baseUrl);
      const captionXml = await captionResponse.text();
      
      // Parse captions
      const transcript = [];
      const textMatches = captionXml.matchAll(/<text start="([^"]+)" dur="([^"]+)"[^>]*>(.*?)<\/text>/gs);
      
      for (const match of textMatches) {
        const start = parseFloat(match[1]);
        const duration = parseFloat(match[2]);
        let text = match[3];
        
        // Decode HTML entities
        text = text
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/<[^>]+>/g, '') // Remove any HTML tags
          .trim();
        
        if (text) {
          transcript.push({ text, start, duration });
        }
      }
      
      if (transcript.length === 0) {
        return Response.json({ error: 'Could not parse captions' }, { status: 404 });
      }

      return Response.json({ 
        transcript, 
        language: track.languageCode,
        source: 'youtube-captions' 
      });
      
    } catch (error) {
      console.error('YouTube transcript error:', error);
      return Response.json({ 
        error: 'Failed to fetch transcript',
        details: error.message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Function error:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
});