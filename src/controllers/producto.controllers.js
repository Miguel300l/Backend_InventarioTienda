import Producto from '../models/Producto.js';
import Compra from "../models/Compra.js";

export const obtenerProductos = async (req, res, next) => {
    try {

        const productos = await Producto.find()
            .populate("proveedor", "nombre");

        const productosConPromedio = await Promise.all(
            productos.map(async (producto) => {

                const compras = await Compra.find({
                    id_producto: producto._id,
                });

                let promedioCompra = 0;

                if (compras.length > 0) {

                    const totalPrecios = compras.reduce(
                        (acc, compra) => acc + compra.precio_compra,
                        0
                    );

                    promedioCompra = totalPrecios / compras.length;
                }

                return {
                    ...producto.toObject(),
                    precio_compra_promedio: Number(
                        promedioCompra.toFixed(2)
                    ),
                };
            })
        );

        res.json(productosConPromedio);

    } catch (error) {
        next(error);
    }
};

export const obtenerProductoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findById(id);

        if (!producto) {
            res.status(404);
            throw new Error('Producto no encontrado');
        }

        res.json(producto);
    } catch (error) {
        next(error);
    }
};

export const crearProducto = async (req, res, next) => {

    try {
        const { nombre, codigo, descripcion, proveedor, stock } = req.body;

        if (!nombre || !codigo || !proveedor || !descripcion || !stock) {
            res.status(400);
            throw new Error('Todos los datos son obligatorios');
        }

        const stockMinimo = req.body.stockMinimo ?? 5;

        if (stockMinimo < 0) {
            res.status(400);
            throw new Error("El stock mínimo no puede ser negativo");
        }

        const productoExistente = await Producto.findOne({ codigo });
        if (productoExistente) {
            res.status(400);
            throw new Error('Ya existe un producto con ese código');
        }

        const producto = await Producto.create({
            nombre,
            codigo,
            descripcion,
            stockMinimo,
            stock,
            proveedor,
        });

        res.status(201).json(producto);
    } catch (error) {
        next(error);
    }
};

export const actualizarProducto = async (req, res, next) => {
    try {
        const { nombre, codigo, descripcion, stockMinimo } = req.body;

        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            res.status(404);
            throw new Error('Producto no encontrado');
        }

        if (stockMinimo !== undefined && stockMinimo < 0) {
            res.status(400);
            throw new Error("El stock mínimo no puede ser negativo");
        }

        if (codigo && codigo !== producto.codigo) {
            const existe = await Producto.findOne({ codigo });
            if (existe) {
                res.status(400);
                throw new Error('El código ya está en uso');
            }
        }

        producto.nombre = nombre ?? producto.nombre;
        producto.codigo = codigo ?? producto.codigo;
        producto.descripcion = descripcion ?? producto.descripcion;
        producto.stockMinimo = stockMinimo ?? producto.stockMinimo;

        await producto.save();

        res.json(producto);
    } catch (error) {
        next(error);
    }
};