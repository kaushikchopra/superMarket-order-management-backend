import "dotenv/config";

import express from "express";

import mongoose from "mongoose";
import databaseConnection from "./config/db.js";

import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import credentials from "./middlewares/credentials.js";

import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import cookieParser from "cookie-parser";

import { logger } from "./middlewares/logEvents.js";
import errorHandler from "./middlewares/errorHandler.js";
import { isAuthenticated } from "./middlewares/authMiddlewares.js";

const app = express();

const PORT = process.env.PORT || 8070;
const NODE_ENV = process.env.NODE_ENV;

// Connect to the database
databaseConnection();

// custom middleware logger
if (NODE_ENV === "development") {
    app.use(logger);
}

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/orders", isAuthenticated, orderRoutes);
app.use("/api/products", isAuthenticated, productRoutes);
app.use("/api/customers", isAuthenticated, customerRoutes);

// Handle all errors
if (NODE_ENV === "development") {
    app.use(errorHandler);
}

mongoose.connection.on("error", (error) => {
    console.error(`MongoDB Connection Error: ${error}`);
})

mongoose.connection.once("open", () => {
    console.log("MongoDB is connected")

    // Start the Server
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    })
})