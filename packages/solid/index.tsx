import {
	createSignal,
	onMount,
	type JSX,
	Switch,
	Match,
	createEffect,
	Show,
} from 'solid-js';
import { Portal, isServer } from 'solid-js/web';

const isBrowser = typeof document !== 'undefined';
const supportsDSD =
	isBrowser && 'shadowRootMode' in HTMLTemplateElement.prototype;

export default function ShadowRoot(props: {
	children: JSX.Element;
	mode?: ShadowRootMode;
}) {
	let mode = props.mode || 'open';

	const [hydrated, setHydrated] = createSignal(false);
	createEffect(() => void setHydrated(true));

	return (
		<Switch>
			{/* for SSR, use DSD template */}
			<Match when={isServer}>
				<template {...{ shadowrootmode: mode }}>{props.children}</template>
			</Match>

			{/* By the time Solid hydrates, the browser has already removed the template element */}
			<Match when={supportsDSD && !hydrated()}>{null}</Match>

			{/* portal into shadowRoot for client-side rendering */}
			<Match when={hydrated()}>
				<ClientShadowRoot mode={mode}>{props.children}</ClientShadowRoot>
			</Match>
		</Switch>
	);
}

function ClientShadowRoot(props) {
	let template: HTMLTemplateElement;
	const [shadowRoot, setShadowRoot] = createSignal<ShadowRoot | null>(null);

	onMount(() => {
		const parent = template?.parentElement;

		if (!parent) return;
		if (parent?.shadowRoot) {
			setShadowRoot(parent.shadowRoot);
			parent.shadowRoot.replaceChildren();
			return;
		}

		queueMicrotask(() => {
			setShadowRoot(parent.attachShadow({ mode: props.mode }));
		});
	});

	return (
		<Show when={!!shadowRoot()} fallback={<template ref={template} />}>
			<Portal
				mount={shadowRoot()}
				ref={(e) => {
					// Solid insists on adding a wrapper div around the portal children.
					// We can't really remove it, but this avoids breaking layout at least.
					e.style.display = 'contents';
				}}
			>
				<>{props.children}</>
			</Portal>
		</Show>
	);
}
