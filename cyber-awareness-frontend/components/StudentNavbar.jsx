"use client"; // ✅ This must be the FIRST line

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StudentNavbar() {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "underline text-white" : "hover:underline";

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">CYBERSAFE - Student</h1>
      <div className="space-x-6 text-sm">
        <Link href="/student/home" className={isActive("/student/home")}>Home</Link>
        <Link href="/student/profile" className={isActive("/student/profile")}>Profile</Link>
        <Link href="/student/notifications" className={isActive("/student/notifications")}>Notifications</Link>
        <Link href="/student/dashboard" className={isActive("/student/dashboard")}>Dashboard</Link>
        <Link href="/student/settings" className={isActive("/student/settings")}>Settings</Link>
        <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
      </div>
    </nav>
  );
}
