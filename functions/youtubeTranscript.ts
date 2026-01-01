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

    // Fetch transcript using youtube-transcript npm package
    const { YoutubeTranscript } = await import('npm:youtube-transcript@1.2.1');

    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      
      // Convert to our format with timestamps
      const transcript = transcriptData.map(item => ({
        text: item.text,
        start: item.offset / 1000, // Convert milliseconds to seconds
        duration: item.duration / 1000
      }));

      return Response.json({ transcript, source: 'youtube-auto-captions' });
    } catch (error) {
      console.error('YouTube transcript error:', error);
      return Response.json({ 
        error: 'No transcript available',
        details: error.message 
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Function error:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
});