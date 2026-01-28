import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import io from 'socket.io-client';

import ChatBox from '../component/ChatBox';
import Barcode from 'react-barcode';
import { Link } from 'react-router-dom';
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

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

export default function ShipmentDetails() {
  const { trackingCode } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchShipment = async () => {
      try {
        // Force uppercase to match DB tracking code
        const code = trackingCode.toUpperCase();
        const res = await API.get(`/api/shipment/track/${code}`);

        if (!mounted) return;

        if (!res.data.shipment) {
          setErrorMsg('Shipment not found.');
        } else {
          setShipment(res.data.shipment);
        }
      } catch (err) {
        console.error('Error fetching shipment:', err.response?.data || err.message);
        if (err.response?.status === 404) {
          setErrorMsg('Shipment not found.');
        } else {
          setErrorMsg('Failed to load shipment.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();

    // Socket live location updates
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

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading shipment…</div>;
  }

  if (errorMsg) {
    return <div className="p-6 text-center text-red-500">{errorMsg}</div>;
  }

  const progress = getShipmentProgress(shipment.status);
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
  



  return (
    <div>
      
      <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white mt-6 rounded shadow">
        {/* Barcode */}
        <div className="relative w-full sm:max-w-xs mx-auto p-4 bg-gray-100 rounded shadow mb-6">
          <h3 className="text-center font-semibold mb-4 text-sm sm:text-base">Tracking Code</h3>
          <Barcode
            value={shipment.trackingCode}
            format="CODE128"
            width={1.5}
            height={60}
            displayValue
            background="#f9f9f9"
            lineColor="#111"
          />
        </div>

        {/* Shipment Info */}
        <h2 className="text-lg sm:text-xl font-bold">Shipment {shipment.trackingCode}</h2>
        <p>Status: <strong>{shipment.status}</strong></p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Delivery Progress</span>
            <span className="text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${colors[shipment.status] || 'bg-gray-400'} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {shipment.status === 'on_hold' && (
          <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
            🚧 Shipment is currently on hold.
          </div>
        )}

        {/* Sender / Recipient / Package */}
        
               {/* Sender / Recipient / Package */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

  {/* LEFT: DETAILS */}
  <div className="space-y-3 text-sm sm:text-base">

    <div>
      <h4 className="font-semibold text-blue-300">Sender infomation</h4>
      <p className="text-gray-500">{shipment.sender.name}</p>
      <p className="text-gray-500">{shipment.sender.email}</p>
      <p className="text-gray-500">{shipment.sender.address}</p>
    </div>

    <div>
      <h4 className="font-semibold text-blue-300">Recipient </h4>
      <p className="text-gray-500">{shipment.recipient.name}</p>
      <p className="text-gray-500">{shipment.recipient.email}</p>
       <p className="text-gray-500">{shipment.recipient.phone }</p>
      <p className="text-gray-500">{shipment.recipient.address}</p>
    </div>

    <div>
      <h4 className="font-semibold text-blue-300">Package Details</h4>
      <p><strong> Package Description:</strong> {shipment.package.description}</p>
      <p><strong>Package Service Type:</strong> {shipment.package.serviceType}</p>
      <p><strong> Package quantity:</strong> {shipment.package.quantity}</p>
      <p><strong> Package Weight:</strong> {shipment.package.weight} kg</p>
      <p><strong>Shipping Cost:</strong> ${shipment.price}</p>
    </div>

    <div>
      <h4 className="font-semibold text-blue-300">Shipping Details</h4>
      <p><strong>Service:</strong> {shipment.shippingService}</p>
      <p>
        <strong className='text-blue-950'>Expected Delivery:</strong>{' '}
        {shipment.expectedDeliveryDate
          ? new Date(shipment.expectedDeliveryDate).toDateString()
          : 'N/A'}
      </p>
      <p>
        <strong className='text-green-400'>Confirmed Delivery:</strong>{' '}
        {shipment.deliveryDate
          ? new Date(shipment.deliveryDate).toDateString()
          : 'Not yet'}
      </p>
    </div>

    <div>
      <h4 className="font-semibold text-blue-300"> Package Destination</h4>
      <p>{shipment.destination?.text || 'N/A'}</p>
    </div>

    <div>
      <h4 className="font-semibold text-blue-300">Current Location</h4>
      <p>{shipment.location?.text || 'N/A'}</p>
      <p className="text-xs text-gray-500">
        Last updated:{' '}
        {shipment.location?.updatedAt
          ? new Date(shipment.location.updatedAt).toLocaleString()
          : '—'}
      </p>
    </div>
  </div>

  {/* RIGHT: PACKAGE IMAGE + MAP */}
  <div className="space-y-3">

    {/* 📦 Package Image */}
    {shipment.package.imageUrl && (
      <div>
        <h4 className="font-semibold text-sm mb-1 text-blue-300">Package Image</h4>
        <img
          src={shipment.package.imageUrl}
          alt="Package"
          className="w-full h-48 object-cover rounded border"
        />
      </div>
    )}

    {/* 🗺 Map */}
    <div className="h-64 sm:h-80 md:h-96">
      {shipment.location?.coords ? (
        <MapContainer
          center={[
            shipment.location.coords.lat,
            shipment.location.coords.lng
          ]}
          zoom={13}
          className="leaflet-container w-full h-full rounded"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[
              shipment.location.coords.lat,
              shipment.location.coords.lng
            ]}
          >
            <Popup>
              <strong className='text-red-700'>Status:</strong> {shipment.status}<br />
              {shipment.location.text}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="p-4 text-sm text-gray-500 border rounded">
          No location yet
        </div>
      )}
    </div>
  </div>
</div>


        {/* Chat */}
        <div className="mt-6">
          <h3 className=" bg-green-500 text-white font-semibold text-base sm:text-lg">Chat</h3>
          <ChatBox room={`shipment_${shipment._id}`}  />
          <Link to={'/reschdule'} className='font-bold text-amber-950' >Do you want to reschdule delivery Date? click here!!!</Link>
        </div>
      </div>
    </div>
  );
}
