import Link from "next/link";

export default function StudentProfile() {
  return (
    <div className="p-8 space-y-4 text-purple-900">
      <h2 className="text-3xl font-bold text-blue-700">Your Profile</h2>
      <p>User ID: <strong>student_123</strong></p>
      <p>Email: <strong>student@example.com</strong></p>
      <p>Modules Completed: Module 1</p>
      <p>Badges Earned: Beginner, Safety Champ</p>

      <div className="mt-4">
        <Link href="/student/home">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go Back to Modules
          </button>
        </Link>
      </div>
    </div>
  );
}
// This code defines a simple student profile page with a link to go back to the modules page.