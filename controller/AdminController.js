
import Admin from "../model/admin.model.js";
// import { v2 as cloudinary } from 'cloudinary'
import Product from "../model/productmodel.js";
import cloudinary from '../cloudinary.js'
import fs from 'fs'
const admin = async (req, res) => {
    const { username, password } = req.body.loginDetail
    console.log("admin data", username);
    console.log("admin data", password);
    try {
        const user = await Admin.findOne({ password });

        console.log("user", user);
        if (!user) {

            const newAdmin = new Admin({
                username: "admin121",
                password: "Admin@121",
            });
            await newAdmin.save()

            return res.status(400).json({
                message: "admin not found"
            })
        }
        // check password
        if (user) {
            const chkpwd = password === user.password
            console.log(chkpwd);


        } else {
            return res.status(401).json({
                message: "admin password incorect"
            })
        }
        return res.status(200).json({
            message: "admin login succesfully",
            userData: user
        })
    } catch (error) {
        console.log("error line no 109", error);
        return res.status(500).json({
            message: "server error",
            success: false
        })

    }
}

const addProduct = async (req, res) => {
    try {
        console.log("data", req.body);
        console.log("file", req.files);

        console.log("data", req.files.colors);

        if (!req.files) {
            return res.status(400).json({
                message: 'No files uploaded',
                success: false
            });
        }

        const productImages = [];
        const colorImages = [];

        //   Upload product images to Cloudinary
        for (let i = 0; i < req.files['productImage[]'].length; i++) {
            const file = req.files['productImage[]'][i]
            const result = await cloudinary.uploader.upload(
                file.path, {
                resource_type: 'auto'
            });

            // Push the Cloudinary URL to the array
            productImages.push(result.url);
            fs.unlinkSync(file.path);
        }

        // Upload color images to Cloudinary

        if (req.files['colors[]']) {

            for (let i = 0; i < req.files['colors[]'].length; i++) {
                const file = req.files['colors[]'][i]
                const result = await cloudinary.uploader.upload(
                    file.path, {
                    resource_type: 'auto'
                });

                // Push the Cloudinary URL to the array
                colorImages.push(result.url);
                fs.unlinkSync(file.path);

            }
        }
        console.log("productimage url", colorImages);
        console.log("productimage url", productImages);

        // Now save product data in the database, including image URLs
        const product = new Product({
            title: req.body.title,
            cateogery: req.body.cateogery,
            description: req.body.description,
            discount: req.body.discount,
            price: req.body.price,
            priceBeforeDiscount: req.body.priceBeforeDiscount,
            measurement: req.body.measurement,
            additionalInfo: req.body.additionalinfo,
            productImages: productImages, // Save the array of product image URLs
            colors: colorImages      // Save the array of color image URLs

        });

        await product.save(); // Save product data to your database

        if (!product) {
            return res.status(400).json({
                message: 'server error',
                success: false,
            })
        }

     //console.log("current product ", product);

        const allProduct = await Product.find()
        console.log("allproduct", allProduct);

        res.status(200).json({
            message: 'Product added successfully!',
            success: true,
            productData: allProduct

        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

export { admin, addProduct } 