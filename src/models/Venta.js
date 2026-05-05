import { Schema, model } from "mongoose";

const ventaSchema = new Schema(
    {
        id_producto: {
            type: Schema.Types.ObjectId,
            ref: "Producto",
            required: true
        },
        id_usuario: {
            type: Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        precio_venta: {
            type: Number,
            required: true
        }, // precio final de venta
        precio_total: {
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

export default model("Venta", ventaSchema);