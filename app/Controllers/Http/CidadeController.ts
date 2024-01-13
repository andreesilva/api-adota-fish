import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Cidade from "App/Models/Cidade";

export default class CidadesController {
  public async index({ response }: HttpContextContract) {
    const cidades = await Cidade.query();

    return response.ok(cidades);
  }

  public async show({ params, response }: HttpContextContract) {
    const idEstado = params.id;

    const cidades = await Cidade.query()
      .where("estado_id", idEstado)
      .orderBy("id", "asc");

    if (cidades == null) {
      return response.notFound("Não encontrado");
    }
    return response.ok(cidades);
  }
}
