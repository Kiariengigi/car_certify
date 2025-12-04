const { required } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MileageReportSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  mileage: { type: Number, required: true },
  predicted_mileage: { type: Number },  // add this
  flag: { type: String }                // add this
});

const reportSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Vehicle",
        required: true
    },
    image: [String],
    model: String,
    make: String,
    year: String,
    numPlate: String,
    rating: Number,
    //banner: [{ type: String }],
    //price_range: [{ type: Number}],
    mileageReports: [MileageReportSchema],
    current_mileage: Number,
    accidents: [],
    engine: String, 
    transmission: String, 
    engine_CC: String, 
    fuel_Type: String, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
      }

});

const Report = mongoose.model('Report', reportSchema)
module.exports = Report

