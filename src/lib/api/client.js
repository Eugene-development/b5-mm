/**
 * Base HTTP client for API requests
 * Provides functions for making authenticated and unauthenticated requests
 */

import { API_CONFIG, buildApiUrl, getAuthHeaders } from '$lib/config/api.js';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
	constructor(status, data, message) {
		super(message || `HTTP ${status}`);
		this.status = status;
		this.data = data;
		this.name = 'ApiError';
	}
}

/**
 * Make a GET request
 * @param {string} endpoint - API endpoint
 * @param {object} params - Query parameters
 * @param {boolean} requireAuth - Whether authentication is required
 * @returns {Promise<any>}
 */
export async function get(endpoint, params = {}, requireAuth = false) {
	const url = buildApiUrl(endpoint);
	const searchParams = new URLSearchParams(params);
	const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

	const headers = { ...API_CONFIG.defaultHeaders };

	if (requireAuth) {
		const authHeaders = getAuthHeaders();
		if (authHeaders) {
			Object.assign(headers, authHeaders);
		}
	}

	try {
		const response = await fetch(fullUrl, {
			method: 'GET',
			headers,
			signal: AbortSignal.timeout(API_CONFIG.timeout)
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(response.status, data, data.message);
		}

		return data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(0, null, 'Network error');
	}
}

/**
 * Make a POST request
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} params - Query parameters
 * @param {boolean} requireAuth - Whether authentication is required
 * @returns {Promise<any>}
 */
export async function post(endpoint, body = {}, params = {}, requireAuth = false) {
	const url = buildApiUrl(endpoint);
	const searchParams = new URLSearchParams(params);
	const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

	const headers = { ...API_CONFIG.defaultHeaders };

	if (requireAuth) {
		const authHeaders = getAuthHeaders();
		if (authHeaders) {
			Object.assign(headers, authHeaders);
		}
	}

	try {
		const response = await fetch(fullUrl, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(API_CONFIG.timeout)
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(response.status, data, data.message);
		}

		return data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(0, null, 'Network error');
	}
}

/**
 * Make a PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} params - Query parameters
 * @param {boolean} requireAuth - Whether authentication is required
 * @returns {Promise<any>}
 */
export async function put(endpoint, body = {}, params = {}, requireAuth = false) {
	const url = buildApiUrl(endpoint);
	const searchParams = new URLSearchParams(params);
	const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

	const headers = { ...API_CONFIG.defaultHeaders };

	if (requireAuth) {
		const authHeaders = getAuthHeaders();
		if (authHeaders) {
			Object.assign(headers, authHeaders);
		}
	}

	try {
		const response = await fetch(fullUrl, {
			method: 'PUT',
			headers,
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(API_CONFIG.timeout)
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(response.status, data, data.message);
		}

		return data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(0, null, 'Network error');
	}
}

/**
 * Make a DELETE request
 * @param {string} endpoint - API endpoint
 * @param {object} params - Query parameters
 * @param {boolean} requireAuth - Whether authentication is required
 * @returns {Promise<any>}
 */
export async function del(endpoint, params = {}, requireAuth = false) {
	const url = buildApiUrl(endpoint);
	const searchParams = new URLSearchParams(params);
	const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

	const headers = { ...API_CONFIG.defaultHeaders };

	if (requireAuth) {
		const authHeaders = getAuthHeaders();
		if (authHeaders) {
			Object.assign(headers, authHeaders);
		}
	}

	try {
		const response = await fetch(fullUrl, {
			method: 'DELETE',
			headers,
			signal: AbortSignal.timeout(API_CONFIG.timeout)
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(response.status, data, data.message);
		}

		return data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(0, null, 'Network error');
	}
}

