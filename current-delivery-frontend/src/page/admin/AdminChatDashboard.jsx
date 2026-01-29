import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000");

export default function AdminChatDashboard() {
  const [rooms, setRooms] = useState([]); // list of active client rooms
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {
    // Admin joins dashboard
    socket.emit("admin_join");

    // Get updated rooms list from server
    socket.on("update_rooms", (roomsList) => {
      setRooms(roomsList);
    });

    // Listen for incoming messages
    socket.on("chat_message", (msg) => {
      setMessages((prev) => {
        const roomMsgs = prev[msg.room] || [];
        return { ...prev, [msg.room]: [...roomMsgs, msg] };
      });

      // Optional: browser notification
      if (Notification.permission === "granted") {
        new Notification(`New message from ${msg.senderName}`, {
          body: msg.text,
        });
      }
    });

    // Ask permission for notifications
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("update_rooms");
      socket.off("chat_message");
    };
  }, []);

  function sendMessage() {
    if (!text || !selectedRoom) return;

    const msg = {
      room: selectedRoom,
      senderId: "admin",
      senderName: "Admin",
      text,
      isAdmin: true,
    };

    socket.emit("chat_message", msg);
    setMessages((prev) => ({
      ...prev,
      [selectedRoom]: [...(prev[selectedRoom] || []), msg],
    }));
    setText("");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar: rooms */}
      <div className="w-64 border-r p-4 bg-gray-50 overflow-y-auto">
        <h2 className="font-bold mb-4">Active Clients</h2>
        {rooms.map((room) => {
          const unread = (messages[room] || []).filter((m) => !m.read && !m.isAdmin).length;
          return (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`w-full text-left px-2 py-1 mb-2 rounded ${
                selectedRoom === room ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              {room} {unread > 0 && <span className="text-sm text-red-600">({unread})</span>}
            </button>
          );
        })}
      </div>

      {/* Chat window */}
      <div className="flex-1 p-4 flex flex-col">
        {selectedRoom ? (
          <>
            <h3 className="font-bold mb-2">Room: {selectedRoom}</h3>

            <div className="flex-1 overflow-y-auto border p-2 mb-2 rounded">
              {(messages[selectedRoom] || []).map((m, idx) => (
                <div
                  key={idx}
                  className={`p-1 mb-1 rounded ${
                    m.isAdmin ? "bg-blue-100 text-blue-900 self-end" : "bg-gray-100"
                  }`}
                >
                  <strong>{m.senderName}:</strong> {m.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Type your reply..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500">Select a client room to start chatting</div>
        )}
      </div>
    </div>
  );
}
