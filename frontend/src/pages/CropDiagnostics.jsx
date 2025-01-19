import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Leaf, Upload, Send, MessageSquare, RefreshCw } from "lucide-react";
import { socket } from "@/lib/socket";
import axios from "axios";
import Chatbot from "@/components/Chatbot";

const CropDiagnostics = () => {
  const [image, setImage] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const[weatherData, setWeatherData] = useState();
  const location = useRef();
  const [ideal,setIdeal] = useState();
  const [similar,setSimilar] = useState(34);

  useEffect(() => {
    async function getCoordinates() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position.coords.latitude, position.coords.longitude);
            location.current = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            getWeather(); // Call getWeather after setting location
          },
          (err) => {
            console.error(err.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
    

    async function getWeather() {
      if (location.current) {
        const { latitude, longitude } = location.current;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=ae416caf02a12b79c3108f22f90d101b`
          );
          console.log(response.data);
          const {
            humidity,
            pressure,
            sea_level,
            temp,
            temp_max,
            temp_min,
          } = response.data.main;

            setWeatherData({
            humidity,
            pressure,
            sea_level,
            temperature: `${temp} K`,
            temp_max: `${temp_max} K`,
            temp_min: `${temp_min} K`
            });

        } catch (error) {
          console.error("Error fetching weather data", error);
        }
      } else {
        console.error("Location is not available");
      }
    }
    getCoordinates();
  }, []);

  const healthyPlants = {
    Apple: {
      characteristics: [
        "Glossy green surface",
        "Firm texture",
        "No visible spots or discoloration"
      ],
      img: "/appleHealthy.jpg"
    },
    Corn: {
      characteristics: [
        "Long and broad green blades",
        "Smooth and even coloration",
        "No signs of wilting or browning tips"
      ],
      img: "/corn.jpg"
    },
    Grape: {
      characteristics: [
        "Broad and lobed green leaves",
        "Smooth texture with no curling",
        "Absence of powdery mildew or discoloration"
      ],
      img: "/grape.jpg"
    },
    Orange: {
      characteristics: [
        "Dark green, shiny, and leathery leaves",
        "Firm and well-attached to branches",
        "No yellowing or pest damage"
      ],
      img: "/orange.jpg"
    },
    Potato: {
      characteristics: [
        "Dark green, compound leaves",
        "Smooth and firm texture",
        "No spots or wilting from blight"
      ],
      img: "/potato.jpg"
    },
    Tomato: {
      characteristics: [
        "Dark green and deeply lobed leaves",
        "Soft, velvety texture",
        "No visible spots or wilting"
      ],
      img: "/tomato.jpg"
    }
  };

  // Existing handlers remain the same
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };
  
  const performDiagnosis = () => {
    setIsLoading(true);
    socket.connect();
    
    socket.on('response', (response) => {
        console.log(response);
        setDiagnosis(response);
        setIdeal(healthyPlants[response.plantName]);
        if(response.estimate == "Medium")
          setSimilar(40);
        if(response.estimate == "High")
          setSimilar(20);
        if(response.estimate == "Low")
          setSimilar(75);
        
        setIsLoading(false);
    });

    socket.on('error', (error) => {
        console.error('Error:', error);
        setIsLoading(false);
    });

    socket.emit("upload", image, weatherData);
  };

  const handleUserMessage = (e) => {
    setUserMessage(e.target.value);
  };

  const sendMessage = () => {
    if (userMessage.trim() === "") return;
    setChatMessages([
      ...chatMessages,
      { sender: "user", message: userMessage },
      { sender: "ai", message: "I can provide additional insights on Leaf Blight." },
    ]);
    setUserMessage("");
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Navbar />
      <div className="flex max-w-full min-h-screen">
        {/* Main Diagnosis Section */}
        <div className={`transition-all duration-300 ${isChatOpen ? "w-8/12" : "w-full"}`}>
          <div className="py-8 px-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Leaf className="w-8 h-8 text-green-600" />
              <h1 className="text-4xl font-bold text-green-800">Crop Diagnostics</h1>
            </div>

            {/* Upload Section */}
            {!diagnosis && (
              <Card className="mb-8 border-2 border-green-100 shadow-lg">
                <CardHeader className="bg-green-100">
                  <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                    <Upload className="w-6 h-6" />
                    Upload Crop Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-full max-w-md relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-green-900
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-green-50 file:text-green-700
                          hover:file:bg-green-100
                          cursor-pointer border-2 border-dashed
                          border-green-200 rounded-lg p-8
                          hover:border-green-300 transition-colors"
                      />
                    </div>
                    {image && !diagnosis && (
                      <Button
                        onClick={performDiagnosis}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-2
                          flex items-center gap-2 transition-all transform hover:scale-105"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Perform Diagnosis"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            {diagnosis && (
              <Card className="mb-8 border-2 border-green-100 shadow-lg">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-2xl text-center text-green-800">
                    Diagnosis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Image Comparison */}
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
                    <div className="flex-1 text-center">
                      <h3 className="font-bold text-lg text-green-700 mb-4">{diagnosis.plantName}</h3>
                      <div className="bg-white p-4 rounded-lg shadow-inner border-2 border-green-100">
                        {image && (
                          <img
                            src={diagnosis.imageUrl}
                            alt="Your plant"
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
                          {similar}% Similar
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 text-center">
                      <h3 className="font-bold text-lg text-green-700 mb-4">
                        Ideal State
                      </h3>
                      <div className="bg-white p-4 rounded-lg shadow-inner border-2 border-green-100">
                        <img
                          src= {ideal.img}
                          alt="Ideal plant state"
                          className="w-64 h-64 object-contain mx-auto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Disease Info */}
                  <div className="bg-green-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-bold text-green-800 mb-4">Disease Analysis:</h3>
                    
                      <div className="ml-6 mb-4 bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-lg font-semibold text-green-700 mb-2">{diagnosis.diseaseName}</p>
                        <p className="text-gray-700 mb-2">Symptoms: {diagnosis.diseaseDescription}</p>
                        {/* <p className="text-gray-600">Severity: {disease.severity}</p> */}
                      </div>
                  
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-bold text-green-800 mb-4">Ideal State Characterstics:</h3>
                    {ideal?.characteristics.map((character) => (
                        <div className="ml-6 mb-4 bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-lg font-semibold text-green-700 mb-2">{character}</p>
                      </div>
                    ))}
                      
        
                  </div>

                  {/* Recommendations */}
                  <div className="bg-green-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-bold text-green-800 mb-4">Recommended Solutions:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {diagnosis.remedy.map((pesticide, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-green-700">{pesticide}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isChatOpen && (
                    <div className="text-center">
                      <Button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full
                          px-6 py-2 flex items-center gap-2 mx-auto transition-all transform hover:scale-105"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Ask More Questions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Chat Section */}
        {isChatOpen && (
          <div className="w-4/12 bg-green-50 p-4 border-l-2 border-green-100">
            <Card className="h-full border-2 border-green-100">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Expert Assistance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[calc(100vh-12rem)]">
                  <div className="flex-1 overflow-y-auto space-y-4 p-4">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          msg.sender === "ai"
                            ? "bg-white text-gray-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <strong>{msg.sender === "ai" ? "Expert:" : "You:"}</strong> {msg.message}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-green-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={userMessage}
                        onChange={handleUserMessage}
                        className="flex-1 p-2 rounded-full border-2 border-green-100 focus:border-green-300 
                          focus:ring-2 focus:ring-green-200 focus:outline-none"
                        placeholder="Ask about your crop..."
                      />
                      <Button
                        onClick={sendMessage}
                        className="bg-green-600 hover:bg-green-700 rounded-full p-2"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default CropDiagnostics;