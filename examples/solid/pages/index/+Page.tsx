import { createSignal } from 'solid-js';
import ShadowRoot from '@declarative-shadow-dom/solid';

export default function Page() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <div>
        <ShadowRoot>
          <button onClick={() => setCount((c) => c - 1)}>-</button>
          <slot></slot>
          <button onClick={() => setCount((c) => c + 1)}>+</button>
        </ShadowRoot>

        {count()}
      </div>
    </>
  );
}
