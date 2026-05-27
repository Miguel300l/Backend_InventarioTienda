import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export const verificarToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (token) {
            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

                const usuario = await Usuario.findById(decoded.id)
                    .populate("rol");

                if (!usuario) {

                    req.user = null;
                    return next();
                }

                req.user = usuario;
                return next();

            } catch (error) {

                if (
                    error.name !== "TokenExpiredError"
                ) {

                    req.user = null;
                    return next();
                }

                console.log(
                    "Access token expirado"
                );
            }
        }

        const refreshToken =
            req.cookies.refreshToken;

        if (!refreshToken) {

            req.user = null;
            return next();
        }

        try {

            const decodedRefresh =
                jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_SECRET
                );

            const usuario =
                await Usuario.findById(
                    decodedRefresh.id
                ).populate("rol");

            if (!usuario) {

                req.user = null;
                return next();
            }

            if (
                usuario.refreshToken !==
                refreshToken
            ) {

                req.user = null;
                return next();
            }

            const newAccessToken =
                createAccessToken({
                    id: usuario._id
                });

            const newRefreshToken =
                createRefreshToken({
                    id: usuario._id
                });

            usuario.refreshToken =
                newRefreshToken;

            await usuario.save();

            res.cookie("token", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000
            });

            res.cookie(
                "refreshToken",
                newRefreshToken,
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge:
                        7 *
                        24 *
                        60 *
                        60 *
                        1000
                }
            );

            req.user =
                usuario;

            return next();

        } catch {

            req.user = null;
            return next();
        }

    } catch {

        req.user = null;
        return next();
    }
};

export const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        const rolesUsuario = req.user.rol.map(r => r.nombre);

        const tieneRol = rolesPermitidos.some(rol =>
            rolesUsuario.includes(rol)
        );

        if (!tieneRol) {
            return res.status(403).json({
                message: "No tienes permisos"
            });
        }

        next();
    };
};