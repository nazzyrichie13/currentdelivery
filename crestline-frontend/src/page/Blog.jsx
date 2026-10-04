import React from "react";

const posts = [
  {
    title: "How to Choose the Right Shipping Method",
    date: "January 2026",
    excerpt:
      "Choosing the right shipping method means balancing speed, cost, and cargo requirements. Learn how to decide between air, sea, and hybrid options for your business.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
  },
  {
    title: "Air Freight vs. Sea Freight: When to Use Each",
    date: "February 2026",
    excerpt:
      "Air and sea freight serve different logistics strategies. This guide breaks down when speed matters more than cost—and when it doesn’t.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  },
  {
    title: "Top Tips for Securing Your Shipment",
    date: "March 2026",
    excerpt:
      "Reduce loss and damage with proven shipment security practices—from packaging and seals to real-time tracking solutions.",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7",
  },
  {
    title: "The Future of Last-Mile Delivery Services",
    date: "April 2026",
    excerpt:
      "E-commerce growth is transforming last-mile delivery. Explore how automation, EVs, and AI are shaping the future.",
    image:
      "https://images.unsplash.com/photo-1581091215367-59ab6c1b1f67",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Insights & Updates
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert perspectives on global shipping, logistics strategies, and
            supply chain innovation.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="text-blue-600 font-medium hover:underline">
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
