import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Cliente from './Cliente'
import Pet from './Pet'
import Aquario from './Aquario'
//import PedidoStatus from './PedidoStatus'
//import Estabelecimento from './Estabelecimento'
//import PedidoProduto from './PedidoProduto'
//import PedidoEndereco from './PedidoEndereco'
//import MeiosPagamento from './MeiosPagamento'

export default class Doacao extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public hash_id: string

  @column()
  public cliente_id_doador: number

  @column()
  public cliente_id_adotante: number

  @column()
  public tipo_doacao: number

  @column()
  public pet_id: number

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

  @hasOne(() => Pet, {
    foreignKey: "id",
    localKey: "pet_id",
  })
  public pet: HasOne<typeof Pet>;

  @hasOne(() => Aquario, {
    foreignKey: "id",
    localKey: "aquario_id",
  })
  public aquario: HasOne<typeof Aquario>;
}
