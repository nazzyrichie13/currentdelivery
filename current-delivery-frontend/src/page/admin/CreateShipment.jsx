import React, { useState } from 'react';
import API from '../../api';
import Nav from '../../component/Nav';

export default function CreateShipment() {
  const [sender, setSender] = useState({ name:'', email:'', phone:'', address:'' });
  const [recipient, setRecipient] = useState({ name:'', email:'', phone:'', address:'' });
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMsg('');

    const fd = new FormData();
    fd.append('sender', JSON.stringify(sender));
    fd.append('recipient', JSON.stringify(recipient));
    fd.append('description', description);
    fd.append('weight', weight);
    fd.append('price', price);
    if (file) fd.append('packageImage', file);

    try {
      // ✅ Updated API path to match backend
      const res = await API.post('/api/shipment', fd);
      setMsg('Created: ' + res.data.shipment.trackingCode);
    } catch(e) {
      setMsg('Error: ' + (e.response?.data?.error || e.message));
    }
  }

  return (
    <div>
      <Nav admin />
      <div className="max-w-3xl mx-auto p-6 bg-white mt-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create Shipment (Admin)</h2>
        <form onSubmit={submit} className="space-y-3">
          
          {/* Sender & Recipient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <h4 className="font-semibold">Sender</h4>
              <input placeholder="Name" className="w-full border p-2" value={sender.name} onChange={e=>setSender({...sender, name: e.target.value})} />
              <input placeholder="Email" className="w-full border p-2 mt-1" value={sender.email} onChange={e=>setSender({...sender, email: e.target.value})} />
              <input placeholder="Phone" className="w-full border p-2 mt-1" value={sender.phone} onChange={e=>setSender({...sender, phone: e.target.value})} />
              <input placeholder="Address" className="w-full border p-2 mt-1" value={sender.address} onChange={e=>setSender({...sender, address: e.target.value})} />
            </div>
            <div>
              <h4 className="font-semibold">Recipient</h4>
              <input placeholder="Name" className="w-full border p-2" value={recipient.name} onChange={e=>setRecipient({...recipient, name: e.target.value})} />
              <input placeholder="Email" className="w-full border p-2 mt-1" value={recipient.email} onChange={e=>setRecipient({...recipient, email: e.target.value})} />
              <input placeholder="Phone" className="w-full border p-2 mt-1" value={recipient.phone} onChange={e=>setRecipient({...recipient, phone: e.target.value})} />
              <input placeholder="Address" className="w-full border p-2 mt-1" value={recipient.address} onChange={e=>setRecipient({...recipient, address: e.target.value})} />
            </div>
          </div>

          {/* Package */}
          <div>
            <h4 className="font-semibold">Package</h4>
            <input placeholder="Description" className="w-full border p-2" value={description} onChange={e=>setDescription(e.target.value)} />
            <input placeholder="Weight (kg)" type="number" className="w-full border p-2 mt-1" value={weight} onChange={e=>setWeight(e.target.value)} />
            <input placeholder="Price" type="number" className="w-full border p-2 mt-1" value={price} onChange={e=>setPrice(e.target.value)} />
            <input type="file" accept="image/*" className="mt-2" onChange={e=>setFile(e.target.files[0])} />
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
          {msg && <p className="mt-2">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
