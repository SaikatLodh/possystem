import fs from "fs";
import path from "path";
import { uploadFile } from "./cloudinary.js";
export const saveAndUploadFile = async (file, folderName = "uploads") => {
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
//# sourceMappingURL=fileUpload.js.map