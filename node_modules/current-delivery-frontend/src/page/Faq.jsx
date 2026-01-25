import React, { useState } from 'react';

// Professional FAQ data for CurrentDelivery
const faqData = [
  {
    category: 'Getting Started',
    faqs: [
      { question: 'How do I create an account on CurrentDelivery?', answer: 'Download the app from the App Store or Google Play. Click "Sign Up" and provide your email, phone number, and a secure password. Verify your account via email or SMS to start using CurrentDelivery.' },
      { question: 'Can I use CurrentDelivery without registering?', answer: 'No, creating an account is required to track your orders and manage delivery preferences efficiently.' },
    ],
  },
  {
    category: 'Placing an Order',
    faqs: [
      { question: 'How do I place an order?', answer: 'Open the app, select the items you want, add them to your cart, choose a delivery time, and complete the payment. A confirmation notification will appear once the order is successfully placed.' },
      { question: 'What payment methods are accepted?', answer: 'CurrentDelivery accepts credit/debit cards, digital wallets (Apple Pay, Google Pay), and in selected regions, cash on delivery.' },
    ],
  },
  {
    category: 'Delivery',
    faqs: [
      { question: 'How can I track my order?', answer: 'After your order is confirmed, go to "My Orders" and select "Track Order" to view real-time updates and estimated delivery time.' },
      { question: 'What happens if my delivery is delayed?', answer: 'You will receive a notification with the updated delivery time. For further assistance, contact our support team directly through the app or website.' },
    ],
  },
  {
    category: 'Cancellations & Returns',
    faqs: [
      { question: 'How do I cancel an order?', answer: 'Open your order in the app, select "Cancel", and confirm your cancellation. Note that cancellation policies may vary depending on the order stage.' },
      { question: 'Can I get a refund?', answer: 'Refunds are processed automatically if the order is canceled before dispatch. For missing or delayed deliveries, please contact support for prompt assistance.' },
    ],
  },
  {
    category: 'Support & Contact',
    faqs: [
      { question: 'How can I contact customer support?', answer: 'Reach out via the "Help" section in the app, email support@currentdelivery.com, or call our hotline for urgent inquiries.' },
      { question: 'Where can I provide feedback about the app?', answer: 'Feedback can be submitted through the "Feedback" form in app settings. Your suggestions help us improve CurrentDelivery.' },
    ],
  },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter FAQs based on search input
  const filteredData = faqData.map(category => {
    const filteredFaqs = category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...category, faqs: filteredFaqs };
  }).filter(category => category.faqs.length > 0);

  return (
    <div className="max-w-full sm:max-w-5xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">CurrentDelivery FAQ</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for questions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
      />

      {filteredData.length > 0 ? (
        filteredData.map((category, catIdx) => (
          <div key={catIdx} className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">{category.category}</h2>
            <div className="border rounded-lg divide-y divide-gray-200">
              {category.faqs.map((faq, idx) => {
                const index = `${catIdx}-${idx}`;
                const isOpen = openIndex === index;
                return (
                  <div key={idx} className="bg-white">
                    <button
                      className="w-full text-left px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center text-gray-800 font-medium hover:bg-gray-50 transition-colors focus:outline-none text-sm sm:text-base"
                      onClick={() => toggleIndex(index)}
                    >
                      <span>{faq.question}</span>
                      <span className="ml-2 text-lg sm:text-xl text-blue-600 font-bold">{isOpen ? '-' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 text-gray-700 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-base sm:text-lg">No results found for "{searchTerm}".</p>
      )}
    </div>
  );
};

export default FaqAccordion;