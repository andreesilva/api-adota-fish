"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'enderecos';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer("cliente_id").unsigned().notNullable().references("id").inTable("clientes");
            table.integer("cidade_id").unsigned().notNullable().references("id").inTable("cidades");
            table.string("rua").notNullable();
            table.string("numero").nullable();
            table.string("bairro").nullable();
            table.string("ponto_referencia").nullable();
            table.string("complemento").nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1665007503871_enderecos.js.map