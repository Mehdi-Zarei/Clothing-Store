const fs = require("fs");

function removeUploadedImages(images) {
  if (!images || images.length === 0) return;

  images.forEach((imgPath) => {
    fs.unlink(imgPath, (err) => {
      if (err) console.error("خطا در حذف فایل:", err.message);
    });
  });
}

module.exports = removeUploadedImages;
