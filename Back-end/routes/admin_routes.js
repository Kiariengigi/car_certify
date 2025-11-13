const express = require('express')
const router = express.Router()
const {getreports} = require('../Controllers/adminCTRL')

router.get('/reports', getreports)

module.exports = router

