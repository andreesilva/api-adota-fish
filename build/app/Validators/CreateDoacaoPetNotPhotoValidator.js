"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateDoacaoPetNotPhotValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            quantidade: Validator_1.schema.number(),
            especie_id: Validator_1.schema.number(),
            observacao: Validator_1.schema.string.nullableAndOptional(),
        });
        this.messages = {};
    }
}
exports.default = CreateDoacaoPetNotPhotValidator;
//# sourceMappingURL=CreateDoacaoPetNotPhotoValidator.js.map