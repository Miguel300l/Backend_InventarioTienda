import { Router } from "express";
import {
    registrarVenta,
    obtenerVentas,
    obtenerVentaPorId
} from "../controllers/venta.controllers.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarToken, registrarVenta);

router.get("/", obtenerVentas);

router.get("/:id", obtenerVentaPorId);

export default router;