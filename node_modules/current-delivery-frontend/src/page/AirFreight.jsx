import React from "react";

export default function AirFreight() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Air Freight</h1>
        <p className="text-gray-600">Fast, secure, worldwide shipping</p>
      </header>

      <img
        src="https://chapmanfreeborn.aero/wp-content/uploads/2023/11/SEO-Blog-3.jpg"
        alt="Air Freight"
        className="rounded shadow mb-6 w-full"
      />

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Why Choose Air Freight?</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Speed — Ideal for urgent or critical shipments</li>
          <li>Security — High-level cargo monitoring and handling</li>
          <li>Global Reach — From airports to final-mile delivery</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Our Air Freight Services</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Door-to-door air cargo delivery</li>
          <li>Express air service</li>
          <li>Standard and consolidated options</li>
          <li>Tracking & customs support</li>
        </ul>
      </section>
    </div>
  );
}
