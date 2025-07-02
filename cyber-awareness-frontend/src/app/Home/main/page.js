import Header from "@/components/Header"; // adjust path as per your project
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header page="home" />

      <main className="px-4 py-6 space-y-6">
        {/* Title Section */}
        {/* <div className="bg-blue-100 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-black">CYBERSAFE</h1>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">LOGIN</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">SIGNUP</button>
          </div>
        </div> */}

        {/* Cyber Awareness Section */}
        <div className="bg-gray-100 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 shadow">
          <div className="w-full sm:w-1/3">
            {/* Placeholder for cybersecurity image */}
            <div className="bg-blue-200 w-full h-48 rounded flex items-center justify-center">
              <span className="text-white">Cybersecurity Image</span>
            </div>
          </div>
          <div className="w-full sm:w-2/3 space-y-2">
            <h2 className="text-xl font-bold text-black">CYBERAWARENESS FOR STUDENTS</h2>
            <p className="text-gray-700">
              Learn how to stay safe online with Interactive module and quizzes
            </p>
            <button className="bg-green-200 border border-green-500 text-black font-semibold px-4 py-2 rounded hover:bg-green-300">
              GET STARTED
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center">
              {/* Placeholder for video icon */}
              <span>🎥</span>
            </div>
            <p className="font-semibold text-black">Educational videos on cybersecurity</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-green-300 w-20 h-20 rounded-full flex items-center justify-center">
              {/* Placeholder for safety icon */}
              <span>✅</span>
            </div>
            <p className="font-semibold text-black">Tips and Practices to protect your information</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-blue-200 w-20 h-20 rounded-full flex items-center justify-center">
              {/* Placeholder for quiz icon */}
              <span>📝</span>
            </div>
            <p className="font-semibold text-black">Quizzes to reinforce learning</p>
          </div>
        </div>
      </main>
    </div>
  );
}
