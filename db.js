import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const mongodbconnect = async () => {
    try {
       await mongoose.connect(process.env.MONGOURI)
        console.log("mongodb connect succesfully");
    } catch (error) {
        console.log("error", error)
        return error
    }
}
export default mongodbconnect