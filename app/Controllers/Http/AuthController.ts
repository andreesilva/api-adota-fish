import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin';
import Cliente from 'App/Models/Cliente';
import User from 'App/Models/User';
import ValidacaoSenha from 'App/Models/ValidacaoSenha';

export default class AuthController {
    public async login({ auth, request, response }: HttpContextContract) {
        const email = request.input("email");
        const password = request.input("password");

        try {
            const user = await User.findByOrFail("email", email);

            let expira;
            switch (user.tipo) {
                case "cliente":
                    expira = "30days";
                    break;
                case "admin":
                    expira = "1days";
                    break;
                default:
                    expira = "30days";
                    break;
            }

            const token = await auth.use("api").attempt(email, password, {
                expiresIn: expira,
                name: user.serialize().email,
            });

            response.ok(token);

        }
        catch {
            return response.badRequest("Invalid credentials");
        }
    }


    public async deleteCodeVerification(id){
        //onsole.log("Hi, Welcome to " + id);

         await ValidacaoSenha.query().where("id", id).delete();
    }
    
    
    public async forgotPassword({request, response }: HttpContextContract) {
        const email = request.input("email");
    
        try {
            const user = await User.findByOrFail("email", email);

            const cliente = await (await Cliente.findByOrFail("userId", user.id));

            const codeVerification = Math.floor(100000 + Math.random() * 900000);
            console.log(codeVerification);

            
            const validacaoSenha = await ValidacaoSenha.create({
                email: email,
                codigo: codeVerification,
            
            });

            //Apaga o registro do banco de dados depois de um tempo
            //30000 = 5 minutos
            setTimeout(this.deleteCodeVerification, 300000, validacaoSenha.id);

            
            let data;

            data = {
                nome: cliente.nome,
                codigo:codeVerification,
                email: email
            };

            return response.ok(data);

        }
        catch {
            return response.badRequest("Email not exist");
        }
    }

    public async logout({ auth, response }: HttpContextContract) {
        try {
            await auth.use("api").revoke();
        }
        catch {
            return response.unauthorized("No authorization for it");
        }

        return response.ok({
            revoked: true,
        });
    }

    public async me({ auth, response }: HttpContextContract) {
        const userAuth = await auth.use("api").authenticate();

        let data;

        switch (userAuth.tipo) {
            case "cliente":
                const cliente = await (await Cliente.findByOrFail("userId", userAuth.id));

                data = {
                    id: cliente.id,
                    nome: cliente.nome,
                    telefone: cliente.telefone,
                    email: userAuth.email,
                    foto: cliente.foto
                };
                break;
            case "admin":
                const admin = await Admin.findByOrFail("userId", userAuth.id);
                data = {
                    id_admin: admin.id,
                    nome: admin.nome,
                    email: userAuth.email
                };
                break;
            default:
                return response.unauthorized("Unauthorized user - type not found");

        }
        return response.ok(data);
    }

    public async verificationCode({ params, response }: HttpContextContract) {
        const codigo = params.id;

        const validaoCodigo = await ValidacaoSenha.query()
            .where("codigo", codigo)
            .first();

        if (validaoCodigo == null) {
            return response.notFound("Nada encontrado");
        }
        return response.ok(validaoCodigo);
    }
}
