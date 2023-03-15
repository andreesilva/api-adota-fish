import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'validacao_senhas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string("email").nullable();
      table.integer("codigo");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}