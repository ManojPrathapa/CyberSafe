import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 px-6 py-12 flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-6 animate-fadeIn">
            Welcome to <span className="text-purple-700">Cyber Awareness</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 animate-fadeIn delay-100">
            Empowering kids, parents, and mentors with knowledge to stay safe online.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/student/home">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                I'm a Student
              </button>
            </Link>
            <Link href="/parent/home">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                I'm a Parent
              </button>
            </Link>
            <Link href="/mentor/home">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                I'm a Mentor
              </button>
            </Link>
            <Link href="/admin">
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded shadow transition hover:scale-105">
                Admin Login
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
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
