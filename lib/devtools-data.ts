export interface DevToolsExample {
  title: string
  description: string
  code: string
}

export interface ExecutionStep {
  label: string
  sublabel?: string
  color: string
}

export interface DevToolsCategory {
  id: string
  name: string
  icon: string
  description: string
  executionFlow?: ExecutionStep[]
  examples: DevToolsExample[]
}

export const devToolsCategories: DevToolsCategory[] = [
  {
    id: 'console',
    name: 'Console API',
    icon: 'Terminal',
    description: 'The Console API provides methods for logging information to the browser console, enabling debugging and monitoring of web applications.',
    executionFlow: [
      { label: 'JS Code', sublabel: 'console.log()', color: '#6366f1' },
      { label: 'Console API', sublabel: 'Browser built-in', color: '#8b5cf6' },
      { label: 'DevTools', sublabel: 'Console panel', color: '#06b6d4' },
      { label: 'Developer', sublabel: 'Reads output', color: '#10b981' },
    ],
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
      {
        title: 'console.dir() & Inspection',
        description: 'Inspect object properties in a tree view and count occurrences.',
        code: `// console.dir() shows an interactive property tree
const btn = document.querySelector("button") || document.body;
console.dir(btn);  // Expand in DevTools to see all DOM properties

// console.count() tracks how many times a label has been called
function greet(name) {
  console.count("greet called");
  return "Hello, " + name;
}
greet("Alice");
greet("Bob");
greet("Carol");
// Output: greet called: 1, 2, 3

// console.countReset("greet called");

// console.assert() — only logs if the condition is FALSE
const age = 17;
console.assert(age >= 18, "User is underage:", age);
// Prints assertion error since age < 18`,
      },
      {
        title: 'Styled & Rich Output',
        description: 'Use %c to apply CSS styles to console output.',
        code: `// Apply CSS styles to log messages using %c
console.log(
  "%cYOT Developer%c — DevTools Explorer",
  "color:#6366f1;font-weight:bold;font-size:16px",
  "color:#94a3b8;font-size:14px"
);

// Multiple style segments
console.log(
  "%c✅ Pass%c  %c❌ Fail%c  %c⚠️ Warn",
  "color:#34d399;font-weight:bold", "",
  "color:#f87171;font-weight:bold", "",
  "color:#fbbf24;font-weight:bold"
);

// Log objects inline
const user = { name: "Alice", score: 99 };
console.log("User data: %o", user);`,
      },
    ],
  },
  {
    id: 'network',
    name: 'Network',
    icon: 'Network',
    description: 'Monitor and analyze HTTP requests, responses, and network performance using the Fetch API and Performance Observer.',
    executionFlow: [
      { label: 'fetch(url)', sublabel: 'JS initiates', color: '#6366f1' },
      { label: 'Browser', sublabel: 'DNS + TCP + TLS', color: '#f59e0b' },
      { label: 'Server', sublabel: 'HTTP response', color: '#ec4899' },
      { label: 'Response', sublabel: 'Headers + body', color: '#06b6d4' },
      { label: 'Network Tab', sublabel: 'DevTools records', color: '#10b981' },
    ],
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
      {
        title: 'AbortController & Timeout',
        description: 'Cancel in-flight requests or enforce a timeout using AbortController.',
        code: `// Create a controller whose signal can be passed to fetch
const controller = new AbortController();

// Automatically abort after 5 seconds
const timeoutId = setTimeout(() => {
  controller.abort();
  console.warn("Request aborted due to timeout");
}, 5000);

async function fetchWithTimeout(url) {
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("Fetch was aborted:", err.message);
    } else {
      console.error("Network error:", err.message);
    }
  }
}

fetchWithTimeout("https://jsonplaceholder.typicode.com/todos/1");
// Call controller.abort() at any time to cancel`,
      },
      {
        title: 'Inspect Response Headers',
        description: 'Read and iterate over response headers from a fetch call.',
        code: `async function inspectHeaders(url) {
  const res = await fetch(url);
  console.log("Status:", res.status, res.statusText);
  console.log("Content-Type:", res.headers.get("content-type"));
  console.log("Cache-Control:", res.headers.get("cache-control"));
  
  // Iterate all headers
  console.group("All Response Headers");
  res.headers.forEach((value, key) => {
    console.log(\`  \${key}: \${value}\`);
  });
  console.groupEnd();
}

inspectHeaders("https://jsonplaceholder.typicode.com/posts/1");`,
      },
    ],
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: 'Gauge',
    description: 'Measure and optimize the performance of your web applications using the Performance API and timing utilities.',
    executionFlow: [
      { label: 'performance.mark()', sublabel: 'Create timestamp', color: '#6366f1' },
      { label: 'Code Runs', sublabel: 'Your JS executes', color: '#f59e0b' },
      { label: 'performance.measure()', sublabel: 'Calculate duration', color: '#ec4899' },
      { label: 'getEntries()', sublabel: 'Read results', color: '#06b6d4' },
      { label: 'Perf Tab', sublabel: 'Visualise timeline', color: '#10b981' },
    ],
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
      {
        title: 'Resource Timing',
        description: 'Inspect timing details for every resource loaded by the page.',
        code: `// Get all resource timing entries (scripts, images, CSS, fonts, etc.)
const resources = performance.getEntriesByType("resource");

console.log(\`Total resources loaded: \${resources.length}\`);

// Show the 5 slowest resources
const slowest = [...resources]
  .sort((a, b) => b.duration - a.duration)
  .slice(0, 5);

console.group("5 Slowest Resources");
slowest.forEach((r, i) => {
  const name = r.name.split("/").pop() || r.name;
  console.log(
    \`\${i + 1}. \${name}\`,
    \`— \${r.duration.toFixed(1)}ms\`,
    \`(type: \${r.initiatorType})\`
  );
});
console.groupEnd();

// Navigation timing
const [nav] = performance.getEntriesByType("navigation");
if (nav) {
  console.log("DOM Interactive:", nav.domInteractive.toFixed(0) + "ms");
  console.log("DOM Complete:", nav.domComplete.toFixed(0) + "ms");
  console.log("Load Event End:", nav.loadEventEnd.toFixed(0) + "ms");
}`,
      },
      {
        title: 'PerformanceObserver',
        description: 'Subscribe to performance events as they happen in real time.',
        code: `// PerformanceObserver fires callbacks as entries are recorded
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(
      \`[Observer] \${entry.entryType}: \${entry.name}\`,
      \`\${entry.duration?.toFixed(2) ?? "—"}ms\`
    );
  });
});

// Observe layout shifts (CLS), largest contentful paint (LCP), etc.
try {
  observer.observe({ type: "largest-contentful-paint", buffered: true });
  console.log("Observing LCP entries…");
} catch {
  console.log("LCP not supported — trying measure entries");
  observer.observe({ entryTypes: ["measure"] });
  // Trigger a measure to test
  performance.mark("test-start");
  performance.mark("test-end");
  performance.measure("test-measure", "test-start", "test-end");
}

// Disconnect when done
setTimeout(() => {
  observer.disconnect();
  console.log("Observer disconnected after 2s");
}, 2000);`,
      },
    ],
  },
  {
    id: 'dom',
    name: 'DOM',
    icon: 'Layout',
    description: 'Inspect and manipulate the Document Object Model, observe mutations, and use intersection observers for efficient DOM handling.',
    executionFlow: [
      { label: 'JavaScript', sublabel: 'DOM API calls', color: '#6366f1' },
      { label: 'DOM Tree', sublabel: 'Nodes updated', color: '#f59e0b' },
      { label: 'Style Engine', sublabel: 'CSSOM recalc', color: '#8b5cf6' },
      { label: 'Layout', sublabel: 'Reflow / paint', color: '#ec4899' },
      { label: 'Screen', sublabel: 'Pixels rendered', color: '#10b981' },
    ],
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
      {
        title: 'Create, Style & Remove Elements',
        description: 'Dynamically create elements, apply styles, and clean them up.',
        code: `// Create a styled notification badge
const badge = document.createElement("div");
badge.textContent = "🔔 New notification";
badge.setAttribute("data-demo", "true");
Object.assign(badge.style, {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background: "#6366f1",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  zIndex: "9999",
  boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
});

document.body.appendChild(badge);
console.log("Badge added to DOM:", badge);

// Animate it out after 2 seconds
setTimeout(() => {
  badge.style.transition = "opacity 0.4s";
  badge.style.opacity = "0";
  setTimeout(() => badge.remove(), 400);
  console.log("Badge removed from DOM");
}, 2000);`,
      },
      {
        title: 'Event Delegation',
        description: 'Handle events on many elements efficiently with a single listener on a parent.',
        code: `// Instead of adding listeners to each item, add ONE to the parent
// This is called event delegation — much more efficient for lists

const list = document.createElement("ul");
list.setAttribute("data-event-demo", "true");
list.style.cssText = "position:fixed;top:60px;right:20px;background:#12121a;border:1px solid #1e1e2e;border-radius:8px;padding:8px;list-style:none;z-index:9998";

["Apple", "Banana", "Cherry"].forEach(item => {
  const li = document.createElement("li");
  li.textContent = item;
  li.dataset.fruit = item.toLowerCase();
  li.style.cssText = "padding:6px 12px;cursor:pointer;color:#e2e8f0;border-radius:4px";
  list.appendChild(li);
});

document.body.appendChild(list);

// Single delegated listener on parent
list.addEventListener("click", (event) => {
  const target = event.target;
  if (target.tagName === "LI") {
    console.log("Clicked fruit:", target.dataset.fruit);
    target.style.background = "#6366f1";
    setTimeout(() => target.style.background = "", 500);
  }
});

// Clean up after 5 seconds
setTimeout(() => list.remove(), 5000);
console.log("Click a fruit in the list (top-right). Cleaned up in 5s.");`,
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: 'Database',
    description: 'Work with browser storage APIs including localStorage, sessionStorage, and IndexedDB for persistent client-side data.',
    executionFlow: [
      { label: 'JS Code', sublabel: 'setItem / get', color: '#6366f1' },
      { label: 'Storage API', sublabel: 'Browser sandbox', color: '#f59e0b' },
      { label: 'Persisted Data', sublabel: 'Survives reload', color: '#ec4899' },
      { label: 'Application Tab', sublabel: 'DevTools view', color: '#10b981' },
    ],
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
      {
        title: 'IndexedDB Basics',
        description: 'Use IndexedDB for structured, larger-scale client-side storage.',
        code: `// IndexedDB — async, structured, supports indexes and transactions
const request = indexedDB.open("YOT-DB", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("notes")) {
    const store = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
    store.createIndex("title", "title", { unique: false });
    console.log("Object store 'notes' created");
  }
};

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log("IndexedDB opened:", db.name, "version:", db.version);

  // Write a record
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  store.add({ title: "Hello IndexedDB", body: "Structured storage!", created: Date.now() });

  tx.oncomplete = () => {
    console.log("Record added. Check DevTools > Application > IndexedDB");
    db.close();
  };
};

request.onerror = (event) => {
  console.error("IndexedDB error:", event.target.error);
};`,
      },
    ],
  },
  {
    id: 'debugging',
    name: 'Debugging',
    icon: 'Bug',
    description: 'Master browser debugging techniques including breakpoints, the debugger statement, error handling, and stack traces.',
    executionFlow: [
      { label: 'Bug Found', sublabel: 'Unexpected output', color: '#ef4444' },
      { label: 'Breakpoint', sublabel: 'Pause execution', color: '#f59e0b' },
      { label: 'Scope / Watch', sublabel: 'Inspect variables', color: '#6366f1' },
      { label: 'Step Through', sublabel: 'Line by line', color: '#8b5cf6' },
      { label: 'Bug Fixed', sublabel: 'Root cause clear', color: '#10b981' },
    ],
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
      {
        title: 'debugger Statement',
        description: 'Pause execution at a specific line when DevTools is open.',
        code: `function calculateDiscount(price, percent) {
  // The debugger statement halts execution here when DevTools is open
  // Open DevTools BEFORE running this to hit the breakpoint
  debugger;

  if (percent < 0 || percent > 100) {
    throw new RangeError(\`Invalid discount: \${percent}%\`);
  }
  const discount = price * (percent / 100);
  const final = price - discount;

  console.log(\`Price: \$\${price}\`);
  console.log(\`Discount: \$\${discount.toFixed(2)} (\${percent}%)\`);
  console.log(\`Final price: \$\${final.toFixed(2)}\`);
  return final;
}

// Open DevTools → Sources tab first, then run this
calculateDiscount(49.99, 20);`,
      },
      {
        title: 'Async Error Patterns',
        description: 'Handle errors in async/await and Promise chains reliably.',
        code: `// Pattern 1: try/catch in async function
async function loadUser(id) {
  try {
    const res = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error("loadUser failed:", err.message);
    return null;
  }
}

// Pattern 2: catch on the Promise chain
loadUser(1)
  .then(user => console.log("Got user:", user?.name))
  .catch(err => console.error("Chain error:", err.message));

// Pattern 3: Promise.allSettled — never rejects, see all outcomes
Promise.allSettled([loadUser(1), loadUser(9999)])
  .then(results => {
    results.forEach((r, i) => {
      if (r.status === "fulfilled") console.log(\`User \${i+1}:\`, r.value?.name ?? "null");
      else console.warn(\`User \${i+1} failed:\`, r.reason?.message);
    });
  });`,
      },
      {
        title: 'try / catch / finally',
        description: 'The finally block always runs regardless of whether an error was thrown — ideal for cleanup tasks.',
        code: `function openConnection(id) {
  console.log("Opening connection", id);
  if (id < 0) throw new RangeError("ID must be non-negative");
  return { id, status: "open" };
}

function closeConnection(conn) {
  if (conn) console.log("Closing connection", conn.id);
}

let conn = null;

try {
  conn = openConnection(3);
  console.log("Connection status:", conn.status);
  // simulate work
  console.log("Doing work on connection", conn.id);
} catch (err) {
  console.error("Connection error:", err.message);
} finally {
  closeConnection(conn);
  console.log("finally block always runs");
}

// Run again with invalid ID
console.log("---");
conn = null;
try {
  conn = openConnection(-1);
} catch (err) {
  console.error("Caught:", err.message);
} finally {
  closeConnection(conn);
  console.log("finally ran even after error");
}`,
      },
      {
        title: 'Re-throwing Errors',
        description: 'Catch only what you can handle; re-throw errors your code cannot recover from.',
        code: `function parseConfig(json) {
  try {
    const config = JSON.parse(json);
    if (!config.host) throw new TypeError("Missing required field: host");
    return config;
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error("Invalid JSON — check the config file format");
      return null;
    }
    throw err; // re-throw TypeError — caller must handle this
  }
}

// Case 1: bad JSON — handled internally
const result1 = parseConfig("not-json");
console.log("Result 1:", result1);

// Case 2: valid JSON but missing field — re-thrown
try {
  const result2 = parseConfig('{"port":8080}');
  console.log("Result 2:", result2);
} catch (err) {
  console.error("Caller caught re-thrown error:", err.message);
}

// Case 3: fully valid config
try {
  const result3 = parseConfig('{"host":"localhost","port":3000}');
  console.log("Result 3:", result3);
} catch (err) {
  console.error("Should not happen:", err.message);
}`,
      },
      {
        title: 'Custom Error Classes',
        description: 'Extend the built-in Error class to create meaningful, type-safe custom errors.',
        code: `class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

class NetworkError extends AppError {
  constructor(url, status) {
    super(\`Request to \${url} failed with status \${status}\`, "NETWORK_ERROR");
    this.name = "NetworkError";
    this.url = url;
    this.status = status;
  }
}

class AuthError extends AppError {
  constructor(message) {
    super(message, "AUTH_ERROR");
    this.name = "AuthError";
  }
}

function handleRequest(url, token) {
  if (!token) throw new AuthError("No auth token provided");
  if (url.includes("bad")) throw new NetworkError(url, 404);
  return { data: "success", url };
}

const tests = [
  () => handleRequest("/api/data", "tok123"),
  () => handleRequest("/api/data", null),
  () => handleRequest("/api/bad-endpoint", "tok123"),
];

tests.forEach((fn, i) => {
  try {
    const res = fn();
    console.log(\`Test \${i + 1} passed:\`, res.data);
  } catch (err) {
    if (err instanceof AuthError) {
      console.error(\`Test \${i + 1} auth error [\${err.code}]:\`, err.message);
    } else if (err instanceof NetworkError) {
      console.error(\`Test \${i + 1} network error [\${err.status}]:\`, err.message);
    } else {
      console.error(\`Test \${i + 1} unexpected:\`, err.message);
    }
  }
});`,
      },
      {
        title: 'Nested try/catch',
        description: 'Use nested try/catch blocks to handle errors at different levels of your call stack.',
        code: `function parseNumber(str) {
  const n = Number(str);
  if (Number.isNaN(n)) throw new TypeError(\`Cannot convert "\${str}" to number\`);
  return n;
}

function divide(a, b) {
  if (b === 0) throw new RangeError("Division by zero");
  return a / b;
}

function computeRatio(aStr, bStr) {
  try {
    const a = parseNumber(aStr);
    try {
      const b = parseNumber(bStr);
      return divide(a, b);
    } catch (inner) {
      if (inner instanceof RangeError) {
        console.warn("Division by zero — returning Infinity");
        return Infinity;
      }
      throw inner; // re-throw parse error for outer catch
    }
  } catch (outer) {
    console.error("Cannot compute ratio:", outer.message);
    return null;
  }
}

console.log(computeRatio("10", "2"));   // 5
console.log(computeRatio("10", "0"));   // Infinity
console.log(computeRatio("abc", "2"));  // null
console.log(computeRatio("10", "xyz")); // null`,
      },
      {
        title: 'Error Boundary Pattern',
        description: 'Wrap unreliable operations in a helper that returns a result or error object instead of throwing.',
        code: `// Result wrapper — avoids propagating exceptions through call stacks
function tryCatch(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (err) {
    return { ok: false, error: err };
  }
}

async function tryCatchAsync(fn) {
  try {
    return { ok: true, value: await fn() };
  } catch (err) {
    return { ok: false, error: err };
  }
}

// Usage — synchronous
const r1 = tryCatch(() => JSON.parse('{"valid":true}'));
console.log("r1:", r1.ok ? r1.value : r1.error.message);

const r2 = tryCatch(() => JSON.parse("bad json"));
console.log("r2:", r2.ok ? r2.value : r2.error.message);

// Usage — with validation
function validateAge(age) {
  if (typeof age !== "number") throw new TypeError("Age must be a number");
  if (age < 0 || age > 150) throw new RangeError("Age out of range");
  return age;
}

[25, -5, "old", 200].forEach(input => {
  const result = tryCatch(() => validateAge(input));
  if (result.ok) {
    console.log("Valid age:", result.value);
  } else {
    console.error(\`Invalid (\${result.error.constructor.name}):\`, result.error.message);
  }
});`,
      },
    ],
  },
  {
    id: 'workers',
    name: 'Web Workers',
    icon: 'Cpu',
    description: 'Run scripts in background threads using Web Workers and Service Workers for improved performance and offline capabilities.',
    executionFlow: [
      { label: 'Main Thread', sublabel: 'UI & events', color: '#6366f1' },
      { label: 'new Worker()', sublabel: 'Spawn thread', color: '#f59e0b' },
      { label: 'Worker Thread', sublabel: 'Heavy computation', color: '#ec4899' },
      { label: 'postMessage()', sublabel: 'Pass result back', color: '#06b6d4' },
      { label: 'UI Unblocked', sublabel: 'Smooth experience', color: '#10b981' },
    ],
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
      {
        title: 'Inline Worker via Blob',
        description: 'Create a worker from a string without a separate file.',
        code: `// You can create a worker inline using a Blob URL
const workerScript = \`
self.onmessage = function({ data }) {
  const { n } = data;
  // Compute nth Fibonacci number (CPU-intensive)
  function fib(k) { return k <= 1 ? k : fib(k-1) + fib(k-2); }
  const result = fib(n);
  self.postMessage({ n, result });
};
\`;

const blob = new Blob([workerScript], { type: "application/javascript" });
const url = URL.createObjectURL(blob);
const worker = new Worker(url);

worker.onmessage = ({ data }) => {
  console.log(\`Fibonacci(\${data.n}) = \${data.result}\`);
  worker.terminate();
  URL.revokeObjectURL(url); // clean up
};

worker.onerror = (err) => console.error("Worker error:", err.message);

console.log("Sending fib(35) to worker thread…");
worker.postMessage({ n: 35 });
// Main thread stays responsive while worker computes`,
      },
      {
        title: 'BroadcastChannel',
        description: 'Communicate between tabs, windows, and workers on the same origin.',
        code: `// BroadcastChannel lets multiple contexts on the same origin talk to each other
// Open this page in two tabs and run this in both DevTools consoles

const channel = new BroadcastChannel("yot-demo");

// Listen for messages from other tabs/workers
channel.onmessage = ({ data }) => {
  console.log("Received broadcast:", data);
};

// Send a message to all other contexts on this channel
channel.postMessage({
  type: "ping",
  from: location.href,
  timestamp: new Date().toISOString(),
});

console.log("BroadcastChannel 'yot-demo' open — open another tab and run the same code!");
// Clean up with: channel.close()`,
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'Shield',
    description: 'Implement security best practices including Content Security Policy, XSS prevention, and safe data handling.',
    executionFlow: [
      { label: 'User Input', sublabel: 'Untrusted data', color: '#ef4444' },
      { label: 'Sanitize', sublabel: 'Encode / validate', color: '#f59e0b' },
      { label: 'Safe Output', sublabel: 'textContent / DOMPurify', color: '#6366f1' },
      { label: 'No XSS', sublabel: 'Attack blocked', color: '#10b981' },
    ],
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
      {
        title: 'CORS & Same-Origin Policy',
        description: 'Understand cross-origin resource sharing and how browsers enforce boundaries.',
        code: `// Same-Origin Policy: browsers block cross-origin reads by default
// CORS headers on the SERVER opt-in to allow specific origins

// Check if a request will be blocked by CORS
function isSameOrigin(url) {
  try {
    const target = new URL(url, location.href);
    return target.origin === location.origin;
  } catch { return false; }
}

console.log("Same origin?", isSameOrigin("/api/data"));         // true
console.log("Cross origin?", isSameOrigin("https://google.com")); // false

// Simulate what CORS headers look like (returned by server):
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://yoursite.com",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // preflight cache for 1 day
};
console.log("Server would respond with CORS headers:", corsHeaders);

// Credentials (cookies) require:
// Access-Control-Allow-Credentials: true
// Access-Control-Allow-Origin: <specific origin>  (no wildcard *)`,
      },
      {
        title: 'Subresource Integrity (SRI)',
        description: 'Verify that third-party scripts have not been tampered with.',
        code: `// SRI ensures a loaded resource matches a known cryptographic hash
// If the file is modified by a CDN or attacker, the browser blocks it

// Example HTML (copy into your page):
// <script
//   src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
//   integrity="sha256-qXBd/EfAdjOA2FGrGAG+b3YBn2tn5A6bhz+LSgYD96k="
//   crossorigin="anonymous">
// </script>

// Generate an SRI hash in Node.js (server-side):
// const crypto = require("crypto");
// const hash = crypto.createHash("sha256").update(fileContent).digest("base64");
// console.log("sha256-" + hash);

// Verify the current page's script integrity
const scripts = document.querySelectorAll("script[integrity]");
console.log("Scripts with SRI:", scripts.length);
scripts.forEach(s => {
  console.log("  src:", s.src.split("/").pop());
  console.log("  integrity:", s.integrity);
});`,
      },
    ],
  },
  {
    id: 'js-reference',
    name: 'JS Reference',
    icon: 'Database',
    description: 'All major JavaScript built-in functions, objects, and classes — with clear explanations and live examples you can run directly in the browser.',
    executionFlow: [
      { label: 'Source Code', sublabel: 'Your JS file', color: '#6366f1' },
      { label: 'V8 / SpiderMonkey', sublabel: 'JS engine parses', color: '#f59e0b' },
      { label: 'JIT Compile', sublabel: 'Optimise hot paths', color: '#ec4899' },
      { label: 'Machine Code', sublabel: 'Native execution', color: '#06b6d4' },
      { label: 'Result', sublabel: 'Output / side-effects', color: '#10b981' },
    ],
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
      {
        title: 'try / catch / finally',
        description: 'Use finally for guaranteed cleanup — it runs whether the try block succeeds or throws.',
        code: `// finally always runs — use it for cleanup (close files, release locks, etc.)
function readData(source) {
  if (source === "corrupt") throw new Error("Data is corrupt");
  return \`data from \${source}\`;
}

function processSource(source) {
  let data = null;
  try {
    data = readData(source);
    console.log("Read:", data);
    return data.toUpperCase();
  } catch (err) {
    console.error("Read failed:", err.message);
    return null;
  } finally {
    console.log("finally: cleanup for", source);
  }
}

console.log("Result 1:", processSource("db"));
console.log("---");
console.log("Result 2:", processSource("corrupt"));`,
      },
      {
        title: 'Catching Specific Error Types',
        description: 'Use instanceof to branch on the error type and respond appropriately to each failure mode.',
        code: `function strictDivide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Both arguments must be numbers");
  }
  if (b === 0) {
    throw new RangeError("Divisor cannot be zero");
  }
  return a / b;
}

const testCases = [
  [10, 2],
  [10, 0],
  ["ten", 2],
  [9, 3],
];

testCases.forEach(([a, b]) => {
  try {
    const result = strictDivide(a, b);
    console.log(\`\${a} / \${b} = \${result}\`);
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("TypeError:", err.message);
    } else if (err instanceof RangeError) {
      console.error("RangeError:", err.message);
    } else {
      throw err; // unexpected — propagate up
    }
  }
});`,
      },
      {
        title: 'Async try / catch',
        description: 'Wrap await calls in try/catch to handle rejected Promises cleanly in async functions.',
        code: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchItem(id) {
  await delay(50);
  if (id < 1) throw new RangeError("ID must be >= 1");
  if (id > 5) throw new Error("Item not found");
  return { id, name: \`Item \${id}\`, price: id * 9.99 };
}

async function loadCart(ids) {
  const cart = [];
  for (const id of ids) {
    try {
      const item = await fetchItem(id);
      cart.push(item);
      console.log("Added:", item.name, "-", item.price.toFixed(2));
    } catch (err) {
      console.warn(\`Skipping id=\${id}: \${err.message}\`);
    }
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  console.log("Cart total:", total.toFixed(2));
  return cart;
}

loadCart([1, -1, 3, 99, 5]);`,
      },
      {
        title: 'Promise.allSettled with Errors',
        description: 'Use Promise.allSettled to run multiple async tasks and inspect each outcome without short-circuiting on failure.',
        code: `async function fetchPost(id) {
  if (id === 2) throw new Error("Post 2 unavailable");
  await new Promise(r => setTimeout(r, 10));
  return { id, title: \`Post \${id}\`, body: "Lorem ipsum..." };
}

async function loadFeed(ids) {
  const results = await Promise.allSettled(ids.map(id => fetchPost(id)));

  results.forEach((result, i) => {
    const id = ids[i];
    if (result.status === "fulfilled") {
      console.log(\`Post \${id}: \${result.value.title}\`);
    } else {
      console.error(\`Post \${id} failed: \${result.reason.message}\`);
    }
  });

  const succeeded = results.filter(r => r.status === "fulfilled").length;
  console.log(\`\${succeeded} / \${ids.length} posts loaded\`);
}

loadFeed([1, 2, 3, 4]);`,
      },
      {
        title: 'Generators & Iterators',
        description: 'Generator functions can pause execution and resume, making them ideal for lazy sequences and async control flow.',
        code: `// Generator function — uses function* and yield
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;  // pause here, return value to caller
  }
}

// Consume with for...of
for (const n of range(1, 10, 2)) {
  process.stdout?.write?.(n + " ") ?? console.log(n);
}
// 1 3 5 7 9

// Convert to array with spread
console.log("Range:", [...range(0, 5)]);

// Infinite generator
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

const gen = naturals();
const first5 = Array.from({ length: 5 }, () => gen.next().value);
console.log("First 5 naturals:", first5); // [1, 2, 3, 4, 5]

// Generator as state machine
function* trafficLight() {
  while (true) {
    yield "🟢 Green";
    yield "🟡 Yellow";
    yield "🔴 Red";
  }
}
const light = trafficLight();
console.log(light.next().value); // 🟢 Green
console.log(light.next().value); // 🟡 Yellow
console.log(light.next().value); // 🔴 Red
console.log(light.next().value); // 🟢 Green (wraps)`,
      },
      {
        title: 'Proxy & Reflect',
        description: 'Intercept and customise fundamental operations on objects with Proxy and Reflect.',
        code: `// Proxy wraps an object and intercepts operations (get, set, delete, etc.)
const handler = {
  get(target, prop) {
    console.log(\`GET \${String(prop)}\`);
    return prop in target ? target[prop] : \`Property "\${String(prop)}" not found\`;
  },
  set(target, prop, value) {
    if (typeof value !== "number") throw new TypeError("Only numbers allowed");
    console.log(\`SET \${String(prop)} = \${value}\`);
    target[prop] = value;
    return true; // must return true to indicate success
  },
  deleteProperty(target, prop) {
    console.log(\`DELETE \${String(prop)}\`);
    return Reflect.deleteProperty(target, prop);
  },
};

const scores = new Proxy({}, handler);
scores.alice = 95;   // SET alice = 95
scores.bob = 87;     // SET bob = 87
console.log(scores.alice);    // GET alice → 95
console.log(scores.charlie);  // GET charlie → "Property not found"

// Reflect mirrors the default behaviour — useful inside traps
const obj = { x: 1 };
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver); // default behaviour
  },
});
console.log(proxy.x); // 1`,
      },
    ],
  },
]
