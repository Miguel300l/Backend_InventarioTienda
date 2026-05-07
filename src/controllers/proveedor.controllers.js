import Proveedor from '../models/Proveedor.js';

// Obtener todos los proveedores
export const obtenerProveedores = async (req, res, next) => {
    try {
        const proveedores = await Proveedor.find();
        res.json(proveedores);
    } catch (error) {
        next(error);
    }
};

// Obtener un proveedor por ID
export const obtenerProveedorPorId = async (req, res, next) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);

        if (!proveedor) {
            res.status(404);
            throw new Error('Proveedor no encontrado');
        }

        res.json(proveedor);
    } catch (error) {
        next(error);
    }
};

// Crear un proveedor
export const crearProveedor = async (req, res, next) => {
    try {
        const { nombre, correo, telefono } = req.body;

        if (correo) {
            const proveedorExistente = await Proveedor.findOne({ correo });
            if (proveedorExistente) {
                res.status(400);
                throw new Error('Ya existe un proveedor con ese correo');
            }
        }

        const proveedor = await Proveedor.create({
            nombre,
            correo,
            telefono
        });

        res.status(201).json(proveedor);
    } catch (error) {
        next(error);
    }
};

// Actualizar un proveedor
export const actualizarProveedor = async (req, res, next) => {
    try {
        const proveedor = await Proveedor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!proveedor) {
            res.status(404);
            throw new Error('Proveedor no encontrado');
        }

        res.json(proveedor);
    } catch (error) {
        next(error);
    }
};

// Eliminar un proveedor
export const eliminarProveedor = async (req, res, next) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);

        if (!proveedor) {
            res.status(404);
            throw new Error('Proveedor no encontrado');
        }

        await proveedor.deleteOne();

        res.json({ mensaje: 'Proveedor eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};