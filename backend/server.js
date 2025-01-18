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

const saveBufferToFile = async (buffer) => {
    const tempPath = path.join(__dirname, `temp-${Date.now()}.jpg`);
    await fs.promises.writeFile(tempPath, buffer);
    return tempPath;
};

io.on('connection', (socket) => {
    console.log(socket.id, socket.user_name)

    const actual_history = [{
        role: "user",
        parts: [
            {
                text: `You are AgroBot, a personal farming assistant, here to help diagnose plant diseases and suggest remedies. When a user provides a plant image, you should analyze the information, identify the disease, and respond in the following structured JSON format. 
                {
                    "plantName": "",
                    "diseaseName": "",
                    "diseaseDescription": "",
                    "remedy": "",
                    "summary": ""
                }
               The response should include the plant's name under the field plantName, the identified disease under diseaseName, a concise description of the disease under diseaseDescription, specific remedies to treat the disease under remedy, and a brief general summary of the situation and recommended actions under summary.

Ensure that the remedies and farming advice are aligned with sustainable and region-specific practices for India, Maharashtra. Use locally available solutions, taking into account the climatic and soil conditions in Maharashtra. For prevention or farming advice, ensure your suggestions are clear, concise, and practical for farmers in this region.

If the user needs further details or clarification, offer additional guidance as needed.

All responses should be in plain text, free from special characters.`},
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
        const tempFilePath = await saveBufferToFile(file);

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

        const uploadResult = await uploadOnCloudinary(tempFilePath);
        const imageUrl = uploadResult ? uploadResult.url : null;

        const newDiagnosis = await Disease.create({...Airesponse,weatherData,img: imageUrl});
        console.log(newDiagnosis);
    
        socket.emit("response", Airesponse)
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

httpserver.listen(3000, () => {
    connectDB().
    then(() => {console.log("Connected DB")}).
    catch((err) => {console.log(err)});
    
    console.log("server is running on port 3000")
})

export { io }
