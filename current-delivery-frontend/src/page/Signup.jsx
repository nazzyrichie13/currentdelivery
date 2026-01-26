import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // your Axios instance

export default function Signup({ admin = false }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      return setError("All fields are required");
    }

    try {
      // Choose endpoint based on admin or user signup
      const endpoint = admin ? "/api/admin/signup" : "/api/auth/register";
      const res = await API.post(endpoint, { name, email, password });

      // Save token for user signup only (admin login separate)
      if (!admin && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setSuccess(
        admin
          ? `Admin created successfully: ${res.data.admin.name}`
          : `Signup successful! Welcome ${res.data.user.name}`
      );

      // Redirect after short delay
      setTimeout(() => nav(admin ? "/admin" : "/"), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white mt-12 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {admin ? "Admin Signup" : "Create Account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {admin ? "Create Admin" : "Sign Up"}
        </button>
      </form>

      {!admin && (
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => nav("/login")}
          >
            Login
          </span>
        </p>
      )}
    </div>
  );
}
