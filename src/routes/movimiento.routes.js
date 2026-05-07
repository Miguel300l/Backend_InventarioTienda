import { Router } from "express";
import { obtenerMovimientos } from "../controllers/movimiento.controller.js";

const router = Router();

router.get("/", obtenerMovimientos);

export default router;