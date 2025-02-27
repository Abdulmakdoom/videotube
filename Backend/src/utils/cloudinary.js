import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
}); 

const uploadOnCloudinary = async (localFilePath) => {  
    if (!localFilePath) {
        throw new Error(`Local path file is required for ${localFilePath}`);
    }

    try {
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        //console.log("File uploaded successfully:", response.url);

        // Check if the file exists before deleting
        if (fs.existsSync(localFilePath)) {
            console.log("Deleting local file...");
            fs.unlinkSync(localFilePath);
        }

        return response;  // Return Cloudinary response

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        // Ensure the file exists before trying to delete it
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
}

export { uploadOnCloudinary };



