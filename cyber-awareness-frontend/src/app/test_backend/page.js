"use client";

import { useEffect, useState } from "react";

export default function TestBackend() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5050/api")  // Flask backend
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Backend Test</h1>
      <p>Response: {message}</p>
    </div>
  );
}
