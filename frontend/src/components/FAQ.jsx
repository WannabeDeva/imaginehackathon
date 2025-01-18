import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-800">{question}</span>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 text-gray-600">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
    const faqs = [
        {
          question: "How does the crop diagnostics tool work?",
          answer: "Our tool uses advanced AI models to analyze images of your crops. Simply upload a photo, and the system provides a detailed diagnosis, including disease identification, ideal crop images, and suggested remedies."
        },
        {
          question: "Is the crop diagnostics solution accurate?",
          answer: "Yes, our AI model is trained on a diverse dataset of crop images and diseases to ensure high accuracy. Additionally, we continuously update the model to include new diseases and refine its performance."
        },
        {
          question: "Can I ask follow-up questions about the diagnosis?",
          answer: "Absolutely! Our platform includes a chat interface where you can ask further questions about your crop's condition or the suggested remedies, ensuring all your concerns are addressed."
        },
        {
          question: "What crops are supported by the diagnostics tool?",
          answer: "Currently, our tool supports a wide range of commonly cultivated crops. We are continuously expanding our database to include more crops based on user feedback and demand."
        },
        {
          question: "Is my data safe on the platform?",
          answer: "Yes, we prioritize data security. All uploaded images and diagnostic results are stored securely and are accessible only to you. We do not share your data with third parties without your consent."
        }
      ];
      

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
      <p className="text-center text-gray-600 font-semibold text-muted-foreground mb-8">
        Get answers to the frequently asked questions about Karigar
      </p>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;