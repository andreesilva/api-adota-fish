import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Especie extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @column()
  public tipo_agua: number;
}
