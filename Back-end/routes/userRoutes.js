const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const Joi = require("joi");
const { signUp, login } = require('../Controllers/authCTRL')
const validate = require('../middlewares/validateUser')

// Add new user
const newUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Buyer','Dealership').required()
})
//Login User
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

router.post('/new', validate(newUserSchema), signUp)
router.post('/login', validate(loginSchema), login)

module.exports = router;
