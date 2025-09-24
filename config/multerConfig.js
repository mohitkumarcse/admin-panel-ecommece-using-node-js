const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload folder path
const baseUploadPath = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fieldName = file.fieldname;

    let subFolder = 'misc';
    if (fieldName.includes('profile')) subFolder = 'profile';
    else if (fieldName.includes('category')) subFolder = 'category';
    else if (fieldName.includes('brand')) subFolder = 'brand';

    const uploadPath = path.join(baseUploadPath, subFolder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;