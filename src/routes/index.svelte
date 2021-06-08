<script context="module">
	export async function preload () {
		const res = await this.fetch(`/README.md.json`);

		if (res.status === 200) {
			const page = await res.json();
			return { page };
		}

		this.error(404, 'Not found');
	}
</script>

<script>
	export let page;
</script>

<svelte:head>
	{#if page && !page.length && page.title}
		<title>{page.title}</title>
	{/if}
</svelte:head>

{#if page && !page.length}
	<h1>{@html page.title}</h1>
	<p>{@html page.deck}</p>
	{@html page.body}
{/if}
