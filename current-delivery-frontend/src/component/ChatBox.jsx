import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000");

export default function ClientChatBox() {
  const [room, setRoom] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [newMsg, setNewMsg] = useState(false);

  // Generate a unique room for each client
  useEffect(() => {
    let storedRoom = localStorage.getItem("chatRoom");
    if (!storedRoom) {
      storedRoom = "room_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      localStorage.setItem("chatRoom", storedRoom);
    }
    setRoom(storedRoom);

    // Join room
    socket.emit("join_room", { room: storedRoom });

    // Listen for messages
    socket.on("chat_message", (m) => {
      if (m.room === storedRoom) {
        setMsgs((prev) => [...prev, m]);
      }
    });

    return () => socket.off("chat_message");
  }, []);
  useEffect(() => {
  socket.on("chat_message", (m) => {
    if (m.room === room && m.isAdmin && !open) setNewMsg(true);
  });
}, [room, open]);

  function send() {
    if (!text || !room) return;

    const user = JSON.parse(localStorage.getItem("user") || "null") || {
      id: null,
      name: "Guest",
    };

    const msg = {
      room,
      senderId: user.id,
      senderName: user.name,
      text,
      isAdmin: false,
    };

    socket.emit("chat_message", msg);
    setMsgs((prev) => [...prev, msg]);
    setText("");
  }
  

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed bottom-0 left-2 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>
      <button
  className="fixed bottom-0 left-2 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 relative"
  onClick={() => {
    setOpen(!open);
    setNewMsg(false);
  }}
>
  💬
  {newMsg && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-600" />}
</button>

      <div
        className={`fixed bottom-0 left-0 md:right-5 md:bottom-8 md:left-auto bg-white shadow-lg border rounded-t-lg md:rounded-lg p-3 z-50 transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full md:translate-y-0"
        } md:translate-y-0 w-80 max-w-sm mx-auto md:w-auto`}
        style={{ maxHeight: "80vh" }}
      >
        {/* Close button */}
        <div className="flex justify-between items-center mb-2 md:hidden">
          <h4 className="font-bold text-blue-950">Chat</h4>
          <button className="text-gray-500" onClick={() => setOpen(!open)}>
            ✖
          </button>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto space-y-2 mb-2" style={{ maxHeight: "200px" }}>
          {msgs.map((m, idx) => (
            <div
              key={idx}
              className={`text-sm p-1 rounded ${
                m.isAdmin ? "bg-blue-100 text-blue-900 self-start" : "bg-gray-100"
              }`}
            >
              <strong>{m.senderName}:</strong> {m.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 border p-2 rounded text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={send}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
