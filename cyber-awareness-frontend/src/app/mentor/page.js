"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";

import ContentManager from "@/components/Mentor/ContentManager";
import QuizManager from "@/components/Mentor/QuizManager";
import ForumManager from "@/components/Mentor/ForumManager";
import DashboardStats from "@/components/Mentor/DashboardStats";
import ProfileCard from "@/components/Mentor/ProfileCard";
import SettingsPanel from "@/components/Mentor/SettingsPanel";
import TipsCreation from "@/components/Mentor/TipsCreation";

import { getUser, logout } from "@/src/app/utils/auth";

export default function MentorDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [isActive, setIsActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      // No user found, redirect to login
      router.push("/login");
      return;
    }
    setIsActive(user?.isActive === 1);
  }, [router]);

  // If not active, force Profile to show
  const visibleSection = isActive ? selectedSection : "profile";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-purple-100 to-indigo-100 text-gray-800">
      {/* Sidebar */}
      <aside className="bg-white w-full lg:w-1/4 xl:w-1/5 p-6 shadow-xl flex flex-col gap-6 border-r border-gray-300">
        <div className="flex items-center justify-between lg:justify-center mb-4">
          <h1 className="text-3xl font-extrabold text-purple-700">CYBERSAFE</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <nav
          className={`flex flex-col gap-4 ${
            mobileMenuOpen ? "flex" : "hidden"
          } lg:flex`}
        >
          <button
            className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold disabled:opacity-50"
            onClick={() => setSelectedSection("dashboard")}
            disabled={!isActive}
          >
            DASHBOARD
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold disabled:opacity-50"
            onClick={() => setSelectedSection("content")}
            disabled={!isActive}
          >
            CONTENT MANAGER
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold disabled:opacity-50"
            onClick={() => setSelectedSection("quiz")}
            disabled={!isActive}
          >
            QUIZ MANAGER
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold disabled:opacity-50"
            onClick={() => setSelectedSection("tips")}
            disabled={!isActive}
          >
            TIPS CREATION
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold disabled:opacity-50"
            onClick={() => setSelectedSection("forum")}
            disabled={!isActive}
          >
            FORUM
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold"
            onClick={() => setSelectedSection("profile")}
          >
            PROFILE
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold disabled:opacity-50"
            onClick={() => setSelectedSection("settings")}
            disabled={!isActive}
          >
            SETTINGS
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto relative">
        <div className="flex justify-between items-center mb-6 relative">
          <h2 className="text-2xl font-bold px-6 py-2 bg-white shadow rounded-full text-purple-800">
            HI MENTOR
          </h2>
          <div className="flex items-center gap-4 relative">
            <NotificationBell />

            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              LOGOUT
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow max-w-5xl">
          {visibleSection === "dashboard" && <DashboardStats />}
          {visibleSection === "content" && <ContentManager />}
          {visibleSection === "quiz" && <QuizManager />}
          {visibleSection === "tips" && <TipsCreation />}
          {visibleSection === "forum" && <ForumManager />}
          {visibleSection === "profile" && <ProfileCard />}
          {visibleSection === "settings" && <SettingsPanel />}
        </div>

        {!isActive && (
          <p className="text-center text-red-600 mt-4 font-semibold">
            Your account is not active. Only Profile is accessible.
          </p>
        )}
      </main>
    </div>
  );
}
