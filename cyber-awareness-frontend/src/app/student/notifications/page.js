export default function StudentNotifications() {
  const notifications = [
    "Mentor 2 answered your doubt on Module 2.",
    "New resources added in Module 2.",
    "Completed Module 1 Quiz!",
    "Module 2 Unlocked!"
  ];

  return (
    <>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Notifications</h2>
        <ul className="space-y-3">
          {notifications.map((note, index) => (
            <li key={index} className="border-b pb-2 text-gray-700">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
// This code defines a simple notifications page for students in a cybersecurity awareness program.