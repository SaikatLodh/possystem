import fs from "fs";
import path from "path";
import { uploadFile } from "./cloudinary.ts";

interface FileInput {
  filename: string;
  mimetype: string;
  encoding: string;
  data: string;
}

export const saveAndUploadFile = async (
  file: FileInput,
  folderName: string = "uploads",
): Promise<{ publicId: string; url: string } | null> => {
  if (!file || !file.data) {
    return null;
  }

  const buffer = Buffer.from(file.data, "base64");
  const uploadsDir = path.join(process.cwd(), "public", folderName);

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, file.filename);

  fs.writeFileSync(filePath, buffer);
  const uploadedFile = await uploadFile(filePath);
  
  return uploadedFile;
};