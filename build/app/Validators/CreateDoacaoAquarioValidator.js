"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateDoacaoAquarioValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            foto: Validator_1.schema.string({ trim: true }),
            capacidade: Validator_1.schema.number(),
            descricao: Validator_1.schema.string.nullableAndOptional(),
        });
        this.messages = {};
    }
}
exports.default = CreateDoacaoAquarioValidator;
//# sourceMappingURL=CreateDoacaoAquarioValidator.js.map