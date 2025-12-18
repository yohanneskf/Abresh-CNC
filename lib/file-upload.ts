import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export interface UploadedFile {
  originalFilename: string;
  newFilename: string;
  filepath: string;
  mimetype: string;
  size: number;
}

export async function saveUploadedFile(file: any): Promise<string> {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "submissions"
    );
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExt = path.extname(file.originalFilename);
    const randomName = randomBytes(16).toString("hex");
    const newFilename = `${randomName}${fileExt}`;
    const newPath = path.join(uploadDir, newFilename);

    // Read the file and save it
    const fileBuffer = await fs.readFile(file.filepath);
    await fs.writeFile(newPath, fileBuffer);

    // Delete temporary file
    await fs.unlink(file.filepath);

    // Return the public URL
    return `/uploads/submissions/${newFilename}`;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save uploaded file");
  }
}

export async function handleFileUpload(files: any[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    try {
      const url = await saveUploadedFile(file);
      uploadedUrls.push(url);
    } catch (error) {
      console.error("Error processing file:", error);
      // Continue with other files even if one fails
    }
  }

  return uploadedUrls;
}
