"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CreateEditEnderecoValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            cidade_id: Validator_1.schema.number([
                Validator_1.rules.exists({
                    table: "cidades",
                    column: "id"
                }),
            ]),
            rua: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(255)]),
            numero: Validator_1.schema.string.nullableAndOptional({ trim: true }, [
                Validator_1.rules.maxLength(20),
            ]),
            bairro: Validator_1.schema.string({ trim: true }, [Validator_1.rules.maxLength(255)]),
            ponto_referencia: Validator_1.schema.string.nullableAndOptional(),
            complemento: Validator_1.schema.string.nullableAndOptional(),
        });
        this.messages = {};
    }
}
exports.default = CreateEditEnderecoValidator;
//# sourceMappingURL=CreateEditEnderecoValidator.js.map