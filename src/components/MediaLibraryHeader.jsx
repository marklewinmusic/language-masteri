import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function MediaLibraryHeader() {
  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = '/';
  };

  return (
    <div style={{ background: 'linear-gradient(to right, #5a6b5a, #6b7c63, #5a6b5a)', borderBottom: '1px solid #a8b89840' }} className="backdrop-blur-xl px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" style={{ color: '#f5f0e8' }} className="hover:bg-white/10">
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
          </Link>
        </div>
        
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="text-red-400 hover:bg-red-500/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}