import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';


export default function Login({ admin=false }){
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [err, setErr] = useState('');
const nav = useNavigate();


async function handle(e){
e.preventDefault();
try{
const res = await API.post('/auth/login', { email, password });
localStorage.setItem('token', res.data.token);
localStorage.setItem('user', JSON.stringify(res.data.user));
if (res.data.user.role === 'admin') nav('/admin'); else nav('/track');
}catch(e){ setErr(e.response?.data?.error || e.message); }
}


return (
<div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
<h2 className="text-xl font-bold mb-4">{admin? 'Admin Login' : 'Login'}</h2>
<form onSubmit={handle} className="space-y-3">
<input className="w-full border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="w-full border p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
</form>
{err && <p className="text-red-500 mt-2">{err}</p>}
</div>
);
}