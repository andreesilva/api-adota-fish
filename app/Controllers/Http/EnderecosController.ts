import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Endereco from 'App/Models/Endereco';
import CreateEditEnderecoValidator from 'App/Validators/CreateEditEnderecoValidator';

export default class EnderecosController {
    
    public async store({ response, request }: HttpContextContract) {
        const payload = await request.validate(CreateEditEnderecoValidator);
        
        const endereco = await Endereco.create({
            cidadeId: payload.cidade_id,
            clienteId: request.input("cliente_id"),
            rua: payload.rua,
            numero: payload.numero,
            bairro: payload.bairro,
            pontoReferencia: request.input("ponto_referencia"),
            complemento: request.input("complemento"),
        });
        return response.ok(endereco);
    }

    
    public async update({ request, response, params }: HttpContextContract) {
        const payload = await request.validate(CreateEditEnderecoValidator);
        const endereco = await Endereco.findOrFail(params.id);

        endereco.merge(payload);
        await endereco.save();

        return response.ok(endereco);
    }
}
