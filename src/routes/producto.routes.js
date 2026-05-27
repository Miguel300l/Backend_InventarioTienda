import { Router } from "express";
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto
} from "../controllers/producto.controllers.js";
import { csrfProtection } from "../middlewares/csrf.middleware.js";

const router = Router();

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.post("/", csrfProtection, crearProducto);
router.put("/:id", csrfProtection, actualizarProducto);

export default router;