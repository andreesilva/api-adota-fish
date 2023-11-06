"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Admin_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Admin"));
const Cliente_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Cliente"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const ValidacaoSenha_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ValidacaoSenha"));
require("dotenv").config();
const sgMail = require('@sendgrid/mail');
class AuthController {
    async login({ auth, request, response }) {
        const email = request.input("email");
        const password = request.input("password");
        try {
            const user = await User_1.default.findByOrFail("email", email);
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
        catch (error) {
            console.log(error);
            return response.badRequest("Invalid credentials");
        }
    }
    async deleteCodeVerification(id) {
        await ValidacaoSenha_1.default.query().where("id", id).delete();
    }
    async forgotPassword({ request, response }) {
        const email = request.input("email");
        try {
            const user = await User_1.default.findByOrFail("email", email);
            const cliente = await (await Cliente_1.default.findByOrFail("userId", user.id));
            const codeVerification = Math.floor(100000 + Math.random() * 900000);
            console.log(codeVerification);
            const clienteNome = cliente.nome;
            const validacaoSenha = await ValidacaoSenha_1.default.create({
                email: email,
                codigo: codeVerification,
            });
            setTimeout(this.deleteCodeVerification, 300000, validacaoSenha.id);
            let data;
            data = {
                nome: cliente.nome,
                codigo: codeVerification,
                email: email
            };
            this.sendEmail(email, codeVerification, clienteNome);
            return response.ok(data);
        }
        catch {
            return response.badRequest("Email not exist");
        }
    }
    async logout({ auth, response }) {
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
    async me({ auth, response }) {
        const userAuth = await auth.use("api").authenticate();
        let data;
        switch (userAuth.tipo) {
            case "cliente":
                const cliente = await (await Cliente_1.default.findByOrFail("userId", userAuth.id));
                data = {
                    id: cliente.id,
                    nome: cliente.nome,
                    telefone: cliente.telefone,
                    email: userAuth.email,
                    foto: cliente.foto
                };
                break;
            case "admin":
                const admin = await Admin_1.default.findByOrFail("userId", userAuth.id);
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
    async verificationCode({ params, response }) {
        const codigo = params.id;
        const validaoCodigo = await ValidacaoSenha_1.default.query()
            .where("codigo", codigo)
            .first();
        if (validaoCodigo == null) {
            return response.notFound("Nada encontrado");
        }
        return response.ok(validaoCodigo);
    }
    async sendEmail(email, codeVerification, clienteNome) {
        const from = "adotafish@gmail.com";
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: from,
            templateId: "d-475d6836e6de4cafa3ca0c636e14d8a3",
            dynamic_template_data: {
                name: clienteNome,
                code: codeVerification,
            },
        };
        try {
            sgMail.send(msg);
            console.log('Email enviado com sucesso!!!!');
        }
        catch (error) {
            console.error('Não foi possível enviar o email');
            console.error(error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map