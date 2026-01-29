import React, { useEffect, useState } from 'react';
import API from '../../api';

import { Link } from 'react-router-dom';

export default function ShipmentsList() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function fetchShipments() {
      try {
        // ✅ Updated path to match backend
        const res = await API.get('/api/shipment');
        setList(res.data); // backend returns array directly
      } catch (err) {
        setMsg('Failed to load shipments: ' + (err.response?.data?.error || err.message));
      }
    }
    fetchShipments();
  }, []);

  return (
    <div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Shipments</h2>
        {msg && <p className="mb-4 text-red-600">{msg}</p>}
        <div className="grid gap-3">
          {list.map(s => (
            <div key={s._id} className="p-3 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-semibold">{s.trackingCode}</div>
                <div className="text-sm text-gray-600">
                  {s.recipient?.name} • {s.status}
                </div>
              </div>
              <div>
                {/* ✅ Use _id for route params */}
                <Link to={`/shipment/${s.trackingCode}`} className="text-blue-600 underline">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <>
      
      </>
      
    </div>
  );
}
