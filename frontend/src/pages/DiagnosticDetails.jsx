import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { 
  FileUp, 
  Calendar, 
  Leaf, 
  AlertTriangle, 
  CheckCircle2, 
  Droplets,
  RefreshCw,
  History
} from "lucide-react";
import { useParams } from "react-router-dom";

const DiagnosticsDetails = () => {
  const {id} = useParams();
  console.log(id);
  const [image, setImage] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [diagnosisLog, setDiagnosisLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`http://localhost:3000/report/${encodeURIComponent(id)}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
  
        const responseData = await res.json();
        console.log(responseData.data); // Data from the API
        setDiagnosisLog(responseData.data); // Assuming you have this state
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    }
  
    fetchReport();
  }, [id]);
  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      performDiagnosis();
    }
  };

  const performDiagnosis = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newDiagnosis = {
        date: new Date().toISOString().split("T")[0],
        similarity: 85,
        diseases: [
          { name: "Powdery Mildew", symptoms: "White powdery coating on leaves", severity: "High" },
        ],
        pesticides: ["Sulfur Spray", "Bicarbonate Solution"],
      };
      setDiagnosis(newDiagnosis);
      setDiagnosisLog([newDiagnosis, ...diagnosisLog]);
      setIsLoading(false);
    }, 2000);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Low: "text-green-600",
      Medium: "text-yellow-600",
      High: "text-red-600"
    };
    return colors[severity] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="flex items-center gap-3 mb-8">
          <History className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl font-bold text-green-800">Diagnostics Details</h1>
        </div>

        {/* Upload Section */}
        

        {/* Latest Diagnosis Section */}
        {diagnosis && (
          <Card className="mb-8 border-2 border-black/50 shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-2xl text-center text-green-800">Latest Diagnosis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
                <div className="flex-1 text-center">
                  <h3 className="font-bold text-lg text-green-700 mb-4">{diagnosis.plantName}</h3>
                  <div className="bg-white p-4 rounded-lg shadow-inner border-2 border-green-100">
                    {image && (
                      <img
                        src={image}
                        alt="Uploaded plant"
                        className="w-64 h-64 object-contain mx-auto"
                      />
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-2">
                  <div className="hidden md:block w-px h-48 bg-green-300 border-dashed border-2"></div>
                  <div className="md:hidden h-px w-48 bg-green-300 border-dashed border-2"></div>
                  <div className="bg-green-100 px-4 py-2 rounded-full">
                    <p className="text-lg font-semibold text-green-800">
                      Extent of spread: {diagnosis.extent}
                    </p>
                  </div>
                </div>

                <div className="flex-1 text-center">
                  <h3 className="font-bold text-lg text-green-700 mb-4">Ideal State</h3>
                  <div className="bg-white p-4 rounded-lg shadow-inner border-2 border-green-100">
                    <img
                      src="/api/placeholder/256/256"
                      alt="Ideal plant state"
                      className="w-64 h-64 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Disease Analysis:
                </h3>
                {diagnosis.diseases.map((disease, index) => (
                  <div key={index} className="ml-6 mb-4 bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-lg font-semibold text-green-700 mb-2">{disease.name}</p>
                    <p className="text-gray-700 mb-2">Symptoms: {disease.symptoms}</p>
                    <p className={`font-semibold ${getSeverityColor(disease.severity)}`}>
                      Severity: {disease.severity}
                    </p>
                  </div>
                ))}
              </div>
              

              <div className="bg-green-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Recommended Solutions:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diagnosis.pesticides.map((pesticide, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-green-700">{pesticide}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis Log */}
        <Card className="border-2 border-black/50 shadow-lg">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
              <Leaf className="w-6 h-6" />
              Diagnosis History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {diagnosisLog.map((log, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
                  <div className="flex items-center gap-2 mb-4 text-green-700">
                    <Calendar className="w-5 h-5" />
                    <h3 className="font-bold">{new Date(log.createdAt).toLocaleDateString()}</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    
                    <div>
                      <p className="font-semibold mb-2">Diseases:</p>
                      <ul className="space-y-2">
                          <li className="ml-6 flex items-start gap-2">
                            <span className="text-green-700">•</span>
                            <span>{log.diseaseName}</span>
                          </li>
                       
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-semibold mb-2">Recommended Solutions:</p>
                      <ul className="space-y-2">
                        {log.remedy.map((pesticide, i) => (
                          <li key={i} className="ml-6 flex items-start gap-2">
                            <span className="text-green-700">•</span>
                            <span>{pesticide}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiagnosticsDetails;