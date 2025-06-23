import ParentNavbar from "../../../components/ParentNavbar";

export default function ParentLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <ParentNavbar />
      <main className="flex-grow w-full">
        {children}
      </main>
    </div>
  );
}
