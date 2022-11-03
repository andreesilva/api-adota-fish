import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'doacaos'

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
      table.integer("tipo_doacao").comment('1-Aquário , 2-Pet');  
      table.integer("pet_id");
      table.integer("aquario_id");  
      table.integer("status").comment('1-Aberto , 2-Concluido ');  
      table.timestamp('created_at').notNullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
