import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cliente from 'App/Models/Cliente';
import Endereco from 'App/Models/Endereco';
import CreateEditEnderecoValidator from 'App/Validators/CreateEditEnderecoValidator';

export default class EnderecosController {
    
    public async store({ response, request, auth }: HttpContextContract) {
        const payload = await request.validate(CreateEditEnderecoValidator);
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

        const endereco = await Endereco.create({
            cidadeId: payload.cidade_id,
            clienteId: cliente.id,
            rua: payload.rua,
            numero: payload.numero,
            bairro: payload.bairro,
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
