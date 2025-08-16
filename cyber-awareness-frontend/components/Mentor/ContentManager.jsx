"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getToken } from "@/src/app/utils/auth";
import { getUser } from "@/src/app/utils/auth";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { ChevronDown, UploadCloud, FilePlus } from "lucide-react";

export default function ContentManager() {
  const [openModule, setOpenModule] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  //const [showBottomUpload, setShowBottomUpload] = useState(false);
  const [showBottomText, setShowBottomText] = useState(false);
  const [ModuleID, setModuleID] = useState("");
  const [Video_Title, setVideo_Title] = useState("");
  const [Video_Description, setVideo_Description] = useState("");
  //const [Video_URL, setVideoURL] = useState("");
  //const [Resource_Link, setResourceLink] = useState("");
  const [modules, getModules] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  //  const [videourl, getvideourl] = useState(null);

  //const modules = [
  //  {
  //    title: "Cyber Basics",
  //    videos: ["Intro to Cyber", "Threat Types"],
  //    quizzes: ["Cyber Quiz 1"],
  //  },
  //  {
  //    title: "Online Safety",
  //    videos: ["Safe Browsing", "Privacy Protection"],
  //    quizzes: ["Safety Quiz"],
  //  },
  // ];

  const Fetch_Modules = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/modules/mentor/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      //const file_url = `http://127.0.0.1:5050/uploads/${data.video_url}`;
      //getvideourl(file_url);
      console.log("VIDEO DATA");
      console.log(data);
      getModules(data);

      console.log(data);
      console.log(typeof data);
    } catch (error) {
      console.error("Failed to  fetch modules", error);
    } finally {
      console.log("In Finally");
    }
  };

  const Upload_Module = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      const formData = new FormData();
      formData.append("title", Video_Title);
      formData.append("description", Video_Description);
      formData.append("uploaded_by", user.id);
      formData.append("mentor_id", user.id);
      formData.append("module_id", ModuleID);

      if (videoFile) {
        formData.append("video", videoFile); // backend should expect "video"
      }
      console.log(user);
      //const payload = {
      //  mentor_id: user.id,
      //   module_id: ModuleID,
      //   video_description: Video_Description,
      //video_url: Video_URL,
      //resource_link: Resource_Link,
      // };

      const response = await fetch(
        `${API_BASE_URL}/api/modules/videos/upload`,
        {
          method: "POST",
          headers: {
            // If using authentication:
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setModuleID("");
      setVideo_Description("");
      setVideoFile(null);
      //setVideoURL("");
      //setResourceLink("");

      console.log("Upload successful:", result);
      Fetch_Modules();
      alert("Module uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload module.");
    }
  };

  useEffect(() => {
    Fetch_Modules();
    console.log("Fetch Modules is executed");
    console.log(typeof modules);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h3 className="text-2xl font-bold mb-4">📂 Content Manager</h3>
      <p className="mb-6 text-sm text-gray-700">
        Manage all your uploaded materials, quizzes, and modules here.
      </p>
      {modules.map((mod, index) => (
        <div key={index} className="mb-4 border rounded shadow-sm">
          <button
            onClick={() => setOpenModule(openModule === index ? null : index)}
            className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-t"
          >
            <span className="text-lg font-semibold">
              <h4>Module Title: {mod.title}</h4>
              <p>Module Description: {mod.description}</p>
            </span>
            <ChevronDown
              className={`transform transition ${
                openModule === index ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {openModule === index && (
            <div className="p-4 space-y-2 bg-blue-50 border-t">
              <div>
                <video
                  width="640"
                  height="360"
                  controls
                  className="rounded shadow"
                >
                  <source src={mod.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p></p>
                <h4 className="font-semibold">
                  Resources:{" "}
                  <a
                    href={mod.resource_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resource Link
                  </a>
                </h4>
                <ul className="list-disc list-inside ml-4 text-sm"></ul>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowTextInput(!showTextInput)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                >
                  ➕ Add Content
                </button>
                <button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                >
                  ⬆️ Upload Content
                </button>
              </div>

              {showTextInput && (
                <textarea
                  placeholder="Enter text content here..."
                  className="mt-3 w-full border rounded p-2 text-sm"
                  rows={4}
                />
              )}
              {showFileUpload && (
                <div className="mt-3 border-dashed border-2 border-gray-400 rounded p-6 text-center bg-gray-100 text-gray-600">
                  <UploadCloud className="mx-auto mb-2" />
                  <p className="text-sm">Drag and drop content here</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      -----------------------------------------------------------------
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setShowBottomText(!showBottomText)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          <FilePlus size={18} /> Add New Content
        </button>
      </div>
      {showBottomText && (
        <div>
          <p></p>
          <br></br>
          <p>Module Id</p>
          <select
            value={ModuleID}
            onChange={(e) => setModuleID(e.target.value)}
            className="w-full border px-3 py-1 rounded"
          >
            <option value="">Select Module</option>
            <option value="1">Module 1</option>
            <option value="2">Module 2</option>
            <option value="3">Module 3</option>
            <option value="4">Module 4</option>
            <option value="5">Module 5</option>
            <option value="6">Module 6</option>
          </select>

          <p></p>
          <br></br>
          <p>Video Title</p>
          <input
            type="text"
            value={Video_Title}
            onChange={(e) => setVideo_Title(e.target.value)}
            className="w-full border px-3 py-1 rounded"
            placeholder="Video Title"
          />
          <p></p>
          <br></br>
          <p>Video Description</p>
          <input
            type="text"
            value={Video_Description}
            onChange={(e) => setVideo_Description(e.target.value)}
            className="w-full border px-3 py-1 rounded"
            placeholder="Video Description"
          />
          <p></p>
          <br></br>
          <div>
            <p>Upload Video</p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full border px-3 py-1 rounded"
            />
          </div>
          <p></p>
          <br></br>
          <button
            onClick={() => Upload_Module()}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded green:bg-purple-700"
          >
            UPLOAD
          </button>
        </div>
      )}
    </div>
  );
}
