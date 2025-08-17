"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getToken } from "@/src/app/utils/auth";
import { getUser } from "@/src/app/utils/auth";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { ChevronDown, UploadCloud, FilePlus } from "lucide-react";

export default function TipsCreation() {
  const [Tip_Title, setTip_Title] = useState("");
  const [Tip_Content, setTip_Content] = useState("");
  const [Tip_Category, setTip_Category] = useState("");
  const [Tip_Resource_URL, setTip_Resource_URL] = useState("");
  const [tips, getTips] = useState([]);
  const [openModule, setOpenModule] = useState(null);
  //const [showTextInput, setShowTextInput] = useState(false);
  //const [showFileUpload, setShowFileUpload] = useState(false);

  const Fetch_Tips = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/tips/${user.id}`, {
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
      console.log("TIPS DATA");
      console.log(data);
      getTips(data);
    } catch (error) {
      console.error("Failed to  fetch modules", error);
    } finally {
      console.log("In Finally");
    }
  };
  const Upload_Tip = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      const data = {
        title: Tip_Title,
        content: Tip_Content,
        mentor_id: user.id,
        category: Tip_Category,
        source_url: Tip_Resource_URL,
      };

      const response = await fetch(`${API_BASE_URL}/api/tips/upload`, {
        method: "POST",
        headers: {
          // If using authentication:
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      console.log("Tips Upload successful:", result);
      Fetch_Tips();
      setTip_Title("");
      setTip_Content("");
      setTip_Category("");
      setTip_Resource_URL("");
      alert("TIps Uploaded successfully!");
    } catch (error) {
      console.error("Tips Upload Failed:", error);
      alert("Failed to upload module.");
    }
  };

  useEffect(() => {
    Fetch_Tips();
    console.log("Fetch Modules is executed");
    console.log(typeof modules);
  }, []);
  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h2>PREVIOUS TIPS</h2>
      <p></p>
      <br></br>
      {tips.map((mod, index) => (
        <div key={index} className="mb-4 border rounded shadow-sm">
          <button
            onClick={() => setOpenModule(openModule === index ? null : index)}
            className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-t"
          >
            <span className="text-lg font-semibold">
              <h4>Tips Title: {mod.title}</h4>
            </span>
            <ChevronDown
              className={`transform transition ${
                openModule === index ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {openModule === index && (
            <div className="p-4 space-y-2 bg-blue-50 border-t">
              <p>Tips Description: {mod.content}</p>
              <p>Tips Category: {mod.category}</p>
              <p>Tips: {mod.source_url}</p>
            </div>
          )}
        </div>
      ))}
      <p></p>
      <br></br>
      <h2>CREATE NEW TIPS</h2>
      <p></p>
      <div>
        <p>Tip Title</p>
        <input
          type="text"
          value={Tip_Title}
          onChange={(e) => setTip_Title(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          placeholder="Tip Title"
        />
        <p></p>
        <br></br>
        <p>Tip Content</p>
        <input
          type="text"
          value={Tip_Content}
          onChange={(e) => setTip_Content(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          placeholder="Tip Content"
        />
        <p></p>
        <br></br>
        <p>Tip Category</p>
        <input
          type="text"
          value={Tip_Category}
          onChange={(e) => setTip_Category(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          placeholder="Tip Category"
        />
        <p></p>
        <br></br>
        <p>Tip Resource URL</p>
        <input
          type="text"
          value={Tip_Resource_URL}
          onChange={(e) => setTip_Resource_URL(e.target.value)}
          className="w-full border px-3 py-1 rounded"
          placeholder="Tip Resource URL"
        />
        <p></p>
        <br></br>
        <p></p>
        <button
          onClick={() => Upload_Tip()}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded green:bg-purple-700"
        >
          UPLOAD
        </button>
      </div>
    </div>
  );
}
