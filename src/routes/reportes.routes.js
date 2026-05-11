import { Router } from "express";
import { proveedorMasBarato } from "../controllers/reportes.controller.js";

const router = Router();

router.get("/:idProducto", proveedorMasBarato);

export default router;