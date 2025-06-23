"use client";

export default function ParentNotifications() {
  const notifications = [
    {
      message: "📢 Reminder: Complete Module 5 by Friday.",
      time: "2 days ago"
    },
    {
      message: "🏅 New badge “Awareness Master” unlocked!",
      time: "4 days ago"
    },
    {
      message: "🛡️ New tip added to Cybersecurity Tips section.",
      time: "1 week ago"
    }
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">🔔 Notifications</h2>

      <ul className="space-y-4">
        {notifications.map((note, index) => (
          <li
            key={index}
            className="bg-white border border-purple-200 rounded-md shadow-sm hover:shadow-md transition transform hover:scale-[1.01] px-5 py-4 flex justify-between items-start"
          >
            <div>
              <p className="text-sm sm:text-base font-medium text-gray-800">{note.message}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{note.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
