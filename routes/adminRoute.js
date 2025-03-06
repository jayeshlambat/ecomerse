import express from "express";
import { admin, addProduct } from "../controller/AdminController.js";
import { upload } from "../middelware/multer.middelware.js";
import { checkproduct } from "../controller/Bussinesscontroller.js";
const Router = express.Router()
Router.post('/adminlogin', admin)

Router.post('/addproduct', upload.fields([
    { name: 'productImage[]', maxCount: 10 },  // Product images
    { name: 'colors[]', maxCount: 5 }          // Color images
]), addProduct)


Router.post('/checkproduct', upload.fields([
    { name: 'productImage[]', maxCount: 10 },  // Product images
    { name: 'colors[]', maxCount: 5 }          // Color images
]), checkproduct)

export default Router