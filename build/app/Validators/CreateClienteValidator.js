"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateClienteValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            nome: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.minLength(3),
                Validator_1.rules.maxLength(255)
            ]),
            email: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.email(),
                Validator_1.rules.maxLength(255),
                Validator_1.rules.unique({ table: "users", column: "email" }),
            ]),
            password: Validator_1.schema.string({}, [
                Validator_1.rules.minLength(8),
                Validator_1.rules.maxLength(180)
            ]),
            telefone: Validator_1.schema.string({ trim: true }, [
                Validator_1.rules.mobile({ locale: ["pt-BR"] }),
                Validator_1.rules.maxLength(15)
            ]),
        });
        this.messages = {
            required: "{{field}} é obrigatório para o cadastro",
            "email.email": "{{field}} deve ser um email válido",
            "email.unique": "{{field}} já está em uso",
            "password.minLenght": "{{field}} deve ter no mínimo 8 caracteres",
            "password.maxlenght": "{{field}} deve ter no máximo 180 caracteres",
            "telefone.mobile": "{{field}} deve ser um telefone válido",
        };
    }
}
exports.default = CreateClienteValidator;
//# sourceMappingURL=CreateClienteValidator.js.map