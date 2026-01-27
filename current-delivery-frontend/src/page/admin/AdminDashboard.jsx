import React from 'react';
import { Link } from 'react-router-dom';



export default function AdminDashboard(){
return (
<div>

<div className="p-6">
<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<Link to="/admin/create-shipment" className="p-4 bg-white rounded shadow">Create Shipment</Link>
<Link to="/admin/shipments" className="p-4 bg-white rounded shadow">Manage Shipments</Link>
<Link to="/admin/shipments/edit/:id" className="p-4 bg-white rounded shadow">Edit shipment</Link>
<Link to="/editbytrack" className="p-4 bg-white rounded shadow">Edit with TrackingCode</Link>
</div>
</div>
</div>
);
}