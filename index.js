import express from "express";
import dotenv from "dotenv";
import mongodbconnect from "./db.js";
import cors from 'cors'
import bodyParser from "body-parser";
import routes from "./routes/userroutes.js";
import Router from "./routes/adminRoute.js";
import bussinessRoutes from "./routes/bussinessRoutes.js";
dotenv.config()
const app = express()
//database conection
mongodbconnect();

//middelware
app.use(cors())
app.use(bodyParser.json())
app.use('/api', routes) // memberlogin
app.use('/api/admin', Router) // adminlogin
app.use('/api/bussiness', bussinessRoutes) // bussiness login



//routes
app.get('/', (req, res) => {
    res.send("backend here")
})
const port = process.env.PORT
app.listen(port, () => {
    console.log(`server is started at http://localhost:${port}`);
})
