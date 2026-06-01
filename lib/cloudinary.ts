import crypto from "crypto";

const CLOUDINARY_UPLOAD_URL = (cloudName: string) =>
  `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

type UploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  bytes: number;
  format?: string;
};

type CloudinaryCredentials = {
  cloudName: string;
  apiKey?: string;
  apiSecret?: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} est manquant dans les variables d'environnement`);
  }

  return value;
}

function getCloudinaryCredentials(): CloudinaryCredentials {
  const cloudinaryUrl = process.env.CLOUDINARY_URL || process.env.CLOUDINARY_API_NAME;

  if (cloudinaryUrl?.startsWith("cloudinary://")) {
    const parsed = new URL(cloudinaryUrl);

    return {
      cloudName: parsed.hostname,
      apiKey: decodeURIComponent(parsed.username),
      apiSecret: decodeURIComponent(parsed.password),
    };
  }

  return {
    cloudName: requiredEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

function signUpload(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(payload + apiSecret).digest("hex");
}

export async function uploadToCloudinary(file: File) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const folder = process.env.CLOUDINARY_FOLDER || "library-manager";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  if (uploadPreset) {
    formData.append("upload_preset", uploadPreset);
  } else {
    if (!apiKey || !apiSecret) {
      throw new Error("Configure CLOUDINARY_UPLOAD_PRESET ou CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET");
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = signUpload({ folder, timestamp }, apiSecret);

    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
  }

  const response = await fetch(CLOUDINARY_UPLOAD_URL(cloudName), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Cloudinary a refuse l'upload: ${details}`);
  }

  const result = (await response.json()) as UploadResult;

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    bytes: result.bytes,
    format: result.format,
  };
}
