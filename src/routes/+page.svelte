<script>
	import { publicSubmit } from '$lib/api/projects.js';
	import { ulid } from 'ulid';

	let secretKeyInput = $state('');
	let loading = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');
	let isKeyFocused = $state(false);

	// Mask secret key showing only last 4 characters
	function maskSecretKey(key) {
		if (!key || key.length <= 4) {
			return key || '';
		}
		const visiblePart = key.slice(-4);
		const maskedPart = '*'.repeat(key.length - 4);
		return maskedPart + visiblePart;
	}

	// Display value for the input (masked when not focused)
	let displayValue = $derived(isKeyFocused ? secretKeyInput : maskSecretKey(secretKeyInput));

	function handleSecretKeyInput(event) {
		const rawValue = String(event.target.value || '');
		const upperSanitized = rawValue.toUpperCase().replace(/[^0-9A-HJKMNP-TV-Z]/g, '');
		secretKeyInput = upperSanitized.slice(0, 26);
	}

	function handleKeyFocus() {
		isKeyFocused = true;
	}

	function handleKeyBlur() {
		isKeyFocused = false;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		successMessage = '';
		errorMessage = '';

		const ulidPattern = /^[0-9A-HJKMNP-TV-Z]{26}$/;
		if (!ulidPattern.test(secretKeyInput)) {
			errorMessage = 'Введите корректный секретный ключ';
			return;
		}

		loading = true;

		const form = event.currentTarget;
		const formData = new FormData(form);

		const phone = String(formData.get('phone') || '').trim();
		const phoneDigits = phone.replace(/\D/g, '');

		if (phoneDigits.length < 10 || phoneDigits.length > 11) {
			errorMessage = 'Телефон должен содержать 10-11 цифр';
			loading = false;
			return;
		}

		// Normalize phone to format 79991234567
		let normalizedPhone = phoneDigits;
		if (normalizedPhone.startsWith('8') && normalizedPhone.length === 11) {
			normalizedPhone = '7' + normalizedPhone.slice(1);
		} else if (normalizedPhone.length === 10) {
			normalizedPhone = '7' + normalizedPhone;
		}

		const clientId = ulid();

		const payload = {
			secretKey: secretKeyInput,
			clientId: clientId,
			clientName: String(formData.get('client_name') || '').trim(),
			phone: normalizedPhone,
			address: String(formData.get('address') || '').trim() || null,
			comment: String(formData.get('comment') || '').trim() || null
		};

		const result = await publicSubmit(payload);

		if (result.success) {
			successMessage = result.message || 'Заявка успешно отправлена';
			form.reset();
			secretKeyInput = '';
		} else {
			errorMessage = result.message || 'Ошибка отправки заявки';
		}

		loading = false;
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 sm:py-16">
	<!-- Animated background elements -->
	<div class="pointer-events-none fixed inset-0 overflow-hidden">
		<div class="animate-blob absolute -left-32 top-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>
		<div class="animate-blob animation-delay-2000 absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
		<div class="animate-blob animation-delay-4000 absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
				Создать проект
			</h1>
			<p class="mt-2 text-slate-400">Регистрация проекта на платформе RUBONUS</p>
		</div>

		<!-- Form Card -->
		<div class="group relative">
			<!-- Glow effect -->
			<div class="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 blur transition duration-500 group-hover:opacity-30"></div>
			
			<div class="relative rounded-2xl border border-slate-700/50 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
				{#if successMessage}
					<div class="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
							<svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<p class="text-sm font-medium text-emerald-300">{successMessage}</p>
					</div>
				{/if}

				{#if errorMessage}
					<div class="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20">
							<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<p class="text-sm font-medium text-red-300">{errorMessage}</p>
					</div>
				{/if}

				<form onsubmit={handleSubmit} novalidate class="space-y-5">
					<!-- Secret Key -->
					<div class="group/field">
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300" for="secret_key">
							<svg class="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
							</svg>
							Ваш секретный ключ
							<span class="text-red-400">*</span>
						</label>
						<div class="relative">
							<input
								class="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-4 py-3 font-mono text-white placeholder-slate-500 transition-all duration-200 focus:border-purple-500/50 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
								type="text"
								name="secret_key"
								id="secret_key"
								value={displayValue}
								oninput={handleSecretKeyInput}
								onfocus={handleKeyFocus}
								onblur={handleKeyBlur}
								pattern="^[0-9A-HJKMNP-TV-Z]{26}$"
								minlength="26"
								maxlength="26"
								inputmode="latin"
								autocapitalize="characters"
								autocomplete="off"
								placeholder="01HZY8Y9G5F8M9B6W7K3NQ4Z8X"
								required
							/>
							{#if secretKeyInput && !isKeyFocused}
								<div class="absolute right-3 top-1/2 -translate-y-1/2">
									<svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
									</svg>
								</div>
							{/if}
						</div>
						{#if secretKeyInput && !isKeyFocused}
							<p class="mt-2 flex items-center gap-1 text-xs text-slate-500">
								<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
								Ключ скрыт для безопасности
							</p>
						{/if}
					</div>

					<!-- Client Name -->
					<div class="group/field">
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300" for="client_name">
							<svg class="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
							Имя клиента
							<span class="text-red-400">*</span>
						</label>
						<input
							class="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:border-blue-500/50 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							type="text"
							name="client_name"
							id="client_name"
							placeholder="Введите имя клиента"
							required
						/>
					</div>

					<!-- Phone -->
					<div class="group/field">
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300" for="phone">
							<svg class="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
							</svg>
							Телефон клиента
							<span class="text-red-400">*</span>
						</label>
						<input
							class="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:border-green-500/50 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20"
							type="tel"
							name="phone"
							id="phone"
							inputmode="tel"
							autocomplete="tel"
							placeholder="+7 (___) ___-__-__"
							required
						/>
					</div>

					<!-- Address -->
					<div class="group/field">
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300" for="address">
							<svg class="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Адрес объекта
							<span class="text-slate-500 text-xs">(не обязательно)</span>
						</label>
						<input
							class="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:border-amber-500/50 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
							type="text"
							name="address"
							id="address"
							placeholder="Введите адрес объекта"
						/>
					</div>

					<!-- Comment -->
					<div class="group/field">
						<label class="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300" for="comment">
							<svg class="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
							</svg>
							Комментарий
							<span class="text-slate-500 text-xs">(желательно)</span>
						</label>
						<textarea
							class="w-full resize-none rounded-xl border border-slate-600/50 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:border-indigo-500/50 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
							rows="3"
							name="comment"
							id="comment"
							placeholder="Интересы клиента, его бюджет, в какую фабрику не обращаться и пр..."
						></textarea>
					</div>

					<!-- Submit Button -->
					<div class="pt-2">
						<button
							class="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
							type="submit"
							disabled={loading}
						>
							<span class="relative z-10 flex items-center justify-center gap-2">
								{#if loading}
									<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Отправка...
								{:else}
									<svg class="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
									</svg>
									Отправить заявку
								{/if}
							</span>
							<div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"></div>
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Footer hint -->
		<p class="mt-6 mx-8 text-center text-sm text-slate-500">
			Клиент должен быть осведомлён о том, что в ближайшее время с ним свяжутся специалисты компании Новострой
		</p>
	</div>
</div>

<style>
	@keyframes blob {
		0%, 100% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(20px, -30px) scale(1.1);
		}
		50% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		75% {
			transform: translate(30px, 10px) scale(1.05);
		}
	}

	.animate-blob {
		animation: blob 15s ease-in-out infinite;
	}

	.animation-delay-2000 {
		animation-delay: 2s;
	}

	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>
