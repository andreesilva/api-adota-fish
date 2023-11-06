"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cidade_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Cidade"));
class CidadesController {
    async index({ response }) {
        const cidades = await Cidade_1.default.query();
        return response.ok(cidades);
    }
    async show({ params, response }) {
        const idEstado = params.id;
        const cidades = await Cidade_1.default.query()
            .where("estado_id", idEstado)
            .orderBy("id", "asc");
        if (cidades == null) {
            return response.notFound("Não encontrado");
        }
        return response.ok(cidades);
    }
}
exports.default = CidadesController;
//# sourceMappingURL=CidadeController.js.map