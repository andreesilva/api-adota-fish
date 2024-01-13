import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class EditCreatePhotoClienteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    user_id: this.ctx.auth.user?.id,
  });

  public schema = schema.create({
    foto: schema.string({ trim: true }, []),
  });

  public messages: CustomMessages = {
    required: "{{field}} Insira uma foto",
  };
}
