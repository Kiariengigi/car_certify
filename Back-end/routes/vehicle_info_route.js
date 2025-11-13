const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadImage')
const Vehicle = require('../Models/vehicle')
const { fetch_decode, genNewReport, retrieve_report, saveVeh, getVehiclesData} = require('../Controllers/vehicle_infoCtrl')
const { protect } = require('../middlewares/authmiddleware')

// Vehicle routes
router.post('/decode', fetch_decode)
router.post('/report', genNewReport)
router.get('/history', protect, retrieve_report)
router.post('/new', protect, upload.array('images', 5), saveVeh)
router.get('/makes', protect, getVehiclesData)

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
