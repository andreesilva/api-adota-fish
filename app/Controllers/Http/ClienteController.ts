import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Cliente from 'App/Models/Cliente';
import User from 'App/Models/User';
import CreateClienteValidator from 'App/Validators/CreateClienteValidator';
import EditClienteValidator from 'App/Validators/EditClienteValidator';
import EditCreatePhotoClienteValidator from 'App/Validators/EditCreatePhotoClienteValidator';
import EditPasswordValidator from 'App/Validators/EditPasswordValidator';

export default class ClienteController {
    public async store({ request, response }: HttpContextContract) {
        const payload = await request.validate(CreateClienteValidator);

        const trx = await Database.transaction();
        try {
            const user = await User.create({
                email: payload.email,
                password: payload.password,
                tipo: "cliente"
            });
    
            const cliente = await Cliente.create({
                nome: payload.nome,
                telefone: payload.telefone,
                userId: user.id,
                foto:" "
            });
    
            await trx.commit();
    
            return response.ok({
                id: cliente.id,
                nome: cliente.nome,
                email: user.email,
                telefone: cliente.telefone
            });
        } catch (error) {
            await trx.rollback();
            return response.badRequest("Something in the request is wrong");
        }
        
        

    }
    public async update({ request, response, auth }: HttpContextContract) {
        const payload = await request.validate(EditClienteValidator);
        const userAuth = await auth.use("api").authenticate();

        const trx = await Database.transaction();
        try {
            const user = await User.findByOrFail("id", userAuth.id);
            const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

            if (payload.password) {
                user.merge({
                    email: payload.email,
                    password: payload.password
                });
            }
            else {
                user.merge({
                    email: payload.email,
                });
            }

            await user.save();

            cliente.merge({
                nome: payload.nome,
                telefone: payload.telefone,
            });

            await cliente.save();

            await trx.commit();

            return response.ok({
            id:cliente.id,
            nome:cliente.nome,
            email:user.email,
            telefone: cliente.telefone
        });

        } catch (error) {
            await trx.rollback();
            return response.badRequest("Something in the request is wrong");
        }
    }

    public async updatePhoto({ request, response, auth }: HttpContextContract) {
        const payload = await request.validate(EditCreatePhotoClienteValidator);
        const userAuth = await auth.use("api").authenticate();

        try {
            const cliente = await Cliente.findByOrFail("user_id", userAuth.id);

            cliente.merge({
                foto: payload.foto
            });

            await cliente.save();

            return response.ok({
            id:cliente.id,
            foto:cliente.foto
        });

        } catch (error) {
            return response.badRequest("Something in the request is wrong");
        }

    }

    public async updatePassword({ request, response, auth }: HttpContextContract) {
        const payload = await request.validate(EditPasswordValidator);
        const userAuth = await auth.use("api").authenticate();

        try {

            const user = await User.findByOrFail("id", userAuth.id);
            if (payload.password) {
                user.merge({
                    password: payload.password
                });
            }

            await user.save();


            return response.ok(true);

        } catch (error) {
            return response.badRequest("Something in the request is wrong");
        }

    }

    public async resetPassword({ request, response }: HttpContextContract) {
        const payload = await request.validate(EditPasswordValidator);

        try {

            const user = await User.findByOrFail("email", request.input("email"));
            if (payload.password) {
                user.merge({
                    password: payload.password
                });
            }

            await user.save();


            return response.ok(true);

        } catch (error) {
            return response.badRequest("Something in the request is wrong");
        }

    }

    public async show({ params, response }: HttpContextContract) {
        const id = params.id;

        const pedido = await Cliente.query()
            .where("id", id)
            .preload("usuario")
                .preload("endereco",(cityQuery)=>{
                    cityQuery
                    .preload("cidade",(stateQuery) => {
                        stateQuery
                        .preload("estado")
                    })
                })
            .orderBy("id", "desc")
            .first();

        if (pedido == null) {
            return response.notFound("Não encontrado");
        }
        return response.ok(pedido);
    }
}