"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';


export default function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const renderButtons = () => {
    if (page === "home") {
      return (
        <>
          <Link href="/notifications">
            <button className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100 transition">
              Notification
            </button>
          </Link>
          <Link href="/logout">
            <button className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100 transition">
              Logout
            </button>
          </Link>
        </>
      );
    } else if (page === "dashboard") {
      return (
        <>
          <Link href="/Admin">
            <button className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100 transition">
              Home
            </button>
          </Link>
          <button
              onClick={handleLogout}
              className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100 transition"
            >
              LOGOUT
            </button>
        </>
      );
    } else if (page === "notifications") {
      return (
        <>
          <Link href="/Admin">
            <button className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100 transition">
              Home
            </button>
          </Link>
          <button
              onClick={handleLogout}
              className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100 transition"
            >
              LOGOUT
            </button>
        </>
      );
    }
    return null;
  };

  return (
    <header className="bg-blue-700 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
          CYBERSAFE
        </h1>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex gap-2">{renderButtons()}</div>

        {/* Mobile Menu */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow"
          >
            ☰ Menu
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-2 z-50 min-w-[120px]">
              {renderButtons()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
