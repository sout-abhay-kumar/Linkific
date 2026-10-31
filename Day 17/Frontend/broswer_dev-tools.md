Browser DevTools

1. What Are Browser DevTools?
   Browser Developer Tools (DevTools) are built-in tools in web browsers that help developers inspect, debug, and test web applications.

They are available in browsers such as Google Chrome, Microsoft Edge, and Firefox.
How to Open DevTools
In Google Chrome:

- Press F12.
- Press Ctrl + Shift + I.
- Right-click a webpage and select Inspect.

2. Important Browser DevTools Tabs
1. Console Tab
   The Console tab displays:

- JavaScript errors.
- Warning messages.
- Output from console.log().
- Errors from React components.
  Example:
  console.log("Application started");
  console.error("Something went wrong");

Use: To identify JavaScript errors and inspect values during debugging. 2. Network Tab
The Network tab displays requests made by the frontend to servers and APIs.

It is especially useful when React communicates with a FastAPI backend.

Example:
fetch("/api/books")
.then((response) => response.json())
.then((data) => console.log(data));

In the Network tab, you can inspect:
Information Meaning
Request URL API endpoint called by React
Request Method GET, POST, PUT, DELETE, etc.
Status Code Result of the request
Request Payload Data sent to the backend
Response Data returned by the backend

Common HTTP Status Codes
Status Code Meaning
200 Request successful
201 Resource created
400 Bad request
401 Authentication required or invalid
403 Access forbidden
404 Resource not found
500 Internal server error

Use: To debug API requests, responses, and frontend-backend communication. 3. Elements Tab
The Elements tab allows developers to inspect the HTML elements and CSS styles rendered on a webpage.

You can use it to:

- Inspect HTML elements.
- Check CSS properties.
- Identify layout problems.
- Temporarily modify styles.
- Check whether an element is hidden.
  For example, if a button is not visible, inspect it to check whether CSS properties such as display: none are affecting it.

Changes made in the Elements tab are temporary. They do not update your source code. 4. Sources Tab
The Sources tab allows developers to inspect JavaScript source code and debug execution.

You can:

- Set breakpoints.
- Pause execution.
- Step through code.
- Inspect local variables.
- Check the call stack.
  Use: To understand exactly what happens inside a function during execution.

3. Example: Debugging an API Request
   Suppose your React Books page does not display books.
   fetch("/api/books")
   .then((response) => response.json())
   .then((data) => {
   console.log("Books received:", data);
   })
   .catch((error) => {
   console.error("API error:", error);
   });

Debugging Steps

1. Open the browser DevTools.
2. Go to the Network tab.
3. Reload the page.
4. Find the /api/books request.
5. Check the request status code.
6. Open the Response section.
7. Verify whether the API returns the expected data.
8. If the response is 500, check the FastAPI terminal logs.
   This helps identify whether the problem is in the frontend, API request, or backend.
9. Browser DevTools Best Practices

- Use the Console tab to identify JavaScript errors.
- Use the Network tab to inspect API requests.
- Use the Elements tab to debug HTML and CSS.
- Use the Sources tab to debug JavaScript execution.
- Check API status codes and responses.
- Test the application after fixing errors.
