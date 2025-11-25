const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vehicleSchema = new mongoose.Schema({
  // GENERAL VEHICLE INFORMATION
  numPlate: {
    type: String,
    required: true,
    match: /^K[A-Z]{2}\s\d{3}[A-Z]$/,
    unique: true,
  },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
    required: true,
  },
  engine: { type: String, required: true },
  engineCC: { type: Number },
  fuel: { type: String, enum: ['Petrol', 'Diesel'], required: true },
  transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },

  // IMAGE UPLOAD
  image: [{ type: String }], // URL from Cloudinary

  // MILEAGE REPORTS
  mileageReports: [
    {
      date: { type: Date, required: true },
      mileage: { type: Number, required: true, min: 0 },
    },
  ],

  // ACCIDENT RECORDS
  accidentReports: [
    {
      date: { type: Date, required: true },
      severity: {
        type: String,
        enum: [
          'Minor damage',
          'Functional damage',
          'Disabling damage',
          'Write-off',
        ],
      },
      location: [{ type: String, enum: ['Rear', 'Left', 'Right', 'Front'] }],
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle