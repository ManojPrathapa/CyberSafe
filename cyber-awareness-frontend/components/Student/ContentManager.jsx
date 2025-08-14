"use client";

import { useState } from "react";
import { ChevronDown, UploadCloud, FilePlus } from "lucide-react";

export default function ContentManager() {
  const [openModule, setOpenModule] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showBottomUpload, setShowBottomUpload] = useState(false);
  const [showBottomText, setShowBottomText] = useState(false);

  const modules = [
    {
      title: "Cyber Basics",
      videos: ["Intro to Cyber", "Threat Types"],
      quizzes: ["Cyber Quiz 1"]
    },
    {
      title: "Online Safety",
      videos: ["Safe Browsing", "Privacy Protection"],
      quizzes: ["Safety Quiz"]
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h3 className="text-2xl font-bold mb-4">📂 Content Modules</h3>
      <p className="mb-6 text-sm text-gray-700"> all your content materials, quizzes, and modules here.</p>

      {modules.map((mod, index) => (
        <div key={index} className="mb-4 border rounded shadow-sm">
          <button
            onClick={() => setOpenModule(openModule === index ? null : index)}
            className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-t"
          >
            <span className="text-lg font-semibold">{mod.title}</span>
            <ChevronDown className={`transform transition ${openModule === index ? "rotate-180" : "rotate-0"}`} />
          </button>
          {openModule === index && (
            <div className="p-4 space-y-2 bg-blue-50 border-t">
              <div>
                <h4 className="font-semibold">🎥 Videos:</h4>
                <ul className="list-disc list-inside ml-4 text-sm">
                  {mod.videos.map((v, i) => <li key={i}>{v}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">📝 Quizzes:</h4>
                <ul className="list-disc list-inside ml-4 text-sm">
                  {mod.quizzes.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>

              {/* <div className="flex gap-3 mt-4">
                <button onClick={() => setShowTextInput(!showTextInput)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">
                  ➕ Add Content
                </button>
                <button onClick={() => setShowFileUpload(!showFileUpload)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                  ⬆️ Upload Content
                </button>
              </div> */}

              {/* {showTextInput && (
                <textarea placeholder="Enter text content here..." className="mt-3 w-full border rounded p-2 text-sm" rows={4} />
              )}
              {showFileUpload && (
                <div className="mt-3 border-dashed border-2 border-gray-400 rounded p-6 text-center bg-gray-100 text-gray-600">
                  <UploadCloud className="mx-auto mb-2" />
                  <p className="text-sm">Drag and drop content here</p>
                </div>
              )} */}
            </div>
          )}
        </div>
      ))}

      {/* <div className="mt-8 flex gap-4">
        <button
          onClick={() => setShowBottomText(!showBottomText)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          <FilePlus size={18} /> Add Module
        </button>
        <button
          onClick={() => setShowBottomUpload(!showBottomUpload)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <UploadCloud size={18} /> Add Files
        </button>
      </div>

      {showBottomText && (
        <textarea placeholder="Enter new module content..." className="mt-4 w-full border rounded p-2 text-sm" rows={4} />
      )}

      {showBottomUpload && (
        <div className="mt-4 border-dashed border-2 border-gray-400 rounded p-6 text-center bg-gray-100 text-gray-600">
          <UploadCloud className="mx-auto mb-2" />
          <p className="text-sm">Drag and drop content here</p>
        </div>
      )} */}
    </div>
  );
}
