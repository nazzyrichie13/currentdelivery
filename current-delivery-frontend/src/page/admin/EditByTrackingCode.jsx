import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditByTrackingCode() {
  const [code, setCode] = useState(''); // <-- THIS is required
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-6 bg-white mt-12 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Shipment by Tracking Code</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Enter tracking code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />

      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={() => {
          if (!code) return alert("Enter tracking code");
          navigate(`/admin/shipments/edit/${code}`); // navigate to your EditShipment page
        }}
      >
        Edit
      </button>
    </div>
  );
}
