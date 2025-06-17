import Footer from "../../../../components/Footer";


export default function StudentHome() {
  const modules = [
    "Module 1", "Module 2", "Module 3", "Module 4", "Module 5", "Module 6"
  ];

  return (
    <>
  
      <div className="p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Welcome, Student!</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {modules.map((mod, index) => (
            <div
              key={index}
              className="border border-blue-300 p-6 rounded hover:bg-blue-50 cursor-pointer"
            >
              <h3 className="font-semibold text-lg">{mod}</h3>
              <p className="text-sm text-gray-600 mt-2">
                Learn key aspects of cybersecurity in {mod}.
              </p>
              <a
                href={`/student/module/${index + 1}`}
                className="text-blue-600 text-sm mt-3 block"
              >
                Explore →
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
