const express = require('express')
const router = express.Router()
const {retrieveMyReports, retrieveReport} = require('../Controllers/reportCTRL')

router.get('/:id', retrieveReport)
router.get('/mine', retrieveMyReports)


module.exports = router