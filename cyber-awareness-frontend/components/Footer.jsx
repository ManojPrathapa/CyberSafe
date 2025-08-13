export default function Footer() {
  return (
    <footer className="bg-white border-t py-4 mt-0">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Cybersafe App. All rights reserved.
      </div>
    </footer>
  );
}
