import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Endereco from './Endereco';
import User from './User';

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number;

  @column()
  public nome: string;

  @column()
  public telefone: string;


  @column()
  public foto: string;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Endereco, {
    localKey: "id",
    foreignKey: "clienteId"
  })
  public endereco: HasOne<typeof Endereco>;

  @hasOne(() => User, {
    localKey: "userId",
    foreignKey: "id"
  })
  public usuario: HasOne<typeof User>;
}
