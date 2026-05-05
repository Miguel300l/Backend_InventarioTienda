import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';

export const obtenerVentas = async (req, res, next) => {
    try {
        const ventas = await Venta.find()
            .populate("id_producto")
            .populate("id_usuario");

        res.json(ventas);
    } catch (error) {
        next(error);
    }
};

export const obtenerVentaPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const venta = await Venta.findById(id)
            .populate("id_producto")
            .populate("id_usuario");

        if (!venta) {
            res.status(404);
            throw new Error("Venta no encontrada");
        }

        res.json(venta);
    } catch (error) {
        next(error);
    }
};

export const registrarVenta = async (req, res, next) => {
    try {

        const { id_producto, cantidad, precio_venta } = req.body;

        // Validación básica
        if (!id_producto || !cantidad || !precio_venta) {
            res.status(400);
            throw new Error("Todos los campos son obligatorios");
        }

        // 1. Buscar producto
        const producto = await Producto.findById(id_producto);

        if (!producto) {
            res.status(404);
            throw new Error('Producto no encontrado');
        }

        // 2. Validar stock
        if (producto.stock < cantidad) {
            res.status(400);
            throw new Error(`Stock insuficiente. Stock actual: ${producto.stock}`);
        }

        // 3. Calcular total
        const precio_total = cantidad * precio_venta;

        // 4. Usuario desde middleware
        const id_usuario = req.user?._id;

        if (!id_usuario) {
            return res.status(401).json({
                message: "Usuario no autenticado (req.user no existe)"
            });
        }

        // 5. Crear venta
        const venta = await Venta.create({
            id_producto,
            id_usuario,
            cantidad,
            precio_venta,
            precio_total
        });

        // 6. Descontar stock
        producto.stock -= cantidad;
        await producto.save();

        res.status(201).json(venta);

    } catch (error) {
        next(error);
    }
};