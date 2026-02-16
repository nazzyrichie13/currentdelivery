import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Link } from 'react-router-dom';

export default function ShipmentsList() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function fetchShipments() {
      try {
        const res = await API.get('/api/shipment');
        // ✅ Filter out any invalid or null shipment objects
        const validShipments = Array.isArray(res.data)
          ? res.data.filter(s => s && s.trackingCode)
          : [];
        setList(validShipments);
      } catch (err) {
        setMsg(
          'Failed to load shipments: ' + (err.response?.data?.error || err.message)
        );
      }
    }
    fetchShipments();
  }, []);

  if (!list.length && !msg) {
    return <p className="p-6 text-gray-500">No shipments available.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Shipments</h2>
      {msg && <p className="mb-4 text-red-600">{msg}</p>}
      <div className="grid gap-3">
        {list.map((s, i) => (
          <div
            key={s._id || i}
            className="p-3 bg-white rounded shadow flex justify-between"
          >
            <div>
              <div className="font-semibold">{s.trackingCode || 'N/A'}</div>
              <div className="text-sm text-gray-600">
                {s.recipient?.name || 'No recipient'} • {s.status || 'Unknown status'}
              </div>
            </div>
            <div>
              <Link
                to={`/shipment/${s.trackingCode || ''}`}
                className="text-blue-600 underline"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
