import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDoacaoAquarioNotPhotoValidator {
  constructor(protected ctx: HttpContextContract) { }


  public schema = schema.create({
    
    capacidade: schema.number(),
    descricao: schema.string.nullableAndOptional(),
  })

  public messages: CustomMessages = {}
}
