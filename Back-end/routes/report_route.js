const express = require('express')
const router = express.Router()
const {retrieveMyReports, retrieveReport, createNewReport, getAllReports} = require('../Controllers/reportCTRL')
const { protect } = require('../middlewares/authmiddleware')

router.get('/retrieve/:numberPlate', retrieveReport)
router.post('/genReport', protect, createNewReport)
router.get('/reports/all', protect, getAllReports);


module.exports = router