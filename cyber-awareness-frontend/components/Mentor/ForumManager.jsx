"use client";

import { useState } from "react";
import { Send, MessageSquare, ThumbsUp, Trash2, Reply } from "lucide-react";

export default function ForumManager() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [replies, setReplies] = useState({});

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        content: newPost,
        time: "Just now",
        likes: 0,
        responses: []
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleReply = (id, message) => {
    if (!message.trim()) return;
    const newPosts = posts.map(p => {
      if (p.id === id) {
        return { ...p, responses: [...p.responses, { message, time: "Just now" }] };
      }
      return p;
    });
    setPosts(newPosts);
    setReplies({ ...replies, [id]: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h3 className="text-2xl font-bold mb-4">💬 Student Forum</h3>
      <p className="mb-4 text-gray-600">Open discussions. Raise doubts. Share your thoughts. Learn together.</p>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Ask a question or start a discussion..."
          className="flex-grow border rounded px-4 py-2 text-sm"
        />
        <button
          onClick={handlePost}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <Send size={16} /> Post
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-50 border p-4 rounded shadow">
            <div className="mb-2 text-sm text-gray-800">
              <MessageSquare className="inline w-4 h-4 mr-1 text-blue-500" /> <strong>Student:</strong> {post.content}
              <span className="ml-4 text-xs text-gray-500">{post.time}</span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 hover:text-blue-600">
                <ThumbsUp size={14} /> Like ({post.likes})
              </button>
              <button onClick={() => setReplies({ ...replies, [post.id]: replies[post.id] ?? "" })} className="flex items-center gap-1 hover:text-blue-600">
                <Reply size={14} /> Reply
              </button>
              <button onClick={() => handleDelete(post.id)} className="flex items-center gap-1 hover:text-red-600">
                <Trash2 size={14} /> Delete
              </button>
            </div>

            {/* Replies */}
            {post.responses.length > 0 && (
              <div className="mt-4 border-t pt-2 space-y-2">
                {post.responses.map((r, idx) => (
                  <div key={idx} className="text-sm pl-4 border-l-2 border-blue-300">
                    <p className="text-gray-700"><strong>Reply:</strong> {r.message}</p>
                    <p className="text-xs text-gray-500">{r.time}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Box */}
            {replies[post.id] !== undefined && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replies[post.id]}
                  onChange={(e) => setReplies({ ...replies, [post.id]: e.target.value })}
                  placeholder="Write a reply..."
                  className="flex-grow border rounded px-3 py-1 text-sm"
                />
                <button
                  onClick={() => handleReply(post.id, replies[post.id])}
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
