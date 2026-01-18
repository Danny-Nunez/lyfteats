import { put } from "@vercel/blob";
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

/**
 * Disable body parsing, we'll handle it with formidable
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @desc   Upload file to Vercel Blob Storage
 * @route  POST /api/blob-upload
 * @method POST
 * @access Public
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let tempFilePath = null;

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
      uploadDir: os.tmpdir(),
      filename: (name, ext, part) => {
        return `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
      },
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    tempFilePath = file.filepath;

    // Read file buffer
    const fileBuffer = await fs.readFile(file.filepath);
    const originalFilename = file.originalFilename || file.newFilename || "upload";

    // Generate unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${originalFilename}`;

    // Upload to Vercel Blob Storage
    const blob = await put(filename, fileBuffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.mimetype || "application/octet-stream",
    });

    // Clean up temp file
    try {
      await fs.unlink(tempFilePath);
    } catch (unlinkError) {
      console.warn("Failed to delete temp file:", unlinkError);
    }

    // Return response compatible with next-s3-upload format for backward compatibility
    return res.status(200).json({
      url: blob.url,
      key: blob.pathname,
    });
  } catch (error) {
    // Clean up temp file on error
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (unlinkError) {
        // Ignore cleanup errors
      }
    }

    console.error("Upload error:", error);
    
    // Provide more helpful error messages
    let errorMessage = "Server Error";
    if (error.message?.includes("BlobStoreNotFoundError") || error.message?.includes("This store does not exist")) {
      errorMessage = "Vercel Blob Storage is not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.";
    } else if (error.message?.includes("BLOB_READ_WRITE_TOKEN")) {
      errorMessage = "Missing BLOB_READ_WRITE_TOKEN. Please configure Vercel Blob Storage.";
    } else {
      errorMessage = error.message || "Upload failed";
    }

    return res.status(500).json({
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default handler;

