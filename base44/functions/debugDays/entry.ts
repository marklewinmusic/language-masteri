import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const allDays = await base44.entities.Day.list();
    
    const languages = {};
    allDays.forEach(day => {
      const lang = day.language || 'unknown';
      if (!languages[lang]) languages[lang] = [];
      languages[lang].push(`Day ${day.day_number}`);
    });

    return Response.json({ 
      total: allDays.length,
      languages 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});