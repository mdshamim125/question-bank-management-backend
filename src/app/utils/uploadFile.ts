import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";

const s3Client = new S3Client({
  endpoint: config.digitalOcean.endpoint,
  region: "nyc3",
  credentials: {
    accessKeyId: config.digitalOcean.accessKeyId!,
    secretAccessKey: config.digitalOcean.secretAccessKey!,
  },
});

interface UploadFileResponse {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
  fileType?: string;
}

export const uploadFile = async (
  file: Express.Multer.File,
  folder: "images" | "pdfs" | "docs" | "others" = "others"
): Promise<UploadFileResponse> => {
  try {
    if (!file) return { success: false, error: "No file provided" };

    const ext = file.originalname.split(".").pop();
    const uniqueName = `${folder}/${uuidv4()}.${ext}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: config.digitalOcean.bucket,
      Key: uniqueName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const url = `${config.digitalOcean.endpoint}/${config.digitalOcean.bucket}/${uniqueName}`;

    return {
      success: true,
      url,
      fileName: uniqueName,
      fileType: file.mimetype,
    };
  } catch (error: any) {
    console.error("Upload failed:", error);
    return {
      success: false,
      error: error.message || "Upload failed",
    };
  }
};