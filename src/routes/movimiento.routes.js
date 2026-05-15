import { Router } from "express";
import { obtenerMovimientos, obtenerStockProductos } from "../controllers/movimiento.controller.js";

const router = Router();

router.get("/", obtenerMovimientos);
router.get("/stock", obtenerStockProductos);

export default router;