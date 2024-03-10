import { type VNode, h } from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';

const isBrowser = typeof document !== 'undefined';
const supportsDSD =
	isBrowser && 'shadowRootMode' in HTMLTemplateElement.prototype;

export default function ShadowRoot({
	children,
	mode = 'open',
}: {
	children: VNode | VNode[];
	mode?: ShadowRootMode;
}) {
	const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
	const isFirstRender = useIsFirstRender();

	const attachShadowRef = useCallback((template: HTMLElement) => {
		const parent = template?.parentElement;

		if (!template || !parent) return;
		if (parent.shadowRoot) {
			setShadowRoot(parent.shadowRoot);
			parent.shadowRoot.replaceChildren();
			return;
		}

		queueMicrotask(() => {
			setShadowRoot(parent.attachShadow({ mode }));
		});
	}, []);

	// By the time React hydrates, the browser has already removed the template element
	if (supportsDSD && isFirstRender) return null;

	// manually portal into shadowRoot for client-side rendering
	if (shadowRoot) {
		return createPortal(<>{children}</>, shadowRoot);
	}

	// for SSR or first render, use DSD template and grab the shadowRoot from its ref
	return (
		<template shadowrootmode={mode} ref={attachShadowRef}>
			{children}
		</template>
	);
}

function useIsFirstRender() {
	const [isFirstRender, setIsFirstRender] = useState(true);
	useEffect(() => {
		setIsFirstRender(false);
	}, []);
	return isFirstRender;
}

// 🙄
declare module 'preact/jsx-runtime' {
	namespace JSX {
		interface IntrinsicElements {
			'template': h.JSX.HTMLAttributes<HTMLTemplateElement> & { shadowrootmode?: ShadowRootMode };
		}
	}
}
