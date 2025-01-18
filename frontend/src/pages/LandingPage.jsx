import React from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import FAQ from "@/components/FAQ";
import { FaSeedling } from "react-icons/fa"; // For Crop Diagnostics
import { RiHistoryLine } from "react-icons/ri"; // For Diagnostics Log
import { BsChatDots } from "react-icons/bs"; // For Chat Feature
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl font-bold mb-12">Our Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-center mb-4 text-green-600">
          {/* Crop Diagnostics Icon */}
          <FaSeedling className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Crop Diagnostics</h3>
        <p className="text-gray-600">
          Upload images of your crops to receive accurate diagnostics, disease identification, and actionable remedies.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-center mb-4 text-purple-600">
          {/* Diagnostics Log Icon */}
          <RiHistoryLine className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Diagnostics Log</h3>
        <p className="text-gray-600">
          Keep track of your previous crop diagnoses with a detailed history of reports for future reference.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-center mb-4 text-blue-600">
          {/* Chat Feature Icon */}
          <BsChatDots className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold mb-2">User-Friendly Chat</h3>
        <p className="text-gray-600">
          Ask follow-up questions and receive additional insights directly from our AI-powered chat interface.
        </p>
      </div>
    </div>
  </div>
  <Chatbot />
</section>

      {/* FAQ Section */}
      <FAQ />

    </div>
  );
};

export default LandingPage;
