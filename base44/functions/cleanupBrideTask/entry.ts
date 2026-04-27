import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    // Get all days
    const allDays = await base44.entities.Day.list();
    let updatedCount = 0;

    // For each day, remove "The Bride" task and any Hebrew-specific tasks for non-Hebrew days
    for (const day of allDays) {
      const filtered = (day.subsections || []).filter(task => {
        const taskName = task.name?.toLowerCase() || '';
        // Always remove "The Bride"
        if (taskName.includes('the bride')) return false;
        // For non-Hebrew days, also filter out other Hebrew-only content
        if (day.language !== 'hebrew' && taskName.includes('hebrew')) return false;
        return true;
      });
      
      if (filtered.length < (day.subsections || []).length) {
        await base44.entities.Day.update(day.id, { subsections: filtered });
        updatedCount++;
      }
    }

    return Response.json({ 
      success: true, 
      message: `Removed "The Bride" from ${updatedCount} non-Hebrew days` 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});