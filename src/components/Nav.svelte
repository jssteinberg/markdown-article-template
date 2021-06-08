<script>
	export let segment;
</script>

<nav>
	<ul>
	<li><a aria-current="{segment === undefined ? 'page' : undefined}" href="/">Front</a></li>

	<!--
	<li><a aria-current="{segment === 'about' ? 'page' : undefined}" href="/about">About</a></li>

	<li><a sapper:prefetch aria-current="{segment === 'blog' ? 'page' : undefined}" href="/blog">Blog</a></li>
	-->
	</ul>
</nav>
