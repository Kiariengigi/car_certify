const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true, lowercase: true, trim: true}, 
    password: {type: String, select: false}, 
    role: {type: String, enum:['Buyer','Dealership','admin'], default: 'Buyer'},
    createdAt: {type: Date, default: Date.now},
    googleId: { type: String },
})

userSchema.pre('save', async function (next){
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.matchpass = async function(candidate){
    return await bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model("User", userSchema)