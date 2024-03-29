import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateDoacaoAquarioValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    foto: schema.string({ trim: true }),
    capacidade: schema.number(),
    descricao: schema.string.nullableAndOptional(),
  });

  public messages: CustomMessages = {};
}
