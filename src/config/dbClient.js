import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI),
            console.log("conexion exitosa")
    } catch (error) {
        console.log("Error de conexion", error.message);
        process.exit(1);
    }
}