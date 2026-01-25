import { useState } from "react";
import Chatbox from "../component/ChatBox";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Thank you for contacting Fortress Bank. We'll reply soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8">
        Have questions, feedback, or need assistance? Our dedicated support team is 
        here to help you 24/7. Reach out to us through the form below or connect 
        directly via email and phone.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>

      <div className="mt-10 bg-blue-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-blue-700 mb-3">Other Ways to Reach Us</h2>
        <p className="text-gray-700 mb-2">📧 Email: support@currentdelivery.com</p>
        <p className="text-gray-700 mb-2">📞 Phone: +1 (800) 123-4567</p>
        <p className="text-gray-700">🏢 Address: 121 Main Street louisville, KY,USA.</p>
      </div>
      <div>
        <Chatbox/>
    </div>

    </div>
    
  );
}
