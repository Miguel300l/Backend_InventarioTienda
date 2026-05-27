import { Router } from "express";
import {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} from "../controllers/proveedor.controllers.js";
import { csrfProtection } from "../middlewares/csrf.middleware.js";

const router = Router();

router.get("/", obtenerProveedores);
router.get("/:id", obtenerProveedorPorId);
router.post("/", csrfProtection, crearProveedor);
router.put("/:id", csrfProtection, actualizarProveedor);
router.delete("/:id", csrfProtection, eliminarProveedor);

export default router;