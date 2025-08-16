"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '@/src/app/utils/apiConfig';

import ParentTips from '@/components/Parent/ContentManager';
// import ForumManager from '@/components/Parent/ForumManager';
import ParentDashboard from '@/components/Parent/DashboardStats';
import ParentProfile from '@/components/Parent/ProfileCard';
import SettingsPanel from '@/components/Parent/SettingsPanel';
import ChildActivity from '@/components/Parent/activity';
import ParentHome from '@/components/Parent/Home';
import NotificationBell from '@/components/NotificationBell';

function ParentDashboardContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('home');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check authentication and handle URL parameters
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login_signup/login');
      return;
    }

    // Handle URL parameters for section navigation
    const section = searchParams.get('section');
    if (section && ['home', 'dashboard', 'content', 'activity', 'profile', 'settings'].includes(section)) {
      setSelectedSection(section);
    }
  }, [searchParams, router]);

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-purple-100 to-indigo-100 text-gray-800">
      {/* Sidebar */}
      <aside className="bg-white w-full lg:w-1/4 xl:w-1/5 p-6 shadow-xl flex flex-col gap-6 border-r border-gray-300">
        <div className="flex items-center justify-between lg:justify-center mb-4">
          <h1 className="text-3xl font-extrabold text-purple-700">CYBERSAFE</h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <nav className={`flex flex-col gap-4 ${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex`}>
          <button className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setSelectedSection('home')}>HOME</button>
          <button className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setSelectedSection('dashboard')}>DASHBOARD</button>
          <button className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setSelectedSection('content')}>TIPS</button>
          <button className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setSelectedSection('activity')}>CHILD ACTIVITY</button>
          {/* <button className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setSelectedSection('forum')}>FORUM</button> */}
          <button className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setSelectedSection('profile')}>PROFILE</button>
          <button className="bg-purple-500 hover:bg-purple-200 rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setSelectedSection('settings')}>SETTINGS</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto relative">
        <div className="flex justify-between items-center mb-6 relative">
          <h2 className="text-2xl font-bold px-6 py-2 bg-white shadow rounded-full text-purple-800">HI PARENTS</h2>
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
          {selectedSection === 'dashboard' && <ParentDashboard />}
          {selectedSection === 'content' && <ParentTips />}
          {selectedSection === 'activity' && <ChildActivity />}
          {/* {selectedSection === 'forum' && <ForumManager />} */}
          {selectedSection === 'profile' && <ParentProfile />}
          {selectedSection === 'settings' && <SettingsPanel />}
          {selectedSection === 'home' && <ParentHome />}
        </div>
      </main>
    </div>
  );
}

export default function ParentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ParentDashboardContent />
    </Suspense>
  );
}
