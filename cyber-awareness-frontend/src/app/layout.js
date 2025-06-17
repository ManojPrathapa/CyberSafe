// Corrected layout.js for Next.js App Router

import '../app/globals.css'; // Use relative path instead of "@/styles/..."
import Navbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Cyber Awareness App',
  description: 'Stay safe online - Learn, Track, Educate.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-gray-100">
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
