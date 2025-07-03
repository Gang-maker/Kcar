const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dexwavagl',
  api_key: '571578981167279',
  api_secret: '1pGHUN5We0jIqGn_WA_WFUVBp1c'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'autorizz_cars', // Folder name in Cloudinary
    upload_preset: 'Kcarexport', // <-- Use your unsigned preset here
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

module.exports = { cloudinary, storage };