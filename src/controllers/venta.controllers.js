import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';

export const obtenerVentas = async (req, res, next) => {
    try {

        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);

        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999);

        const ventas = await Venta.find({
            fecha: {
                $gte: inicioDia,
                $lte: finDia,
            },
        })
            .populate("id_producto", "nombre codigo")
            .populate("id_usuario", "nombre")
            .select(
                "id_producto id_usuario cantidad precio_venta precio_total fecha"
            );

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

        if (!id_producto || !cantidad || !precio_venta) {
            res.status(400);
            throw new Error("Todos los campos son obligatorios");
        }

        const producto = await Producto.findById(id_producto);

        if (!producto) {
            res.status(404);
            throw new Error('Producto no encontrado');
        }

        if (producto.stock < cantidad) {
            res.status(400);
            throw new Error(`Stock insuficiente. Stock actual: ${producto.stock}`);
        }

        const precio_total = cantidad * precio_venta;

        const id_usuario = req.user?._id;

        if (!id_usuario) {
            return res.status(401).json({
                message: "Usuario no autenticado (req.user no existe)"
            });
        }

        const venta = await Venta.create({
            id_producto,
            id_usuario,
            cantidad,
            precio_venta,
            precio_total
        });

        producto.stock -= cantidad;
        await producto.save();

        res.status(201).json(venta);

    } catch (error) {
        next(error);
    }
};

export const productosMasVendidos = async (req, res) => {
    try {
        const result = await Venta.aggregate([
            {
                $group: {
                    _id: "$id_producto",
                    totalVendido: { $sum: "$cantidad" }
                }
            },
            {
                $lookup: {
                    from: "productos",
                    localField: "_id",
                    foreignField: "_id",
                    as: "producto"
                }
            },
            { $unwind: "$producto" },
            {
                $sort: { totalVendido: -1 }
            }
        ]);

        const masVendido = result[0];
        const menosVendido = result[result.length - 1];

        res.json({
            masVendido,
            menosVendido
        });

    } catch (error) {
        res.status(500).json({
            message: "Error generando reporte"
        });
    }
};