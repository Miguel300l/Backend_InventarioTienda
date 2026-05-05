import Role from "../models/Roles.js";

export const createRoles = async (req, res) => {
    try {

        const contador = await Role.estimatedDocumentCount();
        if (contador > 0) {
            return;
        }

        await Promise.all([
            new Role({ nombre: "administrador" }).save(),
            new Role({ nombre: "estilista" }).save(),
            new Role({ nombre: "usuario" }).save()
        ]);

    } catch (error) {
        console.error(error);
    }
};
