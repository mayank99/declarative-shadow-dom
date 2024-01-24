import * as React from "react";
import * as ReactDOM from "react-dom";

const isBrowser = typeof document !== "undefined";
const supportsDSD = isBrowser &&
	"shadowRootMode" in HTMLTemplateElement.prototype;

export default function ShadowDom({ children, ...props }) {
	const [shadowRoot, setShadowRoot] = React.useState(null);
	const [isFirstRender, setIsFirstRender] = React.useState(true);

	React.useEffect(() => void setIsFirstRender(false), []);

	const attachShadowRef = React.useCallback((template) => {
		const parent = template?.parentElement;

		if (!template || !parent) return;
		if (parent.shadowRoot) {
			setShadowRoot(parent.shadowRoot);
			return;
		}

		setShadowRoot(parent.attachShadow({ mode: "open" }));
		template.remove();
	}, []);

	if (!isBrowser) {
		return <template shadowrootmode="open" {...props}>{children}</template>;
	}

	// By the time React hydrates, the browser has already removed the template element
	if (supportsDSD && isFirstRender) return null;

	return (
		<template shadowrootmode="open" ref={attachShadowRef} {...props}>
			{shadowRoot ? ReactDOM.createPortal(children, shadowRoot) : children}
		</template>
	);
}
