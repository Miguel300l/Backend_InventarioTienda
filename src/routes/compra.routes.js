import { Router } from "express";
import {
    registrarCompra,
    obtenerCompras,
    obtenerCompraPorId
} from "../controllers/compra.controllers.js";

const router = Router();

router.post("/", registrarCompra);

router.get("/", obtenerCompras);

router.get("/:id", obtenerCompraPorId);

export default router;