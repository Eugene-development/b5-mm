import { API_CONFIG } from '$lib/config/api.js';
import { post, ApiError } from '$lib/api/client.js';

/**
 * Submit a project publicly using a user's secret key
 * @param {{
 *  secretKey: string,
 *  clientName: string,
 *  phone: string,
 *  address?: string,
 *  comment?: string,
 * }} payload
 * @returns {Promise<{success: boolean, message: string, errors?: Record<string, string[]>}>}
 */
export async function publicSubmit(payload) {
	try {
		const response = await post(
			API_CONFIG.endpoints.publicProjectSubmit,
			{
				secret_key: payload.secretKey,
				client_name: payload.clientName,
				phone: payload.phone,
				address: payload.address ?? null,
				comment: payload.comment ?? null
			},
			{},
			false // public endpoint, no auth
		);

		return {
			success: !!response.success,
			message: response.message || 'Заявка успешно отправлена'
		};
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 422) {
				return {
					success: false,
					errors: error.data?.errors ?? {},
					message: error.data?.message || 'Ошибка валидации'
				};
			}

			if (error.status === 404) {
				return {
					success: false,
					message: 'Пользователь с таким ключом не найден'
				};
			}
		}

		return {
			success: false,
			message: 'Произошла ошибка при отправке данных'
		};
	}
}

