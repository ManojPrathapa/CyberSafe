"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function StudentNavbar() {
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
    <nav className="bg-blue-800 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-y-4">
        <h1 className="text-xl font-bold tracking-wide">CYBERSAFE - Student</h1>

        <div className="space-x-4 text-sm flex flex-wrap items-center">
          <Link href="/student/home" className={isActive("/student/home")}>
            Home
          </Link>
          <Link href="/student/profile" className={isActive("/student/profile")}>
            Profile
          </Link>
          <Link href="/student/notifications" className={isActive("/student/notifications")}>
            Notifications
          </Link>
          <Link href="/student/dashboard" className={isActive("/student/dashboard")}>
            Dashboard
          </Link>
          <Link href="/student/settings" className={isActive("/student/settings")}>
            Settings
          </Link>
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
