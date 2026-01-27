import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import io from 'socket.io-client';
import Nav from '../component/Nav';
import ChatBox from '../component/ChatBox';
import Barcode from 'react-barcode';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000'); // match backend port

function getShipmentProgress(status) {
  const map = {
    created: 10,
    scheduled: 20,
    rescheduled: 25,
    in_transit: 50,
    on_hold: 50,
    out_for_delivery: 80,
    delivered: 100,
    cancelled: 0
  };
  return map[status] ?? 0;
}

function RescheduleSection({ shipment, setShipment }) {
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const hasPending = shipment.rescheduleRequests?.some(r => r.status === 'pending');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await API.post(`/api/shipment/${shipment._id}/reschedule-request`, { requestedDate: date, reason });
      setShipment(prev => ({
        ...prev,
        rescheduleRequests: [...(prev.rescheduleRequests || []), res.data.request]
      }));
      setMsg('Reschedule request submitted');
      setDate('');
      setReason('');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded">
      <h3 className="font-semibold mb-2 text-base sm:text-lg">Reschedule Delivery</h3>
      {hasPending && <p className="text-yellow-600 text-sm">You already have a pending reschedule request.</p>}
      {!hasPending && (
        <form onSubmit={submit} className="space-y-2">
          <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="border p-2 w-full rounded" />
          <textarea placeholder="Reason (optional)" value={reason} onChange={e => setReason(e.target.value)} className="border p-2 w-full rounded" />
          <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            {loading ? 'Submitting...' : 'Request Reschedule'}
          </button>
          {msg && <p className="text-sm mt-1">{msg}</p>}
        </form>
      )}
    </div>
  );
}

function ShipmentProgress({ status }) {
  const progress = getShipmentProgress(status);
  const colors = {
    created: 'bg-gray-400',
    scheduled: 'bg-blue-400',
    rescheduled: 'bg-blue-500',
    in_transit: 'bg-indigo-500',
    on_hold: 'bg-yellow-500',
    out_for_delivery: 'bg-orange-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };
  const barColor = colors[status] || 'bg-gray-400';

  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">Delivery Progress</span>
        <span className="text-gray-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`${barColor} h-3 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function ShipmentDetails() {
  const { trackingCode } = useParams();
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
  let mounted = true;
  let retries = 0;

  const fetchShipment = async () => {
    try {
      const res = await API.get(`/api/track/${trackingCode}`);
      if (!mounted) return;
      setShipment(res.data.shipment);
    } catch (err) {
      if (retries < 5) {
        retries++;
        setTimeout(fetchShipment, 800);
      }
      console.log(err);
    }
  };

  fetchShipment();

  socket.emit('join_room', { room: `tracking_${trackingCode}` });

  socket.on('location_update', data => {
    setShipment(prev =>
      prev ? { ...prev, location: data.location } : prev
    );
  });

  return () => {
    mounted = false;
    socket.off('location_update');
  };
}, [trackingCode]);

  if (!shipment) {
  return (
    <div className="p-6 text-center text-gray-500">
      Loading shipment details…
    </div>
  );
}


  return (
    <div>
      <Nav />
      <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white mt-6 rounded shadow">
        <div className="relative w-full sm:max-w-xs mx-auto p-4 bg-gray-100 rounded shadow mb-6">
          <h3 className="text-center font-semibold mb-4 text-sm sm:text-base">Tracking Code</h3>
          <Barcode value={shipment.trackingCode} format="CODE128" width={1.5} height={60} displayValue background="#f9f9f9" lineColor="#111" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold">Shipment {shipment.trackingCode}</h2>
        <p>Status: <strong>{shipment.status}</strong></p>

        <ShipmentProgress status={shipment.status} />

        {shipment.status === 'on_hold' && (
          <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
            🚧 Shipment is currently on hold.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-semibold text-sm sm:text-base">Sender</h4>
            <p>{shipment.sender.name}</p>
            <h4 className="font-semibold mt-3 text-sm sm:text-base">Recipient</h4>
            <p>{shipment.recipient.name}</p>
            <h4 className="font-semibold mt-3 text-sm sm:text-base">Package</h4>
            <p>{shipment.package.description}</p>
            <p>Price: ${shipment.price}</p>
          </div>
          <div className="h-64 sm:h-80 md:h-96">
            {shipment.location?.coords ? (
              <MapContainer center={[shipment.location.coords.lat, shipment.location.coords.lng]} zoom={13} className="leaflet-container w-full h-full rounded">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[shipment.location.coords.lat, shipment.location.coords.lng]}>
                  <Popup>{shipment.status}</Popup>
                </Marker>
              </MapContainer>
            ) : <div className="p-4 text-sm text-gray-500">No location yet</div>}
          </div>
        </div>

        <RescheduleSection shipment={shipment} setShipment={setShipment} />

        <div className="mt-6">
          <h3 className="font-semibold text-base sm:text-lg">Chat</h3>
          <ChatBox room={`shipment_${shipment._id}`} />
        </div>
      </div>
    </div>
  );
}
