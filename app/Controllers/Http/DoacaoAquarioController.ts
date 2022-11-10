import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Cliente from 'App/Models/Cliente';
import CreateAdocaoAquarioValidator from 'App/Validators/CreateDoacaoAquarioValidator'
import Aquario from 'App/Models/Aquario';
import DoacaoAquario from 'App/Models/DoacaoAquario';

export default class DoacaoAquarioController {
    
    public async store({ auth, response, request }: HttpContextContract) {

        const payload = await request.validate(CreateAdocaoAquarioValidator);
        
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente.findByOrFail("user_id", userAuth.id);
                
        const trx = await Database.transaction();
        
        try{      
                const aquario = await Aquario.create({
                    foto: payload.foto,
                    capacidade:payload.capacidade,
                    descricao: payload.descricao
                });  

                const doacao = await DoacaoAquario.create({
                cliente_id_doador: cliente.id,
                aquario_id:aquario.id, 
                status: 1
                });
    
                await trx.commit();

                return response.ok({
                    id: doacao.id,
                    cliente_id_doador: doacao.cliente_id_doador,
                    status: doacao.status
                });
        }
        catch(error){
            await trx.rollback();
            return response.badRequest("Something in the request is wrong" + error);
        }
    }
    
    public async all({ response }: HttpContextContract) {
    
        const doacoes = await DoacaoAquario.query()
            .where("status", 1)
            .preload("cliente_doador")
            .preload("aquario")
            .orderBy("id", "desc");

        return response.ok(doacoes);
    }
   
    public async index({ auth, response }: HttpContextContract) {
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

        const doacoes = await DoacaoAquario.query()
            .where("cliente_id_doador", cliente.id)
            .preload("cliente_doador")
            .preload("aquario")
            .orderBy("id", "desc");

        return response.ok(doacoes);
    }
    /*
    public async show({ params, response }: HttpContextContract) {
        const idPedido = params.hash_id;

        const pedido = await Pedido.query()
            .where("hash_id", idPedido)
            .preload("produtos", (produtoQuery) => {
                produtoQuery.preload("produto");
            }).preload("cliente")
            .preload("endereco")
            .preload("estabelecimento")
            .preload("meio_pagamento")
            .preload("pedido_status", (statusQuery) => {
                statusQuery.preload("status");
            }).first();

        if (pedido == null) {
            return response.notFound("Pedido não encontrado");
        }
        return response.ok(pedido);
    }
    */
}
