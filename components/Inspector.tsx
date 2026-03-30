'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Play, Info } from 'lucide-react'

interface PropertyNode {
  key: string
  type: string
  value: string
  description: string
  snippet?: string
  children?: PropertyNode[]
}

const browserObjects: PropertyNode[] = [
  {
    key: 'window',
    type: 'object',
    value: 'Window { ... }',
    description: 'The global object in the browser. Every global variable and function is a property of window.',
    children: [
      {
        key: 'window.location',
        type: 'object',
        value: 'Location { href, host, pathname, ... }',
        description: 'Contains information about the current URL. You can read or set properties to navigate.',
        snippet: `console.log("Current URL:", window.location.href);\nconsole.log("Host:", window.location.hostname);\nconsole.log("Pathname:", window.location.pathname);`,
        children: [
          { key: 'href', type: 'string', value: '"https://example.com/path"', description: 'Full URL of the current page.', snippet: `console.log(window.location.href);` },
          { key: 'hostname', type: 'string', value: '"example.com"', description: 'Domain name of the current page without port.', snippet: `console.log(window.location.hostname);` },
          { key: 'pathname', type: 'string', value: '"/path"', description: 'Path component of the URL.', snippet: `console.log(window.location.pathname);` },
          { key: 'search', type: 'string', value: '"?query=1"', description: 'Query string including the "?" character.', snippet: `console.log(window.location.search);` },
          { key: 'hash', type: 'string', value: '"#section"', description: 'Fragment identifier including the "#" character.', snippet: `console.log(window.location.hash);` },
          { key: 'protocol', type: 'string', value: '"https:"', description: 'Protocol scheme of the URL (e.g., "https:").', snippet: `console.log(window.location.protocol);` },
        ],
      },
      {
        key: 'window.history',
        type: 'object',
        value: 'History { length, ... }',
        description: 'Provides access to the browser session history. Allows you to navigate forwards and backwards.',
        snippet: `console.log("History length:", window.history.length);\n// window.history.back()  — go back\n// window.history.forward() — go forward`,
        children: [
          { key: 'length', type: 'number', value: '5', description: 'Number of entries in the session history.', snippet: `console.log(window.history.length);` },
          { key: 'back()', type: 'function', value: 'ƒ back()', description: 'Navigates to the previous page in history.', snippet: `// window.history.back(); // navigates back` },
          { key: 'forward()', type: 'function', value: 'ƒ forward()', description: 'Navigates to the next page in history.', snippet: `// window.history.forward(); // navigates forward` },
          { key: 'pushState()', type: 'function', value: 'ƒ pushState()', description: 'Adds an entry to the session history stack without reloading.', snippet: `// history.pushState({}, '', '/new-path');` },
        ],
      },
      {
        key: 'window.navigator',
        type: 'object',
        value: 'Navigator { userAgent, language, ... }',
        description: 'Information about the browser and the device it is running on.',
        snippet: `console.log("User Agent:", navigator.userAgent);\nconsole.log("Language:", navigator.language);\nconsole.log("Online:", navigator.onLine);\nconsole.log("Platform:", navigator.platform);`,
        children: [
          { key: 'userAgent', type: 'string', value: '"Mozilla/5.0 ..."', description: 'Browser identification string. Avoid relying on it for feature detection.', snippet: `console.log(navigator.userAgent);` },
          { key: 'language', type: 'string', value: '"en-US"', description: 'Preferred language of the user.', snippet: `console.log(navigator.language);` },
          { key: 'onLine', type: 'boolean', value: 'true', description: 'Returns true if the browser is connected to the internet.', snippet: `console.log("Online?", navigator.onLine);` },
          { key: 'platform', type: 'string', value: '"Win32"', description: '(Deprecated) Platform string for the browser\'s host environment. Use navigator.userAgentData.platform where available.', snippet: `// navigator.platform is deprecated — prefer navigator.userAgentData?.platform\nconsole.log(navigator.platform);` },
          { key: 'cookieEnabled', type: 'boolean', value: 'true', description: 'Whether cookies are enabled in the browser.', snippet: `console.log("Cookies enabled?", navigator.cookieEnabled);` },
          { key: 'hardwareConcurrency', type: 'number', value: '8', description: 'Number of logical processor cores available.', snippet: `console.log("CPU cores:", navigator.hardwareConcurrency);` },
        ],
      },
      {
        key: 'window.performance',
        type: 'object',
        value: 'Performance { timeOrigin, now(), ... }',
        description: 'Provides access to performance-related information. Use it to time code execution with microsecond precision.',
        snippet: `const t0 = performance.now();\nlet sum = 0;\nfor (let i = 0; i < 1000000; i++) sum += i;\nconst t1 = performance.now();\nconsole.log("Loop took:", (t1 - t0).toFixed(3), "ms");`,
        children: [
          { key: 'now()', type: 'function', value: 'ƒ now()', description: 'Returns a DOMHighResTimeStamp in milliseconds since time origin.', snippet: `console.log("Time since page load:", performance.now().toFixed(2), "ms");` },
          { key: 'timeOrigin', type: 'number', value: '1700000000000', description: 'The Unix timestamp of when performance measurement began.', snippet: `console.log("Page loaded at:", new Date(performance.timeOrigin).toISOString());` },
          { key: 'mark()', type: 'function', value: 'ƒ mark()', description: 'Creates a named timestamp in the performance timeline.', snippet: `performance.mark("start");\nconsole.log("Mark created!");` },
          { key: 'measure()', type: 'function', value: 'ƒ measure()', description: 'Creates a named measurement between two marks.', snippet: `performance.mark("a");\nperformance.mark("b");\nperformance.measure("a-to-b","a","b");` },
          { key: 'getEntries()', type: 'function', value: 'ƒ getEntries()', description: 'Returns a list of all performance entries.', snippet: `console.log(JSON.stringify(performance.getEntries().slice(0,2), null, 2));` },
        ],
      },
      {
        key: 'window.localStorage',
        type: 'object',
        value: 'Storage { length, ... }',
        description: 'Allows storing key-value pairs in the browser. Data persists even after the browser is closed.',
        snippet: `localStorage.setItem("username", "Alice");\nconsole.log("Stored:", localStorage.getItem("username"));\nconsole.log("Total items:", localStorage.length);\nlocalStorage.removeItem("username");`,
        children: [
          { key: 'setItem()', type: 'function', value: 'ƒ setItem()', description: 'Sets or updates a key-value pair.', snippet: `localStorage.setItem("key", "value");\nconsole.log("Saved!");` },
          { key: 'getItem()', type: 'function', value: 'ƒ getItem()', description: 'Retrieves the value for a given key, or null if not found.', snippet: `const val = localStorage.getItem("key");\nconsole.log("Value:", val);` },
          { key: 'removeItem()', type: 'function', value: 'ƒ removeItem()', description: 'Removes a specific key from storage.', snippet: `localStorage.removeItem("key");\nconsole.log("Removed!");` },
          { key: 'clear()', type: 'function', value: 'ƒ clear()', description: 'Removes all key-value pairs from storage.', snippet: `// localStorage.clear(); // clears everything!` },
          { key: 'length', type: 'number', value: '0', description: 'Number of key-value pairs currently stored.', snippet: `console.log("Items stored:", localStorage.length);` },
        ],
      },
      {
        key: 'window.console',
        type: 'object',
        value: 'Console { log, warn, error, ... }',
        description: 'Provides access to the browser debugging console. Part of the Console API.',
        snippet: `console.log("Standard log");\nconsole.info("Informational");\nconsole.warn("Warning!");\nconsole.error("Error!");\nconsole.table([{a:1},{a:2}]);`,
        children: [
          { key: 'log()', type: 'function', value: 'ƒ log()', description: 'Logs a message to the console.', snippet: `console.log("Hello, World!");` },
          { key: 'warn()', type: 'function', value: 'ƒ warn()', description: 'Outputs a warning message.', snippet: `console.warn("This is a warning");` },
          { key: 'error()', type: 'function', value: 'ƒ error()', description: 'Outputs an error message.', snippet: `console.error("Something went wrong!");` },
          { key: 'table()', type: 'function', value: 'ƒ table()', description: 'Displays data in a table format.', snippet: `console.table([{name:"Alice"},{name:"Bob"}]);` },
          { key: 'time()', type: 'function', value: 'ƒ time()', description: 'Starts a timer with a given label.', snippet: `console.time("timer");\nconsole.timeEnd("timer");` },
          { key: 'assert()', type: 'function', value: 'ƒ assert()', description: 'Logs a message only if the condition is false.', snippet: `console.assert(1===1, "Should not appear");\nconsole.assert(1===2, "1 does not equal 2!");` },
        ],
      },
    ],
  },
  {
    key: 'document',
    type: 'object',
    value: 'HTMLDocument { ... }',
    description: 'Represents the HTML document loaded in the browser. Use it to query and modify the DOM.',
    children: [
      { key: 'title', type: 'string', value: '"Page Title"', description: 'Gets or sets the title of the document shown in the browser tab.', snippet: `console.log("Page title:", document.title);` },
      { key: 'URL', type: 'string', value: '"https://example.com"', description: 'The full URL of the document.', snippet: `console.log("URL:", document.URL);` },
      { key: 'readyState', type: 'string', value: '"complete"', description: '"loading", "interactive", or "complete" — describes loading progress.', snippet: `console.log("Ready state:", document.readyState);` },
      { key: 'getElementById()', type: 'function', value: 'ƒ getElementById()', description: 'Returns the element with the specified ID, or null.', snippet: `// const el = document.getElementById("myId");\nconsole.log("getElementById returns an Element or null");` },
      { key: 'querySelector()', type: 'function', value: 'ƒ querySelector()', description: 'Returns the first element matching a CSS selector.', snippet: `// const el = document.querySelector(".my-class");\nconsole.log("querySelector accepts any CSS selector");` },
      { key: 'querySelectorAll()', type: 'function', value: 'ƒ querySelectorAll()', description: 'Returns a NodeList of all elements matching a CSS selector.', snippet: `// const els = document.querySelectorAll("p");\nconsole.log("querySelectorAll returns a NodeList");` },
      { key: 'createElement()', type: 'function', value: 'ƒ createElement()', description: 'Creates a new HTML element.', snippet: `const div = document.createElement("div");\ndiv.textContent = "Hello!";\nconsole.log("Created:", div.outerHTML);` },
      { key: 'cookie', type: 'string', value: '"key=value; ..."', description: 'Gets or sets cookies for the document.', snippet: `document.cookie = "test=hello; max-age=60";\nconsole.log("Cookies:", document.cookie);` },
    ],
  },
]

const typeColorStyles: Record<string, string> = {
  string: '#c3e88d',
  number: '#f78c6c',
  boolean: '#c792ea',
  function: '#82aaff',
  object: '#06b6d4',
}

const runSnippet = (code: string): string[] => {
  const outputs: string[] = []
  const mc = {
    log: (...a: unknown[]) => outputs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ')),
    warn: (...a: unknown[]) => outputs.push('WARN: ' + a.map(String).join(' ')),
    error: (...a: unknown[]) => outputs.push('ERROR: ' + a.map(String).join(' ')),
    table: (d: unknown) => outputs.push('TABLE:\n' + JSON.stringify(d, null, 2)),
    time: (l: string) => outputs.push(`timer "${l}" started`),
    timeEnd: (l: string) => outputs.push(`timer "${l}": ~1.23ms`),
  }
  const mp = {
    now: () => { outputs.push('(simulated) performance.now() → 42.00 ms'); return 42 },
    timeOrigin: 1700000000000,
    mark: (n: string) => outputs.push(`performance.mark("${n}")`),
    measure: (n: string, a: string, b: string) => outputs.push(`performance.measure("${n}", "${a}", "${b}")`),
    getEntries: () => [],
  }
  try {
    const fn = new Function('console', 'performance', code)
    fn(mc, mp)
  } catch (e) {
    outputs.push('Error: ' + (e as Error).message)
  }
  return outputs
}

function TreeNode({ node, depth = 0 }: { node: PropertyNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth === 0)
  const [selected, setSelected] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const hasChildren = !!node.children?.length

  const handleClick = () => {
    if (hasChildren) setExpanded(!expanded)
    setSelected(!selected)
  }

  const handleRun = () => {
    if (node.snippet) setOutput(runSnippet(node.snippet))
  }

  return (
    <div className={`${depth > 0 ? 'ml-5 border-l pl-3' : ''}`} style={depth > 0 ? { borderColor: 'var(--color-border)' } : {}}>
      <motion.div
        onClick={handleClick}
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors`}
        style={{ backgroundColor: selected ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)' : undefined }}
        whileHover={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 5%, transparent)' } as Record<string, string>}
      >
        <span className="w-4" style={{ color: 'var(--foreground-muted)' }}>
          {hasChildren ? (expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />) : <span className="w-3 inline-block" />}
        </span>
        <span className="font-mono text-sm font-medium" style={{ color: 'var(--foreground)' }}>{node.key}</span>
        <span className="font-mono text-xs" style={{ color: typeColorStyles[node.type] ?? 'var(--foreground-muted)' }}>{node.type}</span>
        <span className="font-mono text-xs truncate max-w-[200px]" style={{ color: 'var(--foreground-muted)' }}>{node.value}</span>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${depth > 0 ? 'ml-5 pl-3' : 'ml-6'} mb-2`}
          >
            <div className="border rounded-xl p-4 text-sm space-y-3" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-start gap-2">
                <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                <p className="leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{node.description}</p>
              </div>
              {node.snippet && (
                <div>
                  <div className="font-mono text-xs border rounded-lg p-3 whitespace-pre overflow-x-auto" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: '#c3e88d' }}>
                    {node.snippet}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={e => { e.stopPropagation(); handleRun() }}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-white text-xs rounded-lg font-medium transition-colors"
                    style={{ background: 'var(--color-accent)' }}
                  >
                    <Play size={11} />Try It
                  </motion.button>
                  {output.length > 0 && (
                    <div className="mt-2 border rounded-lg p-3 font-mono text-xs space-y-0.5" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                      {output.map((line, i) => (
                        <div key={i} className={`${line.startsWith('ERROR:') ? 'text-[#ef4444]' : line.startsWith('WARN:') ? 'text-yellow-400' : line.startsWith('TABLE:') ? 'text-[#06b6d4]' : ''} whitespace-pre-wrap`}
                          style={!line.startsWith('ERROR:') && !line.startsWith('WARN:') && !line.startsWith('TABLE:') ? { color: 'var(--foreground)' } : {}}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {node.children!.map(child => (
              <TreeNode key={child.key} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Inspector() {
  const [search, setSearch] = useState('')

  const filterNodes = (nodes: PropertyNode[], q: string): PropertyNode[] => {
    if (!q) return nodes
    return nodes.reduce<PropertyNode[]>((acc, node) => {
      const matches = node.key.toLowerCase().includes(q) || node.description.toLowerCase().includes(q)
      const filteredChildren = node.children ? filterNodes(node.children, q) : undefined
      if (matches || (filteredChildren && filteredChildren.length > 0)) {
        acc.push({ ...node, children: filteredChildren })
      }
      return acc
    }, [])
  }

  const filtered = filterNodes(browserObjects, search.toLowerCase())

  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-5" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Object / Property Inspector</h2>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
          Browse the browser object tree. Click any property to see a description and a live &quot;Try It&quot; snippet.
        </p>
      </div>

      <div className="relative">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search properties…"
          className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--foreground)' }}
        />
      </div>

      <div className="border rounded-xl p-4 overflow-x-auto" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        {filtered.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: 'var(--foreground-muted)' }}>No properties match &ldquo;{search}&rdquo;</p>
        ) : (
          filtered.map(node => <TreeNode key={node.key} node={node} depth={0} />)
        )}
      </div>
    </div>
  )
}
