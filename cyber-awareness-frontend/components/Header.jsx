export default function Header() {
  return (
    <header className="bg-blue-700 py-5 px-8 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-extrabold text-white tracking-wide">CyberAware</h1>
      <div className="space-x-4">
        <button className="bg-white text-blue-700 font-semibold px-5 py-2 rounded shadow hover:bg-blue-100 transition">Button 1</button>
        <button className="bg-white text-blue-700 font-semibold px-5 py-2 rounded shadow hover:bg-blue-100 transition">Button 2</button>
      </div>
    </header>
  );
}