"use client";

export default function StudentNotifications() {
  const notifications = [
    {
      text: "Mentor 2 answered your doubt on Module 2.",
      time: "21 min ago"
    },
    {
      text: "New resources added in Module 2.",
      time: "1 hr ago"
    },
    {
      text: "Completed Module 1 Quiz!",
      time: "1 day ago"
    },
    {
      text: "Module 2 Unlocked!",
      time: "2 days ago"
    }
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🔔 Notifications</h2>

      <ul className="space-y-4">
        {notifications.map((note, index) => (
          <li
            key={index}
            className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition transform hover:scale-[1.01] px-5 py-4 flex justify-between items-start"
          >
            <div>
              <p className="text-sm sm:text-base font-medium text-gray-800">{note.text}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{note.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
