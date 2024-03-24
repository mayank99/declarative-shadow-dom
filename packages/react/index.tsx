import * as React from 'react';
import * as ReactDOM from 'react-dom';

const isServer = typeof document === 'undefined';
const supportsDSD = 'shadowRootMode' in HTMLTemplateElement.prototype;

export default function ShadowRoot({
	children,
	mode = 'open',
}: {
	children: React.ReactNode;
	mode?: ShadowRootMode;
}) {
	const isClient = useIsClient();

	if (isClient) {
		return <ClientShadowRoot mode={mode}>{children}</ClientShadowRoot>;
	}

	// By the time React hydrates, the browser has already removed the template element
	if (!isServer && supportsDSD) return null;

	// for SSR, use DSD template
	return <template {...{ shadowrootmode: mode }}>{children}</template>;
}

function ClientShadowRoot({
	children,
	mode = 'open',
}: {
	children: React.ReactNode;
	mode?: ShadowRootMode;
}) {
	const templateRef = React.useRef<HTMLTemplateElement>(null);
	const [shadowRoot, setShadowRoot] = React.useState<ShadowRoot | null>(null);

	React.useLayoutEffect(() => {
		const parent = templateRef.current?.parentElement;
		if (!parent) return;

		if (parent.shadowRoot) {
			parent.shadowRoot.replaceChildren();
		}

		queueMicrotask(() => {
			ReactDOM.flushSync(() => {
				setShadowRoot(parent.shadowRoot || parent.attachShadow({ mode }));
			});
		});

		return () => setShadowRoot(null);
	}, []);

	return shadowRoot ? (
		ReactDOM.createPortal(children, shadowRoot)
	) : (
		<template ref={templateRef} />
	);
}

const noopSubscribe = () => () => {};

function useIsClient() {
	return React.useSyncExternalStore(
		noopSubscribe,
		() => true,
		() => false
	);
}
