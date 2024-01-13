"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Especie_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Especie"));
class CidadesController {
    async show({ params, response }) {
        const idTipoAgua = params.id;
        const especies = await Especie_1.default.query()
            .where("tipo_agua", idTipoAgua)
            .orderBy("nome", "asc");
        if (especies == null) {
            return response.notFound("Não encontrado");
        }
        return response.ok(especies);
    }
    async especieId({ response, request }) {
        const especie = await Especie_1.default.findByOrFail("nome", request.input("nome"));
        return response.ok({
            id: especie.id,
            nome: especie.nome
        });
    }
}
exports.default = CidadesController;
//# sourceMappingURL=EspecieController.js.map