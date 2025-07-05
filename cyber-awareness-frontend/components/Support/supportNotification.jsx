"use client";

export default function SupportNotifications({ notifications = [] }) {
  const getColor = (type) => {
    switch (type) {
      case "register": return "text-blue-600";
      case "approval": return "text-blue-600";
      case "complaint": return "text-red-600";
      case "resolved": return "text-green-600";
      default: return "text-gray-800";
    }
  };

  return (
    <div className="mt-6 bg-[#e7e2c9] p-4 rounded-lg shadow-md h-[400px] overflow-y-auto border border-black">
      {notifications.map((note, idx) => (
        <div
          key={idx}
          className="bg-[#e7e2c9] border border-black mb-3 px-4 py-3 flex justify-between items-start shadow"
        >
          <p className={`font-medium ${getColor(note.type)}`}>{note.message}</p>
          <span className="text-sm text-gray-600 whitespace-nowrap">{note.time}</span>
        </div>
      ))}
    </div>
  );
}
