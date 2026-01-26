

// Example images (replace with your own)
import containerShip from "../assets/istockphoto-1340887693-612x612.jpg";
import port from "../assets/ship.jpg";
import cargoLoading from "../assets/shipppp.png";

export default function Seafreight() {
  return (
    <div>
      
      {/* Hero Section */}
      <div className="relative h-64 sm:h-96 w-full overflow-hidden">
        <img
          src={containerShip}
          alt="Seafreight Ship"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-3xl sm:text-5xl text-white font-bold text-center">
            Seafreight Services
          </h1>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-5xl mx-auto p-6 sm:p-12 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">About Our Seafreight</h2>
        <p className="text-gray-700">
          We provide fast, reliable, and secure sea freight solutions worldwide. 
          From container shipping to bulk cargo, our team ensures that your goods 
          reach their destination safely and on time.
        </p>
        <p className="text-gray-700">
          With years of experience in international logistics, we offer tailored 
          services for businesses of all sizes. Our modern fleet and global network 
          make shipping across oceans simple and efficient.
        </p>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 px-6">
          <div className="bg-white rounded shadow overflow-hidden">
            <img src={port} alt="Port" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Port Handling</h3>
              <p className="text-gray-600 text-sm">
                Efficient loading and unloading of cargo at ports worldwide.
              </p>
            </div>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <img src={cargoLoading} alt="Cargo Loading" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Cargo Management</h3>
              <p className="text-gray-600 text-sm">
                Secure and organized cargo handling from origin to destination.
              </p>
            </div>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <img src={containerShip} alt="Container Ship" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Global Shipping</h3>
              <p className="text-gray-600 text-sm">
                Reliable sea freight services connecting ports worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Get Your Goods Delivered Worldwide
        </h2>
        <p className="mb-6">Contact us today for a quote on your next shipment.</p>
        <a
          href="/contact"
          className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
        >
          Request a Quote
        </a>
      </div>
    </div>
  );
}
