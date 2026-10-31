React Debugging Techniques

1. What Is Debugging?
   Debugging is the process of identifying, understanding, and fixing errors (bugs) in a program.

In React, debugging helps us find problems such as:

- Components not rendering correctly.
- Buttons not responding to clicks.
- Incorrect data being displayed.
- State not updating properly.
- API requests failing.
- Errors in JavaScript logic.

2. Common React Debugging Techniques
   Technique 1: Read Error Messages
   React and JavaScript display error messages in the browser console.

Example:
ReferenceError: username is not defined

This means the code is trying to use a variable named username that has not been declared.

How to debug:

1. Read the error message.
2. Identify the file and line number.
3. Open the file.
4. Check the variable or function mentioned.
5. Fix the error and test again.
   Technique 2: Use console.log()
   console.log() is used to display values in the browser console. It helps developers understand what is happening inside their code.

Example:
import { useState } from "react";

function Counter() {
const [count, setCount] = useState(0);

function handleClick() {
console.log("Current count:", count);
setCount(count + 1);
}

return (

<div>
<p>Count: {count}</p>
<button onClick={handleClick}>Increase</button>
</div>
);
}

export default Counter;

When the button is clicked, the current value of count is displayed in the console.

Uses of console.log():

- Check variable values.
- Check function execution.
- Inspect API responses.
- Understand component behavior.
  Technique 3: Debug Props and State
  React components receive data through props and manage changing values through state.

Errors can occur when:

- The wrong prop is passed.
- State is initialized incorrectly.
- State is updated incorrectly.
- A component receives unexpected data.
  Example:
  function BookCard({ title }) {
  console.log("Book title:", title);

  return <h2>{title}</h2>;
  }

function App() {
return <BookCard title="Atomic Habits" />;
}

export default App;

The console helps verify whether the BookCard component receives the expected title.
Technique 4: Use React Developer Tools
React Developer Tools is a browser extension used to inspect and debug React applications.

It provides two important tabs:
Tab Purpose
Components Inspect components, props, state, and component hierarchy
Profiler Analyze component rendering performance

It helps developers understand how data flows through React components.
Technique 5: Use Breakpoints
A breakpoint pauses JavaScript execution at a specific line of code.

Example:
function calculateTotal(price, quantity) {
const total = price \* quantity;

return total;
}

You can place a breakpoint on:
const total = price \* quantity;

When execution pauses, you can inspect the values of price, quantity, and total.

Breakpoints are useful for debugging complex logic and understanding how a function executes. 3. React Debugging Best Practices

- Read error messages carefully.
- Reproduce the bug before fixing it.
- Use console.log() to inspect values.
- Use breakpoints for complex problems.
- Inspect props and state using React Developer Tools.
- Test the application after fixing an issue.
- Avoid changing multiple things at once.
- Remove unnecessary debugging logs before production.

4. Summary
   React debugging techniques help developers identify and fix errors in React applications.
   Technique Purpose
   Read error messages Understand what went wrong
   console.log() Inspect variable values
   Debug props and state Verify component data
   React Developer Tools Inspect React components
   Breakpoints Pause and examine code execution
