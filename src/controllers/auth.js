import Usuario from "../models/Usuario.js"
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../libs/jwt.js";
import Role from "../models/Roles.js";

export const signUp = async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {
        const hashedPassword = await Usuario.hasPassword(password);

        const roleUser = await Role.findOne({ nombre: "usuario" });

        const newUsuario = new Usuario({
            nombre,
            correo,
            password: hashedPassword,
            rol: [roleUser._id]
        });

        const savedUser = await newUsuario.save();

        const accessToken = createAccessToken({ id: savedUser._id });
        const refreshToken = createRefreshToken({ id: savedUser._id });

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "Usuario creado",
            user: {
                id: savedUser._id,
                nombre: savedUser.nombre,
                correo: savedUser.correo
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al registrar usuario",
            error: error.message
        });
    }
};

export const signin = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const userFound = await Usuario.findOne({ correo }).populate("rol");

        if (!userFound) {
            return res.status(404).json({
                message: "Usuario no existe"
            });
        }

        const isMatch = await Usuario.validatePassword(
            password,
            userFound.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Contraseña incorrecta"
            });
        }

        const roles = userFound.rol.map(r => r.nombre);

        const esEstilista = roles.includes("estilista");

        if (esEstilista && userFound.estado !== "aprobado") {
            return res.status(403).json({
                message: "Pendiente de aprobación"
            });
        }

        const accessToken = createAccessToken({ id: userFound._id });
        const refreshToken = createRefreshToken({ id: userFound._id });

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            message: "Login exitoso",
            user: {
                id: userFound._id,
                nombre: userFound.nombre,
                correo: userFound.correo,
                rol: userFound.rol
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error en login",
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.json({
            message: "Sesión cerrada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al cerrar sesión",
            error: error.message
        });
    }
};

export const registerEstilista = async (req, res) => {
    const { nombre, correo, password, celular, especialidad } = req.body;

    try {

        const hashedPassword = await Usuario.hasPassword(password);

        const roleEstilista = await Role.findOne({ nombre: "estilista" });

        const newEstilista = new Usuario({
            nombre,
            correo,
            password: hashedPassword,
            celular,
            especialidad,
            estado: "pendiente",
            rol: [roleEstilista._id]
        });

        await newEstilista.save();

        return res.status(201).json({
            message: "Registro exitoso. Cuenta pendiente de aprobación por el administrador",
            estilista: {
                nombre: newEstilista.nombre,
                correo: newEstilista.correo,
                estado: newEstilista.estado
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error en registro de estilista",
            error: error.message
        });
    }
};