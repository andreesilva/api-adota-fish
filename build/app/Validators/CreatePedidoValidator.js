"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreatePedidoValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            estabelecimento_id: Validator_1.schema.number([
                Validator_1.rules.exists({ table: "estabelecimentos", column: "id" }),
            ]),
            meio_pagamento_id: Validator_1.schema.number([
                Validator_1.rules.exists({ table: "meios_pagamentos", column: "id" }),
            ]),
            troco_para: Validator_1.schema.number.nullableAndOptional(),
            observacao: Validator_1.schema.string.nullableAndOptional({ trim: true }),
            produtos: Validator_1.schema.array([
                Validator_1.rules.minLength(1)
            ]).members(Validator_1.schema.object().members({
                produto_id: Validator_1.schema.number([
                    Validator_1.rules.exists({ table: "produtos", column: "id" })
                ]),
                quantidade: Validator_1.schema.number(),
                observacao: Validator_1.schema.string.nullableAndOptional({ trim: true }),
            })),
            endereco_id: Validator_1.schema.number([
                Validator_1.rules.exists({ table: "enderecos", column: "id" })
            ])
        });
        this.messages = {};
    }
}
exports.default = CreatePedidoValidator;
//# sourceMappingURL=CreatePedidoValidator.js.map