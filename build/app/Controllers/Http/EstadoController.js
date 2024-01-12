"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Estado_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Estado"));
class EstadosController {
    async index({ response }) {
        const estados = await Estado_1.default.query();
        return response.ok(estados);
    }
}
exports.default = EstadosController;
//# sourceMappingURL=EstadoController.js.map