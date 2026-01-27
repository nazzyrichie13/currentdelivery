import React, { useState } from 'react';
import API from '../../api';

export default function CreateShipment() {
  const [sender, setSender] = useState({ name:'', email:'', phone:'', address:'' });
  const [recipient, setRecipient] = useState({ name:'', email:'', phone:'', address:'' });

  // 📦 package
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [packageType, setPackageType] = useState('box');
  const [quantity, setQuantity] = useState(1);

  // 🚚 service
  const [shippingService, setShippingService] = useState('standard');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  // 🎯 destination
  const [destination, setDestination] = useState('');

  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMsg('');

    const fd = new FormData();
    fd.append('sender', JSON.stringify(sender));
    fd.append('recipient', JSON.stringify(recipient));

    // package
    fd.append('description', description);
    fd.append('weight', weight);
    fd.append('packageType', packageType);
    fd.append('quantity', quantity);

    // service
    fd.append('shippingService', shippingService);
    fd.append('expectedDeliveryDate', expectedDeliveryDate);

    // destination
    fd.append('destination', destination);

    fd.append('price', price);
    if (file) fd.append('packageImage', file);

    try {
      const res = await API.post('/api/shipment', fd);
      setMsg('Created: ' + res.data.shipment.trackingCode);
    } catch (e) {
      setMsg('Error: ' + (e.response?.data?.error || e.message));
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Shipment (Admin)</h2>

      <form onSubmit={submit} className="space-y-4">

        {/* Sender & Recipient */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">Sender</h4>
            <input className="w-full border p-2" placeholder="Name"
              value={sender.name}
              onChange={e=>setSender({...sender, name:e.target.value})} />
            <input className="w-full border p-2 mt-1" placeholder="Email"
              value={sender.email}
              onChange={e=>setSender({...sender, email:e.target.value})} />
            <input className="w-full border p-2 mt-1" placeholder="Phone"
              value={sender.phone}
              onChange={e=>setSender({...sender, phone:e.target.value})} />
            <input className="w-full border p-2 mt-1" placeholder="Address"
              value={sender.address}
              onChange={e=>setSender({...sender, address:e.target.value})} />
          </div>

          <div>
            <h4 className="font-semibold">Recipient</h4>
            <input className="w-full border p-2" placeholder="Name"
              value={recipient.name}
              onChange={e=>setRecipient({...recipient, name:e.target.value})} />
            <input className="w-full border p-2 mt-1" placeholder="Email"
              value={recipient.email}
              onChange={e=>setRecipient({...recipient, email:e.target.value})} />
            <input className="w-full border p-2 mt-1" placeholder="Phone"
              value={recipient.phone}
              onChange={e=>setRecipient({...recipient, phone:e.target.value})} />
            <input className="w-full border p-2 mt-1" placeholder="Address"
              value={recipient.address}
              onChange={e=>setRecipient({...recipient, address:e.target.value})} />
          </div>
        </div>

        {/* Package */}
        <div>
          <h4 className="font-semibold">Package</h4>

          <input className="w-full border p-2" placeholder="Description"
            value={description}
            onChange={e=>setDescription(e.target.value)} />

          <input className="w-full border p-2 mt-1" type="number" placeholder="Weight (kg)"
            value={weight}
            onChange={e=>setWeight(e.target.value)} />

          <div className="grid grid-cols-2 gap-2 mt-1">
            <select className="border p-2"
              value={packageType}
              onChange={e=>setPackageType(e.target.value)}>
              <option value="box">Box</option>
              <option value="envelope">Envelope</option>
              <option value="pallet">Pallet</option>
            </select>

            <input className="border p-2" type="number" min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={e=>setQuantity(e.target.value)} />
          </div>

          <input type="file" accept="image/*" className="mt-2"
            onChange={e=>setFile(e.target.files[0])} />
        </div>

        {/* Service */}
        <div>
          <h4 className="font-semibold">Shipping Service</h4>
          <select className="w-full border p-2"
            value={shippingService}
            onChange={e=>setShippingService(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="same_day">Same Day</option>
          </select>

          <input className="w-full border p-2 mt-1" type="date"
            value={expectedDeliveryDate}
            onChange={e=>setExpectedDeliveryDate(e.target.value)} />
        </div>

        {/* Destination */}
        <div>
          <h4 className="font-semibold">Destination</h4>
          <input className="w-full border p-2"
            placeholder="City, Country"
            value={destination}
            onChange={e=>setDestination(e.target.value)} />
        </div>

        {/* Price */}
        <input className="w-full border p-2" type="number"
          placeholder="Price"
          value={price}
          onChange={e=>setPrice(e.target.value)} />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Create Shipment
        </button>

        {msg && <p className="mt-2">{msg}</p>}
      </form>
    </div>
  );
}
