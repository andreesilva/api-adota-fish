import { BaseModel, column, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Especie from './Especie';

export default class Pet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public foto: string;

  @column()
  public quantidade: number

  @column()
  public observacao:  string | null
  
  @column()
  public especie_id: number;

  @hasOne(() => Especie, {
    foreignKey: "id",
    localKey: "especie_id",
  })
  public especie: HasOne<typeof Especie>;
}
