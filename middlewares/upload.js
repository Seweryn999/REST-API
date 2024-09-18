const path = require("node:path");
const multer = require("multer");

const uploadDir = path.join(process.cwd(), "tmp");
const storeImageDir = path.join(process.cwd(), "public", "avatars");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const now = new Date();
    const fileName = [now.getTime(), file.originalname].join("_");
    callback(null, fileName);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({ storage });

module.exports = {
  uploadDir,
  storeImageDir,
  upload,
};
