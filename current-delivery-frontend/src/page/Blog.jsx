import React from "react";

export default function Blog() {
  const posts = [
    { title: "How to Choose the Right Shipping Method", date: "Jan 2026" },
    { title: "Air Freight vs. Sea Freight: When to Use Each", date: "Feb 2026" },
    { title: "Top Tips for Securing Your Shipment", date: "Mar 2026" },
    { title: "The Future of Last-Mile Delivery Services", date: "Apr 2026" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
        <p className="text-gray-600">Insights from the world of logistics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <div key={idx} className="border rounded shadow p-4 hover:shadow-lg">
            <h3 className="font-semibold text-xl mb-1">{post.title}</h3>
            <p className="text-gray-500 text-sm">{post.date}</p>
            <p className="mt-2 text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Learn tips and trends in shipping and delivery.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
