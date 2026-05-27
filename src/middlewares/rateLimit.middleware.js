import rateLimit from "express-rate-limit";

export const loginLimiter =
    rateLimit({
        windowMs:
            15 * 60 * 1000,

        max: 4,

        skipSuccessfulRequests: true,

        message: {
            message:
                "Demasiados intentos fallidos. Intenta en 15 minutos."
        },

        standardHeaders: true,
        legacyHeaders: false
    });