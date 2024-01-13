import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateDoacaoPetNotPhotValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    quantidade: schema.number(),
    especie_id: schema.number(),
    observacao: schema.string.nullableAndOptional(),
  });

  public messages: CustomMessages = {};
}
