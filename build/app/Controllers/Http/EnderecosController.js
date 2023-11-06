"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endereco_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Endereco"));
const CreateEditEnderecoValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CreateEditEnderecoValidator"));
class EnderecosController {
    async store({ response, request }) {
        const payload = await request.validate(CreateEditEnderecoValidator_1.default);
        const endereco = await Endereco_1.default.create({
            cidadeId: payload.cidade_id,
            clienteId: request.input("cliente_id"),
            rua: payload.rua,
            numero: payload.numero,
            bairro: payload.bairro,
            pontoReferencia: request.input("ponto_referencia"),
            complemento: request.input("complemento"),
        });
        return response.ok(endereco);
    }
    async update({ request, response, params }) {
        const payload = await request.validate(CreateEditEnderecoValidator_1.default);
        const endereco = await Endereco_1.default.findOrFail(params.id);
        endereco.merge(payload);
        await endereco.save();
        return response.ok(endereco);
    }
}
exports.default = EnderecosController;
//# sourceMappingURL=EnderecosController.js.map