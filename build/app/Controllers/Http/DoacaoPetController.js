"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Cliente_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Cliente"));
const CreateDoacaoPetValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CreateDoacaoPetValidator"));
const Pet_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Pet"));
const DoacaoPet_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/DoacaoPet"));
const EditCreatePhotoClienteValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/EditCreatePhotoClienteValidator"));
const CreateDoacaoPetNotPhotoValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CreateDoacaoPetNotPhotoValidator"));
class DoacaoPetController {
    async store({ auth, response, request }) {
        const payload = await request.validate(CreateDoacaoPetValidator_1.default);
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente_1.default.findByOrFail("user_id", userAuth.id);
        const trx = await Database_1.default.transaction();
        try {
            const pet = await Pet_1.default.create({
                foto: payload.foto,
                especie_id: payload.especie_id,
                quantidade: payload.quantidade,
                observacao: payload.observacao
            });
            const doacao = await DoacaoPet_1.default.create({
                cliente_id_doador: cliente.id,
                pet_id: pet.id,
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
            const doacoes = await DoacaoPet_1.default.query()
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
                .preload("pet", (petsQuery) => {
                petsQuery
                    .preload("especie");
            })
                .orderBy("created_at", "desc");
            return response.ok(doacoes);
        }
        else {
            const existRegister = await Database_1.default.rawQuery(`select doacao_pets.id, pets.foto, cidades.nome,estados.nome ,especies.nome
                from doacao_pets
                inner join pets on doacao_pets.pet_id = pets.id 
                inner join especies on pets.especie_id = especies.id 
                inner join clientes on doacao_pets.cliente_id_doador = clientes.id 
                inner join users on clientes.user_id = users.id 
                inner join enderecos on clientes.id = enderecos.cliente_id 
                inner join cidades on enderecos.cidade_id = cidades.id 
                inner join estados on cidades.estado_id = estados.id 
                where doacao_pets.status = :status and estados.id = :estado`, {
                status: 1,
                estado: id
            });
            const doacoes = await DoacaoPet_1.default.query()
                .where("status", 1)
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
                .preload("pet", (petsQuery) => {
                petsQuery
                    .preload("especie");
            })
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
        const doacoes = await DoacaoPet_1.default.query()
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
            .preload("pet", (petsQuery) => {
            petsQuery
                .preload("especie");
        })
            .orderBy("created_at", "desc");
        return response.ok(doacoes);
    }
    async show({ params, response }) {
        const idDoacao = params.id;
        const pedido = await DoacaoPet_1.default.query()
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
            .preload("pet", (petsQuery) => {
            petsQuery
                .preload("especie");
        })
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
            const doacao = await DoacaoPet_1.default.findByOrFail("id", id);
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
            const doacao = await DoacaoPet_1.default.findByOrFail("id", id);
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
            const doacao = await DoacaoPet_1.default.findByOrFail("id", id);
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
            const pet = await Pet_1.default.findByOrFail("id", id);
            pet.merge({
                foto: payload.foto
            });
            await pet.save();
            return response.ok({
                id: pet.id,
                foto: pet.foto
            });
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
    async update({ request, response, params }) {
        const payload = await request.validate(CreateDoacaoPetNotPhotoValidator_1.default);
        const id = params.id;
        try {
            const pet = await Pet_1.default.findByOrFail("id", id);
            pet.merge({
                especie_id: payload.especie_id,
                quantidade: payload.quantidade,
                observacao: payload.observacao
            });
            await pet.save();
            return response.ok({
                id: pet.id,
                especie_id: pet.especie_id,
                quantidade: pet.quantidade,
                observacao: pet.observacao
            });
        }
        catch (error) {
            return response.badRequest("Something in the request is wrong");
        }
    }
}
exports.default = DoacaoPetController;
//# sourceMappingURL=DoacaoPetController.js.map