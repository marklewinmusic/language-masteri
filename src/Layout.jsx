import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import BuddyDock from "./components/game/BuddyDock";

export default function Layout({ children, currentPageName }) {
  // Don't show on avatar select page
  const showDock = currentPageName !== "AvatarSelect";

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.list();
      return profiles[0] || null;
    },
    enabled: showDock,
    staleTime: 5 * 60 * 1000,
  });

  const { data: userCoins } = useQuery({
    queryKey: ['userCoins'],
    queryFn: async () => {
      const coins = await base44.entities.UserCoins.list();
      return coins[0] || { coins: 0 };
    },
    enabled: showDock,
    staleTime: 2 * 60 * 1000,
  });

  const { data: backpackWords = [] } = useQuery({
    queryKey: ['backpackWords'],
    queryFn: () => base44.entities.Word.filter({ category: "wordbank" }),
    enabled: showDock,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      {children}
      {showDock && (
        <BuddyDock 
          profile={userProfile} 
          coins={userCoins?.coins} 
          backpackCount={backpackWords.length}
        />
      )}
    </>
  );
}