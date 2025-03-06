import mongoose from "mongoose";
const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    cateogery: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: String,
    },
    price: {
        type: String,
        required: true
    },
    priceBeforeDiscount: {
        type: String,
      
    },
    measurement: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: String,

    },
    productImages: {
        type: [String],
        required: true
    },
    colors: {
        type: [String],

    }
}, { versionkey: false }, { timestamps: true })

const Product = mongoose.model("Products", productSchema)
export default Product