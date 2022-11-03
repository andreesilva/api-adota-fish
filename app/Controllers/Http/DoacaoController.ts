import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
//import CidadesEstabelecimento from 'App/Models/CidadesEstabelecimento';
import Cliente from 'App/Models/Cliente';
import CreateAdocaoValidator from 'App/Validators/CreateDoacaoValidator'
import Doacao from 'App/Models/Doacao';
import Pet from 'App/Models/Pet';
//import Endereco from 'App/Models/Endereco';
import Aquario from 'App/Models/Aquario';
//import Pedido from 'App/Models/Pedido';
//import PedidoEndereco from 'App/Models/PedidoEndereco';
//import PedidoProduto from 'App/Models/PedidoProduto';
//import PedidoStatus from 'App/Models/PedidoStatus';
//import Produto from 'App/Models/Produto';

export default class DoacaoController {
    
    public async store({ auth, response, request }: HttpContextContract) {

        const payload = await request.validate(CreateAdocaoValidator);
        
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente.findByOrFail("user_id", userAuth.id);
                
        const trx = await Database.transaction();
        
        try{
            if(request.input('tipo_doacao') == 1){
                    
                const aquario = await Aquario.create({
                    foto: payload.foto,
                    capacidade:payload.capacidade,
                    descricao: payload.descricao
                });  

                const doacao = await Doacao.create({
                cliente_id_doador: cliente.id,
                tipo_doacao: payload.tipo_doacao,
                aquario_id:aquario.id, 
                pet_id:0,
                status: 1
                });
    
                await trx.commit();

                return response.ok({
                    id: doacao.id,
                    cliente_id_doador: doacao.cliente_id_doador,
                    tipo_doacao: doacao.tipo_doacao,
                    status: doacao.status
                });
            }else{
                const pet = await Pet.create({
                    foto: payload.foto,
                    especie_id: payload.especie_id,
                });  

                const doacao = await Doacao.create({
                cliente_id_doador: cliente.id,
                tipo_doacao: payload.tipo_doacao,
                aquario_id:0,
                pet_id:pet.id, 
                status: 1
                });
    
                await trx.commit();
                
                return response.ok({
                    id: doacao.id,
                    cliente_id_doador: doacao.cliente_id_doador,
                    tipo_doacao: doacao.tipo_doacao,
                    status: doacao.status
                });
            }        
        }
        catch(error){
            await trx.rollback();
            return response.badRequest("Something in the request is wrong" + error);
        }
    }
    
    public async all({ response }: HttpContextContract) {
    
        const doacoes = await Doacao.query()
            .where("status", 1)
            .preload("cliente_doador")
            .preload("aquario")
            .preload("pet", (petsQuery) => {
                petsQuery
                .preload("especie")
            })
            .orderBy("id", "desc");

        return response.ok(doacoes);
    }
   
    public async index({ auth, response }: HttpContextContract) {
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

        const doacoes = await Doacao.query()
            .where("cliente_id_doador", cliente.id)
            .preload("cliente_doador")
            .preload("aquario")
            .preload("pet", (petsQuery) => {
                petsQuery
                .preload("especie")
            })
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
