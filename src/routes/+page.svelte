<script>
	import { publicSubmit } from '$lib/api/projects.js';

	let secretKeyInput = $state('');
	let loading = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');

	function handleSecretKeyInput(event) {
		const rawValue = String(event.target.value || '');
		const upperSanitized = rawValue.toUpperCase().replace(/[^0-9A-HJKMNP-TV-Z]/g, '');
		secretKeyInput = upperSanitized.slice(0, 26);
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

		const payload = {
			secretKey: secretKeyInput,
			clientName: String(formData.get('client_name') || '').trim(),
			phone: String(formData.get('phone') || '').trim(),
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

<div class="min-h-screen bg-gray-900 pb-24 pt-4 sm:pb-32 sm:pt-8">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div
			class="relative z-10 mx-auto max-w-2xl overflow-hidden rounded-lg bg-gray-800 p-6 shadow-md before:absolute before:-z-10 before:h-24 before:w-24 before:rounded-full before:bg-purple-600 before:blur-2xl after:absolute after:-right-12 after:top-24 after:-z-10 after:h-32 after:w-32 after:rounded-full after:bg-sky-400 after:blur-xl sm:p-12 lg:p-24"
		>
			<h2 class="mb-6 text-2xl font-bold text-white">Создать проект</h2>

			{#if successMessage}
				<p class="mb-4 rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-300">
					{successMessage}
				</p>
			{/if}
			{#if errorMessage}
				<p class="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{errorMessage}</p>
			{/if}

			<form onsubmit={handleSubmit} novalidate>
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="secret_key"
						>Ваш ключ агента (он в личном кабинете) <span class="text-red-400">*</span></label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-3 text-white sm:p-2"
						type="text"
						name="secret_key"
						id="secret_key"
						bind:value={secretKeyInput}
						oninput={handleSecretKeyInput}
						pattern="^[0-9A-HJKMNP-TV-Z]{26}$"
						minlength="26"
						maxlength="26"
						inputmode="latin"
						autocapitalize="characters"
						autocomplete="off"
						placeholder="01HZY8Y9G5F8M9B6W7K3NQ4Z8X"
						required
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="client_name"
						>Имя клиента <span class="text-red-400">*</span></label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-3 text-white sm:p-2"
						type="text"
						name="client_name"
						id="client_name"
						placeholder="Введите имя клиента"
						required
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="phone"
						>Телефон клиента <span class="text-red-400">*</span></label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-3 text-white sm:p-2"
						type="tel"
						name="phone"
						id="phone"
						inputmode="tel"
						autocomplete="tel"
						placeholder="+7 (___) ___-__-__"
						required
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="address"
						>Адрес объекта (не обязательно)</label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-3 text-white sm:p-2"
						type="text"
						name="address"
						id="address"
						placeholder="Введите адрес объекта"
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="comment"
						>Комментарий (желательно)</label
					>
					<textarea
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-3 text-white sm:p-2"
						rows="3"
						name="comment"
						id="comment"
						placeholder="Опишите интерес клиента, в какую фабрику не обращаться, дополнительную информацию и т.д."
					></textarea>
				</div>

				<div class="flex justify-end">
					<button
						class="rounded-md bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 px-4 py-2 font-bold text-white hover:opacity-80 disabled:opacity-50"
						type="submit"
						disabled={loading}
					>
						{#if loading}Отправка...{/if}
						{#if !loading}Отправить заявку{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
