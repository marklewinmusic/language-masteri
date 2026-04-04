import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { student_email, words } = await req.json();
    if (!student_email || !words?.length) {
      return Response.json({ error: 'Missing student_email or words' }, { status: 400 });
    }

    // Get student's language
    const profiles = await base44.asServiceRole.entities.UserProfile.filter({ created_by: student_email });
    const language = profiles[0]?.language || "hebrew";

    // Get existing words for this student to avoid duplicates
    const existingWords = await base44.asServiceRole.entities.Word.filter({
      created_by: student_email,
      category: "wordbank"
    });
    const existingSet = new Set(existingWords.map(w => w.word?.toLowerCase()));

    let added = 0;
    for (const word of words) {
      if (!word || existingSet.has(word.toLowerCase())) continue;
      await base44.asServiceRole.entities.Word.create({
        word,
        translation: "",
        category: "wordbank",
        language,
        vocab_level: 0,
        times_practiced: 0,
        mastered: false,
        created_by: student_email,
      });
      added++;
    }

    return Response.json({ success: true, added, language });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});