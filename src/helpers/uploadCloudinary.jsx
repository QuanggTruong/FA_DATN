import { message } from "antd";
import CryptoJS from "crypto-js";

const CLOUDINARY_NAME = import.meta.env.VITE_APP_CLOUDINARY_NAME;
const API_KEY = import.meta.env.VITE_APP_CLOUDINARY_API_KEY;
const SECRET_KEY = import.meta.env.VITE_APP_CLOUDINARY_SECRET_KEY;

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/auto/upload`;
const DESTROY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/destroy`;

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "do_an_web");
  try {
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    message.error("Có lỗi xả ra khi upload ảnh");
    throw error;
  }
};

export const deleteFile = async (publicId) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = CryptoJS.SHA1(
    `public_id=${publicId}&timestamp=${timestamp}${SECRET_KEY}`
  ).toString();
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("signature", signature);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp);
  try {
    const response = await fetch(DESTROY_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    message.error("Có lỗi xả ra khi xóa ảnh");
    throw error;
  }
};
