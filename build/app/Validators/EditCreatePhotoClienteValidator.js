"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class EditCreatePhotoClienteValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.refs = Validator_1.schema.refs({
            user_id: this.ctx.auth.user?.id
        });
        this.schema = Validator_1.schema.create({
            foto: Validator_1.schema.string({ trim: true }, []),
        });
        this.messages = {
            required: "{{field}} Insira uma foto",
        };
    }
}
exports.default = EditCreatePhotoClienteValidator;
//# sourceMappingURL=EditCreatePhotoClienteValidator.js.map