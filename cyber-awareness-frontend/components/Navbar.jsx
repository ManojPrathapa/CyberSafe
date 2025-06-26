'use client';
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full">
      <div className="flex items-center justify-between py-3">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden text-blue-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4 ml-auto">
          <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link href="/child" className="text-gray-700 hover:text-blue-500">Child</Link>
          <Link href="/parent" className="text-gray-700 hover:text-blue-500">Parent</Link>
          <Link href="/mentor" className="text-gray-700 hover:text-blue-500">Mentor</Link>
          <Link href="/admin" className="text-gray-700 hover:text-blue-500">Admin</Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link href="/" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/child" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>Child</Link>
            <Link href="/parent" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>Parent</Link>
            <Link href="/mentor" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>Mentor</Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>Admin</Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-500" onClick={() => setMenuOpen(false)}>Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}