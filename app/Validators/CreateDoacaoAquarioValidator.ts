import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDoacaoAquarioValidator {
  constructor(protected ctx: HttpContextContract) { }


  public schema = schema.create({
    
    foto: schema.string({ trim: true }),
    capacidade: schema.number(),
    descricao: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {}
}
