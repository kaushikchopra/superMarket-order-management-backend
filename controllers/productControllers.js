import Product from "../models/Product.js";

// GET (read) all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
            return res.status(404).send("Products not found")
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// GET (read) a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// POST (create) a new product
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Validation Error", details: error.message });
        } else if (error.code === 11000 && error.keyPattern && error.keyPattern.name === 1 && error.keyPattern.category === 1) {
            return res.status(400).json({ error: "Duplicate Key Error", details: "Product with the same name and category already exists" });
        }
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// PUT (update) a product by ID
const updateProduct = async (req, res) => {
    try {
        console.log("Updating product with ID:", req.params.id);
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Validation Error", details: error.message });
        } else if (error.code === 11000 && error.keyPattern && error.keyPattern.name === 1 && error.keyPattern.category === 1) {
            return res.status(400).json({ error: "Duplicate Key Error", details: "Product with the same name and category already exists" });
        }
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// DELETE a product by ID
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.sendStatus(204); // No Content (Product deleted successfully)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };