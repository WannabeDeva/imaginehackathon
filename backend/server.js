import express, { response } from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { AImodel } from "./controllers/geminiAi.js"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { Disease } from "./models/Disease.js"
import path from 'path'

dotenv.config()

const app = express()
const httpserver = createServer(app)



function searchbyKeyword(keyword) {
    console.log(all_products)
    const search_list = all_products.products
    const search_result = []
    for (let i = 0; i < search_list.length; i++) {
        // Check if the product name contains the keyword (case-insensitive)
        if (search_list[i].name.toLowerCase().includes(keyword.toLowerCase())) {
            search_result.push(search_list[i]);
        }
    }

    console.log(search_result)
    return search_result

}

const io = new Server(httpserver, {
    cors: {
        origin: "http://localhost:5173"
    }
})

io.use((socket, next) => {
    const user_name = socket.handshake.auth.user_name;
    console.log(user_name)
    socket.user_name = user_name
    next()
});

// const saveBufferToFile = async (buffer) => {
//     const tempPath = path.join(_dirname, `temp-${Date.now()}.jpg`);
//     await fs.promises.writeFile(tempPath, buffer);
//     return tempPath;
// };

io.on('connection', (socket) => {
    console.log(socket.id, socket.user_name)

    const actual_history = [{
        role: "user",
        parts: [
            {
                text: `
You are AgroBot, a personal farming assistant designed to diagnose plant diseases and suggest remedies. When a user provides a plant image, you will analyze the information, identify the disease, and respond with structured details in the following JSON format:
                {
    "plantName": "",
    "diseaseName": "",
    "diseaseDescription": "",
    "estimate": "",
    "remedy": [],
    "summary": ""
}
The plantName field must include one of the following: Apple, Grape, Corn, Orange, Potato, or Tomato. The diseaseName field will indicate the identified disease, while the diseaseDescription field will provide a concise explanation of the disease. The estimate field will specify the approximate extent of the spread, categorized as high, medium, or low. Specific remedies to treat the disease must be listed in the remedy array, tailored to sustainable and region-specific practices for India, Maharashtra, and based on locally available solutions that consider the region's climatic and soil conditions. The summary field will provide a brief overview of the situation and recommended actions.

In addition to diagnosing plant diseases, you provide navigation between three pages: Home, CropDiagnostic, and PreviousDiagnostic. If a user requests to navigate to a specific page, you will emit an event in the format "open Page-name", replacing Page-name with the desired page name. For example, if the user says, "Take me to PreviousDiagnostic," you will emit "open PreviousDiagnostic". If the user wants to diagnose a crop, you will emit "open CropDiagnostic".

Ensure your responses are human-like, concise, and interactive while maintaining plain text formatting and excluding special characters. If the user requires additional clarification or details, provide clear and helpful guidance. Your ultimate goal is to deliver accurate, practical farming advice and smooth navigation, making your assistance relevant and actionable for farmers in Maharashtra. Don't use newline characters. Dont use '*' character in the response.
`},
        ],
    },
    {
        role: "model",
        parts: [
            { text: "Hello, I am your personal farming assistant. How may I assist you?" },
        ],
    },]
    const chatSession = AImodel.startChat({

        history: actual_history
    });

    socket.on('prompt', async (response) => {
        console.log(response)

        actual_history.push({
            role: "user",
            parts: [
                { text: `${response}` }
            ]
        })

        try {
            const result = await chatSession.sendMessage(response);
            const Airesponse = result.response.text();

            if (Airesponse) {
                actual_history.push({
                    role: "model",
                    parts: [
                        { text: `${Airesponse}` }
                    ]
                })
            }
            socket.emit("response", Airesponse)

        }
        catch (err) {
            socket.emit("error", "some internal error occured")
            console.error(err)
        }

    })

    socket.on('upload', async (file, weatherData) => {
        console.log(weatherData)
        console.log(file)

        actual_history.push({
            role: "user",
            parts: [
                {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: Buffer.from(file).toString("base64")
                    },
                  },
                {text: "Analyze the image and identify the disease"},
            ]
        })
        const result = await chatSession.sendMessage(`Analyze the image and respond according to above prompt also the weather conditions are ${JSON.stringify(weatherData)}`)
        const Airesponse = result.response.text()
        
        const uploadResult = await uploadOnCloudinary(file);
        
        const imageUrl = uploadResult ? uploadResult.url : "";
        

        const first_index = Airesponse.indexOf(`{`);
        const last_index = Airesponse.lastIndexOf(`}`);

        if (first_index > -1 && last_index > -1) {
            const json_extract = Airesponse.slice(first_index, last_index + 1);
            const response_json = JSON.parse(json_extract)
            socket.emit("response", {...response_json, imageUrl})
            socket.emit("diagnostic", {...response_json, imageUrl})

            const newDiagnosis = await Disease.create({...response_json, weatherData ,img: imageUrl});
            console.log(newDiagnosis);
        }
    })
})

app.use(cors())
app.use(bodyParser.json())

import mongoose from "mongoose";
import { uploadOnCloudinary } from "./cloudinary.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("Mongo Db Connected" , connectionInstance.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB",error);
        process.exit(1)
    }
}

app.get("/all_reports", async(req, res) => {
    try {
        const data = await Disease.find().sort({ timestamp: -1 });
        console.log("Data", data);
        
        return res.status(200).send(data)
    } catch (error) {
        console.error(error)
        return res.status(500).send("internal server error")
    }
})

app.get("/report/:plantName", async(req, res) => {
    try {
        const {plantName} = req.params;
        console.log(plantName);
        
        const data = await Disease.find({plantName}).sort({ timestamp: -1 });
        console.log("Data", data);
        
        return res.status(200).json({data});
    } catch (error) {
        console.error(error)
        return res.status(500).send("internal server error")
    }
})

httpserver.listen(3000, () => {
    connectDB().
    then(() => {console.log("Connected DB")}).
    catch((err) => {console.log(err)});
    
    console.log("server is running on port 3000")
})

export { io }
