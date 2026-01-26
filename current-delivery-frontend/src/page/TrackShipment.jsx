import { useState } from 'react';
import API from '../api';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TrackShipment() {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function go() {
    setErr('');
    if (!code) return setErr('Enter tracking code');

    try {
      // ✅ Updated API path to match backend
      const res = await API.get(`/api/track/${code}`);

      // ✅ Navigate using shipment _id returned by backend
      const shipment = res.data.shipment || res.data;
      nav(`/shipment/${shipment._id}`);
    } catch (err) {
      setErr('Shipment not found: ' + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div>
      <div className="max-w-md mx-auto p-6 bg-white mt-12 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Track Shipment</h2>
        <input
          className="w-full border p-2"
          placeholder="Enter tracking number..."
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded w-full flex justify-center gap-3 font-bold"
          onClick={go}
        >
          Track <Search />
        </button>
        {err && <p className="text-red-500 mt-2">{err}</p>}
      </div>
    </div>
  );
}
