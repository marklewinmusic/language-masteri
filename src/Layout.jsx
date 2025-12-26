import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import FloatingAvatar from "./components/game/FloatingAvatar";
import TranslatorWidget from "./components/TranslatorWidget";

export default function Layout({ children, currentPageName }) {
  // Don't show on avatar select page
  const showFloatingElements = currentPageName !== "AvatarSelect";

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.list();
      return profiles[0] || null;
    },
    enabled: showFloatingElements,
    staleTime: 5 * 60 * 1000,
  });

  const { data: userCoins } = useQuery({
    queryKey: ['userCoins'],
    queryFn: async () => {
      const coins = await base44.entities.UserCoins.list();
      return coins[0] || { coins: 0 };
    },
    enabled: showFloatingElements,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <>
      {children}
      {showFloatingElements && (
        <>
          <FloatingAvatar profile={userProfile} coins={userCoins?.coins} />
          <TranslatorWidget />
        </>
      )}
    </>
  );
}