import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin';
import Cliente from 'App/Models/Cliente';
import User from 'App/Models/User';

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
                const cliente = await Cliente.findByOrFail("userId", userAuth.id);
                data = {
                    id_cliente: cliente.id,
                    nome: cliente.nome,
                    telefone: cliente.telefone,
                    email: userAuth.email
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
}
