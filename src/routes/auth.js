import { Router } from "express";
import * as authController from "../controllers/auth.js";
import { checkUserExists } from "../middlewares/verifyUser.js";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware.js";
import { validarCamposAuch, validarCamposRegistro, validarCamposRegistroEstilista } from "../middlewares/validarCampos.js";
import { csrfProtection } from "../middlewares/csrf.middleware.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";


const router = Router();
router.post("/signup", csrfProtection, checkUserExists, validarCamposRegistro, authController.signUp);

router.post("/signin", loginLimiter, csrfProtection, validarCamposAuch, authController.signin);
router.post("/logout", csrfProtection, verificarToken, authController.logout);

router.post("/registerEstilista", csrfProtection, checkUserExists, validarCamposRegistroEstilista, authController.registerEstilista);
router.get("/me", verificarToken, authController.me);

export default router;

