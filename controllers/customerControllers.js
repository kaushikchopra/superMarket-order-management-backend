import mongoose from "mongoose";
import Customer from "../models/Customer.js";

// GET all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// GET a single customer by ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// POST a new customer
const createCustomer = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if they customer already exists. If yes, return the existing customer details to client.
        const existingCustomer = await Customer.findOne({ email }).exec();
        if (existingCustomer) {
            return res.status(200).json(existingCustomer);
        }

        // Otherwise create a new customer data in database
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        if (error?.code === 11000 && error?.keyPattern?.phone) {
            // Duplicate key error (E11000) handling for the phone field
            return res.status(400).json({
                error: "Duplicate Key Error",
                details: "Phone number already exists",
            });
        }

        console.error("createCustomer error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// PUT (update) a customer by ID
const updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCustomer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json(updatedCustomer);
    } catch (error) {
        if (error.name === "ValidationError") {
            // Mongoose validation error
            const validationErrors = {};
            for (const key in error.errors) {
                validationErrors[key] = error.errors[key].message;
            }
            console.log("validation Errors: ", validationErrors)
            return res.status(400).json({ error: "Validation Error", validationErrors });
        }
        console.error("updateCustomer error:", error);
        res.status(400).json({ error: "Bad Request" });
    }
}

// DELETE a customer by ID
const deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json(deletedCustomer);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };