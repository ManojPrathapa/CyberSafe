"use client";

import { useState, useEffect } from "react";
import { Send, MessageSquare, ThumbsUp, Trash2, Reply } from "lucide-react";
import { apiHelpers, getUserId } from "../../src/app/utils/apiConfig";

export default function ForumManager() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [replies, setReplies] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Get user data from JWT token or use defaults
  const userId = getUserId() || 1;
  const username = "parent_01"; // TODO: get from profile
  const role = "parent";
  const mentorId = 1; // This should be dynamic based on available mentors

  // Fetch doubts/forum posts using API helpers
  const fetchDoubts = async (mentorId) => {
    try {
      const doubts = await apiHelpers.get(`/doubts/${mentorId}`);
      return doubts;
    } catch (error) {
      console.error('Error fetching doubts:', error);
      return [];
    }
  };

  // Ask a doubt using API helpers
  const askDoubt = async (doubtData) => {
    try {
      const result = await apiHelpers.post('/doubt', doubtData);
      return result;
    } catch (error) {
      console.error('Error asking doubt:', error);
      throw error;
    }
  };

  // Reply to doubt using API helpers
  const replyToDoubt = async (replyData) => {
    try {
      const result = await apiHelpers.post('/doubt/reply', replyData);
      return result;
    } catch (error) {
      console.error('Error replying to doubt:', error);
      throw error;
    }
  };

  // Load doubts on component mount
  useEffect(() => {
    const loadDoubts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const doubtsData = await fetchDoubts(mentorId);
        
        // Transform doubts data to posts format
        const transformedPosts = doubtsData.map(doubt => ({
          id: doubt.doubt_id,
          content: doubt.question,
          time: new Date(doubt.timestamp).toLocaleString(),
          likes: 0,
          responses: doubt.answer ? [{ message: doubt.answer, time: new Date(doubt.timestamp).toLocaleString() }] : [],
          author: doubt.student_id ? `Student ${doubt.student_id}` : 'Anonymous'
        }));
        
        setPosts(transformedPosts);
      } catch (error) {
        console.error('Error loading doubts:', error);
        setError('Failed to load forum posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDoubts();
  }, []);

  // Handle posting new doubt
  const handlePost = async () => {
    if (!newPost.trim()) return;
    
    setSubmitting(true);
    try {
      const doubtData = {
        student_id: userId,
        mentor_id: mentorId,
        module_id: 1, // Default module - should be selectable
        question: newPost
      };

      await askDoubt(doubtData);
      
      // Add new post to local state
      const newPostObj = {
        id: Date.now(),
        content: newPost,
        time: "Just now",
        likes: 0,
        responses: [],
        author: username
      };
      
      setPosts([newPostObj, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error('Error posting doubt:', error);
      alert('Failed to post doubt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle liking a post
  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  // Handle deleting a post
  const handleDelete = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  // Handle replying to a post
  const handleReply = async (id, message) => {
    if (!message.trim()) return;
    
    try {
      const replyData = {
        doubt_id: id,
        answer: message
      };

      await replyToDoubt(replyData);
      
      // Update local state
      const newPosts = posts.map(p => {
        if (p.id === id) {
          return { 
            ...p, 
            responses: [...p.responses, { message, time: "Just now" }] 
          };
        }
        return p;
      });
      
      setPosts(newPosts);
      setReplies({ ...replies, [id]: "" });
    } catch (error) {
      console.error('Error replying to doubt:', error);
      alert('Failed to post reply. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-purple-900">
        <h3 className="text-2xl font-bold mb-4">💬 Student Forum</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading forum posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-purple-900">
        <h3 className="text-2xl font-bold mb-4">💬 Student Forum</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          disabled={submitting}
        />
        <button
          onClick={handlePost}
          disabled={submitting || !newPost.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <Send size={16} /> {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-50 border p-4 rounded shadow">
            <div className="mb-2 text-sm text-gray-800">
              <MessageSquare className="inline w-4 h-4 mr-1 text-blue-500" /> 
              <strong>{post.author}:</strong> {post.content}
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
        
        {posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No forum posts yet. Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
}
