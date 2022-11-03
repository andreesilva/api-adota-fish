import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDoacaoPetValidator {
  constructor(protected ctx: HttpContextContract) { }


  public schema = schema.create({
    
    tipo_doacao: schema.number(),
    foto: schema.string({ trim: true }),
    especie_id: schema.number(),
    capacidade: schema.number(),
    descricao: schema.string({ trim: true }),
  })

  public messages: CustomMessages = {}
}
