import express from "express";
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../controllers/customerControllers.js";

const router = express.Router();

// GET all customers
router.get("/", getAllCustomers);

// GET a single customer by ID
router.get("/:id", getCustomerById);

// POST a new customer
router.post("/", createCustomer);

// PUT (update) a customer by ID
router.put("/:id", updateCustomer);

// DELETE a customer by ID
router.delete("/:id", deleteCustomer);

export default router;
