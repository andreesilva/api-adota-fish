import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Especie from 'App/Models/Especie'

export default class CidadesController {

    public async show({ params, response }: HttpContextContract) {
        const idTipoAgua = params.id;

        const especies = await Especie.query()
            .where("tipo_agua", idTipoAgua)
            .orderBy("nome", "asc");

        if (especies == null) {
            return response.notFound("Não encontrado");
        }
        return response.ok(especies);
    }

    public async especieId({ response, request }: HttpContextContract) {

        const especie = await Especie.findByOrFail("nome", request.input("nome"));
                
                return response.ok({
                    id: especie.id,
                    nome:especie.nome
                });   
    }
}