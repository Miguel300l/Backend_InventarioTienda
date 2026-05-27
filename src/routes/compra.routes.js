import { Router } from "express";
import {
    registrarCompra,
    obtenerCompras,
    obtenerCompraPorId,
    productosMasComprados
} from "../controllers/compra.controllers.js";
import { csrfProtection } from "../middlewares/csrf.middleware.js";

const router = Router();

router.post("/", csrfProtection, registrarCompra);

router.get("/", obtenerCompras);

router.get("/productos-mas-comprados", productosMasComprados);

router.get("/:id", obtenerCompraPorId);

export default router;