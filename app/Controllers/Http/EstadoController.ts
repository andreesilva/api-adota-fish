import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Estado from 'App/Models/Estado'

export default class EstadosController {
    public async index({ response }: HttpContextContract) {
        const estados = await Estado.query()

        return response.ok(estados);
    }
}