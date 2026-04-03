'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Play, Info } from 'lucide-react'
import { trackFeatureUsage } from '@/lib/analytics'

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
  // ── Fetch API ────────────────────────────────────────────────────────────────
  {
    key: 'fetch',
    type: 'function',
    value: 'ƒ fetch(url, options?)',
    description: 'Makes an HTTP request and returns a Promise that resolves to a Response object. The modern replacement for XMLHttpRequest.',
    snippet: `// fetch() returns a Promise\nconsole.log("fetch is available:", typeof fetch === "function");\nconsole.log("Usage: fetch(url).then(r => r.json()).then(data => console.log(data))");`,
    children: [
      { key: 'GET request', type: 'function', value: 'fetch(url)', description: 'Simple GET request. Returns a Promise<Response>.', snippet: `// Example GET request (simulated)\nconsole.log("GET fetch example:");\nconsole.log("fetch('https://api.example.com/users')");\nconsole.log("  .then(r => r.json())");\nconsole.log("  .then(data => console.log(data));");` },
      { key: 'POST request', type: 'function', value: 'fetch(url, {method:"POST",...})', description: 'POST request with JSON body.', snippet: `// Example POST request (simulated)\nconst options = {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ name: "Alice" })\n};\nconsole.log("POST options:", JSON.stringify(options, null, 2));` },
      { key: 'Response.json()', type: 'function', value: 'ƒ json()', description: 'Parses the response body as JSON. Returns a Promise.', snippet: `console.log("response.json() parses the response as JSON");` },
      { key: 'Response.text()', type: 'function', value: 'ƒ text()', description: 'Parses the response body as plain text. Returns a Promise.', snippet: `console.log("response.text() returns raw text string");` },
      { key: 'Response.ok', type: 'boolean', value: 'true/false', description: 'true if the HTTP status is in the 200–299 range.', snippet: `// Checking response.ok\nconsole.log("Always check response.ok before reading data:");\nconsole.log("if (!response.ok) throw new Error('HTTP ' + response.status);");` },
      { key: 'AbortController', type: 'object', value: 'AbortController {}', description: 'Allows you to cancel a fetch() request at any time.', snippet: `const controller = new AbortController();\nconsole.log("AbortController created");\nconsole.log("signal:", typeof controller.signal);\n// controller.abort(); // cancels the fetch` },
    ],
  },
  // ── Promise / async ──────────────────────────────────────────────────────────
  {
    key: 'Promise',
    type: 'function',
    value: 'class Promise',
    description: 'Represents the eventual completion or failure of an asynchronous operation.',
    snippet: `const p = Promise.resolve(42);\np.then(v => console.log("Resolved:", v));\nconsole.log("Promise.resolve() creates a pre-resolved promise");`,
    children: [
      { key: 'Promise.resolve()', type: 'function', value: 'ƒ resolve()', description: 'Returns a Promise object resolved with a given value.', snippet: `Promise.resolve("Hello").then(v => console.log("Resolved:", v));` },
      { key: 'Promise.reject()', type: 'function', value: 'ƒ reject()', description: 'Returns a Promise object rejected with a reason.', snippet: `Promise.reject(new Error("Oops")).catch(e => console.error("Caught:", e.message));` },
      { key: 'Promise.all()', type: 'function', value: 'ƒ all()', description: 'Waits for all promises to resolve. Rejects if any one rejects.', snippet: `Promise.all([\n  Promise.resolve(1),\n  Promise.resolve(2),\n  Promise.resolve(3),\n]).then(values => console.log("All:", values));` },
      { key: 'Promise.allSettled()', type: 'function', value: 'ƒ allSettled()', description: 'Waits for all promises to settle (resolve or reject). Never rejects.', snippet: `Promise.allSettled([\n  Promise.resolve("ok"),\n  Promise.reject("fail"),\n]).then(results => console.log(JSON.stringify(results, null, 2)));` },
      { key: 'Promise.race()', type: 'function', value: 'ƒ race()', description: 'Resolves or rejects with the first promise that settles.', snippet: `const a = new Promise(r => setTimeout(() => r("A"), 200));\nconst b = new Promise(r => setTimeout(() => r("B"), 100));\nPromise.race([a, b]).then(v => console.log("First:", v));` },
      { key: '.then()', type: 'function', value: 'ƒ then()', description: 'Handles the resolved value of a Promise.', snippet: `Promise.resolve(10)\n  .then(v => v * 2)\n  .then(v => console.log("After chaining:", v));` },
      { key: '.catch()', type: 'function', value: 'ƒ catch()', description: 'Handles a rejected Promise or any thrown error in the chain.', snippet: `Promise.reject(new Error("Boom!"))\n  .catch(e => console.error("Caught error:", e.message));` },
      { key: '.finally()', type: 'function', value: 'ƒ finally()', description: 'Runs code whether the Promise resolved or rejected.', snippet: `Promise.resolve("done")\n  .then(v => console.log("Resolved:", v))\n  .finally(() => console.log("Finally block ran!"));` },
    ],
  },
  // ── Array ────────────────────────────────────────────────────────────────────
  {
    key: 'Array',
    type: 'function',
    value: 'class Array',
    description: 'JavaScript built-in for ordered, indexed collections. Arrays have a rich set of functional methods.',
    snippet: `const a = [1, 2, 3, 4, 5];\nconsole.log("Length:", a.length);\nconsole.log("First:", a[0], "Last:", a[a.length - 1]);`,
    children: [
      { key: 'map()', type: 'function', value: 'ƒ map(fn)', description: 'Creates a new array with the results of calling fn on every element.', snippet: `const doubled = [1,2,3].map(n => n * 2);\nconsole.log("Doubled:", doubled);` },
      { key: 'filter()', type: 'function', value: 'ƒ filter(fn)', description: 'Creates a new array with all elements that pass the test in fn.', snippet: `const evens = [1,2,3,4,5].filter(n => n % 2 === 0);\nconsole.log("Evens:", evens);` },
      { key: 'reduce()', type: 'function', value: 'ƒ reduce(fn, init)', description: 'Reduces an array to a single value by calling fn on each element.', snippet: `const sum = [1,2,3,4,5].reduce((acc, n) => acc + n, 0);\nconsole.log("Sum:", sum);` },
      { key: 'find()', type: 'function', value: 'ƒ find(fn)', description: 'Returns the first element that satisfies the testing function, or undefined.', snippet: `const found = [3,7,12,5].find(n => n > 10);\nconsole.log("First > 10:", found);` },
      { key: 'some()', type: 'function', value: 'ƒ some(fn)', description: 'Returns true if at least one element passes the test.', snippet: `const hasNegative = [-1,2,3].some(n => n < 0);\nconsole.log("Has negative?", hasNegative);` },
      { key: 'every()', type: 'function', value: 'ƒ every(fn)', description: 'Returns true only if all elements pass the test.', snippet: `const allPositive = [1,2,3].every(n => n > 0);\nconsole.log("All positive?", allPositive);` },
      { key: 'flat()', type: 'function', value: 'ƒ flat(depth?)', description: 'Flattens nested arrays up to the specified depth.', snippet: `const nested = [[1,2],[3,[4,5]]];\nconsole.log("Flat 1:", nested.flat());\nconsole.log("Flat ∞:", nested.flat(Infinity));` },
      { key: 'flatMap()', type: 'function', value: 'ƒ flatMap(fn)', description: 'Maps each element and flattens the result by one level.', snippet: `const result = [1,2,3].flatMap(n => [n, n * 2]);\nconsole.log("flatMap:", result);` },
      { key: 'Array.from()', type: 'function', value: 'ƒ Array.from()', description: 'Creates an array from any iterable or array-like object.', snippet: `console.log(Array.from("hello"));\nconsole.log(Array.from({length: 5}, (_, i) => i + 1));` },
    ],
  },
  // ── Object ───────────────────────────────────────────────────────────────────
  {
    key: 'Object',
    type: 'function',
    value: 'class Object',
    description: 'The base class for all JavaScript objects. Provides static methods for working with objects.',
    snippet: `const obj = {a: 1, b: 2, c: 3};\nconsole.log("Keys:", Object.keys(obj));\nconsole.log("Values:", Object.values(obj));\nconsole.log("Entries:", JSON.stringify(Object.entries(obj)));`,
    children: [
      { key: 'Object.keys()', type: 'function', value: 'ƒ keys()', description: 'Returns an array of the object\'s own enumerable string property keys.', snippet: `const obj = {name:"Alice", age:30};\nconsole.log("Keys:", Object.keys(obj));` },
      { key: 'Object.values()', type: 'function', value: 'ƒ values()', description: 'Returns an array of the object\'s own enumerable property values.', snippet: `const obj = {name:"Alice", age:30};\nconsole.log("Values:", Object.values(obj));` },
      { key: 'Object.entries()', type: 'function', value: 'ƒ entries()', description: 'Returns an array of [key, value] pairs.', snippet: `const obj = {a:1, b:2};\nfor (const [k, v] of Object.entries(obj)) {\n  console.log(k + ":", v);\n}` },
      { key: 'Object.assign()', type: 'function', value: 'ƒ assign(target, ...src)', description: 'Copies all enumerable properties from one or more sources to a target object.', snippet: `const target = {a:1};\nconst result = Object.assign(target, {b:2}, {c:3});\nconsole.log("Merged:", JSON.stringify(result));` },
      { key: 'Object.freeze()', type: 'function', value: 'ƒ freeze()', description: 'Prevents modifications to an object. Properties cannot be added, removed, or changed.', snippet: `const obj = Object.freeze({x:1, y:2});\ntry { obj.x = 99; } catch(e) { console.error(e.message); }\nconsole.log("After freeze attempt:", obj.x);` },
      { key: 'Object.create()', type: 'function', value: 'ƒ create(proto)', description: 'Creates a new object with the specified prototype.', snippet: `const proto = { greet() { return "Hello, " + this.name; } };\nconst obj = Object.create(proto);\nobj.name = "Alice";\nconsole.log(obj.greet());` },
      { key: 'Spread ...', type: 'syntax', value: '{ ...obj }', description: 'Spread syntax creates a shallow copy of an object. ES2018+.', snippet: `const a = {x:1, y:2};\nconst b = {...a, z:3};\nconsole.log("Spread copy:", JSON.stringify(b));` },
    ],
  },
  // ── JSON ────────────────────────────────────────────────────────────────────
  {
    key: 'JSON',
    type: 'object',
    value: 'JSON { parse, stringify }',
    description: 'Provides methods for parsing and serializing JavaScript objects to/from JSON format.',
    snippet: `const obj = {name:"Alice", age:30, active:true};\nconst json = JSON.stringify(obj, null, 2);\nconsole.log("JSON string:\\n" + json);\nconsole.log("Parsed back:", JSON.parse(json));`,
    children: [
      { key: 'JSON.stringify()', type: 'function', value: 'ƒ stringify()', description: 'Converts a JavaScript value to a JSON string.', snippet: `const data = {items:[1,2,3], label:"test"};\nconsole.log(JSON.stringify(data));\nconsole.log(JSON.stringify(data, null, 2)); // pretty print` },
      { key: 'JSON.parse()', type: 'function', value: 'ƒ parse()', description: 'Parses a JSON string and returns the corresponding JavaScript value.', snippet: `const raw = '{"name":"Bob","age":25}';\nconst obj = JSON.parse(raw);\nconsole.log("Name:", obj.name, "Age:", obj.age);` },
    ],
  },
  // ── Math ────────────────────────────────────────────────────────────────────
  {
    key: 'Math',
    type: 'object',
    value: 'Math { PI, E, ... }',
    description: 'Built-in object providing mathematical constants and functions. Not a constructor.',
    snippet: `console.log("PI:", Math.PI);\nconsole.log("sqrt(16):", Math.sqrt(16));\nconsole.log("random:", Math.random());\nconsole.log("floor(4.9):", Math.floor(4.9));`,
    children: [
      { key: 'Math.PI', type: 'number', value: '3.141592653589793', description: 'The mathematical constant π (pi), ratio of a circle\'s circumference to its diameter.', snippet: `console.log("PI =", Math.PI);\nconsole.log("Circumference of r=5:", 2 * Math.PI * 5);` },
      { key: 'Math.random()', type: 'function', value: 'ƒ random()', description: 'Returns a random floating-point number in [0, 1).', snippet: `console.log("Random:", Math.random());\nconsole.log("Random 1-10:", Math.floor(Math.random() * 10) + 1);` },
      { key: 'Math.floor()', type: 'function', value: 'ƒ floor()', description: 'Rounds down to the largest integer ≤ x.', snippet: `console.log(Math.floor(4.9));  // 4\nconsole.log(Math.floor(-2.1)); // -3` },
      { key: 'Math.ceil()', type: 'function', value: 'ƒ ceil()', description: 'Rounds up to the smallest integer ≥ x.', snippet: `console.log(Math.ceil(4.1));  // 5\nconsole.log(Math.ceil(-2.9)); // -2` },
      { key: 'Math.round()', type: 'function', value: 'ƒ round()', description: 'Rounds to the nearest integer.', snippet: `console.log(Math.round(4.5)); // 5\nconsole.log(Math.round(4.4)); // 4` },
      { key: 'Math.max() / min()', type: 'function', value: 'ƒ max(...n)', description: 'Returns the largest / smallest of the given numbers.', snippet: `console.log("Max:", Math.max(3, 1, 4, 1, 5, 9));\nconsole.log("Min:", Math.min(3, 1, 4, 1, 5, 9));\n// With array:\nconsole.log("Max of array:", Math.max(...[7, 2, 11, 4]));` },
      { key: 'Math.abs()', type: 'function', value: 'ƒ abs(x)', description: 'Returns the absolute value of x.', snippet: `console.log(Math.abs(-5));  // 5\nconsole.log(Math.abs(3.7)); // 3.7` },
      { key: 'Math.pow() / sqrt()', type: 'function', value: 'ƒ pow(x, y)', description: 'pow(x,y) returns x^y; sqrt(x) returns √x.', snippet: `console.log("2^10 =", Math.pow(2, 10));\nconsole.log("√144 =", Math.sqrt(144));` },
    ],
  },
  // ── Date ────────────────────────────────────────────────────────────────────
  {
    key: 'Date',
    type: 'function',
    value: 'class Date',
    description: 'Represents a single moment in time. Stores time as the number of milliseconds since the Unix epoch (Jan 1 1970 UTC).',
    snippet: `const now = new Date();\nconsole.log("Now:", now.toString());\nconsole.log("ISO:", now.toISOString());\nconsole.log("Timestamp:", Date.now());`,
    children: [
      { key: 'Date.now()', type: 'function', value: 'ƒ now()', description: 'Returns the current time as a Unix timestamp in milliseconds.', snippet: `const ts = Date.now();\nconsole.log("Timestamp:", ts);\nconsole.log("As date:", new Date(ts).toISOString());` },
      { key: 'new Date()', type: 'function', value: 'new Date()', description: 'Creates a new Date object representing the current moment (or a specified time).', snippet: `const d = new Date();\nconsole.log("Year:", d.getFullYear());\nconsole.log("Month:", d.getMonth() + 1); // 0-based!\nconsole.log("Day:", d.getDate());` },
      { key: 'toISOString()', type: 'function', value: 'ƒ toISOString()', description: 'Returns the date in ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ.', snippet: `console.log(new Date().toISOString());` },
      { key: 'toLocaleDateString()', type: 'function', value: 'ƒ toLocaleDateString()', description: 'Returns a locale-appropriate string representation of the date part.', snippet: `const d = new Date();\nconsole.log(d.toLocaleDateString('en-US'));\nconsole.log(d.toLocaleDateString('en-US', {weekday:'long',year:'numeric',month:'long',day:'numeric'}));` },
    ],
  },
  // ── Regexp ──────────────────────────────────────────────────────────────────
  {
    key: 'RegExp',
    type: 'function',
    value: 'class RegExp',
    description: 'Regular expressions for pattern matching in strings.',
    snippet: `const email = /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i;\nconsole.log("Valid email?", email.test("user@example.com"));\nconsole.log("Invalid?", email.test("not-an-email"));`,
    children: [
      { key: 'test()', type: 'function', value: 'ƒ test(str)', description: 'Tests whether a string matches the pattern. Returns boolean.', snippet: `const re = /\\d+/;\nconsole.log(re.test("abc123")); // true\nconsole.log(re.test("abc"));    // false` },
      { key: 'match()', type: 'function', value: 'ƒ str.match(re)', description: 'Returns an array of matches, or null if no match.', snippet: `const str = "2024-04-01";\nconst [full, y, m, d] = str.match(/(\\d{4})-(\\d{2})-(\\d{2})/) ?? [];\nconsole.log("Year:", y, "Month:", m, "Day:", d);` },
      { key: 'replace()', type: 'function', value: 'ƒ str.replace(re, fn)', description: 'Replaces matched substring(s) with a replacement string or function.', snippet: `const str = "Hello World";\nconsole.log(str.replace(/o/g, "0"));  // Hell0 W0rld\nconsole.log(str.replace(/[aeiou]/gi, "*")); // H*ll* W*rld` },
      { key: 'split()', type: 'function', value: 'ƒ str.split(re)', description: 'Splits a string at each match of the pattern.', snippet: `const csv = "alice,bob,,charlie";\nconsole.log(csv.split(/,+/)); // splits by one or more commas` },
    ],
  },
  // ── Error handling ──────────────────────────────────────────────────────────
  {
    key: 'Error',
    type: 'function',
    value: 'class Error',
    description: 'Represents a runtime error. Subclasses include TypeError, RangeError, SyntaxError, and more.',
    snippet: `try {\n  throw new TypeError("Expected a string!");\n} catch (e) {\n  console.error("Name:", e.name);\n  console.error("Message:", e.message);\n  console.log("Is TypeError?", e instanceof TypeError);\n}`,
    children: [
      { key: 'try / catch / finally', type: 'syntax', value: 'try { } catch (e) { }', description: 'Wraps potentially-throwing code. catch receives the error; finally always runs.', snippet: `try {\n  JSON.parse("invalid json {{{");\n} catch (e) {\n  console.error("Parse failed:", e.message);\n} finally {\n  console.log("Cleanup done");\n}` },
      { key: 'Error.message', type: 'string', value: '"error description"', description: 'Human-readable description of the error.', snippet: `const e = new Error("Something went wrong");\nconsole.log(e.message);` },
      { key: 'Error.name', type: 'string', value: '"TypeError"', description: 'The type of the error (e.g., "TypeError", "RangeError").', snippet: `console.log(new TypeError().name);    // TypeError\nconsole.log(new RangeError().name);   // RangeError\nconsole.log(new SyntaxError().name);  // SyntaxError` },
      { key: 'Custom errors', type: 'class', value: 'class MyError extends Error', description: 'You can extend Error to create domain-specific error types.', snippet: `class ValidationError extends Error {\n  constructor(msg) {\n    super(msg);\n    this.name = "ValidationError";\n  }\n}\ntry {\n  throw new ValidationError("Invalid email");\n} catch (e) {\n  console.error(e.name + ":", e.message);\n}` },
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
    if (node.snippet) {
      trackFeatureUsage('Inspector')
      setOutput(runSnippet(node.snippet))
    }
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
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', ...browserObjects.map(n => n.key)]

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

  const categoryFiltered = activeCategory === 'All' ? browserObjects : browserObjects.filter(n => n.key === activeCategory)
  const filtered = filterNodes(categoryFiltered, search.toLowerCase())

  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-5" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Browser API Inspector</h2>
        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
          Explore the complete browser API — window, document, fetch, promises, arrays, objects, and more. Click any entry to see description and try a live snippet.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={
              activeCategory === cat
                ? { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' }
                : { background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }
            }
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <div className="relative">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search properties, methods, descriptions…"
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
