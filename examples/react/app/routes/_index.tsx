import { useState } from "react";
import ShadowRoot from "@declarative-shadow-dom/react";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<ShadowRoot>
					<button onClick={() => setCount((c) => c - 1)}>-</button>
					<slot></slot>
					<button onClick={() => setCount((c) => c + 1)}>+</button>
				</ShadowRoot>

				{count}
			</div>
		</>
	);
}

export default App;
