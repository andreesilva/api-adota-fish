"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class EditPasswordValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.refs = Validator_1.schema.refs({
            user_id: this.ctx.auth.user?.id
        });
        this.schema = Validator_1.schema.create({
            password: Validator_1.schema.string.nullableAndOptional({}, [Validator_1.rules.minLength(8), Validator_1.rules.maxLength(180)]),
        });
        this.messages = {
            required: "{{field}} é obrigatório para a edição",
            "password.minLenght": "{{field}} deve ter no mínimo 8 caracteres",
            "password.maxlenght": "{{field}} deve ter no máximo 180 caracteres",
        };
    }
}
exports.default = EditPasswordValidator;
//# sourceMappingURL=EditPasswordValidator.js.map