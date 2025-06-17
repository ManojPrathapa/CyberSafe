
export default function StudentSettings() {
  return (
    <>
      <div className="p-8 space-y-4 text-purple-900">
        <h2 className="text-3xl font-bold text-blue-700">Settings</h2>
        <div className="space-y-2">
          <input type="email" placeholder="Change email" className="border px-4 py-2 rounded w-full" />
          <input type="password" placeholder="New password" className="border px-4 py-2 rounded w-full" />
          <button className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Close Account</button>
        </div>
      </div>
    </>
  );
}
