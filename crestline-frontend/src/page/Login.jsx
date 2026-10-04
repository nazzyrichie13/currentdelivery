import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ admin = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');

    if (!email || !password) {
      setErr('Please enter both email and password');
      return;
    }

    try {
      // Use the correct endpoint based on admin or user
      const endpoint = admin ? '/api/admin/login' : '/api/auth/login';
      const res = await API.post(endpoint, { email, password });

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.admin || res.data.user));

      // Navigate based on role
      if (admin) {
        nav('/admin');
      } else {
        nav('/track');
      }
    } catch (error) {
      setErr(error.response?.data?.msg || error.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{admin ? 'Admin Login' : 'User Login'}</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>

      {err && <p className="text-red-500 mt-2">{err}</p>}
    </div>
  );
}
