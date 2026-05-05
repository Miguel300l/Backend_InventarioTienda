
import Usuario from "../models/Usuario.js"

export const validarCamposAuch = async (req, res, next) => {
    const { correo, password } = req.body;
    if (!correo || !password) {
        return res.status(400).json("Todos los datos son requeridos");
    }
    next();
}

export const validarCamposRegistro = async (req, res, next) => {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
        return res.status(400).json("Todos los datos son requeridos");
    }
    next();
}

export const validarCamposRegistroEstilista = async (req, res, next) => {
    const { nombre, correo, password, celular, especialidad } = req.body;
    if (!nombre || !correo || !password || !celular || !especialidad) {
        return res.status(400).json("Todos los datos son requeridos");
    }
    next();
}