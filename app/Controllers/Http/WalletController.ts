import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WalletController {
    public async index({ response, auth }: HttpContextContract) {
        const user = auth.user!;

        try {

            await user.load('wallet');

            return response.ok({
                status: "success",
                code: "SUCCESS",
                message: "Wallet fetched successfully",
                data: user.wallet
            })
        } catch (error) {
            return response.badRequest({
                status: "failed",
                code: error.code ?? "ERROR",
                message: error.message ?? "An error occurred",
                data: null,
            })
        }
    }
}
