import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="bg-blue-700 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">CyberAware</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-white text-blue-700 font-semibold px-5 py-2 rounded shadow hover:bg-blue-100 transition">Button 1</button>
          <button className="bg-white text-blue-700 font-semibold px-5 py-2 rounded shadow hover:bg-blue-100 transition">Button 2</button>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Navbar />
        </div>
      </div>
    </header>
  );
}