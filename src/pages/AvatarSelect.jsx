import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";

export default function AvatarSelect() {
  const navigate = useNavigate();

  useEffect(() => {
    const complete = async () => {
      const currentUser = await base44.auth.me();
      const existing = await base44.entities.UserProfile.filter({ created_by: currentUser.email });
      const data = {
        avatar_id: "default",
        avatar_name: currentUser?.full_name || "Student",
        avatar_status: "ready",
        growth_stage: "starter",
        age_level: 3,
        xp: 0,
        daily_streak: 0,
        is_new_user: false,
        onboarding_completed_at: new Date().toISOString(),
      };
      if (existing.length > 0) {
        await base44.entities.UserProfile.update(existing[0].id, data);
      } else {
        await base44.entities.UserProfile.create(data);
      }
      navigate(createPageUrl("Home"), { replace: true });
    };
    complete();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #f0ece4 0%, #e8e4d8 100%)' }}>
      <div className="w-10 h-10 border-4 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );
}