import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localpath) => {
    try {
        if (!localpath) return null;

        const uploadResult = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto"
        });
        
        // Remove temp file after upload
        fs.unlinkSync(localpath);
        return uploadResult;

    } catch (error) {
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
        }
        console.error("Cloudinary upload error:", error);
        return null;
    }
};