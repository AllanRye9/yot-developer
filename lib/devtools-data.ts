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
  {
    id: 'js-reference',
    name: 'JS Reference',
    icon: 'Database',
    description: 'All major JavaScript built-in functions, objects, and classes — with clear explanations and live examples you can run directly in the browser.',
    examples: [
      {
        title: 'Array Methods',
        description: 'JavaScript arrays come with powerful built-in methods for transforming, searching, and iterating over data without writing manual loops.',
        code: `// map — transform every element, returns new array
const prices = [10, 20, 30];
const withTax = prices.map(p => p * 1.2);
console.log("With tax:", withTax); // [12, 24, 36]

// filter — keep elements that pass a test
const expensive = prices.filter(p => p > 15);
console.log("Expensive:", expensive); // [20, 30]

// reduce — collapse array to a single value
const total = prices.reduce((sum, p) => sum + p, 0);
console.log("Total:", total); // 60

// find — first element that matches
const first = prices.find(p => p > 15);
console.log("First >15:", first); // 20

// some / every — boolean checks
console.log("Any > 25?", prices.some(p => p > 25));  // true
console.log("All > 5?",  prices.every(p => p > 5));   // true

// flat / flatMap — flatten nested arrays
const nested = [[1, 2], [3, 4]];
console.log("Flat:", nested.flat()); // [1, 2, 3, 4]

// Array.from — create array from iterable/length
const range = Array.from({ length: 5 }, (_, i) => i + 1);
console.log("Range:", range); // [1, 2, 3, 4, 5]`,
      },
      {
        title: 'Object Methods',
        description: 'Object static methods let you inspect, transform, merge, and freeze plain JavaScript objects with a clean API.',
        code: `const user = { name: "Alice", age: 30, role: "admin" };

// Object.keys / values / entries — iterate an object
console.log("Keys:",    Object.keys(user));    // ["name","age","role"]
console.log("Values:",  Object.values(user));  // ["Alice",30,"admin"]
console.log("Entries:", Object.entries(user)); // [["name","Alice"],...]

// Object.assign — shallow merge objects
const defaults = { theme: "dark", lang: "en" };
const settings = Object.assign({}, defaults, { lang: "fr" });
console.log("Settings:", settings); // {theme:"dark", lang:"fr"}

// Spread (modern alternative to assign)
const updated = { ...user, age: 31 };
console.log("Updated:", updated);

// Object.freeze — make object immutable
const config = Object.freeze({ maxRetries: 3 });
config.maxRetries = 99; // silently ignored
console.log("Config:", config.maxRetries); // 3

// Object.fromEntries — build object from key/value pairs
const pairs = [["x", 1], ["y", 2]];
console.log("From entries:", Object.fromEntries(pairs)); // {x:1,y:2}

// Destructuring with defaults
const { name, score = 0 } = { name: "Bob" };
console.log(name, score); // Bob 0`,
      },
      {
        title: 'String Methods',
        description: 'String methods cover everything from searching and replacing text to splitting, trimming, and formatting output.',
        code: `const text = "  Hello, World!  ";

// Trim whitespace
console.log(text.trim());         // "Hello, World!"
console.log(text.trimStart());    // "Hello, World!  "

// Case conversion
console.log(text.trim().toLowerCase()); // "hello, world!"
console.log(text.trim().toUpperCase()); // "HELLO, WORLD!"

// Search and test
console.log(text.includes("World")); // true
console.log(text.startsWith("  H")); // true
console.log(text.indexOf("o"));      // 5 (first occurrence)

// Replace
const clean = text.trim().replace("World", "JS");
console.log(clean); // "Hello, JS!"

// Split and join
const csv = "alice,bob,carol";
const names = csv.split(",");
console.log(names);           // ["alice","bob","carol"]
console.log(names.join(" | ")); // "alice | bob | carol"

// Slice and substring
const code = "JS/TS/React";
console.log(code.slice(0, 2));    // "JS"
console.log(code.slice(-5));      // "React"

// Repeat and padStart
console.log("ab".repeat(3));       // "ababab"
console.log("7".padStart(3, "0")); // "007"

// Template literal
const name = "World";
console.log(\`Hello, \${name}! Today is \${new Date().toDateString()}\`);`,
      },
      {
        title: 'Math & Number',
        description: 'The Math object provides mathematical constants and functions. Number methods help parse, format, and validate numeric values.',
        code: `// Math constants
console.log("π:", Math.PI);           // 3.14159...
console.log("e:", Math.E);            // 2.71828...

// Rounding
console.log(Math.round(4.6));  // 5
console.log(Math.floor(4.9));  // 4
console.log(Math.ceil(4.1));   // 5
console.log(Math.trunc(-4.9)); // -4

// Min / Max / Abs
console.log(Math.max(3, 1, 4, 1, 5)); // 5
console.log(Math.min(3, 1, 4, 1, 5)); // 1
console.log(Math.abs(-42));            // 42

// Powers and roots
console.log(Math.pow(2, 10));  // 1024
console.log(Math.sqrt(144));   // 12
console.log(Math.cbrt(27));    // 3

// Random
const rand = Math.random();               // 0 <= x < 1
const randInt = Math.floor(Math.random() * 100); // 0..99
console.log("Random 0-1:", rand.toFixed(4));
console.log("Random int:", randInt);

// Number methods
const n = 3.14159;
console.log(n.toFixed(2));       // "3.14"
console.log(n.toPrecision(4));   // "3.142"
console.log((1234567).toLocaleString()); // "1,234,567"

// Checking special values
console.log(Number.isNaN(NaN));         // true
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isInteger(4.0));     // true
console.log(Number.parseInt("42px"));   // 42`,
      },
      {
        title: 'Promise & async/await',
        description: 'Promises represent future values. async/await is syntactic sugar that makes asynchronous code read like synchronous code while keeping it non-blocking.',
        code: `// Creating a Promise
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// async function — always returns a Promise
async function fetchUser(id) {
  await delay(100); // simulated network wait
  if (id <= 0) throw new Error("Invalid ID");
  return { id, name: \`User \${id}\`, active: true };
}

// await — pauses until the Promise resolves
async function main() {
  try {
    const user = await fetchUser(1);
    console.log("Got user:", JSON.stringify(user));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
main();

// Promise.all — run multiple async ops in parallel
async function loadAll() {
  const [a, b] = await Promise.all([fetchUser(2), fetchUser(3)]);
  console.log("Parallel:", a.name, "&", b.name);
}
loadAll();

// Promise.allSettled — never rejects, shows each outcome
Promise.allSettled([fetchUser(4), fetchUser(-1)])
  .then(results => results.forEach((r, i) =>
    console.log(\`Result \${i}:\`, r.status, r.status === "fulfilled" ? r.value.name : r.reason.message)
  ));`,
      },
      {
        title: 'Map & Set',
        description: 'Map and Set are modern data structures that improve on plain objects and arrays for use-cases requiring unique values or key-value pairs with any key type.',
        code: `// Set — unique values only (like a mathematical set)
const set = new Set([1, 2, 3, 2, 1]);
console.log("Set size:", set.size);           // 3
console.log("Has 2?", set.has(2));           // true
set.add(4);
set.delete(1);
console.log("Set values:", [...set]);         // [2, 3, 4]

// Deduplicate an array
const arr = [1, 1, 2, 3, 2, 4];
const unique = [...new Set(arr)];
console.log("Unique:", unique);               // [1, 2, 3, 4]

// Map — key/value store with any key type (not just strings)
const map = new Map();
map.set("name", "Alice");
map.set(42, "answer");
map.set(true, "flag");

console.log("Map get name:", map.get("name")); // "Alice"
console.log("Map size:", map.size);            // 3

// Iterate a Map
for (const [key, value] of map) {
  console.log(\`  \${String(key)} → \${value}\`);
}

// Convert between Map and Array
const entries = [["a", 1], ["b", 2]];
const m = new Map(entries);
console.log("From array:", [...m.entries()]);`,
      },
      {
        title: 'Classes',
        description: 'JavaScript classes provide a cleaner syntax for creating objects and implementing inheritance. Under the hood they use prototypes.',
        code: `// Base class
class Animal {
  #name; // private field (ES2022)

  constructor(name, sound) {
    this.#name = name;
    this.sound = sound;
  }

  // Getter
  get name() { return this.#name; }

  // Method
  speak() {
    return \`\${this.#name} says \${this.sound}!\`;
  }

  // Static method — called on the class, not an instance
  static create(name, sound) {
    return new Animal(name, sound);
  }
}

// Subclass — inherits from Animal
class Dog extends Animal {
  constructor(name) {
    super(name, "woof"); // call parent constructor
  }

  fetch(item) {
    return \`\${this.name} fetches the \${item}!\`;
  }
}

const dog = new Dog("Rex");
console.log(dog.speak());        // Rex says woof!
console.log(dog.fetch("ball")); // Rex fetches the ball!
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true

const cat = Animal.create("Whiskers", "meow");
console.log(cat.speak());`,
      },
      {
        title: 'Error Handling & Types',
        description: 'JavaScript has several built-in error types. Creating custom errors and handling them precisely helps build robust, debuggable applications.',
        code: `// Built-in error types
try { null.property }
catch (e) { console.log("TypeError:", e.constructor.name); }

try { undeclaredVar }
catch (e) { console.log("ReferenceError:", e.constructor.name); }

try { JSON.parse("{bad}") }
catch (e) { console.log("SyntaxError:", e.constructor.name); }

// Custom error class
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource) {
    super(\`\${resource} not found\`);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

// Discriminated error handling
function processUser(user) {
  if (!user) throw new NotFoundError("User");
  if (!user.email) throw new ValidationError("email", "Email is required");
  return \`Processing \${user.email}\`;
}

for (const input of [null, { name: "Bob" }, { email: "alice@x.com" }]) {
  try {
    console.log(processUser(input));
  } catch (e) {
    if (e instanceof NotFoundError) console.log("404:", e.message);
    else if (e instanceof ValidationError) console.log("Validation on", e.field + ":", e.message);
    else throw e;
  }
}`,
      },
    ],
  },
]
