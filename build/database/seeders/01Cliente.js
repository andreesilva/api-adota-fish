"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Cliente_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Cliente"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class default_1 extends Seeder_1.default {
    async run() {
        const user = await User_1.default.create({
            email: "cliente@email.com",
            password: "12345678",
            tipo: "cliente",
        });
        await Cliente_1.default.create({
            nome: "Cliente",
            telefone: "81 98987-9876",
            userId: user.id,
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=01Cliente.js.map