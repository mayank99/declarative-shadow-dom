import * as React from 'react';
import * as ReactDOM from 'react-dom';

const isBrowser = typeof document !== 'undefined';
const supportsDSD =
	isBrowser && 'shadowRootMode' in HTMLTemplateElement.prototype;

export default function ShadowRoot({
	children,
	mode = 'open',
}: {
	children: React.ReactNode;
	mode?: ShadowRootMode;
}) {
	const [shadowRoot, setShadowRoot] = React.useState(null);
	const isFirstRender = useIsFirstRender();

	const attachShadowRef = React.useCallback((template) => {
		const parent = template?.parentElement;

		if (!template || !parent) return;
		if (parent.shadowRoot) {
			setShadowRoot(parent.shadowRoot);
			parent.shadowRoot.replaceChildren();
			return;
		}

		queueMicrotask(() => {
			ReactDOM.flushSync(() => {
				setShadowRoot(parent.attachShadow({ mode }));
			});
		});
	}, []);

	// By the time React hydrates, the browser has already removed the template element
	if (supportsDSD && isFirstRender) return null;

	// manually portal into shadowRoot for client-side rendering
	if (shadowRoot) {
		return ReactDOM.createPortal(children, shadowRoot);
	}

	// for SSR or first render, use DSD template and grab the shadowRoot from its ref
	return (
		<template {...{ shadowrootmode: mode }} ref={attachShadowRef}>
			{children}
		</template>
	);
}

function useIsFirstRender() {
	const [isFirstRender, setIsFirstRender] = React.useState(true);
	React.useEffect(() => {
		setIsFirstRender(false);
	}, []);
	return isFirstRender;
}
