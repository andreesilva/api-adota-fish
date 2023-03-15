import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Aquario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public foto: string

  @column()
  public capacidade: number

  @column()
  public descricao:  string | null
}