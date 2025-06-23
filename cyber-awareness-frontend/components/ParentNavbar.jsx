"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function ParentNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) =>
    pathname === path
      ? "underline underline-offset-4 text-white font-semibold"
      : "hover:underline hover:underline-offset-4";

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <nav className="bg-purple-800 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-y-4">
        <h1 className="text-xl font-bold">CYBERSAFE - Parent</h1>

        <div className="space-x-4 text-sm flex flex-wrap items-center">
          <Link href="/parent/home" className={isActive("/parent/home")}>Home</Link>
          <Link href="/parent/tips" className={isActive("/parent/tips")}>Tips</Link>
          <Link href="/parent/progress" className={isActive("/parent/progress")}>Progress</Link>
          <Link href="/parent/activity" className={isActive("/parent/activity")}>Child Activity</Link>
          <Link href="/parent/notifications" className={isActive("/parent/notifications")}>Notifications</Link>
          <Link href="/parent/dashboard" className={isActive("/parent/dashboard")}>Dashboard</Link>
          <Link href="/parent/profile" className={isActive("/parent/profile")}>Profile</Link>
          <Link href="/parent/settings" className={isActive("/parent/settings")}>Settings</Link>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
