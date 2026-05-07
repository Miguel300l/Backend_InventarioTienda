import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import proveedorRoutes from "./routes/proveedor.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import compraRoutes from "./routes/compra.routes.js";
import ventaRoutes from "./routes/venta.routes.js";
import movimientoRoutes from "./routes/movimiento.routes.js";
import cookieParser from "cookie-parser";
import { createRoles } from "./config/initialRoles.js"
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
createRoles();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/movimientos", movimientoRoutes);

app.use(errorHandler);

export default app;