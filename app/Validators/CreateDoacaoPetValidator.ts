import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDoacaoPetValidator {
  constructor(protected ctx: HttpContextContract) { }


  public schema = schema.create({
    
    foto: schema.string({ trim: true }),
    quantidade: schema.number(),
    especie_id: schema.number(),
    observacao: schema.string.nullableAndOptional({ trim: true }, [
      rules.maxLength(255)]),
  })

  public messages: CustomMessages = {}
}