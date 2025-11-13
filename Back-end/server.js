const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const connectDB = require('./db/connection')
const express = require('express')
const cors = require('cors')

const adminRoutes = require('./routes/admin_routes')
const reportRoutes = require('./routes/report_route')
const vehicleInfoRoute = require('./routes/vehicle_info_route')
const userRoutes = require('./routes/userRoutes')
const PORT = process.env.PORT
const app = express()
connectDB(process.env.MONGO_URI)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use('/admin', adminRoutes)
app.use('/report', reportRoutes)
app.use('/vehicleInfo', vehicleInfoRoute)
app.use('/users', userRoutes)

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
