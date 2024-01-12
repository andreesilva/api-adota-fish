import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string("foto").notNullable();
      table.integer("especie_id").unsigned().notNullable().references("id").inTable("especies").onDelete("CASCADE");
      table.text("observacao").notNullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
