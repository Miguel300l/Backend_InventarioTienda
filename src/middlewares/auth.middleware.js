import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export const verificarToken = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const usuario = await Usuario.findById(decoded.id).populate("rol");

            if (!usuario) {
                return res.status(404).json({ message: "Usuario no existe" });
            }

            req.user = usuario;
            return next();
        }

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const usuario = await Usuario.findById(decodedRefresh.id).populate("rol");

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no existe" });
        }

        const newAccessToken = createAccessToken({ id: usuario._id });

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        req.user = usuario;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
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