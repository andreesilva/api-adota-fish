import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Cliente from 'App/Models/Cliente';
import CreateAdocaoPetValidator from 'App/Validators/CreateDoacaoPetValidator'
import Pet from 'App/Models/Pet';
import DoacaoPet from 'App/Models/DoacaoPet';

export default class DoacaoPetController {
    
    public async store({ auth, response, request }: HttpContextContract) {

        const payload = await request.validate(CreateAdocaoPetValidator);
        
        const userAuth = await auth.use("api").authenticate();
        const cliente = await Cliente.findByOrFail("user_id", userAuth.id);
                
        const trx = await Database.transaction();
        
        try{
                const pet = await Pet.create({
                    foto: payload.foto,
                    especie_id: payload.especie_id,
                    quantidade: payload.quantidade,
                    observacao: payload.observacao
                });  

                const doacao = await DoacaoPet.create({
                cliente_id_doador: cliente.id,
                pet_id:pet.id, 
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
            const doacoes = await DoacaoPet.query()
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
            .preload("pet", (petsQuery) => {
                petsQuery
                .preload("especie")
            })
            .orderBy("created_at", "desc");

        return response.ok(doacoes);
        }else{
            const existRegister = await Database.rawQuery(
                `select doacao_pets.id, pets.foto, cidades.nome,estados.nome ,especies.nome
                from doacao_pets
                inner join pets on doacao_pets.pet_id = pets.id 
                inner join especies on pets.especie_id = especies.id 
                inner join clientes on doacao_pets.cliente_id_doador = clientes.id 
                inner join users on clientes.user_id = users.id 
                inner join enderecos on clientes.id = enderecos.cliente_id 
                inner join cidades on enderecos.cidade_id = cidades.id 
                inner join estados on cidades.estado_id = estados.id 
                where doacao_pets.status = :status and estados.id = :estado`,
                {
                  status: 1,
                  estado:id
                }
              )

            const doacoes = await DoacaoPet.query()
            .where("status", 1)
            .preload("cliente_doador",(addressQuery) => {
                addressQuery
                .preload("usuario")
                .preload("endereco",(cityQuery)=>{
                    cityQuery
                    .preload("cidade",(stateQuery) => {
                        stateQuery
                        .preload("estado",(stateIdQuery) => {
                            stateIdQuery.where('id', id)
                          })
                    })
                })
            })
            .preload("pet", (petsQuery) => {
                petsQuery
                .preload("especie")
            })
            .orderBy("created_at", "desc");

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

        const doacoes = await DoacaoPet.query()
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
            .preload("pet", (petsQuery) => {
                petsQuery
                .preload("especie")
            })
            .orderBy("created_at", "desc");

        return response.ok(doacoes);
    }
    public async show({ params, response }: HttpContextContract) {
        const idDoacao = params.id;

        const pedido = await DoacaoPet.query()
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
            .preload("pet", (petsQuery) => {
                petsQuery
                .preload("especie")
            })
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

            const doacao = await DoacaoPet.findByOrFail("id", id);
            
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

            const doacao = await DoacaoPet.findByOrFail("id", id);
            
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

            const doacao = await DoacaoPet.findByOrFail("id", id);
            
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
