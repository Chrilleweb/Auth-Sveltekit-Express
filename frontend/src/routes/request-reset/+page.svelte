<script lang="ts">
	let email: string = '';
	let message: string = '';

	async function handleResetRequest(event: Event) {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:8080/api/request-reset', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || 'Failed to send reset email');
			}
			message = data.message;
		} catch (error) {
			message = (error as Error).message;
		}
	}
</script>

<svelte:head>
	<title>Reset Password</title>
</svelte:head>

<div class="mt-8 mx-auto bg-white p-6 rounded-md shadow-md w-full max-w-sm">
	<h1 class="text-2xl font-semibold mb-4 text-center">Reset Password</h1>
	{#if message}
		{#if message.includes('Email sent to')}
			<p class="text-green-500 mb-4">{message}</p>
			<a class="text-blue-500 mb-4 block" href="/login">Login here!</a>
		{:else}
			<p class="text-red-500 mb-4">{message}</p>
		{/if}
	{/if}
	<form on:submit={handleResetRequest}>
		<div class="mb-6">
			<label for="email" class="block text-sm font-medium text-gray-600">Email:</label>
			<input
				type="email"
				id="email"
				name="email"
				autocomplete="email"
				class="form-input mt-1 block w-full border rounded-md p-2"
				bind:value={email}
				required
			/>
		</div>
		<button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
			Send Reset Link
		</button>
	</form>
</div>
