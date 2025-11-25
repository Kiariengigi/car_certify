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
    try {
        console.log("Inside getVehiclesData")
        console.log("req.user:", req.user)
        let query = {};

        const vehicles = await Vehicle.find(query);

        const total = await Vehicle.countDocuments(query);

        res.set("Access-Control-Expose-Headers", "Content-Range");
        res.set("Content-Range", `vehicles 0-${vehicles.length}/${total}`);

        const formatted = vehicles.map(v => {
  // convert the main vehicle doc to plain object
  const vehicleObj = v.toObject();  
  const { _id, mileageReports, accidentReports, ...rest } = vehicleObj;

  const mileage = (mileageReports || []).map(m => ({
    id: m._id,  // just use _id directly
    ...m
  }));

  const accidents = (accidentReports || []).map(a => ({
    id: a._id,
    ...a
  }));

  return {
    id: _id,
    ...rest,
    mileageReports: mileage,
    accidentReports: accidents
  };
});


        return res.status(200).json({ data: formatted, total });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


exports.getSingleVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ error: "No vehicle" });
        }

        const { _id, ...rest } = vehicle._doc;  // REMOVE _id

        return res.json({
            data: {
                id: _id,
                ...rest
            }
        });

    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch vehicle" });
    }
};

// controllers/vehicle_infoCtrl.js

exports.getDashboardData = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    
    // Count of vehicles by make
    const makes = await Vehicle.aggregate([
      { $group: { _id: "$make", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalVehicles,
      makes 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

