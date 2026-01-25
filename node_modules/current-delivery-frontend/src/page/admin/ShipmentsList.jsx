import React, { useEffect, useState } from 'react';
import API from '../../api';
import Nav from '../../component/Nav';
import { Link } from 'react-router-dom';


export default function ShipmentsList(){
const [list, setList] = useState([]);
useEffect(()=>{ API.get('/shipments').then(r=>setList(r.data)).catch(()=>{}); },[]);
return (
<div>
<Nav admin />
<div className="p-6">
<h2 className="text-xl font-bold mb-4">Shipments</h2>
<div className="grid gap-3">
{list.map(s=> (
<div key={s._id} className="p-3 bg-white rounded shadow flex justify-between">
<div>
<div className="font-semibold">{s.trackingCode}</div>
<div className="text-sm text-gray-600">{s.recipient?.name} • {s.status}</div>
</div>
<div>
<Link to={`/shipment/${s.trackingCode}`} className="text-blue-600 underline">View</Link>
</div>
</div>
))}
</div>
</div>
</div>
);
}