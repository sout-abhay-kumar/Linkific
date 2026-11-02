What Is Component Optimization?
Component optimization in React means improving components so that they render efficiently, avoid unnecessary work, and remain easy to maintain.

React applications are built using components. When a component's state, props, or context changes, React may render that component again.

Sometimes, a component renders even though its displayed output does not need to change. Component optimization helps reduce such unnecessary rendering and computation.
Why Is Component Optimization Important?

- Improves application performance.
- Reduces unnecessary component renders.
- Makes large React applications more responsive.
- Avoids repeating expensive calculations.
- Helps maintain clean and reusable components.
  Optimization should be applied when it provides a meaningful benefit. Making every component complicated with optimization techniques can reduce readability.

  1.1 Understanding Unnecessary Re-renders
  Consider this example:
  import { useState } from "react";

function Child() {
console.log("Child component rendered");

return <h2>Hello from Child</h2>;
}

function Parent() {
const [count, setCount] = useState(0);

return (
<div>
<h1>Count: {count}</h1>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>

      <Child />
    </div>

);
}

export default Parent;

What Happens?
When the button is clicked:

1. The count state changes.
2. The Parent component renders again.
3. The Child component also renders again.
4. The child displays the same text as before.
   If the child is expensive to render, unnecessary rendering may affect performance.
   1.2 Using React.memo()
   React.memo() allows React to skip rendering a component when its props have not changed.
   Optimized Example
   import { memo, useState } from "react";

const Child = memo(function Child() {
console.log("Child component rendered");

return <h2>Hello from Child</h2>;
});

function Parent() {
const [count, setCount] = useState(0);

return (
<div>
<h1>Count: {count}</h1>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>

      <Child />
    </div>

);
}

export default Parent;

Now, when count changes, React can skip rendering Child because its props have not changed.

Important: React.memo() performs a shallow comparison of props. If the child receives a new object or function reference each time, it may still render.
1.3 Using useMemo()
useMemo() caches the result of a calculation between renders.

It is useful when a calculation is expensive and its inputs have not changed.
Example
import { useMemo, useState } from "react";

function ProductList() {
const [count, setCount] = useState(0);
const [products] = useState([
{ id: 1, name: "Book", price: 200 },
{ id: 2, name: "Pen", price: 50 },
{ id: 3, name: "Notebook", price: 100 },
]);

const totalPrice = useMemo(() => {
console.log("Calculating total price");

    return products.reduce(
      (total, product) => total + product.price,
      0
    );

}, [products]);

return (
<div>
<h2>Total Price: ₹{totalPrice}</h2>

      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>

);
}

export default ProductList;

Explanation
const totalPrice = useMemo(() => {
return products.reduce(
(total, product) => total + product.price,
0
);
}, [products]);

- useMemo() stores the calculated result.
- The calculation runs when products changes.
- If only count changes, React can reuse the previous result.
  Use case: Filtering or calculating totals for a large list of products or books.
  1.4 Using useCallback()
  useCallback() caches a function reference between renders.

It is useful when passing functions to memoized child components.
Example
import { memo, useCallback, useState } from "react";

const Child = memo(function Child({ onClick }) {
console.log("Child rendered");

return <button onClick={onClick}>Click Child</button>;
});

function Parent() {
const [count, setCount] = useState(0);

const handleClick = useCallback(() => {
console.log("Child button clicked");
}, []);

return (
<div>
<h2>Count: {count}</h2>

      <button onClick={() => setCount(count + 1)}>
        Increase Count
      </button>

      <Child onClick={handleClick} />
    </div>

);
}

export default Parent;

Without useCallback(), a new handleClick function would be created during each render. Since Child is wrapped with memo(), a new function reference could cause it to render again.

With useCallback(), the function reference remains stable until its dependencies change.
1.5 Using Stable Keys in Lists
React uses keys to identify list items.
Incorrect Example
function Books() {
const books = ["Atomic Habits", "Clean Code", "Deep Work"];

return (
<ul>
{books.map((book, index) => (
<li key={index}>{book}</li>
))}
</ul>
);
}

Using an array index as a key can cause issues when items are reordered, inserted, or deleted.
Better Example
function Books() {
const books = [
{ id: 101, title: "Atomic Habits" },
{ id: 102, title: "Clean Code" },
{ id: 103, title: "Deep Work" },
];

return (
<ul>
{books.map((book) => (
<li key={book.id}>{book.title}</li>
))}
</ul>
);
}

Use a stable, unique identifier such as a database ID.
1.6 Component Optimization Best Practices

- Keep components small and focused.
- Avoid unnecessary state.
- Use React.memo() when preventing re-renders is beneficial.
- Use useMemo() for expensive calculations.
- Use useCallback() when stable function references are useful.
- Use stable keys when rendering lists.
- Avoid storing values in state when they can be calculated from existing data.
- Use React DevTools Profiler to identify performance problems.
- Avoid optimizing components without measuring performance first.
  Conclusion
  Component optimization improves React performance by reducing unnecessary rendering and computation. Techniques such as React.memo(), useMemo(), and useCallback() can be useful, but they should be applied when needed rather than everywhere.
