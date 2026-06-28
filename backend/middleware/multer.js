import multer from "multer";

// ==========================================
// Multer Configuration — For Image Upload
// ==========================================

// Memory storage — file will NOT be saved to disk, it stays in RAM as a buffer
// Then we send this buffer to Cloudinary
const storage = multer.memoryStorage();

// File filter — only allow images (jpg, png, gif, webp)
const fileFilter = (req, file, cb) => {
  // Allowed mime types
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only images can be uploaded (jpg, png, gif, webp)"), false);
  }
};

// Multer instance — max 5 files, max 5MB per file
const uploadFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 5, // Maximum 5 files at once
  },
}).array("files", 5);

export default uploadFiles;
