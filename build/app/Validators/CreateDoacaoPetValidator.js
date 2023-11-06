"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateDoacaoPetValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            foto: Validator_1.schema.string({ trim: true }),
            quantidade: Validator_1.schema.number(),
            especie_id: Validator_1.schema.number(),
            observacao: Validator_1.schema.string.nullableAndOptional(),
        });
        this.messages = {};
    }
}
exports.default = CreateDoacaoPetValidator;
//# sourceMappingURL=CreateDoacaoPetValidator.js.map