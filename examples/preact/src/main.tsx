import { hydrate, prerender as ssr } from "preact-iso";
import { App } from './app.tsx';

if (typeof window !== "undefined") {
	hydrate(<App />, document.body);
}

export async function prerender() {
	const { html, links } = await ssr(<App />);
	return {
		html,
		links,
	};
}
