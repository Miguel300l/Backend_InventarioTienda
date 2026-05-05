import Usuario from "../models/Usuario.js";

export const checkUserExists = async (req, res, next) => {
    const { correo } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        if (usuario) {
            return res.status(400).json({
                message: "El usuario ya existe"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Error al verificar usuario",
            error: error.message
        });
    }
};