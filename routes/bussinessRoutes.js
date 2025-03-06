import express from 'express'
import { addProduct, bussinessLogin, bussinessRegistration } from '../controller/Bussinesscontroller.js'
import { upload } from '../middelware/multer.middelware.js'

const bussinessRoutes = express.Router()
bussinessRoutes.post('/bussinesssignup', bussinessRegistration)
bussinessRoutes.post('/bussinesssignin', bussinessLogin)
bussinessRoutes.post('/addproduct', upload.fields([
    { name: 'productImage[]', maxCount: 10 },  // Product images
    { name: 'colors[]', maxCount: 5 }          // Color images
]), addProduct)

export default bussinessRoutes