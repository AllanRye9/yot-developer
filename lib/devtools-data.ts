export interface DevToolsExample {
  title: string
  description: string
  code: string
}

export interface DevToolsCategory {
  id: string
  name: string
  icon: string
  description: string
  examples: DevToolsExample[]
}

export const devToolsCategories: DevToolsCategory[] = [
  {
    id: 'console',
    name: 'Console API',
    icon: 'Terminal',
    description: 'The Console API provides methods for logging information to the browser console, enabling debugging and monitoring of web applications.',
    examples: [
      {
        title: 'Basic Logging',
        description: 'Basic console methods for different types of output.',
        code: `console.log("Standard log message");
console.info("Info message");
console.warn("Warning message");
console.error("Error message");
console.debug("Debug message (visible in verbose mode)");`,
      },
      {
        title: 'console.table()',
        description: 'Display data in a tabular format for easier reading.',
        code: `const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "editor" },
  { id: 3, name: "Carol", role: "viewer" },
];
console.table(users);`,
      },
      {
        title: 'Grouping & Timing',
        description: 'Group related messages and measure execution time.',
        code: `console.group("User Login Flow");
console.log("Step 1: Validating credentials");
console.log("Step 2: Checking permissions");
console.groupEnd();

console.time("Array processing");
const arr = Array.from({ length: 10000 }, (_, i) => i);
const sum = arr.reduce((a, b) => a + b, 0);
console.timeEnd("Array processing");
console.log("Sum:", sum);`,
      },
    ],
  },
  {
    id: 'network',
    name: 'Network',
    icon: 'Network',
    description: 'Monitor and analyze HTTP requests, responses, and network performance using the Fetch API and Performance Observer.',
    examples: [
      {
        title: 'Fetch API',
        description: 'Make HTTP requests with the modern Fetch API.',
        code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    console.log("Data received:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

// Example usage
fetchData("https://jsonplaceholder.typicode.com/posts/1");`,
      },
      {
        title: 'Request Headers',
        description: 'Send requests with custom headers and bodies.',
        code: `async function postData(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer your-token-here",
    },
    body: JSON.stringify(payload),
  });
  return response.json();
}

console.log("POST request function ready");
console.log("Usage: postData(url, { key: 'value' })");`,
      },
    ],
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: 'Gauge',
    description: 'Measure and optimize the performance of your web applications using the Performance API and timing utilities.',
    examples: [
      {
        title: 'Performance Marks',
        description: 'Create named timestamps to measure code execution duration.',
        code: `performance.mark("start");

// Simulate some work
let result = 0;
for (let i = 0; i < 100000; i++) {
  result += Math.sqrt(i);
}

performance.mark("end");
performance.measure("loop-duration", "start", "end");

const [measure] = performance.getEntriesByName("loop-duration");
console.log(\`Loop took: \${measure.duration.toFixed(2)}ms\`);
console.log("Result:", result.toFixed(2));`,
      },
      {
        title: 'Memory Usage',
        description: 'Monitor JavaScript heap memory usage.',
        code: `if (performance.memory) {
  const mem = performance.memory;
  console.log("JS Heap Size Limit:", (mem.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + " MB");
  console.log("Total JS Heap Size:", (mem.totalJSHeapSize / 1024 / 1024).toFixed(2) + " MB");
  console.log("Used JS Heap Size:", (mem.usedJSHeapSize / 1024 / 1024).toFixed(2) + " MB");
} else {
  console.log("Memory API not available in this environment");
  console.log("Available in Chrome DevTools");
}`,
      },
    ],
  },
  {
    id: 'dom',
    name: 'DOM',
    icon: 'Layout',
    description: 'Inspect and manipulate the Document Object Model, observe mutations, and use intersection observers for efficient DOM handling.',
    examples: [
      {
        title: 'QuerySelector',
        description: 'Select DOM elements using CSS selectors.',
        code: `// Select single element
const header = document.querySelector("h1");
console.log("First h1:", header?.textContent || "Not found");

// Select multiple elements
const links = document.querySelectorAll("a");
console.log("Total links on page:", links.length);

// Select by data attribute
const cards = document.querySelectorAll("[data-card]");
console.log("Cards with data-card:", cards.length);`,
      },
      {
        title: 'MutationObserver',
        description: 'Watch for changes in the DOM tree.',
        code: `const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log("Mutation type:", mutation.type);
    if (mutation.addedNodes.length) {
      console.log("Nodes added:", mutation.addedNodes.length);
    }
    if (mutation.removedNodes.length) {
      console.log("Nodes removed:", mutation.removedNodes.length);
    }
  });
});

// Start observing the document body
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});

console.log("MutationObserver is now watching the DOM");
// Remember to call observer.disconnect() when done`,
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: 'Database',
    description: 'Work with browser storage APIs including localStorage, sessionStorage, and IndexedDB for persistent client-side data.',
    examples: [
      {
        title: 'localStorage',
        description: 'Store and retrieve data that persists across browser sessions.',
        code: `// Store data
localStorage.setItem("user", JSON.stringify({ name: "Alice", theme: "dark" }));
localStorage.setItem("visits", "42");

// Retrieve data
const user = JSON.parse(localStorage.getItem("user") || "{}");
const visits = parseInt(localStorage.getItem("visits") || "0");

console.log("User:", user);
console.log("Visits:", visits);

// List all keys
console.log("All localStorage keys:", Object.keys(localStorage));`,
      },
      {
        title: 'sessionStorage',
        description: 'Store temporary data that lasts only for the session.',
        code: `// sessionStorage is cleared when the tab/window is closed
sessionStorage.setItem("sessionId", "abc123-xyz789");
sessionStorage.setItem("cartItems", JSON.stringify(["item1", "item2"]));

const sessionId = sessionStorage.getItem("sessionId");
const cartItems = JSON.parse(sessionStorage.getItem("cartItems") || "[]");

console.log("Session ID:", sessionId);
console.log("Cart items:", cartItems);
console.log("Session storage length:", sessionStorage.length);`,
      },
    ],
  },
  {
    id: 'debugging',
    name: 'Debugging',
    icon: 'Bug',
    description: 'Master browser debugging techniques including breakpoints, the debugger statement, error handling, and stack traces.',
    examples: [
      {
        title: 'Error Handling',
        description: 'Properly catch and handle errors in JavaScript.',
        code: `function riskyOperation(value) {
  if (value === null || value === undefined) {
    throw new TypeError("Value cannot be null or undefined");
  }
  if (typeof value !== "number") {
    throw new TypeError(\`Expected number, got \${typeof value}\`);
  }
  return Math.sqrt(value);
}

try {
  console.log(riskyOperation(16));    // 4
  console.log(riskyOperation("abc")); // throws
} catch (error) {
  if (error instanceof TypeError) {
    console.error("Type error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
} finally {
  console.log("Operation attempted (finally block)");
}`,
      },
      {
        title: 'Stack Traces',
        description: 'Read and understand JavaScript call stack traces.',
        code: `function outer() {
  middle();
}

function middle() {
  inner();
}

function inner() {
  // console.trace() prints the current call stack
  console.trace("Call stack at this point");
  return "done";
}

outer();`,
      },
    ],
  },
  {
    id: 'workers',
    name: 'Web Workers',
    icon: 'Cpu',
    description: 'Run scripts in background threads using Web Workers and Service Workers for improved performance and offline capabilities.',
    examples: [
      {
        title: 'Worker Basics',
        description: 'Create a Web Worker to run code in a separate thread.',
        code: `// Main thread creates the worker
// const worker = new Worker("worker.js");
// worker.postMessage({ type: "compute", data: 1000000 });
// worker.onmessage = (e) => console.log("Result:", e.data);

// Example worker.js content:
const workerCode = \`
  self.onmessage = function(e) {
    const { type, data } = e.data;
    if (type === "compute") {
      let result = 0;
      for (let i = 0; i < data; i++) {
        result += Math.sqrt(i);
      }
      self.postMessage(result);
    }
  };
\`;

console.log("Web Worker example (workers require separate files in production)");
console.log("Workers prevent heavy computation from blocking the UI thread");`,
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'Shield',
    description: 'Implement security best practices including Content Security Policy, XSS prevention, and safe data handling.',
    examples: [
      {
        title: 'XSS Prevention',
        description: 'Sanitize user input to prevent Cross-Site Scripting attacks.',
        code: `// Never insert raw user input into the DOM
function sanitizeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// BAD: vulnerable to XSS
// element.innerHTML = userInput;

// GOOD: sanitized
const userInput = '<script>alert("xss")<\/script>';
const safe = sanitizeHTML(userInput);
console.log("Sanitized:", safe);
// Output: &lt;script&gt;alert("xss")&lt;/script&gt;

// Even better: use textContent for plain text
// element.textContent = userInput;`,
      },
      {
        title: 'Content Security Policy',
        description: 'Set CSP headers to restrict content sources.',
        code: `// CSP is set via HTTP headers or meta tags
// Example header:
// Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline';

const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "https://trusted.cdn.com"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:"],
  "connect-src": ["'self'", "https://api.yourdomain.com"],
};

console.log("CSP Policy:");
for (const [directive, sources] of Object.entries(cspDirectives)) {
  console.log(\`  \${directive}: \${sources.join(" ")}\`);
}`,
      },
    ],
  },
]
