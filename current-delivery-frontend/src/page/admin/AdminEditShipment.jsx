import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';

export default function EditShipment() {
  const { id } = useParams();

  const [shipment, setShipment] = useState(null);
  const [status, setStatus] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  /* ================== LOAD SHIPMENT ================== */
  useEffect(() => {
    let mounted = true;

    const loadShipment = async () => {
      try {
        const res = await API.get(`/api/shipment/${id}`);

        if (!mounted) return;

        const s = res.data; // backend returns shipment directly

        setShipment(s);
        setStatus(s.status ?? '');
        setLat(s.location?.coords?.lat ?? '');
        setLng(s.location?.coords?.lng ?? '');
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.error || 'Failed to load shipment');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadShipment();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ================== UPDATE SHIPMENT ================== */
  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const payload = {
        status,
        location: {
          coords: {
            lat: lat !== '' ? parseFloat(lat) : undefined,
            lng: lng !== '' ? parseFloat(lng) : undefined
          },
          updatedAt: new Date()
        }
      };

      const res = await API.put(`/api/shipment/${id}`, payload);
      setShipment(res.data);
      setMsg('Shipment updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update shipment');
    }
  };

  /* ================== UI STATES ================== */
  if (loading) {
    return <div className="p-6 text-center">Loading shipment…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="p-6 text-center text-gray-500">
        Shipment not found
      </div>
    );
  }

  /* ================== FORM ================== */
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white mt-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Edit Shipment Status & Location
      </h2>

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

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Shipment
        </button>

        {msg && <p className="text-green-700 text-sm">{msg}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}
