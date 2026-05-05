import { Schema, model } from "mongoose";

const compraSchema = new Schema(
    {
        id_producto: {
            type: Schema.Types.ObjectId,
            ref: "Producto",
            required: true
        },
        id_proveedor: {
            type: Schema.Types.ObjectId,
            ref: "Proveedor",
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        precio_compra: {
            type: Number,
            required: true
        },
        costo_total: {
            type: Number,
            required: true
        },
        fecha: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Compra", compraSchema);