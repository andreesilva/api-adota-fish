import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'doacao_aquarios'

  public async up () {
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
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
