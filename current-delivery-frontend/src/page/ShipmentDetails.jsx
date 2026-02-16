
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import ChatBox from '../component/ChatBox';
import 'leaflet/dist/leaflet.css';
import Barcode from 'react-barcode';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../component/LanguageSwitcher';

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
    cancelled: 0,
  };
  return map[status] ?? 0;
}

// Helper for safe values
const safe = (value, fallback = '-') => value ?? fallback;

export default function ShipmentDetails() {
  const { t } = useTranslation();
  const { trackingCode } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchShipment = async () => {
      try {
        const code = trackingCode.toUpperCase();
        const res = await API.get(`/api/shipment/track/${code}`);

        if (!mounted) return;

        if (!res.data.shipment) {
          setErrorMsg(t('Shipment not found.'));
        } else {
          setShipment(res.data.shipment);
        }
      } catch (err) {
        console.error('Error fetching shipment:', err.response?.data || err.message);
        setErrorMsg(err.response?.status === 404 ? t('Shipment not found.') : t('Failed to load shipment.'));
      } finally {
        setLoading(false);
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
  }, [trackingCode, t]);

  if (loading) return <div className="p-6 text-center text-gray-500">{t('Loading shipment…')}</div>;
  if (errorMsg) return <div className="p-6 text-center text-red-500">{errorMsg}</div>;

  const progress = getShipmentProgress(shipment?.status);
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
    <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white mt-6 rounded shadow">
      <LanguageSwitcher />

      {/* Barcode */}
      <div className="relative w-full sm:max-w-xs mx-auto p-4 bg-gray-100 rounded shadow mb-6">
        <h3 className="text-center font-semibold mb-4 text-sm sm:text-base">{t('Tracking Code')}</h3>
        <Barcode
          value={safe(shipment?.trackingCode)}
          format="CODE128"
          width={1.5}
          height={60}
          displayValue
          background="#f9f9f9"
          lineColor="#111"
        />
      </div>

      {/* Shipment Info */}
      <h2 className="text-lg sm:text-xl font-bold">{t('Shipment')} {safe(shipment?.trackingCode)}</h2>
      <p>{t('Status')}: <strong>{safe(shipment?.status)}</strong></p>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">{t('Delivery Progress')}</span>
          <span className="text-gray-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${colors[shipment?.status] || 'bg-gray-400'} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {shipment?.status === 'on_hold' && (
        <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
          🚧 {t('Shipment is currently on hold.')}
        </div>
      )}

      {/* Sender / Recipient / Package */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="space-y-3 text-sm sm:text-base">
          {/* Sender */}
          <div>
            <h4 className="font-semibold text-blue-300">{t('Sender Information')}</h4>
            <p className="text-gray-500">{safe(shipment?.sender?.name, t('N/A'))}</p>
            <p className="text-gray-500">{safe(shipment?.sender?.email)}</p>
            <p className="text-gray-500">{safe(shipment?.sender?.address)}</p>
          </div>

          {/* Recipient */}
          <div>
            <h4 className="font-semibold text-blue-300">{t('Recipient')}</h4>
            <p className="text-gray-500">{safe(shipment?.recipient?.name, t('N/A'))}</p>
            <p className="text-gray-500">{safe(shipment?.recipient?.email)}</p>
            <p className="text-gray-500">{safe(shipment?.recipient?.phone)}</p>
            <p className="text-gray-500">{safe(shipment?.recipient?.address)}</p>
          </div>

          {/* Package */}
          <div>
            <h4 className="font-semibold text-blue-300">{t('Package Details')}</h4>
            <p className="text-gray-500"><strong>{t('Package Description')}:</strong> {safe(shipment?.package?.description)}</p>
            <p className="text-gray-500"><strong>{t('Package Service Type')}:</strong> {safe(shipment?.package?.serviceType)}</p>
            <p className="text-gray-500"><strong>{t('Package Quantity')}:</strong> {safe(shipment?.package?.quantity)}</p>
            <p className="text-gray-500"><strong>{t('Package Weight')}:</strong> {safe(shipment?.package?.weight)} kg</p>
            <p className="text-gray-500"><strong>{t('Shipping Cost')}:</strong> ${safe(shipment?.price)}</p>
          </div>

          {/* Shipping Details */}
          <div>
            <h4 className="font-semibold text-blue-300">{t('Shipping Details')}</h4>
            <p className="text-gray-500"><strong>{t('Service')}:</strong> {safe(shipment?.shippingService)}</p>
            <p className="text-gray-500">
              <strong className='text-blue-950'>{t('Expected Delivery')}:</strong>{' '}
              {shipment?.expectedDeliveryDate ? new Date(shipment.expectedDeliveryDate).toDateString() : t('N/A')}
            </p>
            <p className="text-gray-500">
              <strong className='text-green-400'>{t('Confirmed Delivery')}:</strong>{' '}
              {shipment?.deliveryDate ? new Date(shipment.deliveryDate).toDateString() : t('Not yet')}
            </p>
          </div>

          {/* Package Destination */}
          <div>
            <h4 className="font-semibold text-blue-300">{t('Package Destination')}</h4>
            <p className="text-gray-500">{safe(shipment?.destination?.text, t('N/A'))}</p>
          </div>

          {/* Current Location */}
          <div>
            <h4 className="font-semibold text-blue-300">{t('Current Location')}</h4>
            <p className="text-gray-500">{safe(shipment?.location?.text, t('N/A'))}</p>
            <p className="text-xs text-gray-500">
              {t('Last updated')}: {shipment?.location?.updatedAt ? new Date(shipment.location.updatedAt).toLocaleString() : '—'}
            </p>
          </div>
        </div>

        {/* Right Side: Package Image + Map */}
        <div className="space-y-3">
          {shipment?.package?.imageUrl && (
            <div>
              <h4 className="font-semibold text-sm mb-1 text-blue-300">{t('Package Image')}</h4>
              <img src={shipment.package.imageUrl} alt="Package" className="w-full h-48 object-cover rounded border" />
            </div>
          )}

          <div className="h-64 sm:h-80 md:h-96">
            {shipment?.location?.coords ? (
              <MapContainer
                center={[shipment.location.coords.lat, shipment.location.coords.lng]}
                zoom={13}
                className="leaflet-container w-full h-full rounded"
              >
                <TileLayer
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[shipment.location.coords.lat, shipment.location.coords.lng]}>
                  <Popup>
                    <strong className='text-red-700'>{t('Status')}:</strong> {safe(shipment?.status)}<br />
                    {safe(shipment?.location?.text)}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="p-4 text-sm text-gray-500 border rounded">{t('No location yet')}</div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="mt-6">
        <h3 className="bg-green-500 text-white font-semibold text-base sm:text-lg">{t('Chat')}</h3>
        <ChatBox room={`shipment_${shipment?._id}`} />
        <Link to={'/reschdule'} className='font-bold text-amber-950'>
          {t('Do you want to reschedule delivery Date? click here!!!')}
        </Link>
      </div>
    </div>
  );
}
