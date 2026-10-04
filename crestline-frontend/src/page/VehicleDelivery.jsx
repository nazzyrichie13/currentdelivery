import React from "react";

export default function VehicleDelivery() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Vehicle Delivery</h1>
        <p className="text-gray-600">Safe and reliable vehicle transport</p>
      </header>

      <img
        src="https://hdclogistic.com/wp-content/uploads/2017/08/hdc-logistics-vehicle-transport-road-1200x801-1.jpg"
        alt="Vehicle Delivery"
        className="rounded shadow mb-6 w-full"
      />

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Service Highlights</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Covered & open transport options</li>
          <li>Secure loading & unloading</li>
          <li>Real-time GPS tracking</li>
          <li>Perfect for dealerships, individuals & businesses</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
        <ol className="list-decimal list-inside text-gray-700">
          <li>Book your vehicle shipment</li>
          <li>Pickup and secure loading handled by us</li>
          <li>Vehicle transported safely</li>
          <li>Delivered to your chosen address</li>
        </ol>
      </section>
    </div>
  );
}
