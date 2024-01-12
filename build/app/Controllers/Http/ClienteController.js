"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Cliente_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Cliente"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const CreateClienteValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CreateClienteValidator"));
const EditClienteValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/EditClienteValidator"));
const EditCreatePhotoClienteValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/EditCreatePhotoClienteValidator"));
const EditPasswordValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/EditPasswordValidator"));
class ClienteController {
    async store({ request, response }) {
        const payload = await request.validate(CreateClienteValidator_1.default);
        const trx = await Database_1.default.transaction();
        try {
            const user = await User_1.default.create({
                email: payload.email,
                password: payload.password,
                tipo: "cliente"
            });
            const cliente = await Cliente_1.default.create({
                nome: payload.nome,
                telefone: payload.telefone,
                userId: user.id,
                foto: " "
            });
            await trx.commit();
            return response.ok({
                id: cliente.id,
                nome: cliente.nome,
                email: user.email,
                telefone: cliente.telefone
            });
        }
        catch (error) {
            await trx.rollback();
            return response.badRequest("Something in the request is wrong");
        }
    }
    async update({ request, response, auth }) {
        const payload = await request.validate(EditClienteValidator_1.default);
        const userAuth = await auth.use("api").authenticate();
        const trx = await Database_1.default.transaction();
        try {
            const user = await User_1.default.findByOrFail("id", userAuth.id);
            const cliente = await Cliente_1.default.findByOrFail("user_id", userAuth.id);
            if (payload.password) {
                user.merge({
                    email: payload.email,
                    password: payload.password
                });
            }
            else {
                user.merge({
                    email: payload.email,
                });
            }
            await user.save();
            cliente.merge({
                nome: payload.nome,
                telefone: payload.telefone,
            });
            await cliente.save();
            await trx.commit();
            return response.ok({
                id: cliente.id,
                nome: cliente.nome,
                email: user.email,
                telefone: cliente.telefone
            });
        }
        catch (error) {
            await trx.rollback();
            return response.badRequest("Something in the request is wrong");
        }
    }
    async delete({ response, auth }) {
        const userAuth = await auth.use("api").authenticate();
        const trx = await Database_1.default.transaction();
        try {
            await trx.commit();
            await User_1.default.query().where("id", userAuth.id).delete();
            return response.ok(true);
        }
        catch (error) {
            await trx.rollback();
            return response.badRequest("Não possível excluir o cliente");
            console.error(error);
        }
    }
    async updatePhoto({ request, response, auth }) {
        const payload = await request.validate(EditCreatePhotoClienteValidator_1.default);
        const userAuth = await auth.use("api").authenticate();
        try {
            const cliente = await Cliente_1.default.findByOrFail("user_id", userAuth.id);
            cliente.merge({
                foto: payload.foto
            });
            await cliente.save();
            return response.ok({
                id: cliente.id,
                foto: cliente.foto
            });
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
    async updatePassword({ request, response, auth }) {
        const payload = await request.validate(EditPasswordValidator_1.default);
        const userAuth = await auth.use("api").authenticate();
        try {
            const user = await User_1.default.findByOrFail("id", userAuth.id);
            if (payload.password) {
                user.merge({
                    password: payload.password
                });
            }
            await user.save();
            return response.ok(true);
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
    async resetPassword({ request, response }) {
        const payload = await request.validate(EditPasswordValidator_1.default);
        try {
            const user = await User_1.default.findByOrFail("email", request.input("email"));
            if (payload.password) {
                user.merge({
                    password: payload.password
                });
            }
            await user.save();
            return response.ok(true);
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
    async show({ params, response }) {
        const id = params.id;
        const pedido = await Cliente_1.default.query()
            .where("id", id)
            .preload("usuario")
            .preload("endereco", (cityQuery) => {
            cityQuery
                .preload("cidade", (stateQuery) => {
                stateQuery
                    .preload("estado");
            });
        })
            .orderBy("id", "desc")
            .first();
        if (pedido == null) {
            return response.notFound("Não encontrado");
        }
        return response.ok(pedido);
    }
}
exports.default = ClienteController;
//# sourceMappingURL=ClienteController.js.map