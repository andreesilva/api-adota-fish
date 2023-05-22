import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin';
import Cliente from 'App/Models/Cliente';
import User from 'App/Models/User';
import ValidacaoSenha from 'App/Models/ValidacaoSenha';
require("dotenv").config();
import AWS from 'aws-sdk';

const sgMail = require('@sendgrid/mail')



export default class AuthController {
    
    SES = new AWS.SES({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });

    public async login({ auth, request, response }: HttpContextContract) {
        const email = request.input("email");
        const password = request.input("password");

        //console.log(email);
        //console.log(password);
        //console.log("E-mail enviado com sucesso!");

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
        catch (error){
          console.log(error);
            return response.badRequest("Invalid credentials");
        }
    }


    public async deleteCodeVerification(id){

         await ValidacaoSenha.query().where("id", id).delete();
    }
    
    
    public async forgotPassword({request, response }: HttpContextContract) {
        const email = request.input("email");
    
        try {
            const user = await User.findByOrFail("email", email);

            const cliente = await (await Cliente.findByOrFail("userId", user.id));

            const codeVerification = Math.floor(100000 + Math.random() * 900000);
            console.log(codeVerification);

            const clienteNome = cliente.nome;

            
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

            this.sendEmail(email,codeVerification,clienteNome);

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

    public async  sendEmail(email,codeVerification,clienteNome) {

        const from = "adotafish@gmail.com";
    
        
       

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: email,
  from: from,
  templateId: "d-475d6836e6de4cafa3ca0c636e14d8a3",
    dynamic_template_data: {
      name:clienteNome,
      code: codeVerification,
    },
}
try{
  sgMail.send(msg);
  console.log('Email enviado com sucesso!!!!');
}catch(error){
  console.error('Não foi possível enviar o email');
  console.error(error);

  if(error.response){
    console.error(error.response.body)
  }
}
}
}