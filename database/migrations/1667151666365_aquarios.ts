import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aquarios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string("foto").notNullable();
      table.integer("capacidade");
      table.text("descricao").notNullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
