// ─── AI Console data: task recommendations, method explanations, starter snippets ─

export interface MethodRecommendation {
  name: string
  signature: string
  description: string
  example: string
  category: string
}

export interface TaskRecommendation {
  methods: MethodRecommendation[]
  explanation: string
  starterCode: string
}

// Detailed method library used for explanations in the output panel
export const methodLibrary: Record<string, MethodRecommendation> = {
  'Array.filter': {
    name: 'Array.prototype.filter()',
    signature: 'arr.filter(callback(element, index, array))',
    description: 'Creates a new array with all elements that pass the test in the callback. Does NOT mutate the original array.',
    example: 'const evens = [1,2,3,4].filter(n => n % 2 === 0); // [2, 4]',
    category: 'Array',
  },
  'Array.map': {
    name: 'Array.prototype.map()',
    signature: 'arr.map(callback(element, index, array))',
    description: 'Creates a new array populated with the results of calling a function on every element. Returns a new array of the same length.',
    example: 'const doubled = [1,2,3].map(n => n * 2); // [2, 4, 6]',
    category: 'Array',
  },
  'Array.reduce': {
    name: 'Array.prototype.reduce()',
    signature: 'arr.reduce(callback(accumulator, currentValue), initialValue)',
    description: 'Reduces an array to a single value by executing a reducer function on each element, carrying an accumulator.',
    example: 'const sum = [1,2,3,4].reduce((acc, n) => acc + n, 0); // 10',
    category: 'Array',
  },
  'Array.find': {
    name: 'Array.prototype.find()',
    signature: 'arr.find(callback(element, index, array))',
    description: 'Returns the first element that satisfies the provided testing function, or undefined if none found.',
    example: 'const user = users.find(u => u.id === 42);',
    category: 'Array',
  },
  'Array.some': {
    name: 'Array.prototype.some()',
    signature: 'arr.some(callback(element, index, array))',
    description: 'Tests whether at least one element in the array passes the callback test. Returns a boolean.',
    example: 'const hasAdmin = users.some(u => u.role === "admin"); // true/false',
    category: 'Array',
  },
  'Array.every': {
    name: 'Array.prototype.every()',
    signature: 'arr.every(callback(element, index, array))',
    description: 'Tests whether ALL elements in the array pass the callback test. Returns a boolean.',
    example: 'const allAdults = people.every(p => p.age >= 18);',
    category: 'Array',
  },
  'Array.flat': {
    name: 'Array.prototype.flat()',
    signature: 'arr.flat(depth)',
    description: 'Creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.',
    example: '[1,[2,[3]]].flat(Infinity); // [1,2,3]',
    category: 'Array',
  },
  'Array.flatMap': {
    name: 'Array.prototype.flatMap()',
    signature: 'arr.flatMap(callback)',
    description: 'Maps each element using a mapping function, then flattens the result by one level. More efficient than map + flat.',
    example: '[1,2,3].flatMap(n => [n, n*2]); // [1,2,2,4,3,6]',
    category: 'Array',
  },
  'Array.sort': {
    name: 'Array.prototype.sort()',
    signature: 'arr.sort(compareFunction)',
    description: 'Sorts the array IN PLACE. Always pass a comparator for numbers: (a,b) => a-b. Default sort is lexicographic (string-based).',
    example: '[3,1,2].sort((a,b) => a-b); // [1,2,3]',
    category: 'Array',
  },
  'Object.keys': {
    name: 'Object.keys()',
    signature: 'Object.keys(obj)',
    description: 'Returns an array of a given object\'s own enumerable string-keyed property names.',
    example: 'Object.keys({a:1, b:2}); // ["a","b"]',
    category: 'Object',
  },
  'Object.values': {
    name: 'Object.values()',
    signature: 'Object.values(obj)',
    description: 'Returns an array of a given object\'s own enumerable string-keyed property values.',
    example: 'Object.values({a:1, b:2}); // [1,2]',
    category: 'Object',
  },
  'Object.entries': {
    name: 'Object.entries()',
    signature: 'Object.entries(obj)',
    description: 'Returns an array of [key, value] pairs for all own enumerable string-keyed properties.',
    example: 'Object.entries({a:1,b:2}); // [["a",1],["b",2]]',
    category: 'Object',
  },
  'Object.assign': {
    name: 'Object.assign()',
    signature: 'Object.assign(target, ...sources)',
    description: 'Copies all own enumerable properties from source objects to the target. Returns the target. Performs a shallow merge.',
    example: 'const merged = Object.assign({}, defaults, userOptions);',
    category: 'Object',
  },
  'structuredClone': {
    name: 'structuredClone()',
    signature: 'structuredClone(value)',
    description: 'Creates a deep clone of a value using the structured clone algorithm. Works with objects, arrays, Maps, Sets, Dates, and more.',
    example: 'const deepCopy = structuredClone({ a: { b: 1 } });',
    category: 'Object',
  },
  'Promise.all': {
    name: 'Promise.all()',
    signature: 'Promise.all(iterable)',
    description: 'Takes an iterable of Promises and returns a Promise that resolves when ALL input Promises resolve, or rejects when ANY rejects.',
    example: 'const [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);',
    category: 'Async',
  },
  'Promise.allSettled': {
    name: 'Promise.allSettled()',
    signature: 'Promise.allSettled(iterable)',
    description: 'Returns a Promise that resolves after all given Promises have either fulfilled or rejected, with an array of outcome objects.',
    example: 'const results = await Promise.allSettled([p1, p2, p3]);',
    category: 'Async',
  },
  'fetch': {
    name: 'fetch()',
    signature: 'fetch(url, options)',
    description: 'Initiates a network request and returns a Promise that resolves to the Response. Must call .json(), .text(), or .blob() to read the body.',
    example: 'const data = await fetch("/api/users").then(r => r.json());',
    category: 'Network',
  },
  'console.table': {
    name: 'console.table()',
    signature: 'console.table(data, columns)',
    description: 'Displays tabular data as a table in the console. Especially useful for arrays of objects — each property becomes a column.',
    example: 'console.table([{name:"Alice",age:30},{name:"Bob",age:25}]);',
    category: 'Console',
  },
  'console.group': {
    name: 'console.group() / console.groupEnd()',
    signature: 'console.group(label)',
    description: 'Creates a new inline group in the console output, indenting subsequent messages. Call groupEnd() to close it.',
    example: 'console.group("User"); console.log(user); console.groupEnd();',
    category: 'Console',
  },
  'console.time': {
    name: 'console.time() / console.timeEnd()',
    signature: 'console.time(label)',
    description: 'Starts a timer with the given label. Call console.timeEnd(label) to stop it and print the elapsed time to the console.',
    example: 'console.time("sort"); arr.sort(); console.timeEnd("sort");',
    category: 'Console',
  },
  'setTimeout': {
    name: 'setTimeout()',
    signature: 'setTimeout(callback, delay, ...args)',
    description: 'Schedules a function to execute after a given delay (in milliseconds). Returns a timer ID you can pass to clearTimeout().',
    example: 'const id = setTimeout(() => console.log("done"), 1000);',
    category: 'Async',
  },
  'setInterval': {
    name: 'setInterval()',
    signature: 'setInterval(callback, interval, ...args)',
    description: 'Repeatedly calls a function with a fixed time delay between each invocation. Returns an interval ID for clearInterval().',
    example: 'const id = setInterval(() => console.log("tick"), 500);',
    category: 'Async',
  },
  'JSON.stringify': {
    name: 'JSON.stringify()',
    signature: 'JSON.stringify(value, replacer, space)',
    description: 'Converts a JavaScript value to a JSON string. Use the third argument to pretty-print with indentation.',
    example: 'JSON.stringify({a:1}, null, 2); // formatted JSON string',
    category: 'Utility',
  },
  'JSON.parse': {
    name: 'JSON.parse()',
    signature: 'JSON.parse(text, reviver)',
    description: 'Parses a JSON string and returns the corresponding JavaScript value. Throws SyntaxError if invalid.',
    example: 'const obj = JSON.parse(\'{"name":"Alice"}\');',
    category: 'Utility',
  },
}

// Task → recommended methods and starter code
export function getTaskRecommendation(task: string): TaskRecommendation {
  const t = task.toLowerCase()

  if (t.includes('filter') || t.includes('search') || t.includes('find element') || t.includes('find item')) {
    return {
      methods: [methodLibrary['Array.filter'], methodLibrary['Array.find'], methodLibrary['Array.some']],
      explanation: 'To search or filter a collection, use `filter()` for multiple matches, `find()` for the first match, or `some()` to check if any element satisfies a condition.',
      starterCode: `const people = [
  { name: "Alice", age: 30, role: "admin" },
  { name: "Bob",   age: 25, role: "user"  },
  { name: "Carol", age: 35, role: "admin" },
];

// Filter: get all admins
const admins = people.filter(p => p.role === "admin");
console.log("Admins:", admins);

// Find: first person over 28
const senior = people.find(p => p.age > 28);
console.log("First senior:", senior);

// Some: does anyone have role "admin"?
const hasAdmin = people.some(p => p.role === "admin");
console.log("Has admin:", hasAdmin);`,
    }
  }

  if (t.includes('transform') || t.includes('map') || t.includes('convert') || t.includes('format')) {
    return {
      methods: [methodLibrary['Array.map'], methodLibrary['Array.flatMap']],
      explanation: 'To transform each element of an array, use `map()`. For flattening while mapping (e.g. one-to-many transforms), `flatMap()` is more efficient.',
      starterCode: `const prices = [10, 25, 5, 99, 3];

// Map: apply 10% discount
const discounted = prices.map(p => +(p * 0.9).toFixed(2));
console.log("Discounted:", discounted);

// Map: format as currency strings
const formatted = prices.map(p => \`$\${p.toFixed(2)}\`);
console.log("Formatted:", formatted);

// FlatMap: one item → multiple
const tags = ["js ts", "html css"].flatMap(s => s.split(" "));
console.log("Tags:", tags);`,
    }
  }

  if (t.includes('sum') || t.includes('total') || t.includes('aggregate') || t.includes('reduce') || t.includes('count')) {
    return {
      methods: [methodLibrary['Array.reduce'], methodLibrary['Array.every'], methodLibrary['Array.some']],
      explanation: '`reduce()` is the Swiss Army knife for aggregation — sums, products, grouping, and building objects from arrays. For checking conditions across all items use `every()`.',
      starterCode: `const orders = [
  { product: "Widget",  qty: 3, price: 9.99  },
  { product: "Gadget",  qty: 1, price: 49.99 },
  { product: "Doohick", qty: 5, price: 4.99  },
];

// Reduce: total revenue
const total = orders.reduce((sum, o) => sum + o.qty * o.price, 0);
console.log("Total revenue: $" + total.toFixed(2));

// Reduce: group by first letter
const grouped = orders.reduce((acc, o) => {
  const key = o.product[0];
  (acc[key] = acc[key] || []).push(o.product);
  return acc;
}, {});
console.log("Grouped:", grouped);`,
    }
  }

  if (t.includes('sort') || t.includes('order') || t.includes('rank')) {
    return {
      methods: [methodLibrary['Array.sort'], methodLibrary['Array.map']],
      explanation: '`sort()` mutates the original array and defaults to string comparison — always provide a numeric comparator `(a,b) => a-b`. For immutable sort, spread first: `[...arr].sort(...)`.',
      starterCode: `const scores = [
  { name: "Alice", score: 88 },
  { name: "Bob",   score: 95 },
  { name: "Carol", score: 72 },
  { name: "Dave",  score: 91 },
];

// Sort descending by score (immutable copy)
const ranked = [...scores].sort((a, b) => b.score - a.score);
console.log("Ranking:");
ranked.forEach((s, i) => console.log(\`  \${i+1}. \${s.name}: \${s.score}\`));

// Numeric array sort pitfall
const nums = [10, 9, 100, 2];
console.log("Wrong (default):", [...nums].sort());
console.log("Correct:",         [...nums].sort((a,b) => a-b));`,
    }
  }

  if (t.includes('object') || t.includes('key') || t.includes('propert') || t.includes('merge') || t.includes('clone')) {
    return {
      methods: [methodLibrary['Object.keys'], methodLibrary['Object.entries'], methodLibrary['Object.assign'], methodLibrary['structuredClone']],
      explanation: 'Use `Object.keys/values/entries` to iterate an object\'s properties. Use spread `{...obj}` or `Object.assign()` for shallow merges, and `structuredClone()` for deep copies.',
      starterCode: `const config = { theme: "dark", lang: "en", debug: false };
const overrides = { lang: "fr", debug: true, extra: 42 };

// Keys, values, entries
console.log("Keys:",    Object.keys(config));
console.log("Values:",  Object.values(config));
console.log("Entries:", Object.entries(config));

// Shallow merge (spread)
const merged = { ...config, ...overrides };
console.log("Merged:", merged);

// Deep clone
const deep = structuredClone({ nested: { value: [1,2,3] } });
deep.nested.value.push(4);
console.log("Deep clone independent:", deep.nested.value);`,
    }
  }

  if (t.includes('async') || t.includes('await') || t.includes('promise') || t.includes('fetch') || t.includes('api')) {
    return {
      methods: [methodLibrary['Promise.all'], methodLibrary['Promise.allSettled'], methodLibrary['fetch']],
      explanation: 'Async/await is syntactic sugar over Promises. Use `Promise.all()` to run requests in parallel. `fetch()` returns a Response — always check `response.ok` before parsing.',
      starterCode: `// Simulated async operations
function fakeApi(id, delay = 200) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ id, data: \`Result \${id}\` }), delay)
  );
}

async function main() {
  console.log("Running sequentially...");
  const a = await fakeApi(1);
  const b = await fakeApi(2);
  console.log("Sequential:", a.data, b.data);

  console.log("Running in parallel...");
  const [c, d] = await Promise.all([fakeApi(3), fakeApi(4)]);
  console.log("Parallel:", c.data, d.data);

  // allSettled handles partial failures
  const results = await Promise.allSettled([
    fakeApi(5),
    Promise.reject(new Error("Network error")),
    fakeApi(7),
  ]);
  results.forEach(r => console.log(r.status, r.status === "fulfilled" ? r.value.data : r.reason.message));
}

main();`,
    }
  }

  if (t.includes('class') || t.includes('oop') || t.includes('inherit') || t.includes('object orient')) {
    return {
      methods: [
        { name: 'class / extends', signature: 'class Derived extends Base { }', description: 'Defines a class. Use extends for inheritance. Call super() in the constructor to invoke the parent constructor.', example: 'class Dog extends Animal { constructor(name) { super(name); } }', category: 'OOP' },
        { name: 'static methods', signature: 'static methodName() { }', description: 'Defines a method on the class itself, not on instances. Called as ClassName.method(), not instance.method().', example: 'class MathUtils { static square(n) { return n * n; } }', category: 'OOP' },
      ],
      explanation: 'JavaScript uses prototype-based inheritance. `class` syntax is sugar over prototypes. Use `extends` to inherit, `super` to access the parent, and `static` for class-level utilities.',
      starterCode: `class Shape {
  constructor(color) {
    this.color = color;
  }
  describe() {
    return \`A \${this.color} \${this.constructor.name}\`;
  }
  static compare(a, b) {
    return a.area() - b.area();
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
  constructor(color, w, h) {
    super(color);
    this.w = w; this.h = h;
  }
  area() { return this.w * this.h; }
}

const c = new Circle("red", 5);
const r = new Rectangle("blue", 4, 6);

console.log(c.describe(), "- area:", c.area().toFixed(2));
console.log(r.describe(), "- area:", r.area());
console.log("Larger:", Shape.compare(c, r) > 0 ? c.describe() : r.describe());`,
    }
  }

  if (t.includes('string') || t.includes('text') || t.includes('regex') || t.includes('pattern') || t.includes('replace')) {
    return {
      methods: [
        { name: 'String.prototype.replace()', signature: 'str.replace(searchValue, replaceValue)', description: 'Returns a new string with one (or all, with /g flag) match(es) replaced. Supports RegExp patterns for advanced matching.', example: '"hello world".replace(/o/g, "0"); // "hell0 w0rld"', category: 'String' },
        { name: 'String.prototype.split()', signature: 'str.split(separator, limit)', description: 'Splits a string into an array of substrings. Split on a character, string, or RegExp.', example: '"a,b,c".split(","); // ["a","b","c"]', category: 'String' },
        { name: 'String.prototype.match()', signature: 'str.match(regexp)', description: 'Returns an array of matches against a RegExp. With the /g flag, returns all matches. Without /g, returns the first match with capture groups.', example: '"abc123def456".match(/\\d+/g); // ["123","456"]', category: 'String' },
      ],
      explanation: 'String manipulation in JS uses methods like `replace()`, `split()`, `includes()`, `startsWith()`, and regular expressions. Template literals (backticks) let you embed expressions directly.',
      starterCode: `const sentence = "The quick brown fox jumps over the lazy dog";

// Basic operations
console.log("Upper:", sentence.toUpperCase());
console.log("Words:", sentence.split(" ").length);
console.log("Includes 'fox':", sentence.includes("fox"));

// Replace with regex
const vowels = sentence.replace(/[aeiou]/gi, "*");
console.log("No vowels:", vowels);

// Extract all words 4+ letters
const longWords = sentence.match(/\\b[a-z]{4,}\\b/gi);
console.log("Long words:", longWords);

// Template literal
const name = "Alice";
const score = 95;
console.log(\`\${name} scored \${score}/100 — \${score >= 90 ? "Excellent!" : "Good job!"}\`);`,
    }
  }

  // default / general
  return {
    methods: [methodLibrary['Array.map'], methodLibrary['Array.filter'], methodLibrary['Object.entries']],
    explanation: 'Here are some universally useful methods. Describe your task more specifically (e.g. "filter an array", "merge objects", "async fetch data") for targeted recommendations.',
    starterCode: `// General JavaScript exploration
const data = [
  { id: 1, name: "Alice", score: 88, active: true  },
  { id: 2, name: "Bob",   score: 72, active: false },
  { id: 3, name: "Carol", score: 95, active: true  },
];

// Map: extract names
const names = data.map(d => d.name);
console.log("Names:", names);

// Filter: only active users
const active = data.filter(d => d.active);
console.log("Active:", active.map(d => d.name));

// Object.entries to iterate config
const config = { theme: "dark", version: "2.0", lang: "en" };
Object.entries(config).forEach(([k, v]) => console.log(\`  \${k}: \${v}\`));`,
  }
}

// Console output type colors / labels
export const outputTypeConfig = {
  log:   { label: 'log',   colorVar: 'var(--foreground)',         bgVar: 'var(--color-card)' },
  error: { label: 'error', colorVar: '#f87171',                   bgVar: 'rgba(239,68,68,0.08)' },
  warn:  { label: 'warn',  colorVar: '#fbbf24',                   bgVar: 'rgba(251,191,36,0.08)' },
  info:  { label: 'info',  colorVar: 'var(--color-accent)',       bgVar: 'color-mix(in srgb, var(--color-accent) 8%, transparent)' },
  table: { label: 'table', colorVar: '#34d399',                   bgVar: 'rgba(52,211,153,0.08)' },
  group: { label: 'group', colorVar: 'var(--foreground-muted)',   bgVar: 'var(--color-bg)' },
  clear: { label: 'clear', colorVar: 'var(--foreground-muted)',   bgVar: 'var(--color-bg)' },
} as const

// Curated starter tasks shown as quick-pick chips
export const starterTasks = [
  'Filter and search an array',
  'Transform data with map()',
  'Aggregate with reduce()',
  'Sort and rank items',
  'Merge and clone objects',
  'Run async operations',
  'Work with classes & OOP',
  'Manipulate strings & regex',
]

// Contextual output explanation generator
export function explainOutput(type: string, content: string): string {
  if (type === 'error') {
    if (content.includes('is not defined')) return `ReferenceError: the variable or function you used hasn't been declared in scope. Check for typos or declare it before use.`
    if (content.includes('is not a function')) return `TypeError: you're trying to call something that isn't a function. Check the variable type and method name.`
    if (content.includes('Cannot read prop')) return `TypeError: trying to access a property on null or undefined. Add an optional chain (?.) or check the value first.`
    return `An error was thrown. Check the message above for the cause and the line number if available.`
  }
  if (type === 'warn') return `A warning was logged. Warnings don't stop execution but usually indicate a potential issue worth investigating.`
  if (type === 'table') return `console.table() renders array/object data in a tabular format — great for comparing records side by side.`
  if (type === 'group') return `console.group() starts a collapsible group. Related logs inside a group stay visually organised.`
  if (content.startsWith('timer')) return `console.time() / console.timeEnd() measures elapsed time between two points in your code.`

  // Detect common patterns in the output
  if (content.startsWith('[') || content.startsWith('{')) return `This is a serialised object/array. Use console.table() for arrays of objects, or JSON.stringify(val, null, 2) for pretty-printing.`
  if (!isNaN(Number(content))) return `Numeric result. In JS, all numbers are IEEE 754 doubles. Be aware of floating-point precision (e.g. 0.1 + 0.2 !== 0.3).`
  if (content === 'true' || content === 'false') return `Boolean value. In conditionals, watch for truthy/falsy distinctions — e.g. 0, "", null, undefined are all falsy.`
  if (content === 'undefined') return `undefined means the value was never assigned or the function returned implicitly. Distinct from null, which is an intentional empty value.`
  if (content === 'null') return `null is an intentional absence of value. Use === null to check for it (typeof null is "object" — a known quirk).`

  return `console.log() outputs a string representation. For rich inspection, try console.table(arr) for arrays or JSON.stringify(obj, null, 2) for objects.`
}
