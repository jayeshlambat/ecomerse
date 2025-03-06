import mongoose from "mongoose";

const bussinessSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    hashpassword: {
        type: String,
        required: true,
        minlength: 6
    },
    refreshToken: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionkey: false }, { timestamps: true })

const Bussiness = mongoose.model("Bussiness", bussinessSchema)
export default Bussiness