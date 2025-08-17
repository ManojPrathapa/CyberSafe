"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/src/app/utils/auth";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { ChevronDown } from "lucide-react";

export default function ModuleCreation() {
  const [modules, setModules] = useState([]);
  const [openModule, setOpenModule] = useState(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");

  // Fetch all modules
  const fetchModules = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/modules`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setModules(data);
    } catch (error) {
      console.error("Failed to fetch modules", error);
    }
  };

  // Upload a new module
  const uploadModule = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const newModule = {
        title: moduleTitle,
        description: moduleDescription,
      };

      const response = await fetch(`${API_BASE_URL}/api/modules/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newModule),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      await response.json();
      alert("Module uploaded successfully!");
      setModuleTitle("");
      setModuleDescription("");
      fetchModules();
    } catch (error) {
      console.error("Module Upload Failed:", error);
      alert("Failed to upload module.");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h2 className="text-xl font-bold mb-4">Existing Modules</h2>

      {modules.map((mod, index) => (
        <div key={index} className="mb-4 border rounded shadow-sm">
          <button
            onClick={() => setOpenModule(openModule === index ? null : index)}
            className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-t"
          >
            <span className="text-lg font-semibold">{mod.title}</span>
            <ChevronDown
              className={`transform transition ${
                openModule === index ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {openModule === index && (
            <div className="p-4 space-y-2 bg-blue-50 border-t">
              <p><strong>Description:</strong> {mod.description}</p>
            </div>
          )}
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6 mb-4">Create New Module</h2>
      <div>
        <p>Module Title</p>
        <input
          type="text"
          value={moduleTitle}
          onChange={(e) => setModuleTitle(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          placeholder="Enter module title"
        />
        <br /><br />

        <p>Module Description</p>
        <textarea
          value={moduleDescription}
          onChange={(e) => setModuleDescription(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          placeholder="Enter module description"
        />
        <br /><br />

        <button
          onClick={uploadModule}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Module
        </button>
      </div>
    </div>
  );
}
