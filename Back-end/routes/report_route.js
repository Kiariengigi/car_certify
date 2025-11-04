const express = require('express')
const router = express.Router()

router.get('/report/:id', reportCtrl.retrieveReport)
router.get('/report/mine', reportCtrl.retrieveMyReports)


module.exports = router