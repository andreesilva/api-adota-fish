import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Cliente from "App/Models/Cliente";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const user = await User.create({
      email: "cliente@email.com",
      password: "12345678",
      tipo: "cliente",
    });
    await Cliente.create({
      nome: "Cliente",
      telefone: "81 98987-9876",
      userId: user.id,
    });
  }
}
