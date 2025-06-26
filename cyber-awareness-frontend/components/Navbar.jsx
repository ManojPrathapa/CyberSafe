import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CyberAware</h1>

        <div className="space-x-4">
          <a href="/" className="text-gray-700 hover:text-blue-500">Home</a>
          <a href="/student" className="text-gray-700 hover:text-blue-500">Student</a>
          <a href="/parent" className="text-gray-700 hover:text-blue-500">Parent</a>
          <a href="/mentor" className="text-gray-700 hover:text-blue-500">Mentor</a>
          <a href="/admin" className="text-gray-700 hover:text-blue-500">Admin</a>
          <a href="/login" className="text-gray-700 hover:text-blue-500">Login</a>
        </div>
      </div>
    </nav>
  );
}
