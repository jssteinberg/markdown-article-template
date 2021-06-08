<script context="module">
	export async function preload ({params}) {
		const res = await this.fetch(`/${params.type[0]}.json`);

		if (res.status === 200) {
			const posts = await res.json();
			return { posts };
		}

		this.error(404, 'Not found');
	}
</script>

<script>
	export let posts = [];
</script>

<pre>
	{JSON.stringify(posts, null, 2)}
</pre>

<style>
	pre {
		font-size: .8em;
	}
</style>
