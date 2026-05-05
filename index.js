import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/dbClient.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
});