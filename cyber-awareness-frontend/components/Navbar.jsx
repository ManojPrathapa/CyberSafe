import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CyberAware</h1>
        <div className="space-x-4 text-sm">
          <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link href="/student/home" className="text-gray-700 hover:text-blue-500">Student</Link>
          <Link href="/parent/home" className="text-gray-700 hover:text-blue-500">Parent</Link>
          <Link href="/mentor" className="text-gray-700 hover:text-blue-500">Mentor</Link>
          <Link href="/admin" className="text-gray-700 hover:text-blue-500">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
