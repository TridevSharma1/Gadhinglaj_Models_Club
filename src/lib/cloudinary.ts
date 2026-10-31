import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(
  fileBufferOrBase64: string | Buffer,
  folder: string = "gmc_atelier",
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    if (typeof fileBufferOrBase64 === "string" && fileBufferOrBase64.startsWith("data:")) {
      cloudinary.uploader.upload(
        fileBufferOrBase64,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
          } else {
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        },
      );
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload stream failed"));
          } else {
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        },
      );

      if (Buffer.isBuffer(fileBufferOrBase64)) {
        uploadStream.end(fileBufferOrBase64);
      } else {
        uploadStream.end(Buffer.from(fileBufferOrBase64 as string));
      }
    }
  });
}
