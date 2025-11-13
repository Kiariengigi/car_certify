const Vehicle = require('../Models/vehicle'); 
exports.fetch_decode = async (req, res) => {
    res.send('vehichle info controller works 1')
}
exports.genNewReport = async (req, res) => {
    res.send('vehichle info controller works 1')
}
exports.retrieve_report = async (req, res) => {
    try{
        const vehicles = await Vehicle.find({user: req.user._id})
        res.status(200).json({success: true, data: vehicles})
    } catch (err){
        res.status(500).json({success: false, message: err.message})
    }
}
exports.saveVeh = async (req, res) => {
  try {
    // Handle images
    const images = req.files ? req.files.map(f => f.path) : [];

    // Parse reports safely
    let mileageReports = [];
    let serviceReports = [];
    let accidentReports = [];

    try {
      mileageReports = req.body.mileageReports ? JSON.parse(req.body.mileageReports) : [];
    } catch {}
    try {
      serviceReports = req.body.serviceReports ? JSON.parse(req.body.serviceReports) : [];
    } catch {}
    try {
      accidentReports = req.body.accidentReports ? JSON.parse(req.body.accidentReports) : [];
    } catch {}

    const newVehicle = new Vehicle({
      numPlate: req.body.numPlate,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      engine: req.body.engine,
      fuel: req.body.fuel,
      transmission: req.body.transmission,
      mileageReports,
      serviceReports,
      accidentReports,
      image: images,
      user: req.user._id, // Make sure protect middleware sets req.user
    });

    await newVehicle.save();
    res.status(201).json({ success: true, message: 'Vehicle saved successfully', data: newVehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getVehiclesData = async (req, res) => {
    try{
        const vehicles = await Vehicle.find({ user: req.user._id}).select('make -_id')

        const makes = [...new Set(vehicles.map(v => v.make))]

        res.status(200).json({ success: true, data: makes})
    } catch (err) {
        res.status(500).json({ success: false, message: err.message})
    }
}
