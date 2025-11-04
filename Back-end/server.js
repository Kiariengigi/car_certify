const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express')
const cors = require('cors')

const adminRoutes = require('../Back-end/routes/admin_routes')
const reportRoutes = require('../Back-end/routes/report_route')
const vehicleInfoRoute = require('../Back-end/routes/vehicle_info_route')
const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/report', reportRoutes)
app.use('/vehicle_info', vehicleInfoRoute)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
