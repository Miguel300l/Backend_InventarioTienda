import { Router } from "express";

import {
    csrfProtection
} from "../middlewares/csrf.middleware.js";

import {
    getCsrfToken
} from "../controllers/csrf.controller.js";

const router =
    Router();

router.get(
    "/",
    csrfProtection,
    getCsrfToken
);

export default router;