import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'especies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string("nome").notNullable();
      table.integer("tipo_agua").comment('1- Água doce , 2 -Água salgada');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
