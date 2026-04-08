import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
const env = dotenv;
env.config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const uploadFile = async (localfilePath: string) => {
  if (!localfilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localfilePath);
    return {
      publicId: response.public_id,
      url: response.secure_url,
    };
  } catch (error) {
    fs.unlinkSync(localfilePath);
    return null;
  }
};

const deleteImage = async (publicId: string) => {
  if (!publicId) return null;
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadFile, deleteImage };
