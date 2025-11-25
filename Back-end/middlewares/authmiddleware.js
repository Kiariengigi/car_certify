const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken')
const user = require('../Models/user')

const protect = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization 
    if (authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(' ')[1]
    }
    if (!token) return res.status(401).json({message: 'NOT AUTHORIZED'});
    
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const foundUser = await user.findById(decoded.id).select('-password')
        if (!foundUser) return res.status(401).json({ message: 'User not found' });
        req.user = foundUser;
        next()
        console.log("PROTECT middleware activated")
        console.log("Authorization header:", req.headers.authorization)

    } catch (err){
        res.status(401).json({message: 'Token invalid'})
        console.error("AUTH ERROR:", err.message)
        res.status(401).json({ message: "Not authorized" })
    }
}

const authorize = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) return res.status(403).json({message: 'Forbidden'})
    next()
}

module.exports = {protect, authorize}
