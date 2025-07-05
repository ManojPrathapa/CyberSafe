"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

import AllUsers from "@/components/Admin/Alluser";
import TrainerApproval from "@/components/Admin/TrainerApproval";
import ContentApproval from "@/components/Admin/ContentApproval";


const notifications = [
  { type: "register", message: "Student 5 registered in the application.", time: "2 min ago" },
  { type: "approval", message: "Trainer 3 approved in the application", time: "1 hr ago" },
  { type: "complaint", message: "Student 1 raised compliant against Trainer 2", time: "2 days ago" },
  { type: "complaint", message: "Student 2 raised compliant against Trainer 3", time: "4 days ago" },
  { type: "resolved", message: "Compliant by Student 3 was resolved", time: "4 days ago" },
];

export default function SupportHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("home");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-100 to-indigo-100 text-gray-800">
      {/* Sidebar */}
      <aside className="bg-white w-full lg:w-1/4 xl:w-1/5 p-6 shadow-xl flex flex-col gap-6 border-r border-gray-300">
        <div className="flex items-center justify-between lg:justify-center mb-4">
          <h1 className="text-3xl font-extrabold text-indigo-700">CYBERSAFE</h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <nav className={`${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
          <div className="flex flex-col gap-4">
            <button onClick={() => setSelectedSection("users")} className="bg-blue-500 hover:bg-indigo-200 rounded-lg px-4 py-3 text-left font-semibold">ALL USERS</button>
            <button onClick={() => setSelectedSection("trainer")} className="bg-blue-500 hover:bg-indigo-200 rounded-lg px-4 py-3 text-left font-semibold">TRAINER APPROVAL</button>
            <button onClick={() => setSelectedSection("content")} className="bg-blue-500 hover:bg-indigo-200 rounded-lg px-4 py-3 text-left font-semibold">CONTENT APPROVAL</button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold px-6 py-2 bg-white shadow rounded-full text-indigo-800">HI ADMIN</h2>
          <div className="flex items-center gap-4">
            <Link href="/adminDashboard">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">🖥</div>
            </Link>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
              onClick={() => setSelectedSection("notification")}
            >
              🔔
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow">LOGOUT</button>
          </div>
        </div>

       
          {selectedSection === "home" && (
             <div className="bg-white border border-gray-200 p-6 rounded-xl shadow max-w-5xl">
            <ul className="list-disc pl-6 space-y-4 text-base leading-relaxed">
              <li><strong>Record Keeping and Data Management:</strong> Organizing, maintaining, and updating records, files, and databases.</li>
              <li><strong>Communication and Coordination:</strong> Facilitating effective communication within the organization, coordinating meetings and events, and liaising with external stakeholders.</li>
              <li><strong>Support for Other Departments:</strong> Providing assistance to other teams, such as HR, finance, and IT, with tasks like recruitment, invoicing, and budget management.</li>
              <li><strong>Ensuring Compliance:</strong> Adhering to company policies, procedures, and regulatory requirements.</li>
              <li><strong>Resource Management:</strong> Managing office supplies, equipment, and other resources to ensure they are readily available and maintained.</li>
              <li><strong>Scheduling and Planning:</strong> Managing schedules, booking appointments, and coordinating travel arrangements.</li>
            </ul>
             </div>
          )}

        {selectedSection === "users" && <AllUsers />}
        {selectedSection === "trainer" && <TrainerApproval />}
        {selectedSection === "content" && <ContentApproval />}
        
      </main>
    </div>
  );
}
