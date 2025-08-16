// Corrected layout.js for Next.js App Router

import '../app/globals.css'; // Use relative path instead of "@/styles/..."
import Footer from '@/components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

export const metadata = {
  title: 'Cyber Awareness App',
  description: 'Stay safe online - Learn, Track, Educate.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-gray-100">
        <ThemeProvider>
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
