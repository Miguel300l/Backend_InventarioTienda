import { Router } from "express";
import * as authController from "../controllers/auth.js";
import { checkUserExists } from "../middlewares/verifyUser.js";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware.js";
import { validarCamposAuch, validarCamposRegistro, validarCamposRegistroEstilista } from "../middlewares/validarCampos.js";


const router = Router();
router.post("/signup", checkUserExists, validarCamposRegistro, authController.signUp);

router.post("/signin", validarCamposAuch, authController.signin);

router.post("/registerEstilista", checkUserExists, validarCamposRegistroEstilista, authController.registerEstilista);

export default router;

