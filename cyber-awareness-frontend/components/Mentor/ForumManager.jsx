"use client";
import { useEffect } from "react";
import { useState } from "react";
import { Send, MessageSquare, ThumbsUp, Trash2, Reply } from "lucide-react";
import { getToken } from "@/src/app/utils/auth";
import { getUser } from "@/src/app/utils/auth";
import { API_BASE_URL } from "@/src/app/utils/api";

export default function ForumManager() {
  const [doubts, setDoubts] = useState([]);
  //const [newPost, setNewPost] = useState("");
  const [replies, setReplies] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const Fetch_Doubts = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/doubts/${user.id}`, {
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
      setDoubts(data);
      console.log(data);
      console.log("DATA OF DATA");
      console.log(typeof data);
    } catch (error) {
      console.error("Failed to  fetch doubts", error);
    } finally {
      console.log("In Finally");
    }
  };
  //const reloadComponent = () => {
  //  setRefreshKey((oldKey) => oldKey + 1); // Changes the key, forcing a re-render
  //};

  //const handlePost = () => {
  //  if (newPost.trim()) {
  //    const post = {
  //      id: Date.now(),
  //       content: newPost,
  //       time: "Just now",
  //       likes: 0,
  //       responses: [],
  //     };
  //     setPosts([post, ...posts]);
  //     setNewPost("");
  //    }
  //  };

  //  const handleDelete = (id) => {
  //    setPosts(doubts.filter((p) => p.id !== id));
  //  };
  const handleReply = async (Doubt_Id, message) => {
    if (!message.trim()) return;

    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      // Send reply to backend
      const res = await fetch(`${API_BASE_URL}/api/doubt/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doubt_id: Doubt_Id, answer: message }),
      });

      if (!res.ok) {
        throw new Error(`Failed to send reply: ${res.status}`);
      }

      const savedReply = await res.json(); // Expect backend to return saved reply object

      // Update frontend state immediately
      setDoubts((prev) =>
        prev.map((d) =>
          d.doubt_id === Doubt_Id
            ? { ...d, responses: [...(d.responses || []), savedReply] }
            : d
        )
      );

      // Clear reply box for that doubt
      setReplies((prev) => ({ ...prev, [Doubt_Id]: "" }));
    } catch (error) {
      console.error("Error sending reply:", error);
    }
    await Fetch_Doubts();
    setRefreshKey((oldKey) => oldKey + 1);
    //window.location.reload();
  };
  useEffect(() => {
    Fetch_Doubts();
    console.log("Doubts are fetched");
  }, [refreshKey]);

  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h3 className="text-2xl font-bold mb-4">💬 Doubts Forum</h3>
      <p className="mb-4 text-gray-600">
        Open discussions. Raise doubts. Share your thoughts. Learn together.
      </p>

      {/*<div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Ask a question or start a discussion..."
          className="flex-grow border rounded px-4 py-2 text-sm"
        /
        <button
          onClick={handlePost}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <Send size={16} /> Post
        </button>
      </div>*/}

      <div className="space-y-6" key={refreshKey}>
        {doubts.map((doubt) => (
          <div
            key={doubt.doubt_id}
            className="bg-gray-50 border p-4 rounded shadow"
          >
            <div className="mb-2 text-sm text-gray-800">
              <MessageSquare className="inline w-4 h-4 mr-1 text-blue-500" />{" "}
              <strong>Student:</strong> {doubt.question}
              <span className="ml-4 text-xs text-gray-500">
                {doubt.timestamp}
              </span>
            </div>
            <div className="mb-2 text-sm text-gray-800">
              <MessageSquare className="inline w-4 h-4 mr-1 text-blue-500" />{" "}
              <strong>Reply:</strong> {doubt.answer}
            </div>
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              {/* <button
                // onClick={() => handleLike(doubt.id)}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <ThumbsUp size={14} /> Like ({doubt.likes})
              </button>*/}
              <button
                onClick={() => {
                  setReplies({
                    ...replies,
                    [doubt.doubt_id]: replies[doubt.doubt_id] ?? "",
                  });
                }}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Reply size={14} /> Reply
              </button>
              <button
                //onClick={() => handleDelete(doubt.id)}//
                className="flex items-center gap-1 hover:text-red-600"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
            {/* Replies */}
            {doubt.length > 0 && (
              <div className="mt-4 border-t pt-2 space-y-2">
                {doubt.responses.map((r, idx) => (
                  <div
                    key={idx}
                    className="text-sm pl-4 border-l-2 border-blue-300"
                  >
                    <p className="text-gray-700">
                      <strong>Reply:</strong> {r.answer}
                    </p>
                    <p className="text-xs text-gray-500">{r.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
            *{/* Reply Box */}
            {replies[doubt.doubt_id] !== undefined && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replies[doubt.doubt_id]}
                  onChange={(e) =>
                    setReplies({ ...replies, [doubt.doubt_id]: e.target.value })
                  }
                  placeholder="Write a reply..."
                  className="flex-grow border rounded px-3 py-1 text-sm"
                />
                <button
                  onClick={() =>
                    handleReply(doubt.doubt_id, replies[doubt.doubt_id])
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
