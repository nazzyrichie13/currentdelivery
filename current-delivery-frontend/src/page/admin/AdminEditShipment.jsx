import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../api';

export default function EditShipment() {
  const { t } = useTranslation();
  const { trackingCode } = useParams();

  const [shipment, setShipment] = useState(null);
  const [status, setStatus] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locationText, setLocationText] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // ------------------ LOAD SHIPMENT ------------------
  useEffect(() => {
    let mounted = true;

    const fetchShipment = async () => {
      if (!trackingCode) {
        setMsg(t('Tracking code is missing.'));
        setLoading(false);
        return;
      }

      try {
        const code = trackingCode.toUpperCase();
        const res = await API.get(`/api/shipment/track/${code}`);
        if (!mounted) return;

        const s = res.data.shipment || res.data;
        setShipment(s);
        setStatus(s?.status || '');
        setLat(s?.location?.coords?.lat || '');
        setLng(s?.location?.coords?.lng || '');
        setLocationText(s?.location?.text || '');
      } catch (err) {
        setMsg(
          t('Failed to load shipment') + ': ' + (err.response?.data?.error || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
    return () => { mounted = false; };
  }, [trackingCode, t]);

  // ------------------ UPDATE STATUS / LOCATION ------------------
  const submit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!shipment?.trackingCode) {
      setMsg(t('Shipment tracking code missing.'));
      return;
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) {
      setMsg(t('Invalid coordinates.'));
      return;
    }

    try {
      const payload = {
        status,
        location: {
          coords: { lat: latitude, lng: longitude },
          text: locationText,
          updatedAt: new Date(),
        },
      };

      const res = await API.put(`/api/shipment/track/${shipment.trackingCode}`, payload);
      const updatedShipment = res.data.shipment || res.data;
      setShipment(updatedShipment);
      setMsg(t('Shipment updated successfully'));

      // Auto-hide message after 5s
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      setMsg(t('Error') + ': ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">{t('Loading shipment details…')}</div>;
  }

  if (!shipment) {
    return (
      <div className="p-6 text-center text-red-500">
        {msg || t('Shipment not found.')}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white mt-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{t('Edit Shipment Status & Location')}</h2>

      <form onSubmit={submit} className="space-y-4">
        {/* Status */}
        <div>
          <label className="font-semibold">{t('Status')}</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="created">{t('Created')}</option>
            <option value="scheduled">{t('Scheduled')}</option>
            <option value="rescheduled">{t('Rescheduled')}</option>
            <option value="in_transit">{t('In Transit')}</option>
            <option value="on_hold">{t('On Hold')}</option>
            <option value="out_for_delivery">{t('Out For Delivery')}</option>
            <option value="delivered">{t('Delivered')}</option>
            <option value="cancelled">{t('Cancelled')}</option>
          </select>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold">{t('Latitude')}</label>
            <input
              type="number"
              step="0.000001"
              className="w-full border p-2 rounded mt-1"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div>
            <label className="font-semibold">{t('Longitude')}</label>
            <input
              type="number"
              step="0.000001"
              className="w-full border p-2 rounded mt-1"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>
        </div>

        {/* Location text */}
        <div>
          <label className="font-semibold">{t('Current Location Text')}</label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {t('Update Shipment')}
        </button>

        {msg && (
          <p className="mt-2 text-sm text-green-700">
            {msg}
          </p>
        )}
      </form>

      {/* Current details */}
      <div className="mt-6 p-4 bg-gray-50 rounded space-y-1">
        <h3 className="font-semibold">{t('Current Details')}:</h3>
        <p><strong>{t('Tracking Code')}:</strong> {shipment?.trackingCode || 'N/A'}</p>
        <p><strong>{t('Status')}:</strong> {shipment?.status || 'N/A'}</p>
        <p><strong>{t('Latitude')}:</strong> {shipment?.location?.coords?.lat ?? 'N/A'}</p>
        <p><strong>{t('Longitude')}:</strong> {shipment?.location?.coords?.lng ?? 'N/A'}</p>
        <p><strong>{t('Present Location')}:</strong> {shipment?.location?.text || 'N/A'}</p>
        <p>
          <strong>{t('Last Updated')}:</strong>{' '}
          {shipment?.location?.updatedAt
            ? new Date(shipment.location.updatedAt).toLocaleString()
            : 'N/A'}
        </p>
      </div>
    </div>
  );
}
