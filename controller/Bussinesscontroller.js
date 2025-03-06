import { accessAndRefreshToken } from "../accessAndRefreshToken.js";
import { comparePwd, hashedPwd } from "../hashpwd.js";
import Bussiness from "../model/bussiness.model.js";
import Product from "../model/productmodel.js";
import cloudinary from '../cloudinary.js'
import fs from 'fs'

const bussinessRegistration = async (req, res) => {
    const { name, email, username, password } = req.body.formData
    console.log("name", name);
    console.log("email", email);
    console.log("username", username);
    console.log("password", password);
    try {
        // check all fields come or not
        if (!name || !email || !username || !password) {
            console.log("all fields are required");
            return res.status(400).json({
                message: "all fields are reuired"
            })
        }
        const userExist = await Bussiness.findOne({ email: email })
        if (userExist) {
            console.log("user already exist");
            return res.status(401).json({
                message: 'user already exist'
            })
        }

        const hashedPass = await hashedPwd(password)
        console.log("hashed password", hashedPass);

        const newUser = await new Bussiness({
            name,
            username,
            email,
            hashpassword: hashedPass,
            password: password
        })

        const user = await newUser.save()
        if (!user) {
            return res.status(402).json({
                message: "registration failed",
                status: false
            })
        }
        if (user) {
            return res.status(200).json({
                message: "registraion success",
                status: true
            })
        }

        console.log("user", user);
    } catch (error) {
        console.log("error", error);
    }
}
const bussinessLogin = async (req, res) => {
    const { userNameOrEmail, password } = req.body.loginDetail
    console.log("userNameOrEmail", userNameOrEmail);
    console.log("password", password);

    if (!userNameOrEmail || !password) {
        return res.status(400).json({
            message: "insert all crediantial"
        })
    }
    try {
        // const user = await Bussiness.findOne({
        //     $or: [{ username: userNameOrEmail }, { email: userNameOrEmail }]
        // });
        const user = await Bussiness.findOne({ email: userNameOrEmail })

        console.log("user =", user);
        if (!user) {
            return res.status(401).json({
                message: "user not found"
            })
        }
        // check password
        const chkpwd = await comparePwd(password, user.hashpassword)
        if (!chkpwd) {
            return res.status(401).json({
                message: "password is incorrect",
                success: false
            })
        }
        console.log("chkpwd", chkpwd);

        const { accessToken, refreshToken } = await accessAndRefreshToken(user)
        console.log("accesstoken", accessToken);
        console.log("refreshToken", refreshToken);

        //send refresh token in database
        user.refreshToken = refreshToken
        await user.save()

        return res.status(200)
            .json({
                message: "user logged in succesfully",
                success: true,
                userData: user,
                accessToken: accessToken
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

        // console.log("data", req.files.colors);

        if (!req.files) {
            return res.status(400).json({
                message: 'No files uploaded',
                success: false
            });
        }

        const productImages = [];
        const colorImages = [];

        // Upload product images to Cloudinary
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
        console.log("colorimage url", colorImages);
        console.log("productimage url", productImages);

        // Now save product data in the database, including image URLs
        // const product = new Product({
        //     title: req.body.title,
        //     cateogery: req.body.cateogery,
        //     description: req.body.description,
        //     discount: req.body.discount,
        //     price: req.body.price,
        //     priceBeforeDiscount: req.body.priceBeforeDiscount,
        //     measurement: req.body.measurement,
        //     additionalInfo: req.body.additionalinfo,
        //     productImages: productImages, // Save the array of product image URLs
        //     colors: colorImages      // Save the array of color image URLs
        // });

        //await product.save(); // Save product data to your database

        // if (!product) {
        //     return res.status(400).json({
        //         message: 'server error',
        //         success: false,
        //     })
        // }

        // const allProduct = await Product.find()
        // console.log("allproduct", allProduct);

        // res.status(200).json({
        //     message: 'product went to admin succesfully',
        //     success: true,
        //     productData: allProduct

        // });

        res.status(200).json({
            message: 'Product sent to admin successfully',
            success: true,
            productData: req.body ? {
                title: req.body.title || '',
                cateogery: req.body.cateogery || '',
                description: req.body.description || '',
                discount: req.body.discount || '',
                price: req.body.price || '',
                priceBeforeDiscount: req.body.priceBeforeDiscount || '',
                measurement: req.body.measurement || '',
                additionalInfo: req.body.additionalinfo || '',
                productImages: productImages.length > 0 ? productImages : [],
                colors: colorImages.length > 0 ? colorImages : []
            } : null
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

const checkproduct = async (req, res) => {
    try {
        console.log("data from checkproduct", req.body);
        //   console.log("file", req.files);

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
            productImages: req.body.productImages,
            colors: req.body.colors

        });

     const currentProduct=   await product.save(); // Save product data to your database

        if (!currentProduct) {
            return res.status(400).json({
                message: 'server error',
                success: false,
            })
        }
        console.log("currentproduct", product)

        const allProduct = await Product.find()
       // console.log("allproduct", allProduct);

        res.status(200).json({
            msg: 'product accepted successfully',
            message: 'Product added successfully!',
            success: true,
            currentProduct: currentProduct,
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

export { bussinessRegistration, bussinessLogin, addProduct, checkproduct } 