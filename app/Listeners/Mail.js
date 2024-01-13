"use strict";

const Logger = use("Logger");

/** @type {require('@sendgrid/mail')} */
const sgMail = use("@sendgrid/mail");
const UtilHelper = use("App/Helpers/UtilHelper");
/** @type {require('@sendgrid/mail')} */
const moment = require("moment");

const OccurrenceModel = use("App/Models/Occurrence");

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

// Configurao de SG
sgMail.setApiKey(Env.get("SENDGRID_API_KEY"));

// Configuraçaão de templates
const templates = {
  new_client: "d-ae986559d1424098b31bc85d0ea37142",
  new_tech: "d-82ebc4656dae42928ec8ed0d7183c1b5",
  request_new_password: "d-4e3293ddc77044ed8faf9b68afa9c5cd",

  shared_occurrence: "",
  orderRejected: "d-64b7c66b052047c682ea3ea2ffd5b023",
  orderApproved: "d-29f2094086884fe8990d4049841f1e0e",
  // Checklist
  checklist: "d-594b0587f03e4e2fbe5dd4c3ed813c81",
  // Atendimentos
  new_occurrence: "d-92be865571294641bf37cf00a1dc41e9",
  occurrence_cancel: "d-8bc2723a1a8f45de903adc3c54c1e506",
  occurrence_finish: "d-9b05e30069b84bdf93851e238bd9d14a"
};

/**
 * Função generica de envio de email
 * @param content Object Conteudo pra envio de email
 */
function sendEmail(content) {
  if (Env.get("NODE_ENV") !== "testing") {
    sgMail
      .send(content)
      .then((res) => {
        Logger.info(res);
      })
      .catch((err) => {
        Logger.error(err.toString());
      });
  }
}

/**
 * ===========================================
 * =========  Default Info Occ
 * ===========================================
 */
async function getContentOccurrenceForClient(occurrenceId, template) {
  const occurrenceDb = await OccurrenceModel.query()
    .where('id', occurrenceId)
    .with('service')
    .with('specialist.individual')
    .with('client')
    .with('address.city')
    .first();

  const occurrence = occurrenceDb.toJSON();

  return {
    to: occurrence.client.username,
    from: "noreply@findup.com.br",
    subject: "Chamado FindUP",
    templateId: template,
    dynamic_template_data: {
      specialist_name: occurrence.specialist ? `${occurrence.specialist.first_name} ${occurrence.specialist.last_name}` : '',
      cpf: `${occurrence.specialist ? occurrence.specialist.individual.cpf.substring(0, 3) : ''}.*.*-**`,
      rg: `${occurrence.specialist ? occurrence.specialist.individual.rg.substring(0, 3) : ''}**`,
      client_name: `${occurrence.client.first_name} ${occurrence.client.last_name}`,
      os: occurrence.id,
      scheduling: UtilHelper.convertStringToDate(occurrence.schedule_time, "D/MM/Y hh:mm", occurrence.address.city.timezone),
      service: occurrence.service.name,
      address: occurrence.address.street,
      description: occurrence.description,
      solution_description: occurrence.solution_description,
      time_duration: UtilHelper.getTimeDuration(occurrence.checkin_date, occurrence.checkout_date)
    },
  };
}


/**
 * ===========================================
 * =========  Default Info Occ
 * ===========================================
 */
async function getContentOccurrenceForSpecialist(occurrenceId, template) {
  const occurrenceDb = await OccurrenceModel.query()
    .where('id', occurrenceId)
    .with('service')
    .with('specialist.individual')
    .with('client')
    .with('address.city')
    .first();

  const occurrence = occurrenceDb.toJSON();

  return {
    to: occurrence.specialist.username,
    from: "noreply@findup.com.br",
    subject: "Chamado FindUP",
    templateId: template,
    dynamic_template_data: {
      specialist_name: occurrence.specialist ? `${occurrence.specialist.first_name} ${occurrence.specialist.last_name}` : '',
      cpf: `${occurrence.specialist.individual.cpf.substring(0, 3)}.*.*-**`,
      rg: `${occurrence.specialist.individual.rg.substring(0, 3)}**`,
      client_name: `${occurrence.client.first_name} ${occurrence.client.last_name}`,
      os: occurrence.id,
      scheduling: UtilHelper.convertStringToDate(occurrence.schedule_time, "D/MM/Y hh:mm", occurrence.address.city.timezone),
      service: occurrence.service.name,
      address: occurrence.address.street,
      description: occurrence.description,
      solution_description: occurrence.solution_description,
      time_duration: UtilHelper.getTimeDuration(occurrence.checkin_date, occurrence.checkout_date)
    },
  };
}

const Mail = (exports = module.exports = {});

/**
 * Novo usuário cadastrado
 */
Mail.newUser = async (user) => {
  var content = {
    to: user.username,
    from: "noreply@findup.com.br",
    subject: "Bem-vindo ao FindUP",
    templateId: templates.new_client,
    dynamic_template_data: {},
  };

  // Alterar o template caso seja um técnico se cadastrando.
  if (user.access_specialist) {
    content.templateId = templates.new_tech;
  }

  sendEmail(content);
};

Mail.late = async (info) => {
};

/**
 * Requisição de nova senha, enviar email com link para a troca de senha
 */
Mail.requestNewPassword = async (user) => {
  var content = {
    to: user.username,
    from: "noreply@findup.com.br",
    subject: "Recuperar senha",
    templateId: templates.request_new_password,
    dynamic_template_data: {
      link:
        "https://account.findup.com.br/users/new-password/" +
        user.reset_password_token,
      name: user.first_name,
    },
  };

  if (user.access_specialist) {
    content.dynamic_template_data.link =
      "https://account.findup.com.br/users/new-password/" +
      user.reset_password_token;
  }

  sendEmail(content);
};

/**
 * Pedido de compra recusado
 */
Mail.orderRejected = async (user, order) => {
  var content = {
    to: user.username,
    from: "noreply@findup.com.br",
    subject: "Pedido de compra recusado",
    templateId: templates.orderRejected,
    dynamic_template_data: {
      name: user.first_name + " " + user.last_name,
      os: order.occurrence_id,
      name_product: order.name,
      quantity: order.quantity,
      client_value: "R$" + order.quantity * order.client_value,
    },
  };

  sendEmail(content);
};

/**
 * Pedido de compra aceito
 */
Mail.orderApproved = async (user, order) => {
  var content = {
    to: user.username,
    from: "noreply@findup.com.br",
    subject: "Pedido de compra aceito",
    templateId: templates.orderApproved,
    dynamic_template_data: {
      name: user.first_name + " " + user.last_name,
      os: order.occurrence_id,
      name_product: order.name,
      quantity: order.quantity,
      client_value: "R$" + order.quantity * order.client_value,
    },
  };

  sendEmail(content);
};


/**
 * ===========================================
 * =========  Occ Canceled
 * ===========================================
 */
Mail.cancel = async (data) => {
  const content = await getContentOccurrenceForSpecialist(data.occurrence_id, templates.occurrence_cancel);
  sendEmail(content);
};


/**
 * ===========================================
 * =========  Occ Finish
 * ===========================================
 */
Mail.finish = async (data) => {
  const content = await getContentOccurrenceForClient(data.occurrence_id, templates.occurrence_finish);
  sendEmail(content);
};

/**
 * Novo usuário cadastrado
 */
Mail.nerbyOccurrence = async (info) => {
  const content = {
    // to: info.user.username,
    to: info.user.username,
    from: {
      email: Env.get('MAIL_FROM')
    },
    subject: "Novo Atendimento FindUP",
    templateId: templates.new_occurrence,
    dynamic_template_data: {
      os: info.occurrence.id,
      schedule_time: UtilHelper.convertStringToDate(info.occurrence.schedule_time, "DD/MM/YYYY HH:mm", info.occurrence.address.city.timezone),
      link: `https://tech.findup.com.br/occurrence/${info.occurrence.id}`,
    },
  };

  sendEmail(content);
};

/**
 * Finalização de CheckList
 */
Mail.checklist = async (email, link, occurrence_id) => {
  console.log(`* [ChecklistListener][checklist] - start sending mail: (${email} - ${link} - ${occurrence_id}) *`);

  const content = {
    to: email,
    from: Env.get('MAIL_FROM'),
    subject: "CheckList - Ocorrência",
    templateId: templates.checklist,
    dynamic_template_data: {
      os: occurrence_id,
      link
    },
  };

  sendEmail(content);
};


module.exports = Mail;