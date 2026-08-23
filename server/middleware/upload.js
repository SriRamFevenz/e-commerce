const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ddbtclyw2", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
});

module.exports = upload;
