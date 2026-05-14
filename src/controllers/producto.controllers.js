import Producto from '../models/Producto.js';

export const obtenerProductos = async (req, res, next) => {
    try {

        const productos = await Producto.find()
            .populate("proveedor", "nombre");

        res.json(productos);
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
        const { nombre, codigo, descripcion, proveedor, } = req.body;

        if (!nombre || !codigo || !proveedor || !descripcion) {
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
            stock: 0,
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