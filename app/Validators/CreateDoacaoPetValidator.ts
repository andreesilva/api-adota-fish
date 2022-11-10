import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDoacaoPetValidator {
  constructor(protected ctx: HttpContextContract) { }


  public schema = schema.create({
    
    foto: schema.string({ trim: true }),
    especie_id: schema.number(),
  })

  public messages: CustomMessages = {}
}
