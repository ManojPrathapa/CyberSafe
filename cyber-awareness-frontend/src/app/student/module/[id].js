import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ModulePage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Navbar mode="student" />
      <div className="p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Module {id}</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Protection from cyberattacks</li>
          <li>Maintaining confidentiality</li>
          <li>Ensuring data integrity</li>
          <li>Using firewalls, anti-malware tools</li>
          <li>Training & awareness programs</li>
        </ul>

        <div className="mt-6 space-y-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Start Quiz
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded">
            Ask Mentor a Doubt
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
