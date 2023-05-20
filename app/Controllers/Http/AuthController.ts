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

        console.log(email);
        console.log(password);
        console.log("E-mail enviado com sucesso!");

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
    
        /*
        var logo = "https://firebasestorage.googleapis.com/v0/b/app-adota-fish.appspot.com/o/images%2Femail%2Fimage-6.jpeg?alt=media&token=9daf26fb-9f86-4ac6-8a89-a910035b9223";
        var cadeado = "https://firebasestorage.googleapis.com/v0/b/app-adota-fish.appspot.com/o/images%2Femail%2Fimage-5.png?alt=media&token=de516fb4-c621-4f83-887f-0a67d82f3fa5";
        
        const params = {
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                <!--[if gte mso 9]>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <meta name="x-apple-disable-message-reformatting">
                  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                  <title></title>
                  
                    <style type="text/css">
                      @media only screen and (min-width: 620px) {
                  .u-row {
                    width: 600px !important;
                  }
                  .u-row .u-col {
                    vertical-align: top;
                  }
                
                  .u-row .u-col-50 {
                    width: 300px !important;
                  }
                
                  .u-row .u-col-100 {
                    width: 600px !important;
                  }
                
                }
                
                @media (max-width: 620px) {
                  .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                  }
                  .u-row .u-col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                  }
                  .u-row {
                    width: 100% !important;
                  }
                  .u-col {
                    width: 100% !important;
                  }
                  .u-col > div {
                    margin: 0 auto;
                  }
                }
                body {
                  margin: 0;
                  padding: 0;
                }
                
                table,
                tr,
                td {
                  vertical-align: top;
                  border-collapse: collapse;
                }
                
                p {
                  margin: 0;
                }
                
                .ie-container table,
                .mso-container table {
                  table-layout: fixed;
                }
                
                * {
                  line-height: inherit;
                }
                
                a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
                }
                
                table, td { color: #000000; } #u_body a { color: #161a39; text-decoration: underline; }
                    </style>
                  
                  
                
                <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
                
                </head>
                
                <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
                  <!--[if IE]><div class="ie-container"><![endif]-->
                  <!--[if mso]><div class="mso-container"><![endif]-->
                  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
                  <tbody>
                  <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
                    
                
                <div class="u-row-container" style="padding: 0px;background-color: #f9f9f9">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #f9f9f9;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;" align="left">
                        
                  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f9f9f9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                      <tr style="vertical-align: top">
                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                          <span>&#160;</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px;font-family:'Lato',sans-serif;" align="left">
                        
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                      
                      <img align="center" border="0" src=`+logo+` alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 29%;max-width: 168.2px;" width="168.2"/>
                      
                    </td>
                  </tr>
                </table>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #161a39;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #161a39;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:'Lato',sans-serif;" align="left">
                        
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                      
                      <img align="center" border="0" src=`+cadeado+` alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 10%;max-width: 58px;" width="58"/>
                      
                    </td>
                  </tr>
                </table>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 30px;font-family:'Lato',sans-serif;" align="left">
                        
                  <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
                    <p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 28px; line-height: 39.2px; color: #ffffff; font-family: Lato, sans-serif;">Recuperar senha </span></p>
                  </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;" align="left">
                        
                  <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
                    <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Olá ${clienteNome},</span></p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Você solicitou a validação do e-mail pessoal para recuperar uma conta de acesso no Adota Fish.</span></p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">O código (PIN de segurança) abaixo foi criado para essa validação. Esse código tem validade de 5 minutos para ser utilizado.</span></p>
                  </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 40px;font-family:'Lato',sans-serif;" align="left">
                        
                  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                <div align="center">
                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:47px; v-text-anchor:middle; width:179px;" arcsize="2%"  stroke="f" fillcolor="#18163a"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Lato',sans-serif;"><![endif]-->  
                    <a href="" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:'Lato',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #18163a; border-radius: 1px;-webkit-border-radius: 1px; -moz-border-radius: 1px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                      <span style="display:block;padding:15px 40px;line-height:120%;"><strong><span style="line-height: 16.8px;">${codeVerification}</span></strong></span>
                    </a>
                  <!--[if mso]></center></v:roundrect><![endif]-->
                </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  </div>
                </div>
               
                    </div>
                  </div>
                </div>
                
                  </tr>
                  </tbody>
                  </table>
                 
                </body>
                
                </html>
                `,
            },
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Recuperação de conta",
            },
          },
          Source: from,
        };
      
        try {
          await this.SES.sendEmail(params).promise();
          console.log("E-mail enviado com sucesso!");
        } catch (error) {
          console.log(error);
        }
*/
       

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: from, // Change to your recipient
  from: email, // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
    }
}