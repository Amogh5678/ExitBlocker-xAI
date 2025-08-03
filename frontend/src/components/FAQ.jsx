import React, { useState } from 'react';

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our churn prediction system
          </p>
        </div>

        <div className="space-y-6">
            <FAQItem
            question="What is Customer Churn?"
            answer="Customer churn (also known as customer attrition) refers to when a customer (player, subscriber, user, etc.) ceases his or her relationship with a company. 
            Online businesses typically treat a customer as churned once a particular amount of time has elapsed since the customer’s last interaction with the site or service. The full cost of churn includes both lost revenue and the marketing costs involved with replacing those customers with new ones. 
            Reducing churn is a key business goal of every online business."
          />
           <FAQItem
            question="The Importance of Predicting Customer Churn"
            answer="The ability to predict that a particular customer is at a high risk of churning, while there is still time to do something about it, represents a huge additional potential revenue source for every online business. 
            Besides the direct loss of revenue that results from a customer abandoning the business, the costs of initially acquiring that customer may not have already been covered by the customer’s spending to date. 
            (In other words, acquiring that customer may have actually been a losing investment.) Furthermore, it is always more difficult and expensive to acquire a new customer than it is to retain a current paying customer.
            
            Churn can be predicted by using a machine learning algorithm to calculate churn risks for each individual customer. However, for those looking for a simpler approach, calculating each customer’s churn factor is a powerful way to predict churn."
          />

          <FAQItem
            question="How accurate is the churn prediction model?"
            answer="Our AI model achieves 95% accuracy using advanced machine learning algorithms trained on extensive customer data patterns. The model continuously learns and improves its predictions over time."
          />
          <FAQItem
            question="What data do I need to provide for predictions?"
            answer="You'll need basic customer information including demographics, service usage patterns, billing details, and subscription history. Our system guides you through each required field."
          />
          <FAQItem
            question="How quickly can I get prediction results?"
            answer="Predictions are generated in real-time. Once you input the customer data, our AI processes it instantly and provides detailed insights along with SHAP explanations."
          />
          <FAQItem
            question="Can I understand why a customer might churn?"
            answer="Yes! We provide SHAP (SHapley Additive exPlanations) analysis that shows exactly which factors contribute most to the churn prediction, helping you take targeted action."
          />
          <FAQItem
            question="Is my customer data secure?"
            answer="Absolutely. We use enterprise-grade security measures to protect your data. All information is encrypted and processed securely without storing sensitive customer details."
          />
          <FAQItem
            question="Can I integrate this with my existing CRM?"
            answer="Yes, our system is designed to integrate seamlessly with popular CRM platforms. Contact our team for specific integration requirements and API documentation."
          />
        </div>
      </div>
    </section>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQ;
