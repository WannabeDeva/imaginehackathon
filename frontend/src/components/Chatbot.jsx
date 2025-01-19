import { useEffect, useRef, useState } from "react";
import { socket } from "../lib/socket";
import { speakText } from "../lib/speech";
import AIicon from "../assets/AiAnimation.webm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSearchResult } from "@/context/SearchContext";
import "./styles/chatbot.css";

export default function Chatbot() {
  const [transcript1, setTranscript] = useState(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(transcript1);
  const accumulatedTranscriptRef = useRef("");
  const chatStatusref = useRef(false);
  const loopref = useRef(false);
  const navigate = useNavigate();
  const [chatVisibility, setChatVisibility] = useState(false);
  const { storeSearchResult } = useSearchResult();
  const location = useRef();
  const inputFileRef = useRef();
  const inputButtonRef = useRef();
  const [weatherData, setWeatherData] = useState();
  const [chatContent, setChatContent] = useState(
    "Hello, I am AgroCare, your personal Farming assistant. How may I assist you?"
  );

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

  useEffect(() => {
    transcriptRef.current = transcript1;
  }, [transcript1]);

  useEffect(() => {
    const chatStatus = localStorage.getItem("chatActive");
    chatStatusref.current = chatStatus;
    console.log(chatStatus);
  }, []);

  const startChat = () => {
    socket.connect();

    socket.on("connect", () => {
      console.log(socket.id);
    });

    const textToSpeak = chatContent;

    if (window.location.pathname === "/" && chatStatusref.current) {
      speakText(textToSpeak);
    }

    startRecognition();
  };

  function upload(file) {
    console.log(file);
    socket.emit("upload", file, weatherData, (status) => {
      console.log(status);
    });
  }

  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        console.log(result);
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          setTimeout(() => {
            recognitionRef.current.stop();
            console.log("stopped by timeout");
          }, 2500);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      accumulatedTranscriptRef.current += finalTranscript;
      setTranscript(accumulatedTranscriptRef.current + interimTranscript);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      if (accumulatedTranscriptRef.current) {
        console.log(accumulatedTranscriptRef.current);
        setChatContent(accumulatedTranscriptRef.current);
        socket.emit("prompt", accumulatedTranscriptRef.current);
      }
      accumulatedTranscriptRef.current = "";
      setTranscript(accumulatedTranscriptRef.current);
      if (loopref.current) {
        startRecognition();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  async function book_appointment(req_data) {
    console.log("appointment data", req_data);
    const { doctor_id, doctor_name, date, time } = req_data;
    const { data } = await axios.post("http://localhost:3000/add_appointment", {
      doctor_id,
      doctor_name,
      date,
      time,
    });
    console.log(data);
    speakText(data.message);
  }

  useEffect(() => {
    const handleResponse = (raw_response) => {
      console.log(raw_response);
      let response = JSON.stringify(raw_response)

      if(response.indexOf('*') > -1){
        response = raw_response.replace('*', '')
      }

      const first_index = response.indexOf(`{`);
      const last_index = response.lastIndexOf(`}`);
      // if (first_index > -1 && last_index > -1) {
      //   const json_extract = response.slice(first_index, last_index + 1);
      //   const response_json = JSON.parse(json_extract);
      //   if (
      //     response_json.operation &&
      //     response_json.operation.toLowerCase() == "appointment"
      //   ) {
      //     book_appointment(response_json);
      //     return;
      //   } else if (
      //     response_json.operation &&
      //     response_json.operation.toLowerCase() == "medication"
      //   ) {
      //     add_medication(response_json);
      //   }
      // }

      if (first_index > -1 && last_index > -1) {
        const json_extract = response.slice(first_index, last_index + 1);
        const response_json = JSON.parse(json_extract);
        console.log(response_json);
        localStorage.setItem("search_result", JSON.stringify(response_json));
        storeSearchResult(response_json);
        // navigate("/searchresult");
        speakText(response_json.summary);
        setChatContent(response_json.summary);
        return;
      }

      const parts = raw_response.split(" ");

      let pagename;

      if (parts[0].toLowerCase() === "open") {
        pagename = parts.slice(1).join(" ").replace(/\s+/g, "").toLowerCase();

        console.log(pagename);

        // Define a mapping of possible variations to correct routes
        const pageRoutes = {
          home: "/",
          homepage: "/",
          cropdiagnostic: "/crop-diagnostics",
          cropdiagnosticpage: "/crop-diagnostics",
          previousdiagnostic: "/history",
          previousdiagnosticpage: "/history",
        };

        // Check if the normalized page name exists in the mapping
        if (pageRoutes[pagename]) {
          speakText(`opening ${pagename}`);
          navigate(pageRoutes[pagename]);
        } else {
          speakText("Invalid page name");
        }
      } else {
        setChatContent(response);
        speakText(response);
      }
      startRecognition();
    };

    socket.on("response", handleResponse);

    return () => {
      socket.off("response", handleResponse); // Clean up the listener
    };
  }, []);

  const startRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex justify-center">
      <button
        className="button AIbutton"
        id="AIbutton"
        onClick={() => {
          if (!loopref.current) {
            startChat();
            localStorage.setItem("chatActive", "true");
            setChatVisibility(true);
          } else {
            localStorage.setItem("chatActive", "false");
          }
          loopref.current = !loopref.current;
        }}
      >
        <video src={AIicon} alt="AI Icon Video" autoPlay muted loop />
      </button>
      <input
        ref={inputFileRef}
        type="file"
        style={{
          display: "none",
        }}
        onChange={(e) => upload(e.target.files[0])}
      />
      {/* <button ref={inputButtonRef} onClick={() => inputFileRef.current.click()}>
        Upload File
      </button> */}
      {chatVisibility ? (
        <div className="output-div" id="output-div">
          <button
            className="close_btn"
            onClick={() => {
              setChatVisibility(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>

          <p>{chatContent ? chatContent : null}</p>
        </div>
      ) : null}
    </div>
  );
}
