import StudentNavbar from "../../../components/StudentNavbar";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <StudentNavbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
// This layout component is specifically for the student section of the app.
// It includes the StudentNavbar and wraps the main content area.