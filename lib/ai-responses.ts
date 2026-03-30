const responses: Record<string, string[]> = {
  console: [
    "The Console API is one of the most powerful debugging tools available. Beyond console.log(), you can use console.table() to display arrays of objects in a readable table format, console.time()/timeEnd() to measure performance, and console.group() to organize related messages.",
    "console.assert() is an underused gem - it only logs if the condition is false, making it perfect for debugging assertions without cluttering your console.",
    "For production debugging, consider using console.log conditionally: const debug = process.env.NODE_ENV === 'development' ? console.log : () => {};"
  ],
  network: [
    "The Network panel reveals everything about HTTP requests. Look for the 'Waterfall' view to understand request timing - DNS lookup, TCP handshake, SSL negotiation, TTFB, and content download.",
    "Use the Fetch API with async/await for clean network code. Always handle errors with try/catch and check response.ok before parsing JSON.",
    "The Performance API's PerformanceObserver can monitor resource timing in real-time."
  ],
  performance: [
    "The Performance API provides microsecond-precision timing. Use performance.mark() to create named timestamps and performance.measure() to calculate durations between marks.",
    "Core Web Vitals are crucial for SEO and UX: LCP should be < 2.5s, FID < 100ms, and CLS < 0.1.",
    "Memory leaks often come from forgotten event listeners, closures holding references, or growing data structures."
  ],
  dom: [
    "querySelector and querySelectorAll support full CSS selector syntax. For performance with many elements, consider using getElementById() which is faster than querySelector('#id').",
    "MutationObserver is perfect for watching DOM changes without polling. Always call observer.disconnect() to prevent memory leaks.",
    "IntersectionObserver enables efficient lazy loading and infinite scroll. It's far better than scroll event listeners since it's asynchronous."
  ],
  storage: [
    "localStorage persists until explicitly cleared, while sessionStorage lasts only for the browser session. Both are synchronous and limited to ~5MB.",
    "Never store sensitive data in localStorage - it's accessible to any JavaScript on the page. For authentication tokens, use httpOnly cookies.",
    "IndexedDB supports structured data, indexes, and transactions. Libraries like Dexie.js make the API much friendlier."
  ],
  debugging: [
    "Conditional breakpoints are a superpower - right-click on a breakpoint number in Sources and add a condition. The debugger only pauses when the condition is true.",
    "Logpoints let you log expressions without modifying code. They show up in the console with a different icon.",
    "The 'Never Pause Here' option and blackboxing scripts help you skip through library code to get to your application code faster."
  ],
  workers: [
    "Web Workers run in a separate thread, preventing heavy computations from blocking the UI. Communication is via postMessage/onmessage.",
    "Service Workers act as a programmable proxy between your app and the network. They enable PWA features like offline support and push notifications.",
    "Worker threads don't have access to the DOM, but can use Fetch, WebSockets, IndexedDB, and most other Web APIs."
  ],
  security: [
    "Content Security Policy (CSP) is your first line of defense against XSS attacks. Start with a strict policy and loosen it as needed.",
    "The same-origin policy prevents malicious sites from reading your data. CORS lets you selectively allow cross-origin requests.",
    "Subresource Integrity (SRI) hashes ensure CDN-served files haven't been tampered with."
  ],
  javascript: [
    "JavaScript uses prototype-based inheritance. Every object has a [[Prototype]] internal slot that links to another object, forming a chain.",
    "Closures are functions that remember the scope in which they were created. They're fundamental to patterns like the module pattern and currying.",
    "The event loop processes the call stack, microtask queue (Promises), and macrotask queue (setTimeout) in that order each iteration.",
    "Destructuring assignment lets you unpack values from arrays/objects: const { name, age } = user; const [first, ...rest] = arr;",
    "Optional chaining (?.) and nullish coalescing (??) are modern patterns for safely accessing nested properties."
  ],
  typescript: [
    "TypeScript's type system is structural, not nominal. Two types are compatible if their shapes match, regardless of their names.",
    "Use 'unknown' instead of 'any' when you don't know the type. 'unknown' forces you to narrow the type before using it.",
    "Generics let you write reusable, type-safe functions: function identity<T>(arg: T): T { return arg; }",
    "Discriminated unions model state machines safely: type Result = { ok: true; value: string } | { ok: false; error: Error }",
    "The 'satisfies' operator validates a value against a type without widening it: const config = { port: 3000 } satisfies Config;"
  ],
  react: [
    "React's reconciliation algorithm (Fiber) compares virtual DOM trees to determine the minimal set of DOM changes needed.",
    "Use useCallback and useMemo to prevent unnecessary re-renders, but only when the computation or reference stability actually matters.",
    "The useEffect cleanup function runs before the effect re-runs and when the component unmounts. Use it to cancel requests and remove listeners.",
    "Context is great for truly global state (theme, locale, auth), but for complex state management consider Zustand or Redux Toolkit.",
    "React Server Components run only on the server and can directly access databases/APIs without exposing credentials to the client."
  ],
  async: [
    "async/await is syntactic sugar over Promises. An async function always returns a Promise, and await pauses execution until that Promise resolves.",
    "Use Promise.all() for parallel requests: const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)])",
    "Promise.allSettled() waits for all Promises regardless of whether they resolve or reject - useful when you need all results.",
    "Use AbortController to cancel fetch requests: const controller = new AbortController(); fetch(url, { signal: controller.signal })",
    "For retry logic, wrap your async calls in a loop with exponential backoff: await new Promise(r => setTimeout(r, delay * 2 ** attempt))"
  ],
  array: [
    "Array methods like map, filter, and reduce don't mutate the original array - they return new arrays.",
    "Use Array.from() to convert array-like objects (NodeList, arguments) to real arrays.",
    "flat() and flatMap() simplify nested array handling: [1,[2,[3]]].flat(Infinity) // [1,2,3]",
    "findIndex() returns -1 if not found. Use includes() for simple membership checks on primitive values.",
    "Sort mutates the original array and sorts as strings by default. Always provide a comparator for numbers: arr.sort((a,b) => a-b)"
  ],
  object: [
    "Object.keys/values/entries return arrays of an object's own enumerable properties.",
    "Spread syntax creates shallow copies: const clone = { ...original }. For deep cloning, use structuredClone().",
    "Object.freeze() makes an object immutable at the top level. For deep immutability you need a recursive solution.",
    "Property shorthand: if variable name matches key name, you can write { name } instead of { name: name }.",
    "Computed property names allow dynamic keys: const key = 'color'; const obj = { [key]: 'blue' }"
  ],
  error: [
    "Use specific error types by extending the Error class: class ValidationError extends Error { constructor(msg) { super(msg); this.name = 'ValidationError'; } }",
    "In async code, unhandled Promise rejections crash Node.js processes. Always add .catch() or use try/catch with await.",
    "The finally block runs regardless of whether try or catch executed, making it perfect for cleanup.",
    "Error boundaries in React catch errors in the component tree during rendering. Use componentDidCatch or a library like react-error-boundary.",
    "console.error() outputs to stderr and includes a stack trace, making it more useful than console.log() for errors."
  ],
  css: [
    "CSS Grid is best for 2D layouts (rows and columns simultaneously). Flexbox excels at 1D layouts (a single row or column).",
    "Custom properties (CSS variables) cascade and inherit just like regular CSS properties, making them very flexible for theming.",
    "Container queries (@container) let you style elements based on their parent's size rather than the viewport size.",
    "The :is() and :where() pseudo-classes simplify complex selectors. :where() has 0 specificity, making it easy to override.",
    "Use logical properties (margin-inline, padding-block) for better internationalization support with RTL languages."
  ],
  git: [
    "git rebase -i HEAD~n lets you squash, reorder, or edit the last n commits interactively.",
    "git bisect uses binary search to find the commit that introduced a bug. Run git bisect start, mark good/bad commits, and git does the rest.",
    "git stash saves your working directory changes without committing. Use git stash pop to restore them.",
    "Use conventional commits (feat:, fix:, chore:) to make your git history readable and enable automated changelog generation.",
    "git reflog tracks every movement of HEAD, letting you recover from accidental resets or branch deletions."
  ],
  playground: [
    "The playground supports full JavaScript execution. Try using async/await, array methods, and object destructuring.",
    "You can use console.log(), console.table(), console.warn() and console.error() to inspect values.",
    "Tab key inserts 2 spaces for indentation. Use the Snippets menu for common code patterns.",
    "The playground runs code in a sandboxed environment. DOM manipulation and network requests are mocked.",
    "Try the AI assistant in the playground to have code written or modified for you by describing what you want."
  ],
  help: [
    "I can help you with JavaScript, TypeScript, React, CSS, debugging, async patterns, array/object methods, and more. Just ask!",
    "Ask me about specific APIs (fetch, DOM, Storage), design patterns, best practices, or how something works in the browser.",
    "Try asking: 'How do I use async/await?', 'What is a closure?', 'How do I center a div with CSS?', or 'Explain the event loop'."
  ],
  closure: [
    "A closure is a function that retains access to its outer scope even after the outer function has returned. Example: function makeCounter() { let count = 0; return () => ++count; } — the returned arrow function closes over 'count'.",
    "Closures enable the module pattern, memoization, and partial application. They're created every time a function is defined inside another function.",
    "Common closure pitfall in loops: for(var i=0; i<3; i++) { setTimeout(() => console.log(i), 0) } logs 3,3,3. Fix with let (block scope) or an IIFE."
  ],
  promise: [
    "Promises represent a future value. They have three states: pending, fulfilled (resolved), or rejected. Once settled, they're immutable.",
    "Promise chaining: fetch(url).then(r => r.json()).then(data => process(data)).catch(err => handle(err)). Each .then() returns a new Promise.",
    "Promise.race() resolves/rejects with the first settled promise. Useful for timeout patterns: Promise.race([fetchData(), timeout(5000)])"
  ],
  event: [
    "Event delegation: attach one listener to a parent instead of many listeners to children. Use event.target to identify the source.",
    "addEventListener's third argument can be an options object: { once: true } auto-removes the listener after first invocation.",
    "Custom events: const evt = new CustomEvent('myEvent', { detail: { value: 42 } }); element.dispatchEvent(evt);"
  ],
  default: [
    "Browser DevTools are a developer's best friend! Each panel serves a specific purpose: Elements for DOM inspection, Console for JS execution, Network for request monitoring.",
    "A great debugging workflow: 1) Reproduce the issue, 2) Open DevTools, 3) Check console for errors, 4) Use the debugger to step through code.",
    "Did you know you can edit files directly in DevTools? In the Sources panel, open a file and edit it.",
    "The $() and $$() shortcuts in the Console are aliases for document.querySelector() and document.querySelectorAll().",
    "Use DevTools device emulation to test responsive designs and touch events.",
    "I can help with JavaScript, TypeScript, React, CSS, async patterns, debugging, performance, and more. What would you like to learn?"
  ]
}

const keywordMap: Record<string, string> = {
  // console keywords
  'console': 'console', 'log': 'console', 'print': 'console', 'output': 'console',
  // network keywords
  'network': 'network', 'fetch': 'network', 'http': 'network', 'api': 'network', 'request': 'network', 'cors': 'network',
  // performance keywords
  'performance': 'performance', 'speed': 'performance', 'slow': 'performance', 'optimize': 'performance', 'core web': 'performance', 'lcp': 'performance',
  // dom keywords
  'dom': 'dom', 'element': 'dom', 'selector': 'dom', 'queryselector': 'dom', 'mutation': 'dom', 'intersection': 'dom',
  // storage keywords
  'storage': 'storage', 'localstorage': 'storage', 'sessionstorage': 'storage', 'indexeddb': 'storage', 'cookie': 'storage',
  // debugging keywords
  'debug': 'debugging', 'breakpoint': 'debugging', 'debugger': 'debugging', 'logpoint': 'debugging',
  // workers
  'worker': 'workers', 'service worker': 'workers', 'web worker': 'workers', 'thread': 'workers',
  // security
  'security': 'security', 'xss': 'security', 'csp': 'security', 'injection': 'security', 'authentication': 'security',
  // javascript
  'javascript': 'javascript', 'prototype': 'javascript', 'scope': 'javascript', 'hoisting': 'javascript',
  // typescript
  'typescript': 'typescript', 'interface': 'typescript', 'generic': 'typescript', 'type': 'typescript', 'enum': 'typescript',
  // react
  'react': 'react', 'component': 'react', 'hook': 'react', 'usestate': 'react', 'useeffect': 'react', 'context': 'react', 'jsx': 'react',
  // async
  'async': 'async', 'await': 'async', 'promise': 'promise', 'then': 'async', 'callback': 'async',
  // array
  'array': 'array', 'map': 'array', 'filter': 'array', 'reduce': 'array', 'foreach': 'array', 'flatmap': 'array',
  // object
  'object': 'object', 'spread': 'object', 'destructur': 'object', 'freeze': 'object',
  // error
  'error': 'error', 'exception': 'error', 'try': 'error', 'catch': 'error', 'throw': 'error',
  // css
  'css': 'css', 'grid': 'css', 'flexbox': 'css', 'flex': 'css', 'variable': 'css', 'animation': 'css',
  // git
  'git': 'git', 'commit': 'git', 'branch': 'git', 'rebase': 'git', 'merge': 'git',
  // playground
  'playground': 'playground', 'run code': 'playground', 'snippet': 'playground',
  // closure
  'closure': 'closure',
  // event
  'event': 'event', 'listener': 'event', 'dispatch': 'event', 'addeventlistener': 'event',
  // help
  'help': 'help', 'what can': 'help', 'how do': 'help', 'explain': 'help',
}

export async function getAIResponse(query: string, category?: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600))
  const queryLower = query.toLowerCase()

  // Check keyword map for best match
  for (const [keyword, bucket] of Object.entries(keywordMap)) {
    if (queryLower.includes(keyword)) {
      const list = responses[bucket]
      if (list) return list[Math.floor(Math.random() * list.length)]
    }
  }

  // Fall back to category-based response
  if (category && responses[category]) {
    const list = responses[category]
    return list[Math.floor(Math.random() * list.length)]
  }

  const defaultList = responses.default
  return defaultList[Math.floor(Math.random() * defaultList.length)]
}

export const quickSuggestions = [
  "How do I use console.table?",
  "Explain the event loop",
  "What is a closure?",
  "How does async/await work?",
  "What is a Service Worker?",
  "How to prevent XSS attacks?",
  "Explain Promise.all()",
  "What are Core Web Vitals?",
  "How do I use TypeScript generics?",
  "Explain React hooks",
]
