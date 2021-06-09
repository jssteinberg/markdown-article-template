<script>
	import A11yWrapper, { a11yTitle } from '../components/A11yAppWrapper.svelte';
	import Nav from '../components/Nav.svelte';

	const updateA11yTitle = () => {
		if (!segment) a11yTitle.set('Home');
		else a11yTitle.set('');
	};

	$: updatedA11yTitle = updateA11yTitle(segment);

	export let segment;
</script>

<style global>
	@import 'floor-typography-css/src/reset.css';
	@import 'floor-typography-css/src/normalize-style.css';
	@import 'floor-typography-css/src/vars.css';
	/* Files below are optional: */
	@import 'floor-typography-css/src/headings-font.css';
	@import 'floor-typography-css/src/headings-font-lg.css' (min-width: 1200px);
	@import 'floor-typography-css/src/headings-margin.css';
	@import 'floor-typography-css/src/classes-sr.css';

	:root {
		--space: calc(1rem * (1 + var(--added-lead)));
		--h-added-lead: .25;

		--reading-width: 50rem;

		--font-system: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		--h-font: var(--font-system);

		--bg-h: 0;
		--fg-h: 0;
		--bg-l: 100%;
		--fg-l: 0%;
		--code-bg: hsl(var(--bg-h),5%,calc(var(--bg-l) - 5%));

		font-size: 1.1em;
		background: hsl(var(--bg-h),0%,var(--bg-l));
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--bg-l: 10%;
			--fg-l: 100%;
		}
	}

	body {
		max-width: var(--reading-width);
		margin: var(--space, 1em) auto;
		padding: 0 1ch;

		font-family: var(--font-system);
		color: hsla(var(--fg-h),0%,var(--fg-l),87.5%);
	}

	a {
		color: inherit;
	}

	@media (min-width: 600px) {
		h1 {
			hyphens: manual;
		}
	}

	/** Lead p */

	h1 + * {
		--lead-line-height: 1.3;
		font-size: calc(
			(1em * (1 + var(--added-lead, .6)))
			/
			var(--lead-line-height)
		);
		line-height: var(--lead-line-height);
	}

	/** Code blocks */

	pre {
		--space-pre: calc(var(--space) * .75);
		--radius-pre: .9em;
		width: 100%;
		max-width: unset;
		overflow: auto;
		white-space: pre;
		box-shadow: 0 0 0 .1em hsla(var(--bg-h),0%,calc(var(--bg-l) - 40%),40%),
			0 0 0 .1em hsla(var(--bg-h),0%,calc(var(--bg-l) + 80%),80%);
		border-radius: var(--radius-pre);
	}

	code {
		font-size: .925em;
	}

	code::after,
	code::before {
		content: '`';
	}

	pre code::after,
	pre code::before {
		content: unset;
	}

	h2 code,
	h3 code {
		background: transparent;
		border: none;
	}

	pre code {
		display: inline-block;
		padding: calc(var(--space, 1rem) - 1px) min(var(--space, 1rem), 4vw);
		font-size: .9em;
		background: var(--code-bg);
		border-radius: var(--radius-pre);
		min-width: 100%;
	}

	pre code * {
		opacity: .55;
	}

	pre code .hljs-keyword,
	pre code .hljs-string,
	pre code .hljs-section,
	pre code .hljs-emphasis {
		opacity: 1;
	}

	pre code .hljs-keyword,
	pre code .hljs-punctuation,
	pre code .hljs-attr {
		font-weight: bold;
	}

	pre code .hljs-emphasis {
		font-style: italic;
	}
</style>

<A11yWrapper class="page">
	<div slot="header">
		<Nav {segment}></Nav>
	</div>

	<slot></slot>
</A11yWrapper>
