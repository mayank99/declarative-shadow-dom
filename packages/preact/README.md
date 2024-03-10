# @declarative-shadow-dom/preact

Peact component that makes it possible to use shadow DOM declaratively, with support for both server-side rendering and client-side rendering.

```
npm add @declarative-shadow-dom/preact
```

```jsx

import ShadowRoot from "@declarative-shadow-dom/preact"

<div>
	<ShadowRoot>
		<div>Shadow DOM content</div>
		<slot />
	</ShadowRoot>

	<p>Light DOM content</div>
</div>
```
