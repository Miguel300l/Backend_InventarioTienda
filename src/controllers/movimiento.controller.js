import Venta from "../models/Venta.js";
import Compra from "../models/Compra.js";

export const obtenerMovimientos = async (req, res, next) => {
    try {

        const { desde, hasta, tipo = "ambos" } = req.query;

        if (!desde || !hasta) {
            res.status(400);
            throw new Error("Las fechas desde y hasta son obligatorias");
        }

        const fechaInicio = new Date(
            `${desde}T00:00:00`
        );

        const fechaFin = new Date(
            `${hasta}T23:59:59.999`
        );

        let movimientos = [];

        // VENTAS
        if (tipo === "venta" || tipo === "ambos") {

            const ventas = await Venta.find({
                createdAt: {
                    $gte: fechaInicio,
                    $lte: fechaFin
                }
            })
                .populate("id_producto", "nombre")
                .populate("id_usuario", "nombre email")
                .sort({ createdAt: -1 });

            const ventasFormateadas = ventas.map((v) => ({
                tipo: "venta",
                id: v._id,
                producto: v.id_producto?.nombre,
                usuario: v.id_usuario?.nombre,
                cantidad: v.cantidad,
                precio_unitario: v.precio_venta,
                total: v.precio_total,
                fecha: v.createdAt
            }));

            movimientos.push(...ventasFormateadas);
        }

        // COMPRAS
        if (tipo === "compra" || tipo === "ambos") {

            const compras = await Compra.find({
                createdAt: {
                    $gte: fechaInicio,
                    $lte: fechaFin
                }
            })
                .populate("id_producto", "nombre")
                .populate("id_proveedor", "nombre")
                .sort({ createdAt: -1 });

            const comprasFormateadas = compras.map((c) => ({
                tipo: "compra",
                id: c._id,
                producto: c.id_producto?.nombre,
                proveedor: c.id_proveedor?.nombre,
                cantidad: c.cantidad,
                precio_unitario: c.precio_compra,
                total: c.costo_total,
                fecha: c.createdAt
            }));

            movimientos.push(...comprasFormateadas);
        }

        movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        res.status(200).json({
            total: movimientos.length,
            movimientos
        });

    } catch (error) {
        next(error);
    }
};