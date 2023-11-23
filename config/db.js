import mongoose from "mongoose";

async function databaseConnection() {
    await mongoose.connect(process.env.MONGO_URI)
}

export default databaseConnection;