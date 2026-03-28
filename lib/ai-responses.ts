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
  default: [
    "Browser DevTools are a developer's best friend! Each panel serves a specific purpose: Elements for DOM inspection, Console for JS execution, Network for request monitoring.",
    "A great debugging workflow: 1) Reproduce the issue, 2) Open DevTools, 3) Check console for errors, 4) Use the debugger to step through code.",
    "Did you know you can edit files directly in DevTools? In the Sources panel, open a file and edit it.",
    "The $() and $$() shortcuts in the Console are aliases for document.querySelector() and document.querySelectorAll().",
    "Use DevTools device emulation to test responsive designs and touch events."
  ]
}

export async function getAIResponse(query: string, category?: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
  const queryLower = query.toLowerCase()
  for (const [key, responseList] of Object.entries(responses)) {
    if (key !== 'default' && (queryLower.includes(key) || category === key)) {
      return responseList[Math.floor(Math.random() * responseList.length)]
    }
  }
  if (category && responses[category]) {
    const list = responses[category]
    return list[Math.floor(Math.random() * list.length)]
  }
  const defaultList = responses.default
  return defaultList[Math.floor(Math.random() * defaultList.length)]
}

export const quickSuggestions = [
  "How do I use console.table?",
  "Explain the Performance API",
  "What is a Service Worker?",
  "How to prevent XSS attacks?",
  "What is MutationObserver?",
  "How to debug memory leaks?",
  "Explain localStorage vs sessionStorage",
  "What are Core Web Vitals?"
]
