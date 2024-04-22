<script lang="ts">
	import { isAuthenticated, user } from '../../auth/auth';
	import ErrorAdmin from '../../components/ErrorAdmin.svelte';
	export let data;
	const username = data.props.userName;
	const userId = data.props.userId;
	const userRole = data.props.userRole;
	const usersNameEmailAndRole = data.props.usersNameEmailAndRole;
	user.set(username);
</script>

<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Admin" />
</svelte:head>

{#if userId && userRole === 'admin' && isAuthenticated}
	<div class="container mx-auto py-8">
		<h1 class="text-3xl text-center mb-4">Admin page</h1>
		<p class="text-lg text-gray-700 leading-relaxed">Welcome, {username}!</p>
		<p class="text-lg text-gray-700 leading-relaxed">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies nisl. Phasellus
			ultricies sem a massa ultricies, ac tincidunt est laoreet. Proin pulvinar felis at sem
			malesuada, et ultricies purus posuere.
		</p>
		<table class="min-w-full leading-normal mt-4">
			<thead>
				<tr>
					<th
						class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
					>
						Username
					</th>
					<th
						class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
					>
						Email
					</th>
					<th
						class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
					>
						Role
					</th>
				</tr>
			</thead>
			<tbody>
				{#each usersNameEmailAndRole as user}
					<tr>
						<td class="px-5 py-2 border-b border-gray-200 bg-white text-sm">
							{user.username}
						</td>
						<td class="px-5 py-2 border-b border-gray-200 bg-white text-sm">
							{user.email}
						</td>
						<td class="px-5 py-2 border-b border-gray-200 bg-white text-sm">
							{user.role}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<ErrorAdmin />
{/if}
