"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateDoacaoAquarioNotPhotoValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            capacidade: Validator_1.schema.number(),
            descricao: Validator_1.schema.string.nullableAndOptional(),
        });
        this.messages = {};
    }
}
exports.default = CreateDoacaoAquarioNotPhotoValidator;
//# sourceMappingURL=CreateDoacaoAquarioNotPhotoValidator.js.map