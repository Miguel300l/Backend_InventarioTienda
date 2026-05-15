import { Router } from "express";
import {
    registrarVenta,
    obtenerVentas,
    obtenerVentaPorId,
    productosMasVendidos,
    ventasPorMes
} from "../controllers/venta.controllers.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, registrarVenta);

router.get("/", obtenerVentas);

router.get("/productos-mas-vendidos", productosMasVendidos);

router.get("/ventas-por-mes", ventasPorMes);

router.get("/:id", obtenerVentaPorId);

export default router;