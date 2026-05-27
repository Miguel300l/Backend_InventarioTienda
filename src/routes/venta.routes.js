import { Router } from "express";
import {
    registrarVenta,
    obtenerVentas,
    obtenerVentaPorId,
    productosMasVendidos,
    ventasPorMes,
    estadisticasMensuales
} from "../controllers/venta.controllers.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { csrfProtection } from "../middlewares/csrf.middleware.js";

const router = Router();

router.post("/", csrfProtection, verificarToken, registrarVenta);

router.get("/", obtenerVentas);

router.get("/productos-mas-vendidos", productosMasVendidos);

router.get("/ventas-por-mes", ventasPorMes);

router.get("/estadisticas-mensuales", estadisticasMensuales);

router.get("/:id", obtenerVentaPorId);

export default router;