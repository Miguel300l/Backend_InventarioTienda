import Compra from '../models/Compra.js';
import Producto from '../models/Producto.js';
import Proveedor from '../models/Proveedor.js';

export const obtenerCompras = async (req, res, next) => {
    try {

        const hoy = new Date();

        const inicioDia = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate(),
            0, 0, 0, 0
        );

        const finDia = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate(),
            23, 59, 59, 999
        );

        const compras = await Compra.find({
            fecha: {
                $gte: inicioDia,
                $lte: finDia,
            },
        })
            .populate("id_producto", "nombre codigo")
            .populate("id_proveedor", "nombre")
            .select(
                "id_producto id_proveedor cantidad precio_compra costo_total fecha"
            );

        res.json(compras);
    } catch (error) {
        next(error);
    }
};

export const obtenerCompraPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const compra = await Compra.findById(id)
            .populate("id_producto")
            .populate("id_proveedor");

        if (!compra) {
            res.status(404);
            throw new Error("Compra no encontrada");
        }

        res.json(compra);
    } catch (error) {
        next(error);
    }
};

export const registrarCompra = async (req, res, next) => {
    try {
        const { id_producto, id_proveedor, cantidad, precio_compra } = req.body;

        if (!id_producto || !id_proveedor || !cantidad || !precio_compra) {
            res.status(400);
            throw new Error('Todos los campos son obligatorios');
        }

        if (cantidad <= 0 || precio_compra <= 0) {
            res.status(400);
            throw new Error('Cantidad y precio deben ser mayores a 0');
        }

        const productoExiste = await Producto.findById(id_producto);
        if (!productoExiste) {
            res.status(404);
            throw new Error('Producto no encontrado');
        }

        const proveedorExiste = await Proveedor.findById(id_proveedor);
        if (!proveedorExiste) {
            res.status(404);
            throw new Error('Proveedor no encontrado');
        }

        const costo_total = cantidad * precio_compra;

        const compra = await Compra.create({
            id_producto,
            id_proveedor,
            cantidad,
            precio_compra,
            costo_total
        });

        productoExiste.stock += cantidad;
        await productoExiste.save();

        res.status(201).json(compra);
    } catch (error) {
        next(error);
    }
};

export const productosMasComprados =
    async (req, res) => {

        try {

            const result =
                await Compra.aggregate([

                    {
                        $group: {
                            _id: "$id_producto",

                            totalComprado: {
                                $sum: "$cantidad"
                            }
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

                    {
                        $unwind: "$producto"
                    },

                    {
                        $sort: {
                            totalComprado: -1
                        }
                    }

                ]);

            res.json({

                masComprado:
                    result[0],

                menosComprado:
                    result[
                    result.length - 1
                    ]
            });

        } catch (error) {

            res.status(500).json({
                message:
                    "Error obteniendo compras"
            });
        }
    };