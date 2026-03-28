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
        title: 'console.group',
        description: 'Group related console messages',
        code: `console.group("User Details");
console.log("Name: John Doe");
console.log("Email: john@example.com");
console.groupCollapsed("Address");
console.log("Street: 123 Main St");
console.log("City: Springfield");
console.groupEnd();
console.groupEnd();`,
        expectedOutput: 'Grouped output in console'
      }
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
  }
]
