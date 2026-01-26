import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"// your Axios instance

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
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
      const res = await API.post("/auth/register", { name, email, password, role });
      // save token in localStorage
      localStorage.setItem("token", res.data.token);
      setSuccess(`Signup successful! Welcome ${res.data.user.name}`);
      setTimeout(() => nav("/"), 1500); // redirect to home after 1.5s
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white mt-12 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <input
          type="text"
          placeholder="Name"
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

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <span className="text-blue-600 cursor-pointer" onClick={() => nav("/login")}>
          Login
        </span>
      </p>
    </div>
  );
}
