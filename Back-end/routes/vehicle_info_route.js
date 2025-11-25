const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadImage')
const Vehicle = require('../Models/vehicle')
const { fetch_decode, genNewReport, retrieve_report, saveVeh, getVehiclesData, getSingleVehicle, getDashboardData} = require('../Controllers/vehicle_infoCtrl')
const { protect } = require('../middlewares/authmiddleware')

// Vehicle routes
router.post('/decode', fetch_decode)
router.post('/report', genNewReport)
router.get('/history', protect, retrieve_report)
router.post('/new', protect, upload.array('image', 5), saveVeh)
router.get('/vehicles', protect, getVehiclesData)
router.get('/vehicles/:id', protect, getSingleVehicle)
router.get("/dashboard", protect, getDashboardData);
// routes/vehicleRoutes.js
router.put('/vehicles/:id', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

        // Update fields
        Object.assign(vehicle, req.body);

        await vehicle.save();
        res.status(200).json({ data: vehicle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// If you want a separate /register endpoint
router.post('/register', protect, upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path)

    const newVehicle = new Vehicle({
      ...req.body,
      image: imageUrls,
      user: req.user._id, // Make sure the vehicle is tied to the logged-in user
    })

    await newVehicle.save()
    res.status(201).json({ message: 'Vehicle registered successfully', vehicle: newVehicle })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to register vehicle' })
  }
})

module.exports = router
