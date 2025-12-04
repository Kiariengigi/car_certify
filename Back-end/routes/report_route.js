const express = require('express')
const router = express.Router()
const {retrieveMyReports, retrieveReport, createNewReport} = require('../Controllers/reportCTRL')

router.get('/retrieve/:numberPlate', retrieveReport)
router.get('/retrieveUserReport', retrieveMyReports)
router.post('/genReport', createNewReport)


module.exports = router