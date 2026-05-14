import dotenv from "dotenv";
dotenv.config();
process.env.TZ = process.env.APP_TIMEZONE || "America/Bogota";

import app from "./src/app.js";
import { connectDB } from "./src/config/dbClient.js";

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
});