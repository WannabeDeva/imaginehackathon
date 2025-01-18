import mongoose, { Schema } from "mongoose";

const WeatherSchema = new Schema({
    humidity: {
        type: Number,
        required: true
    },
    pressure: {
        type: Number,
        required: true
    },
    sea_level: {
        type: Number,
        required: true
    },
    temperature: {
        type: String,
        required: true
    },
    temp_max: {
        type: String,
        required: true
    },
    temp_min: {
        type: String,
        required: true
    }
});

const DiseaseSchema = new Schema({
    plantName: {
        type: String,
        required: true
    },
    diseaseName: {
        type: String,
        required: true
    },
    diseaseDescription: {
        type: String,
        required: true,
    },
    remedy: {
        type: [String],
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    weatherData: {
        type: WeatherSchema,
        required: true
    },
    img:{
        type: String,
        required: true
    }
}, { timestamps: true });

export const Disease = mongoose.model('Disease', DiseaseSchema);