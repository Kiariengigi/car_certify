const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary, 
    params: {
        folder: 'vehicle_uploads',
        allowed_formats: ['jpg','jpeg','png']
    }
})

module.exports = {cloudinary, storage}