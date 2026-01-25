
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { FaWhatsapp } from "react-icons/fa";

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');

export default function ChatBox({ room }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false); // toggle chat box on mobile

  useEffect(() => {
    socket.emit('join_room', { room });
    socket.on('chat_message', (m) => setMsgs((prev) => [...prev, m]));
    return () => socket.off('chat_message');
  }, [room]);

  function send() {
    if (!text) return;
    const user =
      JSON.parse(localStorage.getItem('user') || 'null') || {
        id: null,
        name: 'Guest',
      };
    socket.emit('chat_message', {
      room,
      senderId: user.id,
      senderName: user.name,
      text,
    });
    setText('');
  }

  return (
    <>
      {/* Floating button for mobile */}
      <button
        className="fixed bottom-0 left-2 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {/* Chat box */}
      <div
        className={`fixed bottom-0  left-0 md:right-5 md:bottom-8 md:left-auto bg-white shadow-lg border rounded-t-lg md:rounded-lg p-3 z-50 transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full md:translate-y-0"
        } md:translate-y-0 w-80  max-w-sm mx-auto md:w-auto`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center mb-2 md:hidden">
          <h4 className="font-bold text-blue-950">Chat</h4>
          <button className="text-gray-500" onClick={() => setOpen(!open)}>✖</button>
        </div>

        {/* Messages */}
        <div
          className="overflow-y-auto space-y-2 mb-2"
          style={{ maxHeight: '200px' }}
        >
          {msgs.map((m) => (
            <div key={m._id || Math.random()} className="text-sm">
              <strong>{m.senderName}:</strong> {m.text}
            </div>
          ))}
        </div>

        {/* Input and send button */}
        <div className="flex gap-2 mb-2 ">
          <input
            className="flex-1 border p-2 rounded text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="How can I help you?"
          />
          <button
            onClick={send}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Send
          </button>
        </div>

        {/* WhatsApp link */}
        <div className="flex items-center gap-2 mt-2">
          <a href="https://wa.me/16195680175" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={28} color="green" />
          </a>
          <p className="text-sm">Chat with us on WhatsApp!</p>
        </div>
      </div>
    </>
  );
}
