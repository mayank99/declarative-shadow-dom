# @declarative-shadow-dom/solid

Solid component that makes it possible to use shadow DOM declaratively, with support for both server-side rendering and client-side rendering.

```
npm add @declarative-shadow-dom/solid
```

```jsx

import ShadowRoot from "@declarative-shadow-dom/solid"

<div>
	<ShadowRoot>
		<div>Shadow DOM content</div>
		<slot />
	</ShadowRoot>

	<p>Light DOM content</div>
</div>
```
