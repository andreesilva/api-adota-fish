"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Cliente_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Cliente"));
const CreateDoacaoAquarioValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CreateDoacaoAquarioValidator"));
const Aquario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Aquario"));
const DoacaoAquario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/DoacaoAquario"));
const CreateDoacaoAquarioNotPhotoValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CreateDoacaoAquarioNotPhotoValidator"));
const EditCreatePhotoClienteValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/EditCreatePhotoClienteValidator"));
class DoacaoAquarioController {
    async store({ auth, response, request }) {
        const payload = await request.validate(CreateDoacaoAquarioValidator_1.default);
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente_1.default.findByOrFail("user_id", userAuth.id);
        const trx = await Database_1.default.transaction();
        try {
            const aquario = await Aquario_1.default.create({
                foto: payload.foto,
                capacidade: payload.capacidade,
                descricao: payload.descricao
            });
            const doacao = await DoacaoAquario_1.default.create({
                cliente_id_doador: cliente.id,
                aquario_id: aquario.id,
                status: 1
            });
            await trx.commit();
            return response.ok({
                id: doacao.id,
                cliente_id_doador: doacao.cliente_id_doador,
                status: doacao.status
            });
        }
        catch (error) {
            await trx.rollback();
            return response.badRequest("Something in the request is wrong" + error);
        }
    }
    async all({ response, params }) {
        const id = params.id;
        if (id == 0) {
            const doacoes = await DoacaoAquario_1.default.query()
                .where("status", 1)
                .preload("cliente_doador", (addressQuery) => {
                addressQuery
                    .preload("usuario")
                    .preload("endereco", (cityQuery) => {
                    cityQuery
                        .preload("cidade", (stateQuery) => {
                        stateQuery
                            .preload("estado");
                    });
                });
            })
                .preload("aquario")
                .orderBy("created_at", "desc");
            return response.ok(doacoes);
        }
        else {
            const existRegister = await Database_1.default.rawQuery(`select doacao_aquarios.id,aquarios.foto,aquarios.capacidade,cidades.nome,estados.nome 
                from doacao_aquarios 
                inner join aquarios on doacao_aquarios.aquario_id = aquarios.id 
                inner join clientes on doacao_aquarios.cliente_id_doador = clientes.id 
                inner join users on clientes.user_id = users.id 
                inner join enderecos on clientes.id = enderecos.cliente_id 
                inner join cidades on enderecos.cidade_id = cidades.id 
                inner join estados on cidades.estado_id = estados.id 
                where doacao_aquarios.status = :status and estados.id = :estado`, {
                status: 1,
                estado: id
            });
            const doacoes = await DoacaoAquario_1.default.query()
                .preload("cliente_doador", (addressQuery) => {
                addressQuery
                    .preload("usuario")
                    .preload("endereco", (cityQuery) => {
                    cityQuery
                        .preload("cidade", (stateQuery) => {
                        stateQuery
                            .preload("estado", (stateIdQuery) => {
                            stateIdQuery.where('id', id);
                        });
                    });
                });
            })
                .preload("aquario")
                .where("status", 1)
                .orderBy("created_at", "desc");
            if (existRegister[0] == "") {
                return response.ok([]);
            }
            else {
                return response.ok(doacoes);
            }
        }
    }
    async index({ auth, response }) {
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente_1.default.findByOrFail("user_id", userAuth.id);
        const doacoes = await DoacaoAquario_1.default.query()
            .where("cliente_id_doador", cliente.id)
            .where("status", 1)
            .orWhere("status", 2)
            .preload("cliente_doador", (addressQuery) => {
            addressQuery
                .preload("usuario")
                .preload("endereco", (cityQuery) => {
                cityQuery
                    .preload("cidade", (stateQuery) => {
                    stateQuery
                        .preload("estado");
                });
            });
        })
            .preload("aquario")
            .orderBy("created_at", "desc");
        return response.ok(doacoes);
    }
    async show({ params, response }) {
        const idDoacao = params.id;
        const pedido = await DoacaoAquario_1.default.query()
            .where("id", idDoacao)
            .preload("cliente_doador", (addressQuery) => {
            addressQuery
                .preload("usuario")
                .preload("endereco", (cityQuery) => {
                cityQuery
                    .preload("cidade", (stateQuery) => {
                    stateQuery
                        .preload("estado");
                });
            });
        })
            .preload("aquario")
            .orderBy("id", "desc")
            .first();
        if (pedido == null) {
            return response.notFound("Não encontrado");
        }
        return response.ok(pedido);
    }
    async inactivate({ response, params }) {
        const id = params.id;
        try {
            const doacao = await DoacaoAquario_1.default.findByOrFail("id", id);
            doacao.merge({
                status: 2
            });
            await doacao.save();
            return response.ok(true);
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
    async activate({ response, params }) {
        const id = params.id;
        try {
            const doacao = await DoacaoAquario_1.default.findByOrFail("id", id);
            doacao.merge({
                status: 1
            });
            await doacao.save();
            return response.ok(true);
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
    async delete({ response, params }) {
        const id = params.id;
        try {
            const doacao = await DoacaoAquario_1.default.findByOrFail("id", id);
            doacao.merge({
                status: 3
            });
            await doacao.save();
            return response.ok(true);
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
    async updatePhoto({ request, response, params }) {
        const payload = await request.validate(EditCreatePhotoClienteValidator_1.default);
        const id = params.id;
        try {
            const aquario = await Aquario_1.default.findByOrFail("id", id);
            aquario.merge({
                foto: payload.foto
            });
            await aquario.save();
            return response.ok({
                id: aquario.id,
                foto: aquario.foto
            });
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
    async update({ request, response, params }) {
        const payload = await request.validate(CreateDoacaoAquarioNotPhotoValidator_1.default);
        const id = params.id;
        try {
            const aquario = await Aquario_1.default.findByOrFail("id", id);
            aquario.merge({
                capacidade: payload.capacidade,
                descricao: payload.descricao
            });
            await aquario.save();
            return response.ok({
                id: aquario.id,
                capacidade: aquario.capacidade,
                descricao: aquario.descricao
            });
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
}
exports.default = DoacaoAquarioController;
//# sourceMappingURL=DoacaoAquarioController.js.map