import { Schema, model } from "mongoose";

const productoSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        codigo: {
            type: String,
            required: true,
            unique: true
        },
        descripcion: {
            type: String
        },
        precioVenta: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            default: 0
        },
        stockMinimo: {
            type: Number,
        },
        proveedor: {
            type: Schema.Types.ObjectId,
            ref: "Proveedor",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Producto", productoSchema);