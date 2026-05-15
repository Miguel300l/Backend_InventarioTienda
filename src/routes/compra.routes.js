import { Router } from "express";
import {
    registrarCompra,
    obtenerCompras,
    obtenerCompraPorId,
    productosMasComprados
} from "../controllers/compra.controllers.js";

const router = Router();

router.post("/", registrarCompra);

router.get("/", obtenerCompras);

router.get("/productos-mas-comprados", productosMasComprados);

router.get("/:id", obtenerCompraPorId);

export default router;