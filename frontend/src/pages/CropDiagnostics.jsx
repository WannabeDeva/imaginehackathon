import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import Navbar from "@/components/Navbar";

const CropDiagnostics = () => {
  const [image, setImage] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Simulate AI model diagnosis
  const performDiagnosis = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setDiagnosis({
        similarity: 75,
        diseases: [
          {
            name: "Leaf Blight",
            symptoms: "Yellowing leaves, brown spots",
            severity: "medium"
          }
        ],
        pesticides: [
          "Copper fungicide",
          "Neem oil spray",
          "Organic sulfur spray"
        ]
      });
      setIsLoading(false);
    }, 2000);
  };

  // Reset the form
  const handleReset = () => {
    setImage(null);
    setDiagnosis(null);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Crop Diagnostics</h1>

        {/* Image Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Upload Crop Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border border-gray-300 p-2 rounded-md w-full max-w-md"
              />
              {image && !diagnosis && (
                <Button 
                  onClick={performDiagnosis} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Analyzing..." : "Perform Diagnosis"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Results Section */}
        {diagnosis && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Diagnosis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Comparison Section */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
                {/* Your Plant */}
                <div className="flex-1 text-center">
                  <h3 className="font-bold text-lg underline mb-4">Your Plant</h3>
                  <div className="bg-gray-100 p-4 mx-auto w-64 h-64 rounded-lg">
                    {image && (
                      <img 
                        src={image} 
                        alt="Your plant" 
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Similarity Indicator */}
                <div className="flex md:flex-col items-center gap-2">
                  <div className="hidden md:block w-px h-48 bg-pink-400 border-dashed border-2 border-pink-400"></div>
                  <div className="md:hidden h-px w-48 bg-pink-400 border-dashed border-2 border-pink-400"></div>
                  <p className="text-lg font-semibold">
                    {diagnosis.similarity}% Similar
                  </p>
                </div>

                {/* Ideal State */}
                <div className="flex-1 text-center">
                  <h3 className="font-bold text-lg underline mb-4 text-purple-600">Ideal State</h3>
                  <div className="bg-gray-100 p-4 mx-auto w-64 h-64 rounded-lg">
                    <img 
                      src="/api/placeholder/256/256" 
                      alt="Ideal plant state" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Disease Diagnostics Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Disease (Diagnostics):</h3>
                {diagnosis.diseases.map((disease, index) => (
                  <div key={index} className="ml-6 mb-4">
                    <p className="mb-2">• {disease.name} - {disease.symptoms}</p>
                    <p className="text-gray-600">Extent: {disease.severity}</p>
                  </div>
                ))}
              </div>

              {/* Pesticides Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Buy these pesticides:</h3>
                <ul className="ml-6">
                  {diagnosis.pesticides.map((pesticide, index) => (
                    <li key={index} className="mb-2">• {pesticide}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={handleReset}
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  Start New Diagnosis
                </Button>
                <Button 
                  onClick={() => {
                    // Save to history or export functionality
                    Toast.success("Diagnosis saved successfully!");
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save Diagnosis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CropDiagnostics;