import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a valid product name"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Please enter a valid product category"],
        trim: true
    },
    unitPrice: {
        type: Number,
        required: [true, "Please enter a valid unit price"]
    },
    unit: {
        type: String,
        required: [true, "Please enter a valid product unit"],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, "Please enter a valid stock amount"]
    }
})

// Create a compound index for unique combination of name and category
productSchema.index({ name: 1, category: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

export default Product;