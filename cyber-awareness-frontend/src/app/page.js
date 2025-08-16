"use client";
import Header from "@/components/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header page="home" />

<<<<<<< HEAD
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/home">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                Home
              </button>
            </Link>
            <Link href="/student">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                I&apos;m a Student
              </button>
            </Link>
            <Link href="/parent">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                I&apos;m a Parent
              </button>
            </Link>
            <Link href="/mentor">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                I&apos;m a Mentor
              </button>
            </Link>
            <Link href="/Admin/home">
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                Admin Login
              </button>
            </Link>
            <Link href="/support">
              <button className="bg-gray-700 hover:bg-gray-500 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                Support Login
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full animate-fadeIn delay-200">
          {[
            {
              title: "🛡 Safe Browsing Tips",
              desc: "Learn how to browse smartly and avoid online traps."
            },
            {
              title: "👪 Parental Guidance",
              desc: "Tools and tips to help parents monitor safely."
            },
            {
              title: "🎓 Learn with Quizzes",
              desc: "Interactive quizzes to reinforce cyber safety learning."
            }
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white border border-blue-100 rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.desc}</p>
=======
      <main className="px-4 py-6 space-y-12">
        {/* Cyber Awareness Section (Hero Section) */}
        <section className="bg-gray-100 rounded-lg p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-8 shadow-lg min-h-[70vh]">
          {/* Image */}
          <div className="w-full sm:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-64 sm:h-80 rounded overflow-hidden">
              <Image
                src="/leadspace_article.jpeg"
                alt="Cybersecurity Awareness"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                priority
              />
>>>>>>> e9ddd2a (home page)
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full sm:w-1/2 space-y-4 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-black leading-snug">
              CYBERAWARENESS FOR STUDENTS
            </h2>
            <p className="text-lg text-gray-700 max-w-lg mx-auto sm:mx-0">
              Learn how to stay safe online with interactive modules, engaging
              videos, and fun quizzes designed just for you.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
            >
              GET STARTED
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center text-3xl">
              🎥
            </div>
            <p className="font-semibold text-black text-lg">
              Educational videos on cybersecurity
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-green-300 w-20 h-20 rounded-full flex items-center justify-center text-3xl">
              ✅
            </div>
            <p className="font-semibold text-black text-lg">
              Tips and practices to protect your information
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-blue-200 w-20 h-20 rounded-full flex items-center justify-center text-3xl">
              📝
            </div>
            <p className="font-semibold text-black text-lg">
              Quizzes to reinforce learning
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
