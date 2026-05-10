import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const usuarioSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true
        },

        correo: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        rol: [{
            ref: "Role",
            type: Schema.Types.ObjectId
        }],

        celular: {
            type: Number
        },

        especialidad: {
            type: String
        },

        estado: {
            type: String,
            enum: ["pendiente", "aprobado", "rechazado"],
            default: null
        },

        refreshToken: {
            type: String,
            default: null
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
);

usuarioSchema.statics.hasPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

usuarioSchema.statics.validatePassword = async (password, receivedPassword) => {
    return await bcryptjs.compare(password, receivedPassword);
}

export default model("Usuario", usuarioSchema);