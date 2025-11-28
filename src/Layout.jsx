import React from "react";

export default function Layout({ children, currentPageName }) {
  // For the new game-style UI, pages handle their own layout
  return <>{children}</>;
}