<script lang="ts">
    import { isAuthenticated } from '../../auth/auth';
    import ErrorAuth from '../../components/ErrorAuth.svelte';
    export let data;
    const username = data.props.userName;
	const userId = data.props.userId;
	const userRole = data.props.role;
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
	</div>
{:else}
	<ErrorAuth />
{/if}