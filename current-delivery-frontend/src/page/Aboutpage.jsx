// AboutPage.jsx
import  Image1  from '../assets/—Pngtree—illustration of a vector icon_12646880.jpg';

const milestones = [
  {
    year: "2003–2007",
    title: "The Beginning",
    description:
      "Started as a local courier service with hands-on care. Every delivery was tracked personally, building a foundation of trust.",
  },
  {
    year: "2008–2012",
    title: "Expansion & Innovation",
    description:
      "Regional hubs and real-time tracking systems were introduced. Partnerships with local businesses expanded our reach across cities.",
  },
  {
    year: "2013–2017",
    title: "Industry Leadership",
    description:
      "Nationwide coverage, advanced warehouse systems, route optimization, and award-winning customer service established Current Delivery as a leader.",
  },
  {
    year: "2018–2022",
    title: "Sustainability & Modernization",
    description:
      "Eco-friendly vehicles, mobile apps, AI logistics, and large-scale corporate partnerships redefined our approach to modern delivery services.",
  },
  {
    year: "2023–Present",
    title: "Looking Ahead",
    description:
      "Over 20 years of experience, a nationwide network, and millions of deliveries annually. Our mission: deliver trust, reliability, and excellence with every package.",
  },
];

const values = [
  { title: "Integrity", description: "Honest and transparent in every delivery we handle.", icon: "🛡️" },
  { title: "Reliability", description: "On-time delivery is at the heart of everything we do.", icon: "⏰" },
  { title: "Innovation", description: "Constantly improving systems, technology, and processes.", icon: "⚙️" },
  { title: "Customer Focus", description: "Every decision revolves around our customers' satisfaction.", icon: "❤️" },
];

const Aboutpage = () => {
  return (
    <div className="about-page max-w-7xl mx-auto p-6 md:p-10 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">Delivering Excellence Since 2003</h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          At <strong>Current Delivery</strong>, we connect people, businesses, and communities through reliable,
          innovative, and sustainable delivery solutions.
        </p>
        <img
        src={Image1}
          alt="Delivery vans"
          className="mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
        />
      </section>

      {/* Our Story Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">Our Story</h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto">
          Founded in 2003, Current Delivery started with a small team and a handful of vehicles. From personally overseeing
          every package to introducing real-time tracking systems, we built a reputation for trust, care, and reliability.
        </p>
        <p className="text-gray-700 text-center max-w-3xl mx-auto">
          Over the years, we expanded our fleet, opened regional hubs, and embraced technological innovations to ensure
          every delivery reached its destination safely and on time.
        </p>
      </section>

      {/* Timeline / Milestones Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-10">Milestones</h2>
        <div className="relative border-l-2 border-blue-600 ml-4">
          {milestones.map((item, index) => (
            <div
              key={index}
              className={`mb-10 ml-6 relative before:absolute before:w-4 before:h-4 before:rounded-full before:bg-blue-600 before:left-[-0.5rem] before:top-2`}
            >
              <span className="text-blue-600 font-bold">{item.year}</span>
              <h3 className="text-xl font-semibold mt-1">{item.title}</h3>
              <p className="text-gray-700 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-10">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {values.map((val, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-500"
            >
              <div className="text-4xl mb-4">{val.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{val.title}</h3>
              <p className="text-gray-700">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center bg-blue-50 p-10 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Partner with Us Today</h2>
        <p className="text-gray-700 mb-6">
          Whether you need urgent documents delivered, large-scale shipments handled, or reliable business logistics,
          Current Delivery is here for you.
        </p>
        <a
          href="/contact"
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
};

export default Aboutpage;
