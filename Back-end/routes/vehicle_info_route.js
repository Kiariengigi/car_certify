const express = require('express')
const router = express.Router()
const Joi = require('joi')

const registerVehicle = Joi.object({
    //GENERAL VEHICLE INFORMATION
    numPlate: Joi.string().
    pattern(/^K[A-Z]{2}\s\d{3}[A-Z]$/).
    required(),
    make: Joi.string().required(), 
    model: Joi.string().required(), 
    year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear()).required(),
    engine: Joi.string().required(),
    engineCC: Joi.number(), 
    fuel: Joi.string().valid('Petrol', 'Diesel').required(),
    transmission: Joi.string().valid('Automatic', 'Manual').required(),
    //MILEAGE REPORTS
    mileageReports: Joi.array().items(
        Joi.object({
            date: Joi.date().required(),
            mileage: Joi.number().positive().required(), 
        })
    ).min(1).required(),
    //SERVICE REPORTS 
    serviceReports: Joi.array().items(
        Joi.object({
            date: Joi.date().required(),
            services: Joi.array()
    .items(
      Joi.string().valid(
        'Oil & Filter change', 'Tire rotation', 'Wheel Alignment', 'Engine & Cabin Air Filter replacement', 'Brake Fluid Exchange', 'Spark Plug Replacement'
      )
    )
    .min(1)
    .required()
    .messages({
      'any.only': 'One or more selected services are invalid.',
      'array.min': 'At least one service must be selected.'
    }),
        })
    ).min(1).required(),
    //OWNERSHIP REPORTS --- FIGURE THIS OUT!
    //ACCIDENT RECORDS 
    mileageReports: Joi.array().items(
        Joi.object({
            date: Joi.date().required(),
            severity: Joi.string().valid('Minor damage', 'Functional Damage', 'Disabling damage', 'Write-off'), 
            location: Joi.array().items(
                Joi.string().valid('Rear','Left side', 'Right side', 'Front')
            )
        })
    )
    
})

router.post('/vehicle/decode', vehicle_infoCtrl.fetch_decode)
router.post('/vehicle/report', vehicle_infoCtrl.genNewReport)
router.get('/vehicle/:vin/history',vehicle_infoCtrl.retrieve_report)
router.post('/vehicle/new', vehicle_infoCtrl.saveVeh)


module.exports = router