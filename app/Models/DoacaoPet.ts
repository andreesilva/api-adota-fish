import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Cliente from './Cliente'
import Pet from './Pet'

export default class DoacaoPet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cliente_id_doador: number

  @column()
  public cliente_id_adotante: number

  @column()
  public pet_id: number

  @column()
  public status: number
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @hasOne(() => Cliente, {
    foreignKey: "id",
    localKey: "cliente_id_doador",
  })
  public cliente_doador: HasOne<typeof Cliente>;

  @hasOne(() => Cliente, {
    foreignKey: "id",
    localKey: "cliente_id_adotante",
  })
  public cliente_adotante: HasOne<typeof Cliente>;

  @hasOne(() => Pet, {
    foreignKey: "id",
    localKey: "pet_id",
  })
  public pet: HasOne<typeof Pet>;
}
