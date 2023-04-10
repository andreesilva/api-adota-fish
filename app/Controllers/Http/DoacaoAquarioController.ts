import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Cliente from 'App/Models/Cliente';
import CreateAdocaoAquarioValidator from 'App/Validators/CreateDoacaoAquarioValidator'
import Aquario from 'App/Models/Aquario';
import DoacaoAquario from 'App/Models/DoacaoAquario';
import Event from '@ioc:Adonis/Core/Event'

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

    public async all({ response, params }: HttpContextContract) {

        const id = params.id;

        if(id == 0){
            const doacoes = await DoacaoAquario.query()
            .where("status", 1)
            .preload("cliente_doador",(addressQuery) => {
                addressQuery
                .preload("usuario")
                .preload("endereco",(cityQuery)=>{
                    cityQuery
                    .preload("cidade",(stateQuery) => {
                        stateQuery
                        .preload("estado")
                    })
                })
            })
            .preload("aquario")
            .orderBy("id", "desc");

            return response.ok(doacoes);
        }else{
            const existRegister = await Database.rawQuery(
                `select doacao_aquarios.id,aquarios.foto,aquarios.capacidade,cidades.nome,estados.nome 
                from doacao_aquarios 
                inner join aquarios on doacao_aquarios.aquario_id = aquarios.id 
                inner join clientes on doacao_aquarios.cliente_id_doador = clientes.id 
                inner join users on clientes.user_id = users.id 
                inner join enderecos on clientes.id = enderecos.cliente_id 
                inner join cidades on enderecos.cidade_id = cidades.id 
                inner join estados on cidades.estado_id = estados.id 
                where doacao_aquarios.status = :status and estados.id = :estado`,
                {
                  status: 1,
                  estado:id
                }
              )
    
              const doacoes = await DoacaoAquario.query()     
              .preload("cliente_doador",(addressQuery) => {
                addressQuery
                .preload("usuario")
                .preload("endereco",(cityQuery)=>{
                    cityQuery
                    .preload("cidade",(stateQuery) => {
                        stateQuery
                        .preload("estado",(stateIdQuery) => {
                            stateIdQuery
                            .where("id",id)
                        })
                    })
                })
            })
            .preload("aquario")
            .where("status",1)
            .orderBy("id", "desc")
                          
            //Event.on('db:query', Database.prettyPrint)

            if(existRegister[0] == ""){
                return response.ok([]);
              }else{
                return response.ok(doacoes);
              }
        }
    }
   
    public async index({ auth, response }: HttpContextContract) {
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente.findByOrFail("user_id", userAuth.id);


        const doacoes = await DoacaoAquario.query()
            .where("cliente_id_doador", cliente.id)
            .where("status", 1)
            .orWhere("status", 2)
            .preload("cliente_doador",(addressQuery) => {
                addressQuery
                .preload("usuario")
                .preload("endereco",(cityQuery)=>{
                    cityQuery
                    .preload("cidade",(stateQuery) => {
                        stateQuery
                        .preload("estado")
                    })
                })
            })
            .preload("aquario")
            .orderBy("id", "desc");

        return response.ok(doacoes);
    }
    
    public async show({ params, response }: HttpContextContract) {
        const idDoacao = params.id;

        const pedido = await DoacaoAquario.query()
            .where("id", idDoacao)
            .preload("cliente_doador",(addressQuery) => {
                addressQuery
                .preload("usuario")
                .preload("endereco",(cityQuery)=>{
                    cityQuery
                    .preload("cidade",(stateQuery) => {
                        stateQuery
                        .preload("estado")
                    })
                })
            })
            .preload("aquario")
            .orderBy("id", "desc")
            .first();

        if (pedido == null) {
            return response.notFound("Não encontrado");
        }
        return response.ok(pedido);
    }

    public async inactivate({ response ,params}: HttpContextContract) {
      
        const id = params.id;

        try {

            const doacao = await DoacaoAquario.findByOrFail("id", id);
            
            doacao.merge({
                status: 2
            });

            await doacao.save();


            return response.ok(true);

        } catch (error) {
            return response.badRequest("Something in the request is wrong");
        }

    }

    public async activate({ response ,params}: HttpContextContract) {
      
        const id = params.id;

        try {

            const doacao = await DoacaoAquario.findByOrFail("id", id);
            
            doacao.merge({
                status: 1
            });

            await doacao.save();


            return response.ok(true);

        } catch (error) {
            return response.badRequest("Something in the request is wrong");
        }

    }

    public async delete({ response ,params}: HttpContextContract) {
      
        const id = params.id;

        try {

            const doacao = await DoacaoAquario.findByOrFail("id", id);
            
            doacao.merge({
                status: 3
            });

            await doacao.save();


            return response.ok(true);

        } catch (error) {
            return response.badRequest("Something in the request is wrong");
        }

    }   
}