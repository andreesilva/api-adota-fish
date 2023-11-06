"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class EditClienteValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.refs = Validator_1.schema.refs({
            user_id: this.ctx.auth.user?.id
        });
        this.schema = Validator_1.schema.create({
            nome: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.minLength(3),
                Validator_1.rules.maxLength(255)
            ]),
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.email(),
                Validator_1.rules.maxLength(255),
            ]),
            password: Validator_1.schema.string.nullableAndOptional({}, [Validator_1.rules.minLength(8), Validator_1.rules.maxLength(180)]),
            telefone: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.mobile({ locale: ["pt-BR"] }),
                Validator_1.rules.maxLength(15),
            ]),
        });
        this.messages = {
            required: "{{field}} é obrigatório para a edição",
            "email.email": "{{field}} deve ser um email válido",
            "email.unique": "{{field}} já está em uso por outro usuário",
            "password.minLenght": "{{field}} deve ter no mínimo 8 caracteres",
            "password.maxlenght": "{{field}} deve ter no máximo 180 caracteres",
            "telefone.mobile": "{{field}} deve ser um telefone válido",
        };
    }
}
exports.default = EditClienteValidator;
//# sourceMappingURL=EditClienteValidator.js.map