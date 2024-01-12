import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Cliente from './Cliente'
import Aquario from './Aquario'

export default class DoacaoAquario extends BaseModel {
  @column({ isPrimary: true})
  public id: number

  @column()
  public cliente_id_doador: number

  @column()
  public cliente_id_adotante: number


  @column()
  public aquario_id: number

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

  @hasOne(() => Aquario, {
    foreignKey: "id",
    localKey: "aquario_id",
  })
  public aquario: HasOne<typeof Aquario>;
}
