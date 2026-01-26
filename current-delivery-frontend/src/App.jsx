
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './component/Nav';
import Login from './page/Login'
import AdminDashboard from './page/admin/AdminDashboard';
import CreateShipment from './page/admin/CreateShipment';
import ShipmentsList from './page/admin/ShipmentsList';
import TrackShipment from './page/TrackShipment';
import ShipmentDetails from './page/ShipmentDetails';
import PrivateRoute from './component/PrivateRoute';
import Contact from './page/Contact';
import Faq from './page/Faq';
import AdminSignup from './page/admin/AdminSignUp';
import Home from './page/Home';
import Aboutpage from './page/Aboutpage';
import Footer from "./component/Footer"
import EditShipment from './page/admin/AdminEditShipment';
import Blog from './page/Blog';
import AirFreight from './page/AirFreight';
import SeaFreight from './page/SeaFreight';
import VehicleDelivery from './page/VehicleDelivery';
import HomeDelivery from './page/HomeDelivery';
import Signup from './page/Signup';
import AdminLogin from './page/admin/AdminLogin';






export default function App(){
return (
    
<div className="min-h-screen bg-gray-50">
<Nav/>
<home/>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/register" element={<Signup />} />
<Route path="/login" element={<Login />} />
<Route path="/track" element={<TrackShipment />} />
<Route path="/shipment/:trackingCode" element={<ShipmentDetails />} />
<Route path='/about' element={<Aboutpage/>}/>
<Route path="/contact" element={<Contact/>}/>
<Route path="/faq" element={<Faq/>}/>
<Route path="/blog" element={<Blog />} />
<Route path="/air-freight" element={<AirFreight />} />
<Route path="/sea-freight" element={<SeaFreight />} />
<Route path="/vehicle-delivery" element={<VehicleDelivery />} />
<Route path="/home-delivery" element={<HomeDelivery />} />

<Route path="/signup" element={<AdminSignup />} />
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin" element={  <AdminDashboard />}/>

<Route path="/admin/create-shipment" element={<CreateShipment/>} />
<Route path="/admin/shipments" element={<ShipmentsList/>} />
<Route path="/admin/shipments/edit/:id" element={<EditShipment/>} />

</Routes>

<Footer/>
</div>
);
}