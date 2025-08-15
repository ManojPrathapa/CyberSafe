"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import ParentTips from '@/components/Parent/ContentManager';
// import ForumManager from '@/components/Parent/ForumManager';
import ParentDashboard from '@/components/Parent/DashboardStats';
import ParentProfile from '@/components/Parent/ProfileCard';
import SettingsPanel from '@/components/Parent/SettingsPanel';
import ChildActivity from '@/components/Parent/activity';
import ParentHome from '@/components/Parent/Home';

export default function MentorDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL parameters for section navigation
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && ['home', 'dashboard', 'content', 'activity', 'profile', 'settings'].includes(section)) {
      setSelectedSection(section);
    }
  }, [searchParams]);


  const notifications = [
    { text: 'Reminder: Complete Module 5 by Friday.', time: '5m ago' },
    { text: 'New badge “Awareness Master” unlocked!', time: '18m ago' },
    { text: '🛡️ New tip added to Cybersecurity Tips section.', time: '1h ago' },
  ];

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
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center focus:outline-none"
            >
              <Bell size={20} />
            </button>
            {showNotifications && (
              <div className="absolute top-14 right-14 w-80 bg-white shadow-lg rounded-lg p-4 z-20">
                <h4 className="text-lg font-semibold text-purple-700 mb-2">Notifications</h4>
                <ul className="space-y-2 max-h-64 overflow-auto">
                  {notifications.map((note, index) => (
                    <li key={index} className="text-sm border-b pb-1 text-gray-700">
                      <div>{note.text}</div>
                      <div className="text-xs text-gray-400">{note.time}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
