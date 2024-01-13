import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Estado from "./Estado";

export default class Cidade extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @column()
  public estado_id: number;

  @hasOne(() => Estado, {
    foreignKey: "id",
    localKey: "estado_id",
  })
  public estado: HasOne<typeof Estado>;
}
