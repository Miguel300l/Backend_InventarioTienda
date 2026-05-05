import { Schema, model } from "mongoose";

const proveedorSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        correo: {
            type: String
        },
        telefono: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Proveedor", proveedorSchema);