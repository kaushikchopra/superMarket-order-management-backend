import Order from "../models/Order.js";
import Product from "../models/Product.js";

// GET all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "customer",
                select: "firstName lastName email phone address",
            })
            .populate({
                path: "products.product",
                select: "name quantity unit unitPrice totalPrice",
            });

        // Check if orders were found
        if (!orders) {
            return res.status(404).send("Orders not found");
        }

        // Map the orders to the desired response format
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            orderDate: order.orderDate,
            customer: {
                firstName: order.customer.firstName,
                lastName: order.customer.lastName,
                email: order.customer.email,
                phone: order.customer.phone,
                address: order.customer.address,
            },
            products: order.products.map(product => ({
                name: product.product.name,
                quantity: product.quantity,
                unit: product.unit,
                unitPrice: product.unitPrice,
                totalPrice: product.totalPrice,
            })),
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            deliveryStatus: order.deliveryStatus,
        }));

        // Respond with the formatted orders in JSON format
        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// GET a single order by ID
const getOrderById = async (req, res) => {
    try {
        // Fetch a single order by ID from the database and populate related data
        const order = await Order.findOne({ orderNumber: req.params.orderNumber })
            .populate({
                path: "customer",
                select: "firstName lastName email phone address",
            })
            .populate({
                path: "products.product",
                select: "name quantity unit unitPrice totalPrice",
            });

        // Check if the order was found
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Format the order to include nested customer and product details
        const formattedOrder = {
            _id: order._id,
            orderNumber: order.orderNumber,
            orderDate: order.orderDate,
            customer: {
                firstName: order.customer.firstName,
                lastName: order.customer.lastName,
                email: order.customer.email,
                phone: order.customer.phone,
                address: order.customer.address,
            },
            products: order.products.map(product => ({
                name: product.product.name,
                quantity: product.quantity,
                unit: product.unit,
                unitPrice: product.unitPrice,
                totalPrice: product.totalPrice,
            })),
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            deliveryStatus: order.deliveryStatus,
        };

        // Respond with the formatted order in JSON format
        res.status(200).json(formattedOrder);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// POST a new order
const createOrder = async (req, res) => {
    try {
        // Extract product details from the request body
        const { products } = req.body;

        // Check if products array is provided
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Products array is required and must not be empty." });
        }

        // Create a new order
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();

        // Update the stock for each product in the order
        for (const { product, quantity } of products) {
            // Find the product by ID
            const foundProduct = await Product.findById(product);

            // Update the stock based on the quantity in the order
            if (foundProduct) {
                foundProduct.stock -= quantity;

                // Save the updated product to the database
                await foundProduct.save();
            }
        }
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ error: "Bad Request" });
    }
}

// PUT (update) an order by ID
const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: "Bad Request" });
    }
}

// DELETE an order by ID
const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(deletedOrder);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// GET previous order number
const getLatestOrderNumber = async (req, res) => {
    try {
        // Find the order with the latest order date and time
        const latestOrder = await Order.findOne({}, { orderNumber: 1, orderDate: 1 })
            .sort({ orderDate: "desc", _id: "desc" })
            .limit(1);

        if (!latestOrder) {
            return res.status(404).json({ message: "No orders found." });
        }

        // Extract the order number from the latest order
        const latestOrderNumber = latestOrder.orderNumber;

        // Send the latest order number in the response
        res.status(200).json({ latestOrderNumber });
    } catch (error) {
        // Handle any errors that occurred during the process
        console.error("Error getting latest order number:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, getLatestOrderNumber }