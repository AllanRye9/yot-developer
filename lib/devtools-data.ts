export interface DevToolExample {
  title: string
  description: string
  code: string
  expectedOutput: string
}

export interface DevToolCategory {
  id: string
  name: string
  icon: string
  description: string
  examples: DevToolExample[]
}

export const devToolsCategories: DevToolCategory[] = [
  {
    id: 'console',
    name: 'Console API',
    icon: 'Terminal',
    description: 'The Console API provides methods to log information to the browser console, enabling debugging and monitoring of web applications.',
    examples: [
      {
        title: 'console.log & console.error',
        description: 'Basic logging methods for outputting information',
        code: `console.log("Hello, World!");
console.log("Multiple", "arguments", 42, true);
console.error("Something went wrong!");
console.warn("This is a warning");`,
        expectedOutput: 'Hello, World!\nMultiple arguments 42 true\nERROR: Something went wrong!\nWARN: This is a warning'
      },
      {
        title: 'console.table',
        description: 'Display data as a formatted table',
        code: `const users = [
  { name: "Alice", age: 30, role: "Developer" },
  { name: "Bob", age: 25, role: "Designer" },
  { name: "Charlie", age: 35, role: "Manager" }
];
console.table(users);`,
        expectedOutput: 'TABLE: displays users as formatted table'
      },
      {
        title: 'console.time & timeEnd',
        description: 'Measure execution time of code',
        code: `console.time("myTimer");
let sum = 0;
for (let i = 0; i < 1000000; i++) {
  sum += i;
}
console.timeEnd("myTimer");
console.log("Sum:", sum);`,
        expectedOutput: 'myTimer: ~Xms\nSum: 499999500000'
      },
      {
        title: 'console.dir',
        description: 'Display object properties in an interactive tree',
        code: `const element = { tagName: 'DIV', id: 'app', className: 'container', children: [] };
console.dir(element);
// In browser: console.dir(document.body) shows interactive DOM tree
console.log("console.dir shows all enumerable properties");
console.dir({ nested: { deep: { value: 42 } } });`,
        expectedOutput: 'Interactive property tree in DevTools Console'
      },
      {
        title: 'console.trace',
        description: 'Output a stack trace from the current call site',
        code: `function grandchild() {
  console.trace("Trace from grandchild");
}
function child() { grandchild(); }
function parent() { child(); }
parent();
console.log("Stack trace shows full call chain above");`,
        expectedOutput: 'Stack trace with call chain in Console'
      },
      {
        title: 'console.profile',
        description: 'Start/stop CPU profiling sessions',
        code: `console.profile("myProfile");
let result = 0;
for (let i = 0; i < 1000000; i++) {
  result += Math.sqrt(i);
}
console.profileEnd("myProfile");
console.log("Result:", result.toFixed(2));
console.log("→ Check DevTools > Performance > Profiles");`,
        expectedOutput: 'CPU profile recorded (view in Performance tab)'
      },
    ]
  },
  {
    id: 'network',
    name: 'Network',
    icon: 'Network',
    description: 'Understand and monitor network requests, responses, timing, and performance using browser Network APIs.',
    examples: [
      {
        title: 'Fetch API',
        description: 'Make HTTP requests using the modern Fetch API',
        code: `const mockResponse = {
  status: 200,
  data: { userId: 1, title: "Sample Todo", completed: false }
};
console.log("Fetching data...");
console.log("Response status:", mockResponse.status);
console.log("Data:", JSON.stringify(mockResponse.data, null, 2));`,
        expectedOutput: 'Fetching data...\nResponse status: 200\nData: {...}'
      },
      {
        title: 'Performance Timing',
        description: 'Measure network performance metrics',
        code: `const timing = {
  dns: 45,
  tcp: 120,
  ttfb: 230,
  download: 89,
  total: 484
};
console.log("=== Network Timing ===");
console.log("DNS Lookup:", timing.dns + "ms");
console.log("TCP Connection:", timing.tcp + "ms");
console.log("Time to First Byte:", timing.ttfb + "ms");
console.log("Download:", timing.download + "ms");
console.log("Total:", timing.total + "ms");`,
        expectedOutput: 'Network timing metrics'
      },
      {
        title: 'WebSocket',
        description: 'Real-time bidirectional communication with WebSocket API',
        code: `// WebSocket connection example
const ws = new WebSocket('wss://echo.websocket.org');
ws.addEventListener('open', () => {
  console.log('WebSocket connected!');
  ws.send(JSON.stringify({ type: 'ping', data: 'Hello Server' }));
});
ws.addEventListener('message', (event) => {
  // Note: wrap in try-catch if server may send non-JSON data
  try {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
  } catch {
    console.log('Received (raw):', event.data);
  }
});
ws.addEventListener('close', (event) => {
  console.log('Connection closed:', event.code, event.reason);
});
// Check DevTools > Network > WS tab for frames`,
        expectedOutput: 'WebSocket frames visible in Network tab'
      },
      {
        title: 'XMLHttpRequest',
        description: 'Legacy but widely supported HTTP request API',
        code: `const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1');
xhr.setRequestHeader('Accept', 'application/json');
xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    console.log('Status:', xhr.status);
    console.log('Response:', xhr.responseText);
    console.log('Headers:', xhr.getResponseHeader('content-type'));
  }
};
xhr.onprogress = (e) => console.log('Progress:', e.loaded, '/', e.total);
xhr.send();`,
        expectedOutput: 'XHR request visible in Network tab'
      }
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: 'Gauge',
    description: 'Profile and optimize your application using the Performance API, navigation timing, and memory monitoring.',
    examples: [
      {
        title: 'Performance Marks',
        description: 'Create custom performance marks and measures',
        code: `const start = Date.now();
const fibonacci = (n) => n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);
const result = fibonacci(30);
const end = Date.now();
console.log("Fibonacci(30):", result);
console.log("Execution time:", (end - start) + "ms");
console.log("Performance mark created: 'fib-calculation'");`,
        expectedOutput: 'Fibonacci(30): 832040\nExecution time: Xms'
      },
      {
        title: 'Memory Usage',
        description: 'Monitor JavaScript heap memory',
        code: `const memInfo = {
  usedJSHeapSize: 45.2,
  totalJSHeapSize: 128.0,
  jsHeapSizeLimit: 2048.0
};
console.log("=== Memory Usage ===");
console.log("Used Heap:", memInfo.usedJSHeapSize + " MB");
console.log("Total Heap:", memInfo.totalJSHeapSize + " MB");
console.log("Heap Limit:", memInfo.jsHeapSizeLimit + " MB");
console.log("Usage:", ((memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100).toFixed(1) + "%");`,
        expectedOutput: 'Memory usage metrics'
      },
      {
        title: 'PerformanceObserver',
        description: 'Observe real-time performance entries as they happen',
        code: `const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(\`[\${entry.entryType}] \${entry.name}\`);
    console.log(\`  Duration: \${entry.duration.toFixed(2)}ms\`);
    console.log(\`  Start: \${entry.startTime.toFixed(2)}ms\`);
  }
});
observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
// Trigger a measure
performance.mark('obs-start');
performance.mark('obs-end');
performance.measure('my-task', 'obs-start', 'obs-end');
observer.disconnect();`,
        expectedOutput: 'PerformanceObserver entries logged'
      },
      {
        title: 'Navigation Timing',
        description: 'Analyze page load performance metrics',
        code: `const nav = performance.getEntriesByType('navigation')[0];
if (nav) {
  console.log('=== Navigation Timing ===');
  console.log('DNS:', (nav.domainLookupEnd - nav.domainLookupStart).toFixed(2), 'ms');
  console.log('TCP:', (nav.connectEnd - nav.connectStart).toFixed(2), 'ms');
  console.log('TTFB:', (nav.responseStart - nav.requestStart).toFixed(2), 'ms');
  console.log('DOM Content Loaded:', nav.domContentLoadedEventEnd.toFixed(2), 'ms');
  console.log('Total Load:', nav.loadEventEnd.toFixed(2), 'ms');
} else {
  console.log('Navigation timing not available');
}`,
        expectedOutput: 'Navigation timing metrics in ms'
      }
    ]
  },
  {
    id: 'dom',
    name: 'DOM/Elements',
    icon: 'Layout',
    description: 'Inspect and manipulate the DOM using querySelector, MutationObserver, IntersectionObserver and other powerful APIs.',
    examples: [
      {
        title: 'querySelector & DOM Manipulation',
        description: 'Select and modify DOM elements',
        code: `const virtualDOM = {
  createElement: (tag, attrs, content) => ({tag, attrs, content}),
  querySelector: (selector) => ({ selector, found: true, tagName: 'DIV' })
};
const element = virtualDOM.querySelector('.my-element');
console.log("Found element:", element.tagName);
console.log("Selector used:", element.selector);
const newEl = virtualDOM.createElement('div', {class: 'highlight'}, 'Hello!');
console.log("Created element:", JSON.stringify(newEl));`,
        expectedOutput: 'DOM element info'
      },
      {
        title: 'MutationObserver',
        description: 'Observe changes to the DOM tree',
        code: `console.log("Setting up MutationObserver...");
const mutations = [
  { type: 'childList', addedNodes: 2, removedNodes: 0 },
  { type: 'attributes', attributeName: 'class', oldValue: 'old' },
  { type: 'characterData', oldValue: 'old text' }
];
mutations.forEach(m => {
  console.log("Mutation detected:", m.type);
  if (m.addedNodes) console.log("  Added nodes:", m.addedNodes);
  if (m.attributeName) console.log("  Changed attribute:", m.attributeName);
});`,
        expectedOutput: 'MutationObserver events'
      },
      {
        title: 'IntersectionObserver',
        description: 'Detect when elements enter or leave the viewport',
        code: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    console.log('Element:', entry.target.id || entry.target.tagName);
    console.log('Is intersecting:', entry.isIntersecting);
    console.log('Intersection ratio:', entry.intersectionRatio.toFixed(2));
    console.log('Visible area:', JSON.stringify(entry.intersectionRect));
  });
}, {
  root: null,       // viewport
  rootMargin: '0px',
  threshold: [0, 0.5, 1.0]
});
// observer.observe(element); — attach to any DOM element`,
        expectedOutput: 'IntersectionObserver callbacks with ratio'
      },
      {
        title: 'ResizeObserver',
        description: 'Watch for changes to element dimensions',
        code: `const resizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(\`Element resized: \${width.toFixed(0)}×\${height.toFixed(0)}px\`);
    if (entry.borderBoxSize) {
      const bs = entry.borderBoxSize[0];
      console.log(\`Border box: \${bs.inlineSize.toFixed(0)}×\${bs.blockSize.toFixed(0)}\`);
    }
  }
});
// resizeObserver.observe(document.body);
console.log('ResizeObserver ready — attach to any element');`,
        expectedOutput: 'ResizeObserver dimension updates'
      },
      {
        title: 'CustomEvent',
        description: 'Create and dispatch custom DOM events',
        code: `// Create a custom event with detail data
const event = new CustomEvent('user:login', {
  detail: { username: 'alice', timestamp: Date.now() },
  bubbles: true,
  cancelable: true
});
// Listen for it
document.addEventListener('user:login', (e) => {
  console.log('Custom event received!');
  console.log('Username:', e.detail.username);
  console.log('Bubbles:', e.bubbles);
});
// Dispatch
document.dispatchEvent(event);
console.log('Event dispatched');`,
        expectedOutput: 'Custom event fired and caught'
      }
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: 'Database',
    description: 'Work with various browser storage mechanisms: localStorage, sessionStorage, IndexedDB, and cookies.',
    examples: [
      {
        title: 'localStorage',
        description: 'Store and retrieve persistent data',
        code: `const storage = {};
storage['username'] = 'john_doe';
storage['theme'] = 'dark';
storage['preferences'] = JSON.stringify({ language: 'en', notifications: true });
console.log("=== localStorage ===");
console.log("username:", storage['username']);
console.log("theme:", storage['theme']);
const prefs = JSON.parse(storage['preferences']);
console.log("preferences:", JSON.stringify(prefs, null, 2));
console.log("Total items:", Object.keys(storage).length);`,
        expectedOutput: 'localStorage data'
      },
      {
        title: 'Cookies',
        description: 'Read and write browser cookies',
        code: `const cookies = {
  set: (name, value, days) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    return \`\${name}=\${value}; expires=\${expires}; path=/\`;
  },
  get: (name) => name === 'session' ? 'abc123xyz' : null
};
const cookieStr = cookies.set('user', 'alice', 7);
console.log("Cookie set:", cookieStr);
console.log("Session cookie:", cookies.get('session'));
console.log("Cookie exists:", cookies.get('session') !== null);`,
        expectedOutput: 'Cookie information'
      },
      {
        title: 'IndexedDB',
        description: 'Client-side structured data storage with transactions',
        code: `const request = indexedDB.open('YOTDatabase', 1);
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('name', 'name', { unique: false });
  console.log('Database schema created');
};
request.onsuccess = (event) => {
  const db = event.target.result;
  const tx = db.transaction('users', 'readwrite');
  tx.objectStore('users').add({ id: 1, name: 'Alice', role: 'admin' });
  console.log('Record added to IndexedDB');
  console.log('Check DevTools > Application > IndexedDB');
};`,
        expectedOutput: 'IndexedDB record stored'
      },
      {
        title: 'sessionStorage',
        description: 'Temporary per-tab storage cleared on session end',
        code: `sessionStorage.setItem('session-token', 'eyJhbGciOiJIUzI1Ni...');
sessionStorage.setItem('user-preferences', JSON.stringify({
  theme: 'dark', fontSize: 14, autoSave: true
}));
console.log('Token:', sessionStorage.getItem('session-token')?.slice(0, 20) + '...');
const prefs = JSON.parse(sessionStorage.getItem('user-preferences') || '{}');
console.log('Prefs:', prefs);
console.log('Session items:', sessionStorage.length);
// Cleared when tab/browser closed
console.log('→ Check DevTools > Application > Session Storage');`,
        expectedOutput: 'sessionStorage data'
      },
      {
        title: 'CacheStorage',
        description: 'Service Worker cache API for offline assets',
        code: `// Cache API (typically used inside Service Worker)
caches.open('yot-cache-v1').then(cache => {
  console.log('Cache opened: yot-cache-v1');
  return cache.addAll(['/index.html', '/styles.css', '/app.js']);
}).then(() => {
  console.log('Assets cached for offline use');
  return caches.keys();
}).then(cacheNames => {
  console.log('Active caches:', cacheNames);
}).catch(err => {
  console.log('Cache API requires HTTPS or localhost');
  console.log('Error:', err.message);
});`,
        expectedOutput: 'CacheStorage entries'
      }
    ]
  },
  {
    id: 'debugging',
    name: 'Sources/Debugging',
    icon: 'Bug',
    description: 'Master debugging techniques including breakpoints, error tracking, stack traces, and source maps.',
    examples: [
      {
        title: 'Error Handling & Stack Traces',
        description: 'Capture and analyze error information',
        code: `function level3() {
  throw new Error("Something went wrong deep in the stack!");
}
function level2() { return level3(); }
function level1() { return level2(); }
try {
  level1();
} catch (error) {
  console.error("Error caught:", error.message);
  console.log("Stack trace simulation:");
  console.log("  at level3 (app.js:2)");
  console.log("  at level2 (app.js:6)");
  console.log("  at level1 (app.js:10)");
  console.log("  at main (app.js:14)");
}`,
        expectedOutput: 'Error and stack trace info'
      },
      {
        title: 'Debugging Techniques',
        description: 'Common debugging patterns',
        code: `const data = [1, 5, 3, 8, 2, 9, 4, 7, 6];
console.log("Searching for values > 5...");
data.forEach((value, index) => {
  if (value > 5) {
    console.log(\`Breakpoint hit! index=\${index}, value=\${value}\`);
  }
});
console.log("---");
console.log("In real browser: 'debugger;' pauses execution");
console.log("Use Sources panel to set breakpoints");`,
        expectedOutput: 'Debugging output'
      },
      {
        title: 'debugger Statement',
        description: 'Pause code execution in DevTools with the debugger keyword',
        code: `function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    debugger; // Execution pauses here when DevTools is open
    total += item.price * item.quantity;
  }
  return total;
}
const cart = [
  { name: 'Widget', price: 9.99, quantity: 3 },
  { name: 'Gadget', price: 24.99, quantity: 1 }
];
// Open DevTools first, then run to hit the debugger
console.log('Total:', calculateTotal(cart));`,
        expectedOutput: 'Pauses execution in Sources panel'
      },
      {
        title: 'Source Maps',
        description: 'Map minified code back to original source',
        code: `// Source maps are configured in your build tool (webpack/vite)
// webpack.config.js:
//   devtool: 'source-map'
// vite.config.js:
//   build: { sourcemap: true }

// The //# sourceMappingURL comment links minified to source:
// app.min.js ends with:
// //# sourceMappingURL=app.min.js.map

console.log("Source map example:");
console.log("Minified: a.b(c=>c.d(e=>f(e)))");
console.log("Original: items.filter(item => item.checkStock(sku => validate(sku)))");
console.log("→ DevTools Sources tab shows original TypeScript/JSX");`,
        expectedOutput: 'Source map explanation'
      }
    ]
  },
  {
    id: 'workers',
    name: 'Workers',
    icon: 'Cpu',
    description: 'Explore Web Workers and Service Workers to run JavaScript in background threads and enable offline functionality.',
    examples: [
      {
        title: 'Web Worker Simulation',
        description: 'Run computations in a background thread',
        code: `console.log("Main thread: Starting heavy computation via Worker...");
function simulateWorkerTask(data) {
  const fib = (n) => n <= 1 ? n : fib(n-1) + fib(n-2);
  return data.map(n => fib(n));
}
const inputs = [10, 15, 20];
console.log("Sending to worker:", inputs);
const results = simulateWorkerTask(inputs);
console.log("Worker results:", results);
console.log("Main thread remains responsive!");`,
        expectedOutput: 'Worker computation results'
      },
      {
        title: 'Service Worker Cache',
        description: 'Cache strategies for offline support',
        code: `const cacheStrategies = {
  'cache-first': 'Return cached response, fall back to network',
  'network-first': 'Try network first, fall back to cache',
  'stale-while-revalidate': 'Return cache immediately, update in background',
  'network-only': 'Always fetch from network',
  'cache-only': 'Only serve from cache'
};
console.log("=== Service Worker Strategies ===");
Object.entries(cacheStrategies).forEach(([strategy, description]) => {
  console.log(\`\\n[\${strategy}]\\n  \${description}\`);
});`,
        expectedOutput: 'Service worker strategies'
      }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'Shield',
    description: 'Understand browser security features including CSP, CORS, HTTPS, mixed content, and XSS prevention.',
    examples: [
      {
        title: 'Content Security Policy',
        description: 'Understanding CSP headers and directives',
        code: `const cspPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'nonce-abc123'", "cdn.example.com"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "*.example.com"],
  'connect-src': ["'self'", "api.example.com"],
  'frame-ancestors': ["'none'"]
};
console.log("=== Content Security Policy ===");
Object.entries(cspPolicy).forEach(([directive, sources]) => {
  console.log(\`\${directive}: \${sources.join(' ')}\`);
});`,
        expectedOutput: 'CSP directives'
      },
      {
        title: 'XSS Prevention',
        description: 'Techniques to prevent Cross-Site Scripting',
        code: `function sanitizeHTML(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
const maliciousInput = '<script>alert("XSS")</script>';
const userInput = '<b>Hello</b> & "World"';
console.log("Original:", maliciousInput);
console.log("Sanitized:", sanitizeHTML(maliciousInput));
console.log("---");
console.log("Original:", userInput);
console.log("Sanitized:", sanitizeHTML(userInput));`,
        expectedOutput: 'Sanitized HTML output'
      }
    ]
  },
  {
    id: 'css-animations',
    name: 'CSS/Animations',
    icon: 'Sparkles',
    description: 'Inspect CSS variables, animations, computed styles and use the Web Animations API from JavaScript.',
    examples: [
      {
        title: 'CSS Variables',
        description: 'Read and update CSS custom properties at runtime',
        code: `// Read a CSS variable
const root = document.documentElement;
const accent = getComputedStyle(root).getPropertyValue('--color-accent');
console.log('Accent color:', accent.trim());

// Set CSS variables dynamically
root.style.setProperty('--dynamic-spacing', '16px');
root.style.setProperty('--dynamic-color', '#6366f1');
console.log('Variables updated on :root');
console.log('→ Check DevTools > Elements > :root to see them');`,
        expectedOutput: 'CSS variable values and updates'
      },
      {
        title: 'CSS Animations API',
        description: 'Control animations with the Web Animations API',
        code: `const el = document.createElement('div');
el.style.cssText = 'width:50px;height:50px;background:#6366f1;position:fixed;top:50%;left:50%';
document.body.appendChild(el);

// Web Animations API
const animation = el.animate([
  { transform: 'rotate(0deg) scale(1)', opacity: 1 },
  { transform: 'rotate(360deg) scale(1.5)', opacity: 0.5 }
], { duration: 1000, iterations: 3, easing: 'ease-in-out' });

animation.onfinish = () => {
  console.log('Animation complete!');
  el.remove();
};
console.log('Animation state:', animation.playState);
console.log('→ Check DevTools > Animations panel');`,
        expectedOutput: 'Animation playing — check Animations tab'
      },
      {
        title: 'getComputedStyle',
        description: 'Inspect final resolved styles of any element',
        code: `const body = document.body;
const styles = getComputedStyle(body);
console.log('=== Computed Styles (body) ===');
console.log('font-size:', styles.fontSize);
console.log('font-family:', styles.fontFamily.slice(0, 40));
console.log('background-color:', styles.backgroundColor);
console.log('display:', styles.display);
console.log('box-sizing:', styles.boxSizing);
// Pseudo-elements
const before = getComputedStyle(body, '::before');
console.log('::before content:', before.content);`,
        expectedOutput: 'Resolved CSS property values'
      }
    ]
  },
  {
    id: 'clipboard-drag',
    name: 'Clipboard/Drag',
    icon: 'ClipboardList',
    description: 'Access the Clipboard API for copy/paste and implement drag-and-drop interactions.',
    examples: [
      {
        title: 'Clipboard API',
        description: 'Read from and write to the system clipboard',
        code: `// Write to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied:', text);
  } catch (err) {
    console.log('Clipboard write error:', err.message);
  }
}

// Read from clipboard
async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Clipboard contents:', text.slice(0, 50));
  } catch (err) {
    console.log('Clipboard read error (needs permission):', err.message);
  }
}

copyToClipboard('Hello from YOT DevTools!');
readFromClipboard();`,
        expectedOutput: 'Clipboard read/write results'
      },
      {
        title: 'Drag and Drop API',
        description: 'Implement native drag-and-drop with DataTransfer',
        code: `const draggable = document.createElement('div');
draggable.textContent = '📦 Drag me';
draggable.draggable = true;
draggable.style.cssText = 'padding:8px;background:#6366f1;color:white;cursor:grab;display:inline-block';

draggable.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', 'item-data-123');
  e.dataTransfer.effectAllowed = 'move';
  console.log('Drag started, data set');
});

const dropZone = document.createElement('div');
dropZone.textContent = '🎯 Drop here';
dropZone.style.cssText = 'padding:16px;border:2px dashed #1e1e2e;margin-top:8px';

dropZone.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
dropZone.addEventListener('drop', (e) => {
  const data = e.dataTransfer.getData('text/plain');
  console.log('Dropped! Data:', data);
});

document.body.append(draggable, dropZone);
console.log('Drag demo elements added to page');`,
        expectedOutput: 'Drag-and-drop elements added to page'
      }
    ]
  }
]
