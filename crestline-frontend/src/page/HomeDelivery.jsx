import React from "react";

export default function HomeDelivery() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Home Delivery</h1>
        <p className="text-gray-600">Fast, convenient, doorstep delivery</p>
      </header>

      <img
        src="https://static1.bigstockphoto.com/0/3/2/large1500/230370190.jpg"
        alt="Home Delivery"
        className="rounded shadow mb-6 w-full"
      />

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Same-day or next-day delivery</li>
          <li>GPS tracking updates</li>
          <li>Multiple vehicle types for any package</li>
          <li>Friendly, professional delivery personnel</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Perfect For</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>E-commerce orders</li>
          <li>Documents & personal items</li>
          <li>Scheduled delivery windows</li>
          <li>Bulk or regular shipments</li>
        </ul>
      </section>
    </div>
  );
}
