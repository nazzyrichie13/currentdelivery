
import React, { useState } from 'react';
import API from '../../api';

export default function CreateShipmentWithInvoice() {
  const [sender, setSender] = useState({ name:'', email:'', phone:'', address:'' });
  const [recipient, setRecipient] = useState({ name:'', email:'', phone:'', address:'' });
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [packageType, setPackageType] = useState('box');
  const [quantity, setQuantity] = useState(1);
  const [shippingService, setShippingService] = useState('standard');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);

  const [msg, setMsg] = useState('');
  const [createdShipment, setCreatedShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Create Shipment
  const submitShipment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setErrorMsg('');

    const fd = new FormData();
    fd.append('sender', JSON.stringify(sender));
    fd.append('recipient', JSON.stringify(recipient));
    fd.append('description', description);
    fd.append('weight', weight);
    fd.append('packageType', packageType);
    fd.append('quantity', quantity);
    fd.append('shippingService', shippingService);
    fd.append('expectedDeliveryDate', expectedDeliveryDate);
    fd.append(
  'destination',
  JSON.stringify({ text: destination })
);
    fd.append('price', price);
    if (file) fd.append('file', file); // <-- must be "file"


    try {
      const res = await API.post('/api/shipment', fd);
      setMsg('Shipment created: ' + res.data.shipment.trackingCode);
      setCreatedShipment(res.data.shipment);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download Invoice
  const downloadInvoice = async () => {
    if (!createdShipment) return;
    setInvoiceLoading(true);
    try {
      const res = await API.get(`/api/invoice/download/${createdShipment.trackingCode}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${createdShipment.trackingCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Invoice not available.');
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Shipment (Admin)</h2>

      <form onSubmit={submitShipment} className="space-y-4">

        {/* Sender & Recipient */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">Sender</h4>
            <input placeholder="Name" className="w-full border p-2" value={sender.name} onChange={e=>setSender({...sender, name:e.target.value})} />
            <input placeholder="Email" className="w-full border p-2 mt-1" value={sender.email} onChange={e=>setSender({...sender, email:e.target.value})} />
            <input placeholder="Phone" className="w-full border p-2 mt-1" value={sender.phone} onChange={e=>setSender({...sender, phone:e.target.value})} />
            <input placeholder="Address" className="w-full border p-2 mt-1" value={sender.address} onChange={e=>setSender({...sender, address:e.target.value})} />
          </div>
          <div>
            <h4 className="font-semibold">Recipient</h4>
            <input placeholder="Name" className="w-full border p-2" value={recipient.name} onChange={e=>setRecipient({...recipient, name:e.target.value})} />
            <input placeholder="Email" className="w-full border p-2 mt-1" value={recipient.email} onChange={e=>setRecipient({...recipient, email:e.target.value})} />
            <input placeholder="Phone" className="w-full border p-2 mt-1" value={recipient.phone} onChange={e=>setRecipient({...recipient, phone:e.target.value})} />
            <input placeholder="Address" className="w-full border p-2 mt-1" value={recipient.address} onChange={e=>setRecipient({...recipient, address:e.target.value})} />
          </div>
        </div>

        {/* Package */}
        <div>
          <h4 className="font-semibold">Package</h4>
          <input placeholder="Description" className="w-full border p-2" value={description} onChange={e=>setDescription(e.target.value)} />
          <input placeholder="Weight" type="number" className="w-full border p-2 mt-1" value={weight} onChange={e=>setWeight(e.target.value)} />
          <div className="grid grid-cols-2 gap-2 mt-1">
            <select className="border p-2" value={packageType} onChange={e=>setPackageType(e.target.value)}>
              <option value="box">Box</option>
              <option value="envelope">Envelope</option>
              <option value="pallet">Pallet</option>
            </select>
            <input type="number" min="1" placeholder="Quantity" className="border p-2" value={quantity} onChange={e=>setQuantity(e.target.value)} />
          </div>
          <input type="file" accept="image/*" className="mt-2" onChange={e=>setFile(e.target.files[0])} />
        </div>

        {/* Service */}
        <div>
          <h4 className="font-semibold">Shipping Service</h4>
          <select className="w-full border p-2" value={shippingService} onChange={e=>setShippingService(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="same_day">Same Day</option>
          </select>
          <input type="date" className="w-full border p-2 mt-1" value={expectedDeliveryDate} onChange={e=>setExpectedDeliveryDate(e.target.value)} />
        </div>

        {/* Destination & Price */}
        <input placeholder="Destination" className="w-full border p-2" value={destination} onChange={e=>setDestination(e.target.value)} />
        <input type="number" placeholder="Price" className="w-full border p-2" value={price} onChange={e=>setPrice(e.target.value)} />

        <button className="bg-green-600 text-white px-4 py-2 rounded mt-2" disabled={loading}>
          {loading ? 'Creating...' : 'Create Shipment'}
        </button>

        {msg && <p className="mt-2 text-green-600">{msg}</p>}
        {errorMsg && <p className="mt-2 text-red-500">{errorMsg}</p>}
      </form>

      {/* Download Invoice */}
      {createdShipment && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Download Invoice</h3>
          <p>Tracking Code: <strong>{createdShipment.trackingCode}</strong></p>
          <button
            onClick={downloadInvoice}
            disabled={invoiceLoading}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {invoiceLoading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      )}
    </div>
  );
}
