"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'doacao_aquarios';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer("cliente_id_doador")
                .unsigned()
                .notNullable()
                .references("id")
                .inTable("clientes");
            table.integer("cliente_id_adotante")
                .unsigned()
                .nullable()
                .references("id")
                .inTable("clientes");
            table.integer("aquario_id")
                .unsigned()
                .nullable()
                .references("id")
                .inTable("aquarios");
            table.integer("status").comment('1-Aberto , 2-Concluido ');
            table.timestamp('created_at').notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1668048121690_doacao_aquarios.js.map