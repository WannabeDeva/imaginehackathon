import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Microscope, FileChartLine } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToFAQ = () => {
    const faqSection = document.getElementById("faq");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-yellow-50 to-white">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-green-100 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-green-100 opacity-40 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-5 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">AI-Powered Crop Care</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 leading-tight">
                Smart Farming for a 
                <span className="block text-green-600">Sustainable Future</span>
              </h1>

              <p className="text-lg text-gray-600 max-w-xl">
                Transform your farming practices with AI-driven crop diagnostics. Get instant disease detection, 
                treatment recommendations, and expert insights for healthier crops.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/crop-diagnostics">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full
                      flex items-center gap-2 text-lg transform transition-transform hover:scale-105"
                  >
                    Start Diagnosis
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  className="border-2 border-green-200 hover:border-green-300 px-8 py-6 rounded-full
                    flex items-center gap-2 text-lg text-green-700"
                  onClick={scrollToFAQ}
                >
                  Learn More
                </Button>
              </div>

              {/* Feature List */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileChartLine className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Real-time Analysis</p>
                    <p className="text-sm text-gray-600">Instant disease detection</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Microscope className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">High Accuracy</p>
                    <p className="text-sm text-gray-600">AI-powered precision</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent rounded-full blur-3xl"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src="https://img.freepik.com/free-photo/growing-organic-ecological-plants-fields-background_1268-30597.jpg?t=st=1737255107~exp=1737258707~hmac=ceda22119abada5ce3fad8cc89fde19e283b335b9ed9aa8fb80505d8749745f8&w=1380"
                    alt="Smart farming illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Crops Analyzed</p>
                      <p className="text-xl font-bold text-green-800">10,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
