import mongoose from "mongoose";
import Compra from "../models/Compra.js";

export const proveedorMasBarato = async (req, res) => {
    try {
        const { idProducto } = req.params;

        const resultado = await Compra.aggregate([
            {
                $match: {
                    id_producto: new mongoose.Types.ObjectId(idProducto),
                },
            },
            {
                $group: {
                    _id: "$id_proveedor",
                    precioMasBarato: {
                        $min: "$precio_compra",
                    },
                    promedioPrecio: {
                        $avg: "$precio_compra",
                    },
                    totalCompras: {
                        $sum: 1,
                    },
                },
            },

            {
                $lookup: {
                    from: "proveedors",
                    localField: "_id",
                    foreignField: "_id",
                    as: "proveedor",
                },
            },

            {
                $unwind: "$proveedor",
            },

            {
                $sort: {
                    precioMasBarato: 1,
                },
            },
            {
                $project: {
                    _id: 0,

                    proveedorId: "$proveedor._id",

                    nombreProveedor: "$proveedor.nombre",

                    correoProveedor: "$proveedor.correo",

                    telefonoProveedor: "$proveedor.telefono",

                    precioMasBarato: 1,

                    promedioPrecio: {
                        $round: ["$promedioPrecio", 2],
                    },

                    totalCompras: 1,
                },
            },
        ]);

        if (!resultado.length) {
            return res.status(404).json({
                message: "No hay compras para este producto",
            });
        }

        return res.json(resultado);

    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor",
            error,
        });
    }
};