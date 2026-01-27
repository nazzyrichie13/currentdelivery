import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';

export default function EditShipment() {
  const { trackingCode } = useParams();

  const [shipment, setShipment] = useState(null);
  const [status, setStatus] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // ------------------ LOAD SHIPMENT ------------------
  useEffect(() => {
    let mounted = true;

    const fetchShipment = async () => {
      try {
        const code = trackingCode.toUpperCase();
        const res = await API.get(`/api/shipment/track/${code}`);

        if (!mounted) return;

        if (!res.data.shipment) {
          setMsg('Shipment not found.');
        } else {
          const s = res.data.shipment;
          setShipment(s);
          setStatus(s.status || '');
          setLat(s.location?.coords?.lat || '');
          setLng(s.location?.coords?.lng || '');
        }
      } catch (err) {
        setMsg('Failed to load shipment: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();

    return () => { mounted = false; };
  }, [trackingCode]);

  // ------------------ UPDATE STATUS / LOCATION ------------------
  const submit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!shipment?.trackingCode) {
      setMsg('Shipment tracking code missing.');
      return;
    }

    try {
      const payload = {
        status,
        location: {
          coords: { lat: parseFloat(lat), lng: parseFloat(lng) },
          updatedAt: new Date()
        }
      };

      // Backend endpoint updated to support update by trackingCode
      const res = await API.put(`/api/shipment/track/${shipment.trackingCode}`, payload);
      setShipment(res.data);
      setMsg('Shipment updated successfully');
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading shipment details…</div>;
  }

  if (!shipment) {
    return <div className="p-6 text-center text-red-500">{msg || 'Shipment not found.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white mt-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Shipment Status & Location</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="font-semibold">Status</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="created">Created</option>
            <option value="scheduled">Scheduled</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="in_transit">In Transit</option>
            <option value="on_hold">On Hold</option>
            <option value="out_for_delivery">Out For Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold">Latitude</label>
            <input
              type="number"
              step="0.000001"
              className="w-full border p-2 rounded mt-1"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div>
            <label className="font-semibold">Longitude</label>
            <input
              type="number"
              step="0.000001"
              className="w-full border p-2 rounded mt-1"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Update Shipment</button>
        {msg && <p className="mt-2 text-sm text-green-700">{msg}</p>}
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold">Current Details:</h3>
        <p><strong>Tracking Code:</strong> {shipment.trackingCode}</p>
        <p><strong>Status:</strong> {shipment.status}</p>
        <p><strong>Latitude:</strong> {shipment.location?.coords?.lat || 'N/A'}</p>
        <p><strong>Longitude:</strong> {shipment.location?.coords?.lng || 'N/A'}</p>
      </div>
    </div>
  );
}
