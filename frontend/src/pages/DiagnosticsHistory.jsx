import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Leaf, AlertCircle, CheckCircle2, ChevronRight, History } from "lucide-react";
import Chatbot from "@/components/Chatbot";

const DiagnosticsHistory = () => {
  const navigate = useNavigate();

  const [diagnostics, setDiagnostics] = useState([]); // Initialize state

useEffect(() => {
  async function getData() {
    try {
      const res = await fetch('http://localhost:3000/all_reports');
      const data = await res.json();
      console.log(data);
      
      setDiagnostics(data); // Update state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  getData();
}, []);
useState
  const handleViewDetails = (name) => {
    navigate(`/history/${name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <History className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl font-bold text-green-800">Diagnostics History</h1>
        </div>

        <div className="grid gap-6">
          {diagnostics.map((diagnostic, index) => (
            <Card 
              key={index} 
              className="border-2 border-green-200 hover:border-green-200 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <CardHeader className="bg-green-50/50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-xl text-green-800">{diagnostic.plantName}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{new Date(diagnostic.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="flex items-start gap-3 mb-4">
                  {diagnostic.status === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  )}
                  <p className="text-gray-700">{diagnostic.summary}</p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      handleViewDetails(diagnostic.plantName);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transform transition-transform hover:translate-x-1"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {diagnostics.length === 0 && (
          <Card className="text-center p-8">
            <div className="flex flex-col items-center gap-4">
              <History className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No diagnostic history available</p>
            </div>
          </Card>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default DiagnosticsHistory;