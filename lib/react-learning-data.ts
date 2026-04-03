export interface ReactExample {
  title: string
  description: string
  code: string
  preview?: string // HTML string for live preview (React DOM examples)
}

export interface ReactCategory {
  id: string
  name: string
  examples: ReactExample[]
}

export interface ReactPlatform {
  id: 'react-dom' | 'react-native'
  name: string
  tagline: string
  categories: ReactCategory[]
}

// ─── React DOM ────────────────────────────────────────────────────────────────

export const reactDOMPlatform: ReactPlatform = {
  id: 'react-dom',
  name: 'React DOM',
  tagline: 'Build web applications with React and the DOM',
  categories: [
    {
      id: 'basics',
      name: 'Basics',
      examples: [
        {
          title: 'Hello World',
          description: 'The simplest React component — a function that returns JSX. React renders JSX into actual DOM nodes via ReactDOM.createRoot().',
          code: `import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Welcome to React DOM.</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
          preview: `<div style="font-family:sans-serif;padding:16px"><h1 style="margin:0 0 8px">Hello, World!</h1><p style="margin:0;color:#64748b">Welcome to React DOM.</p></div>`,
        },
        {
          title: 'JSX Fundamentals',
          description: 'JSX is a syntax extension for JavaScript that looks like HTML. Babel transpiles JSX into React.createElement() calls at build time.',
          code: `function Profile() {
  const name = 'Alice';
  const role = 'Engineer';
  const avatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice';

  return (
    <div className="profile">
      {/* JSX comment — curly braces embed JS expressions */}
      <img src={avatarUrl} alt={name} width={64} />
      <h2>{name}</h2>
      <p>Role: <strong>{role}</strong></p>
      <p>Year joined: {new Date().getFullYear()}</p>
    </div>
  );
}

export default Profile;`,
          preview: `<div style="font-family:sans-serif;padding:16px;display:flex;align-items:center;gap:12px"><div style="width:64px;height:64px;border-radius:50%;background:#e0e7ff;display:flex;align-items:center;justify-content:center;font-size:28px">👩‍💻</div><div><h2 style="margin:0 0 4px">Alice</h2><p style="margin:0;color:#64748b">Role: <strong>Engineer</strong></p></div></div>`,
        },
        {
          title: 'Conditional Rendering',
          description: 'React renders nothing for false, null, and undefined. Use the ternary operator or logical && to render content conditionally.',
          code: `function StatusBadge({ status }) {
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 12,
        background: status === 'active' ? '#d1fae5' : '#fee2e2',
        color: status === 'active' ? '#065f46' : '#991b1b',
      }}
    >
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}

function UserCard({ user }) {
  return (
    <div>
      <p>{user.name}</p>
      <StatusBadge status={user.status} />
      {user.isAdmin && <span> · Admin</span>}
    </div>
  );
}

const user = { name: 'Bob', status: 'active', isAdmin: true };`,
          preview: `<div style="font-family:sans-serif;padding:16px"><div style="display:flex;align-items:center;gap:8px"><p style="margin:0;font-weight:500">Bob</p><span style="padding:2px 8px;border-radius:12px;font-size:12px;background:#d1fae5;color:#065f46">Active</span><span style="color:#64748b;font-size:13px"> · Admin</span></div></div>`,
        },
        {
          title: 'Lists & Keys',
          description: 'Render arrays with .map(). Every list item needs a unique key prop so React can efficiently update the DOM.',
          code: `const fruits = [
  { id: 1, name: 'Apple',  emoji: '🍎' },
  { id: 2, name: 'Banana', emoji: '🍌' },
  { id: 3, name: 'Cherry', emoji: '🍒' },
];

function FruitList() {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {fruits.map(fruit => (
        // key must be a unique, stable string/number
        <li key={fruit.id} style={{ padding: '4px 0' }}>
          {fruit.emoji} {fruit.name}
        </li>
      ))}
    </ul>
  );
}

export default FruitList;`,
          preview: `<div style="font-family:sans-serif;padding:16px"><ul style="list-style:none;padding:0;margin:0"><li style="padding:4px 0">🍎 Apple</li><li style="padding:4px 0">🍌 Banana</li><li style="padding:4px 0">🍒 Cherry</li></ul></div>`,
        },
      ],
    },
    {
      id: 'components',
      name: 'Components',
      examples: [
        {
          title: 'Props',
          description: 'Props are read-only inputs passed to components. They flow one-way from parent to child, keeping data predictable.',
          code: `// Receive props via destructuring
function Button({ label, variant = 'primary', onClick }) {
  const styles = {
    primary:   { background: '#6366f1', color: '#fff' },
    secondary: { background: '#f1f5f9', color: '#334155' },
    danger:    { background: '#ef4444', color: '#fff' },
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: '8px 16px',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  );
}

// Parent passes props to child
function App() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button label="Save" variant="primary" onClick={() => alert('Saved!')} />
      <Button label="Cancel" variant="secondary" />
      <Button label="Delete" variant="danger" />
    </div>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px;display:flex;gap:8px"><button style="background:#6366f1;color:#fff;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-weight:500">Save</button><button style="background:#f1f5f9;color:#334155;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-weight:500">Cancel</button><button style="background:#ef4444;color:#fff;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-weight:500">Delete</button></div>`,
        },
        {
          title: 'Component Composition',
          description: 'Build complex UIs by composing small, focused components. The children prop lets you pass JSX content into a component like HTML nesting.',
          code: `function Card({ title, children }) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: 16,
        maxWidth: 300,
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
      {children}
    </div>
  );
}

function App() {
  return (
    <Card title="User Profile">
      <p>Name: Alice</p>
      <p>Email: alice@example.com</p>
      <button>Edit Profile</button>
    </Card>
  );
}

export default App;`,
          preview: `<div style="font-family:sans-serif;padding:16px"><div style="border:1px solid #e2e8f0;border-radius:8px;padding:16px;max-width:300px"><h3 style="margin:0 0 8px">User Profile</h3><p style="margin:2px 0">Name: Alice</p><p style="margin:2px 0">Email: alice@example.com</p><button style="margin-top:8px;padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer;background:#f8fafc">Edit Profile</button></div></div>`,
        },
        {
          title: 'Default & Named Exports',
          description: 'A file can have one default export (the main component) and multiple named exports (utilities, sub-components).',
          code: `// utils.js — named exports
export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency,
  }).format(amount);
}

// Invoice.jsx — default export
import { formatDate, formatCurrency } from './utils';

function Invoice({ items, date }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <p>Date: {formatDate(date)}</p>
      {items.map(item => (
        <p key={item.id}>{item.name}: {formatCurrency(item.price)}</p>
      ))}
      <strong>Total: {formatCurrency(total)}</strong>
    </div>
  );
}

export default Invoice;`,
          preview: `<div style="font-family:sans-serif;padding:16px"><p style="margin:2px 0">Date: January 1, 2025</p><p style="margin:2px 0">Widget A: $10.00</p><p style="margin:2px 0">Widget B: $25.00</p><p style="margin:8px 0 0"><strong>Total: $35.00</strong></p></div>`,
        },
      ],
    },
    {
      id: 'hooks',
      name: 'Hooks',
      examples: [
        {
          title: 'useState',
          description: 'useState returns a state value and a setter. Calling the setter triggers a re-render with the new value. Never mutate state directly.',
          code: `import { useState } from 'react';

function Counter() {
  // [currentValue, updaterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Object state — spread to avoid mutation
function Form() {
  const [form, setForm] = useState({ name: '', email: '' });

  const update = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <form>
      <input value={form.name}  onChange={e => update('name',  e.target.value)} placeholder="Name" />
      <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="Email" />
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </form>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><p>Count: <strong>0</strong></p><div style="display:flex;gap:8px"><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">Increment</button><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">Decrement</button><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">Reset</button></div></div>`,
        },
        {
          title: 'useEffect',
          description: 'useEffect runs side effects after render. The dependency array controls when it re-runs. Return a cleanup function to avoid memory leaks.',
          code: `import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  // Effect with cleanup — stops the interval when component unmounts
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => s + 1); // functional update avoids stale closure
    }, 1000);

    return () => clearInterval(id); // cleanup
  }, []); // empty array = run once on mount

  return <p>Elapsed: {seconds}s</p>;
}

// Fetching data on mount
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]); // re-run when userId changes

  if (loading) return <p>Loading...</p>;
  return <p>User: {user.name}</p>;
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><p style="margin:0 0 8px">Elapsed: 0s</p><p style="margin:0;color:#64748b;font-size:13px">(timer starts when component mounts)</p></div>`,
        },
        {
          title: 'useRef',
          description: 'useRef holds a mutable value that persists across renders without triggering re-renders. Use it to access DOM nodes or store previous values.',
          code: `import { useRef, useEffect, useState } from 'react';

// Access a DOM element directly
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Auto-focused on mount" />;
}

// Store a previous value
function PreviousValue({ value }) {
  const prevRef = useRef(undefined);

  useEffect(() => {
    prevRef.current = value;
  });

  return (
    <p>
      Current: {value} | Previous: {prevRef.current ?? 'none'}
    </p>
  );
}

// Count renders without re-rendering
function RenderCounter() {
  const renderCount = useRef(0);
  const [count, setCount] = useState(0);

  renderCount.current += 1;

  return (
    <div>
      <p>State: {count} | Renders: {renderCount.current}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><input placeholder="Auto-focused on mount" style="padding:8px;border:1px solid #cbd5e1;border-radius:4px;width:220px" /><p style="margin:12px 0 4px">State: 0 | Renders: 1</p><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">Increment</button></div>`,
        },
        {
          title: 'useContext',
          description: 'Context lets you pass data through the component tree without prop drilling. createContext + Provider + useContext work together.',
          code: `import { createContext, useContext, useState } from 'react';

// 1. Create a context with a default value
const ThemeContext = createContext('light');

// 2. A custom hook to consume the context
function useTheme() {
  return useContext(ThemeContext);
}

// 3. A component that reads from context
function ThemedButton({ children }) {
  const theme = useTheme();
  return (
    <button
      style={{
        background: theme === 'dark' ? '#1e293b' : '#f1f5f9',
        color:      theme === 'dark' ? '#f8fafc'  : '#0f172a',
        padding: '8px 16px',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

// 4. Provide the context value from a parent
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <ThemedButton>Hello from context</ThemedButton>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
    </ThemeContext.Provider>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px;display:flex;gap:8px;align-items:center"><button style="background:#f1f5f9;color:#0f172a;padding:8px 16px;border:none;border-radius:6px;cursor:pointer">Hello from context</button><button style="padding:8px 16px;border:1px solid #cbd5e1;border-radius:6px;cursor:pointer;background:transparent">Toggle theme</button></div>`,
        },
        {
          title: 'useMemo & useCallback',
          description: 'useMemo memoizes expensive computed values; useCallback memoizes functions. Both help avoid unnecessary recalculations and re-renders.',
          code: `import { useState, useMemo, useCallback, memo } from 'react';

// memo — only re-renders when props change
const ExpensiveList = memo(function ExpensiveList({ items, onSelect }) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onSelect(item)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const allItems = [
    { id: 1, name: 'Apple' }, { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' }, { id: 4, name: 'Date' },
  ];

  // Only recalculate when query changes
  const filtered = useMemo(
    () => allItems.filter(i => i.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  // Stable function reference — won't cause ExpensiveList to re-render
  const handleSelect = useCallback(item => {
    setSelected(item);
  }, []);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter..." />
      {selected && <p>Selected: {selected.name}</p>}
      <ExpensiveList items={filtered} onSelect={handleSelect} />
    </div>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><input placeholder="Filter..." style="padding:8px;border:1px solid #cbd5e1;border-radius:4px;width:200px;margin-bottom:8px" /><ul style="padding-left:16px;margin:4px 0"><li style="cursor:pointer;padding:2px 0">Apple</li><li style="cursor:pointer;padding:2px 0">Banana</li><li style="cursor:pointer;padding:2px 0">Cherry</li><li style="cursor:pointer;padding:2px 0">Date</li></ul></div>`,
        },
        {
          title: 'Custom Hooks',
          description: 'Extract reusable stateful logic into custom hooks — functions starting with "use" that can call other hooks.',
          code: `import { useState, useEffect } from 'react';

// useLocalStorage — persists state in localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStored = newValue => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStored];
}

// useFetch — generic data fetcher
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`);
        return r.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light');

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle
      </button>
    </div>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><p style="margin:0 0 8px">Current theme: light</p><button style="padding:8px 16px;border:1px solid #cbd5e1;border-radius:6px;cursor:pointer;background:transparent">Toggle</button></div>`,
        },
      ],
    },
    {
      id: 'forms',
      name: 'Forms',
      examples: [
        {
          title: 'Controlled Inputs',
          description: 'Controlled components keep form data in React state. React is the single source of truth — every keystroke goes through state.',
          code: `import { useState } from 'react';

function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault(); // prevent page reload
    if (!form.email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    alert(\`Logging in as \${form.email}\`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}>
      <input name="email"    type="email"    value={form.email}    onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
      {error && <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>}
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;`,
          preview: `<div style="font-family:sans-serif;padding:16px"><form style="display:flex;flex-direction:column;gap:8px;max-width:280px"><input type="email" placeholder="Email" style="padding:8px;border:1px solid #cbd5e1;border-radius:4px" /><input type="password" placeholder="Password" style="padding:8px;border:1px solid #cbd5e1;border-radius:4px" /><button type="submit" style="padding:8px 16px;background:#6366f1;color:#fff;border:none;border-radius:4px;cursor:pointer">Log In</button></form></div>`,
        },
        {
          title: 'Select, Checkbox & Radio',
          description: 'All form elements follow the same controlled pattern: value/checked from state, onChange to update it.',
          code: `import { useState } from 'react';

function PreferencesForm() {
  const [country, setCountry]       = useState('us');
  const [newsletter, setNewsletter] = useState(true);
  const [plan, setPlan]             = useState('free');

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Select */}
      <label>
        Country:
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
        </select>
      </label>

      {/* Checkbox */}
      <label>
        <input
          type="checkbox"
          checked={newsletter}
          onChange={e => setNewsletter(e.target.checked)}
        />
        {' '}Subscribe to newsletter
      </label>

      {/* Radio group */}
      <fieldset>
        <legend>Plan</legend>
        {['free', 'pro', 'enterprise'].map(p => (
          <label key={p} style={{ display: 'block' }}>
            <input type="radio" value={p} checked={plan === p} onChange={() => setPlan(p)} />
            {' '}{p.charAt(0).toUpperCase() + p.slice(1)}
          </label>
        ))}
      </fieldset>

      <pre>{JSON.stringify({ country, newsletter, plan }, null, 2)}</pre>
    </form>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><form style="display:flex;flex-direction:column;gap:10px"><label>Country: <select style="margin-left:4px;padding:4px"><option>United States</option><option>United Kingdom</option><option>Canada</option></select></label><label><input type="checkbox" checked readonly /> Subscribe to newsletter</label><fieldset style="border:1px solid #cbd5e1;border-radius:4px;padding:8px"><legend>Plan</legend><label style="display:block"><input type="radio" checked readonly /> Free</label><label style="display:block"><input type="radio" /> Pro</label><label style="display:block"><input type="radio" /> Enterprise</label></fieldset></form></div>`,
        },
      ],
    },
    {
      id: 'routing',
      name: 'Routing',
      examples: [
        {
          title: 'React Router Basics',
          description: 'React Router v6 uses component-based routing. Routes render components based on the URL path without full page reloads.',
          code: `import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <nav>
        <Link to="/users/1">User 1</Link> | <Link to="/users/2">User 2</Link>
      </nav>
    </div>
  );
}

function UserDetail() {
  const { id } = useParams(); // extract :id from URL
  return <h2>User #{id}</h2>;
}

function NotFound() {
  return <h2>404 — Page not found</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*"        element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,
          preview: `<div style="font-family:sans-serif;padding:16px"><nav style="margin-bottom:12px"><a href="#" style="color:#6366f1;text-decoration:none">Home</a> | <a href="#" style="color:#6366f1;text-decoration:none">About</a></nav><h2 style="margin:0 0 8px">Home</h2><nav><a href="#" style="color:#6366f1;text-decoration:none">User 1</a> | <a href="#" style="color:#6366f1;text-decoration:none">User 2</a></nav></div>`,
        },
        {
          title: 'Next.js App Router',
          description: 'Next.js App Router uses the filesystem as routes. Folders map to URL segments; page.tsx files define the UI for each route.',
          code: `// app/layout.tsx — root layout wraps every page
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/page.tsx — renders at /
export default function HomePage() {
  return <h1>Welcome to Next.js</h1>;
}

// app/blog/[slug]/page.tsx — renders at /blog/:slug
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>;
}

// Fetch data server-side (no useEffect needed)
async function getData(slug) {
  const res = await fetch(\`https://api.example.com/posts/\${slug}\`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export default async function BlogPost({ params }) {
  const post = await getData(params.slug);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;font-family:monospace;font-size:13px;margin-bottom:12px"><div>app/</div><div style="padding-left:16px">├── layout.tsx</div><div style="padding-left:16px">├── page.tsx</div><div style="padding-left:16px">└── blog/</div><div style="padding-left:32px">└── [slug]/</div><div style="padding-left:48px">└── page.tsx</div></div><p style="margin:0;color:#64748b;font-size:13px">Filesystem = URL structure in Next.js App Router</p></div>`,
        },
      ],
    },
    {
      id: 'state-management',
      name: 'State Management',
      examples: [
        {
          title: 'useReducer',
          description: 'useReducer is better than useState for complex state logic. A pure reducer function maps (state, action) → newState.',
          code: `import { useReducer } from 'react';

const initialState = { count: 0, history: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1, history: [...state.history, '+1'] };
    case 'decrement':
      return { count: state.count - 1, history: [...state.history, '-1'] };
    case 'reset':
      return initialState;
    case 'add':
      return { count: state.count + action.amount, history: [...state.history, \`+\${action.amount}\`] };
    default:
      throw new Error(\`Unknown action: \${action.type}\`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: <strong>{state.count}</strong></p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
        <button onClick={() => dispatch({ type: 'add', amount: 10 })}>+10</button>
        <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>
      <p>History: {state.history.join(', ') || 'none'}</p>
    </div>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><p>Count: <strong>0</strong></p><div style="display:flex;gap:8px;margin-bottom:8px"><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">+1</button><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">-1</button><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">+10</button><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">Reset</button></div><p style="margin:0;color:#64748b">History: none</p></div>`,
        },
        {
          title: 'Zustand Store',
          description: 'Zustand is a minimal, fast state management library. A store holds state and actions; components subscribe with a selector hook.',
          code: `import { create } from 'zustand';

// Define the store — state + actions in one place
const useCartStore = create(set => ({
  items: [],
  total: 0,

  addItem: item => set(state => {
    const existing = state.items.find(i => i.id === item.id);
    const items = existing
      ? state.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      : [...state.items, { ...item, qty: 1 }];
    return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
  }),

  removeItem: id => set(state => {
    const items = state.items.filter(i => i.id !== id);
    return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
  }),

  clear: () => set({ items: [], total: 0 }),
}));

// Components subscribe to only the slices they need
function CartSummary() {
  const total = useCartStore(state => state.total);
  const count = useCartStore(state => state.items.length);
  return <p>Cart: {count} items — \${total.toFixed(2)}</p>;
}

function AddButton({ product }) {
  const addItem = useCartStore(state => state.addItem);
  return <button onClick={() => addItem(product)}>Add {product.name}</button>;
}`,
          preview: `<div style="font-family:sans-serif;padding:16px"><p style="margin:0 0 8px">Cart: 0 items — $0.00</p><div style="display:flex;gap:8px"><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">Add Apple</button><button style="padding:6px 12px;border:1px solid #cbd5e1;border-radius:4px;cursor:pointer">Add Book</button></div></div>`,
        },
      ],
    },
  ],
}

// ─── React Native ─────────────────────────────────────────────────────────────

export const reactNativePlatform: ReactPlatform = {
  id: 'react-native',
  name: 'React Native',
  tagline: 'Build native iOS & Android apps with React',
  categories: [
    {
      id: 'basics',
      name: 'Basics',
      examples: [
        {
          title: 'Hello World',
          description: 'React Native uses native components (View, Text, etc.) instead of HTML elements. StyleSheet.create() defines styles with a CSS-like API.',
          code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, React Native!</Text>
      <Text style={styles.subtitle}>Running on iOS & Android</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
});`,
          preview: `<div style="display:flex;justify-content:center;align-items:center;height:100%;flex-direction:column;gap:8px;background:#f8fafc;padding:16px"><p style="font-size:22px;font-weight:bold;margin:0;color:#0f172a">Hello, React Native!</p><p style="font-size:15px;color:#64748b;margin:0">Running on iOS & Android</p></div>`,
        },
        {
          title: 'Core Components',
          description: 'React Native maps components to native widgets. View ≈ div, Text ≈ p/span, Image ≈ img, TextInput ≈ input, ScrollView ≈ overflow:scroll.',
          code: `import { View, Text, Image, TextInput, ScrollView, StyleSheet } from 'react-native';

function CoreComponents() {
  return (
    <ScrollView style={styles.scroll}>
      {/* View — the basic container */}
      <View style={styles.card}>
        <Text style={styles.heading}>View + Text</Text>
        <Text>This is a Text component inside a View.</Text>
      </View>

      {/* Image */}
      <View style={styles.card}>
        <Text style={styles.heading}>Image</Text>
        <Image
          source={{ uri: 'https://picsum.photos/200/100' }}
          style={{ width: 200, height: 100, borderRadius: 8 }}
        />
      </View>

      {/* TextInput */}
      <View style={styles.card}>
        <Text style={styles.heading}>TextInput</Text>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          placeholderTextColor="#94a3b8"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f8fafc' },
  card: { margin: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  heading: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 8 },
});`,
          preview: `<div style="padding:12px;background:#f8fafc;font-family:sans-serif"><div style="background:#fff;border-radius:8px;padding:12px;margin-bottom:8px;border:1px solid #e2e8f0"><p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 6px">View + Text</p><p style="font-size:13px;margin:0;color:#374151">This is a Text component inside a View.</p></div><div style="background:#fff;border-radius:8px;padding:12px;margin-bottom:8px;border:1px solid #e2e8f0"><p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 6px">TextInput</p><input placeholder="Type something..." style="border:1px solid #e2e8f0;border-radius:6px;padding:6px;width:calc(100%-12px);font-size:13px" /></div></div>`,
        },
        {
          title: 'Flexbox Layout',
          description: 'React Native uses Flexbox for all layout, with flexDirection defaulting to column (vertical). This matches the mobile-first, scrollable nature of apps.',
          code: `import { View, Text, StyleSheet } from 'react-native';

function FlexDemo() {
  return (
    <View style={styles.container}>
      {/* Row layout */}
      <Text style={styles.label}>Row (flexDirection: row)</Text>
      <View style={styles.row}>
        {['R', 'G', 'B'].map((c, i) => (
          <View key={i} style={[styles.box, { backgroundColor: ['#ef4444','#22c55e','#3b82f6'][i] }]}>
            <Text style={styles.boxText}>{c}</Text>
          </View>
        ))}
      </View>

      {/* Space between */}
      <Text style={styles.label}>Space Between</Text>
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        {[1, 2, 3].map(n => (
          <View key={n} style={[styles.box, { backgroundColor: '#6366f1' }]}>
            <Text style={styles.boxText}>{n}</Text>
          </View>
        ))}
      </View>

      {/* Flex sizes */}
      <Text style={styles.label}>Flex Sizes (1:2:1)</Text>
      <View style={styles.row}>
        <View style={[styles.flexBox, { flex: 1, backgroundColor: '#f59e0b' }]}><Text style={styles.boxText}>1</Text></View>
        <View style={[styles.flexBox, { flex: 2, backgroundColor: '#10b981' }]}><Text style={styles.boxText}>2</Text></View>
        <View style={[styles.flexBox, { flex: 1, backgroundColor: '#f59e0b' }]}><Text style={styles.boxText}>1</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8fafc' },
  label: { fontSize: 12, color: '#64748b', marginTop: 12, marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8 },
  box: { width: 44, height: 44, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  flexBox: { height: 40, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  boxText: { color: '#fff', fontWeight: '700' },
});`,
          preview: `<div style="font-family:sans-serif;padding:16px;background:#f8fafc"><p style="font-size:12px;color:#64748b;margin:0 0 4px">Row</p><div style="display:flex;gap:8px;margin-bottom:12px"><div style="width:44px;height:44px;border-radius:6px;background:#ef4444;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">R</div><div style="width:44px;height:44px;border-radius:6px;background:#22c55e;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">G</div><div style="width:44px;height:44px;border-radius:6px;background:#3b82f6;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">B</div></div><p style="font-size:12px;color:#64748b;margin:0 0 4px">Flex Sizes (1:2:1)</p><div style="display:flex;gap:8px"><div style="flex:1;height:40px;border-radius:6px;background:#f59e0b;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">1</div><div style="flex:2;height:40px;border-radius:6px;background:#10b981;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">2</div><div style="flex:1;height:40px;border-radius:6px;background:#f59e0b;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">1</div></div></div>`,
        },
      ],
    },
    {
      id: 'navigation',
      name: 'Navigation',
      examples: [
        {
          title: 'React Navigation Stack',
          description: 'React Navigation is the standard navigation library. Stack Navigator mimics iOS/Android native navigation with push/pop animations.',
          code: `import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', { itemId: 42 })}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { itemId } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Details</Text>
      <Text>Item ID: {itemId}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home"    component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
          preview: `<div style="font-family:sans-serif;background:#f8fafc;border-radius:12px;overflow:hidden"><div style="background:#fff;padding:12px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:14px">Home</div><div style="padding:24px;display:flex;flex-direction:column;align-items:center;gap:12px"><p style="font-size:18px;margin:0">Home Screen</p><button style="padding:8px 20px;background:#3b82f6;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">Go to Details</button></div></div>`,
        },
        {
          title: 'Tab Navigator',
          description: 'Bottom Tab Navigator renders a tab bar at the bottom — the most common navigation pattern for mobile apps.',
          code: `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function HomeTab() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>🏠</Text>
      <Text>Home</Text>
    </View>
  );
}

function SearchTab() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>🔍</Text>
      <Text>Search</Text>
    </View>
  );
}

function ProfileTab() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>👤</Text>
      <Text>Profile</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home"    component={HomeTab} />
        <Tab.Screen name="Search"  component={SearchTab} />
        <Tab.Screen name="Profile" component={ProfileTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}`,
          preview: `<div style="font-family:sans-serif;background:#f8fafc;border-radius:12px;overflow:hidden;min-height:180px;position:relative"><div style="padding:32px;display:flex;flex-direction:column;align-items:center;gap:8px"><span style="font-size:32px">🏠</span><p style="margin:0;font-size:15px">Home</p></div><div style="position:absolute;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e2e8f0;display:flex"><div style="flex:1;padding:10px;text-align:center;color:#6366f1;font-size:12px;font-weight:600">🏠 Home</div><div style="flex:1;padding:10px;text-align:center;color:#94a3b8;font-size:12px">🔍 Search</div><div style="flex:1;padding:10px;text-align:center;color:#94a3b8;font-size:12px">👤 Profile</div></div></div>`,
        },
      ],
    },
    {
      id: 'apis',
      name: 'Native APIs',
      examples: [
        {
          title: 'FlatList',
          description: 'FlatList renders large lists efficiently by only rendering visible items. It is the React Native equivalent of a virtualized list.',
          code: `import { FlatList, View, Text, StyleSheet } from 'react-native';

const DATA = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  title: \`Item \${i + 1}\`,
  subtitle: \`Description for item \${i + 1}\`,
}));

function Item({ item }) {
  return (
    <View style={styles.item}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.id}</Text>
      </View>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <FlatList
      data={DATA}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Item item={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  title: { fontWeight: '600', color: '#0f172a' },
  subtitle: { color: '#64748b', fontSize: 13 },
  separator: { height: 1, backgroundColor: '#e2e8f0', marginLeft: 64 },
});`,
          preview: `<div style="font-family:sans-serif;background:#fff"><div style="display:flex;align-items:center;padding:10px 12px;gap:12px;border-bottom:1px solid #e2e8f0"><div style="width:40px;height:40px;border-radius:20px;background:#6366f1;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;flex-shrink:0">1</div><div><p style="margin:0;font-weight:600;color:#0f172a">Item 1</p><p style="margin:0;color:#64748b;font-size:13px">Description for item 1</p></div></div><div style="display:flex;align-items:center;padding:10px 12px;gap:12px;border-bottom:1px solid #e2e8f0"><div style="width:40px;height:40px;border-radius:20px;background:#6366f1;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;flex-shrink:0">2</div><div><p style="margin:0;font-weight:600;color:#0f172a">Item 2</p><p style="margin:0;color:#64748b;font-size:13px">Description for item 2</p></div></div><div style="display:flex;align-items:center;padding:10px 12px;gap:12px"><div style="width:40px;height:40px;border-radius:20px;background:#6366f1;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;flex-shrink:0">3</div><div><p style="margin:0;font-weight:600;color:#0f172a">Item 3</p><p style="margin:0;color:#64748b;font-size:13px">Description for item 3</p></div></div></div>`,
        },
        {
          title: 'AsyncStorage',
          description: 'AsyncStorage is React Native\'s key-value storage for persisting data between app sessions. It is asynchronous and Promise-based.',
          code: `import AsyncStorage from '@react-native-async-storage/async-storage';

// Store a value
async function saveUser(user) {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('User saved');
  } catch (err) {
    console.error('Save failed:', err.message);
  }
}

// Read a value
async function loadUser() {
  try {
    const json = await AsyncStorage.getItem('user');
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.error('Load failed:', err.message);
    return null;
  }
}

// Remove a value
async function logout() {
  await AsyncStorage.removeItem('user');
}

// Example usage in a component
import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser().then(setUser);
  }, []);

  const handleLogin = async () => {
    const u = { name: 'Alice', email: 'alice@example.com' };
    await saveUser(u);
    setUser(u);
  };

  return (
    <View>
      {user ? (
        <>
          <Text>Welcome, {user.name}!</Text>
          <Button title="Logout" onPress={async () => { await logout(); setUser(null); }} />
        </>
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}`,
          preview: `<div style="font-family:sans-serif;padding:24px;display:flex;flex-direction:column;align-items:center;gap:12px;background:#f8fafc;border-radius:12px"><p style="margin:0;color:#64748b;font-size:13px">No user stored</p><button style="padding:10px 24px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer">Login</button></div>`,
        },
        {
          title: 'Expo APIs',
          description: 'Expo provides a rich set of pre-built native APIs — camera, location, notifications, and more — without writing native code.',
          code: `// Expo Camera
import { CameraView, useCameraPermissions } from 'expo-camera';

function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return <Button title="Grant Camera Permission" onPress={requestPermission} />;
  }

  return (
    <CameraView
      style={{ flex: 1 }}
      onBarcodeScanned={({ data, type }) => {
        alert(\`\${type}: \${data}\`);
      }}
    />
  );
}

// Expo Location
import * as Location from 'expo-location';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Location permission denied');
    return;
  }
  const loc = await Location.getCurrentPositionAsync({});
  console.log('Lat:', loc.coords.latitude);
  console.log('Lon:', loc.coords.longitude);
}

// Expo Notifications
import * as Notifications from 'expo-notifications';

async function scheduleReminder(title, body, seconds) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds },
  });
}

// Install: npx expo install expo-camera expo-location expo-notifications`,
          preview: `<div style="font-family:sans-serif;padding:16px;background:#f8fafc;border-radius:12px"><p style="font-weight:600;margin:0 0 10px;color:#0f172a">Expo SDK APIs</p><div style="display:flex;flex-direction:column;gap:8px"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:10px"><p style="margin:0;font-size:13px;font-weight:500">📷 expo-camera</p><p style="margin:2px 0 0;font-size:12px;color:#64748b">Camera & barcode scanner</p></div><div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:10px"><p style="margin:0;font-size:13px;font-weight:500">📍 expo-location</p><p style="margin:2px 0 0;font-size:12px;color:#64748b">GPS & geocoding</p></div><div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:10px"><p style="margin:0;font-size:13px;font-weight:500">🔔 expo-notifications</p><p style="margin:2px 0 0;font-size:12px;color:#64748b">Push & local notifications</p></div></div></div>`,
        },
      ],
    },
  ],
}

// ─── Flutter section data ──────────────────────────────────────────────────────

export interface FlutterSection {
  id: string
  title: string
  content: FlutterSectionContent
}

export interface FlutterSectionContent {
  description: string
  subsections: FlutterSubsection[]
}

export interface FlutterSubsection {
  title: string
  description: string
  code?: string
  items?: string[]
  tree?: string
}

export const flutterSections: FlutterSection[] = [
  {
    id: 'directory',
    title: 'Project Structure',
    content: {
      description: 'A Flutter project follows a well-defined directory layout. Understanding each folder helps you navigate and organize large apps.',
      subsections: [
        {
          title: 'Standard Directory Tree',
          description: 'Flutter separates platform code (android/, ios/, web/) from Dart application code (lib/).',
          tree: `my_flutter_app/
├── android/              # Android-specific native code
│   ├── app/
│   │   └── src/main/
│   └── build.gradle
├── ios/                  # iOS-specific native code
│   └── Runner/
├── web/                  # Web target (if enabled)
├── lib/                  # All your Dart code goes here
│   ├── main.dart         # Entry point
│   ├── app.dart          # Root widget (MaterialApp / CupertinoApp)
│   ├── screens/          # Full-page widgets
│   ├── widgets/          # Reusable UI components
│   ├── models/           # Data models
│   ├── services/         # API calls, storage, etc.
│   ├── providers/        # State management (Provider / Riverpod)
│   └── utils/            # Helpers and constants
├── test/                 # Unit & widget tests
├── assets/               # Images, fonts, JSON files
├── pubspec.yaml          # Dependencies & assets manifest
└── pubspec.lock          # Locked dependency versions`,
        },
        {
          title: 'lib/ Architecture Pattern',
          description: 'Feature-first organization groups all files for a feature together, making large apps easier to navigate.',
          tree: `lib/
├── main.dart
├── app.dart
├── core/
│   ├── theme/            # App theme, colors, typography
│   ├── router/           # GoRouter / named routes
│   └── utils/            # Date helpers, validators, etc.
├── features/
│   ├── auth/
│   │   ├── screens/      # LoginScreen, SignupScreen
│   │   ├── widgets/      # AuthButton, PasswordField
│   │   ├── providers/    # AuthProvider / AuthController
│   │   └── models/       # User, AuthResponse
│   ├── home/
│   │   ├── screens/
│   │   └── widgets/
│   └── profile/
│       ├── screens/
│       └── widgets/
└── shared/
    ├── widgets/          # AppBar, BottomNav, LoadingSpinner
    └── models/           # Shared data types`,
        },
      ],
    },
  },
  {
    id: 'code',
    title: 'Dart & Flutter Code',
    content: {
      description: 'Flutter uses Dart — a strongly typed, object-oriented language. Widgets are the building blocks of every Flutter UI.',
      subsections: [
        {
          title: 'Hello World',
          description: 'Every Flutter app starts with main(), which calls runApp() with the root widget. MaterialApp wraps the app with Material Design.',
          code: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hello Flutter')),
      body: const Center(
        child: Text(
          'Hello, World!',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}`,
        },
        {
          title: 'StatefulWidget',
          description: 'StatefulWidget has mutable state stored in a separate State object. Calling setState() triggers a rebuild with the updated values.',
          code: `import 'package:flutter/material.dart';

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _count = 0;

  void _increment() => setState(() => _count++);
  void _decrement() => setState(() => _count--);
  void _reset()     => setState(() => _count = 0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Counter')),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            '$_count',
            style: Theme.of(context).textTheme.displayLarge,
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(onPressed: _decrement, child: const Text('-')),
              const SizedBox(width: 16),
              ElevatedButton(onPressed: _increment, child: const Text('+')),
              const SizedBox(width: 16),
              OutlinedButton(onPressed: _reset, child: const Text('Reset')),
            ],
          ),
        ],
      ),
    );
  }
}`,
        },
        {
          title: 'ListView & Builder',
          description: 'ListView.builder creates items lazily — only rendering visible items, which is essential for long lists.',
          code: `import 'package:flutter/material.dart';

class ProductListPage extends StatelessWidget {
  const ProductListPage({super.key});

  static const products = [
    {'name': 'Flutter Book',  'price': 29.99, 'icon': '📖'},
    {'name': 'Dart Guide',    'price': 19.99, 'icon': '📚'},
    {'name': 'UI Kit',        'price': 49.99, 'icon': '🎨'},
    {'name': 'State Package', 'price': 0.00,  'icon': '📦'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Products')),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          final p = products[index];
          return ListTile(
            leading: Text(
              p['icon'] as String,
              style: const TextStyle(fontSize: 28),
            ),
            title: Text(p['name'] as String),
            subtitle: Text(
              (p['price'] as double) == 0
                  ? 'Free'
                  : '\$\${(p['price'] as double).toStringAsFixed(2)}',
            ),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Tapped: \${p['name']}')),
              );
            },
          );
        },
      ),
    );
  }
}`,
        },
        {
          title: 'Riverpod State Management',
          description: 'Riverpod is the modern, compile-safe state management solution for Flutter. Providers are defined globally and consumed with ConsumerWidget.',
          code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 1. Define a provider — it lives outside any widget
final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
  return CounterNotifier();
});

class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);

  void increment() => state++;
  void decrement() => state--;
  void reset()     => state = 0;
}

// 2. ProviderScope must wrap the whole app (usually in main.dart)
void main() {
  runApp(const ProviderScope(child: MyApp()));
}

// 3. Use ConsumerWidget instead of StatelessWidget to read providers
class CounterPage extends ConsumerWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    final notifier = ref.read(counterProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('Riverpod Counter')),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('$count', style: const TextStyle(fontSize: 64)),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(onPressed: notifier.decrement, icon: const Icon(Icons.remove)),
              IconButton(onPressed: notifier.increment, icon: const Icon(Icons.add)),
              TextButton(onPressed: notifier.reset, child: const Text('Reset')),
            ],
          ),
        ],
      ),
    );
  }
}`,
        },
        {
          title: 'HTTP & Dio',
          description: 'Dio is a powerful HTTP client for Dart. Use it for REST API calls, interceptors, file uploads, and request cancellation.',
          code: `import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio;

  ApiService()
      : _dio = Dio(BaseOptions(
          baseUrl: 'https://jsonplaceholder.typicode.com',
          connectTimeout: const Duration(seconds: 5),
          receiveTimeout: const Duration(seconds: 10),
          headers: {'Content-Type': 'application/json'},
        )) {
    // Add a logging interceptor
    _dio.interceptors.add(LogInterceptor(responseBody: true));
  }

  // GET request
  Future<List<dynamic>> getPosts() async {
    final response = await _dio.get('/posts');
    return response.data as List;
  }

  // POST request
  Future<Map<String, dynamic>> createPost(String title, String body) async {
    final response = await _dio.post('/posts', data: {
      'title': title,
      'body': body,
      'userId': 1,
    });
    return response.data as Map<String, dynamic>;
  }

  // With error handling
  Future<dynamic> safeGet(String path) async {
    try {
      final response = await _dio.get(path);
      return response.data;
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout) {
        throw Exception('Connection timed out');
      }
      if (e.response?.statusCode == 404) {
        throw Exception('Resource not found');
      }
      rethrow;
    }
  }
}`,
        },
        {
          title: 'GoRouter Navigation',
          description: 'GoRouter is the recommended navigation package for Flutter. It supports URL-based routing, nested routes, and redirects.',
          code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Define routes in one place
final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/profile/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ProfileScreen(userId: id);
      },
    ),
    ShellRoute(
      builder: (context, state, child) => ScaffoldWithNav(child: child),
      routes: [
        GoRoute(path: '/feed',    builder: (_, __) => const FeedScreen()),
        GoRoute(path: '/search',  builder: (_, __) => const SearchScreen()),
        GoRoute(path: '/account', builder: (_, __) => const AccountScreen()),
      ],
    ),
  ],
  // Redirect unauthenticated users
  redirect: (context, state) {
    final isLoggedIn = AuthService.instance.isLoggedIn;
    if (!isLoggedIn && state.matchedLocation != '/login') {
      return '/login';
    }
    return null;
  },
);

// Navigate imperatively
void goToProfile(BuildContext context, String id) {
  context.go('/profile/$id');   // replace current route
  // context.push('/profile/$id'); // push onto stack
}`,
        },
      ],
    },
  },
  {
    id: 'dependencies',
    title: 'Dependencies (pubspec.yaml)',
    content: {
      description: 'Flutter dependencies are declared in pubspec.yaml. pub.dev is the package repository. Run flutter pub get after editing the file.',
      subsections: [
        {
          title: 'pubspec.yaml Structure',
          description: 'pubspec.yaml defines the app metadata, dependencies, dev dependencies, and assets.',
          code: `name: my_flutter_app
description: A modern Flutter application.
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.13.0'

dependencies:
  flutter:
    sdk: flutter

  # State management
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.5

  # Navigation
  go_router: ^14.0.1

  # Networking
  dio: ^5.4.3
  retrofit: ^4.1.0

  # Data & serialization
  freezed_annotation: ^2.4.1
  json_annotation: ^4.9.0

  # Storage
  shared_preferences: ^2.2.3
  hive_flutter: ^1.1.0

  # UI components
  flutter_svg: ^2.0.10+1
  cached_network_image: ^3.3.1
  shimmer: ^3.0.0

  # Utilities
  intl: ^0.19.0
  url_launcher: ^6.3.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.9
  freezed: ^2.5.2
  json_serializable: ^6.8.0
  riverpod_generator: ^2.4.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
    - assets/data/
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Regular.ttf
        - asset: assets/fonts/Inter-Bold.ttf
          weight: 700`,
        },
        {
          title: 'Essential Packages',
          description: 'These are the most widely used Flutter packages in production applications.',
          items: [
            'flutter_riverpod — Compile-safe, scalable state management',
            'go_router — URL-based declarative navigation',
            'dio — HTTP client with interceptors and cancellation',
            'freezed — Immutable data classes with union types',
            'json_serializable — Code-gen JSON serialization',
            'hive_flutter — Fast NoSQL storage (no native code)',
            'shared_preferences — Key-value persistent storage',
            'flutter_svg — SVG rendering',
            'cached_network_image — Image caching with placeholders',
            'intl — Internationalization and date/number formatting',
            'url_launcher — Open URLs, emails, phone numbers',
            'flutter_hooks — React-style hooks for Flutter',
            'auto_route — Type-safe navigation with code generation',
            'bloc / flutter_bloc — BLoC state management pattern',
            'get_it — Service locator / dependency injection',
          ],
        },
      ],
    },
  },
  {
    id: 'tools',
    title: 'Tools & Workflow',
    content: {
      description: 'Flutter has excellent tooling — from the CLI to the DevTools browser extension. Learning these tools will make you significantly more productive.',
      subsections: [
        {
          title: 'Flutter CLI Commands',
          description: 'The flutter command is your primary tool. Run it from the project root.',
          code: `# Create a new Flutter project
flutter create my_app
flutter create --org com.example --template=app my_app

# Run the app (hot reload enabled by default)
flutter run                          # default device
flutter run -d chrome                # web
flutter run -d "iPhone 15 Pro"       # iOS simulator

# Hot reload vs. hot restart
# r  — hot reload  (preserves state, faster)
# R  — hot restart (resets state, full rebuild)
# q  — quit

# Build for production
flutter build apk --release          # Android APK
flutter build appbundle --release    # Android App Bundle (Play Store)
flutter build ipa --release          # iOS (requires macOS)
flutter build web --release          # Web
flutter build macos --release        # macOS desktop

# Pub (package manager)
flutter pub get                      # install dependencies
flutter pub add dio                  # add a package
flutter pub remove dio               # remove a package
flutter pub upgrade                  # upgrade all packages
flutter pub run build_runner build   # run code generation

# Analyse & test
flutter analyze                      # static analysis
flutter test                         # run all tests
flutter test test/unit/widget_test.dart  # single test file

# Clean build artifacts
flutter clean`,
        },
        {
          title: 'VS Code Setup',
          description: 'VS Code with the Flutter & Dart extensions gives you IntelliSense, hot reload, debugging, and widget inspector.',
          items: [
            'Install extension: "Flutter" by Dart Code (includes Dart extension)',
            'Cmd/Ctrl+Shift+P → "Flutter: New Project" — scaffold from VS Code',
            'F5 — Start debugging with hot reload',
            'Cmd/Ctrl+S — triggers hot reload automatically while running',
            'Cmd/Ctrl+Shift+P → "Dart: Open DevTools" — open browser DevTools',
            'Settings: dart.flutterHotReloadOnSave: "all" for auto hot reload',
            'Install "Pubspec Assist" to add packages from the command palette',
            'Install "Flutter Tree" for widget tree visualization in the sidebar',
          ],
        },
        {
          title: 'Flutter DevTools',
          description: 'Flutter DevTools is a browser-based suite for profiling, debugging widgets, and inspecting network requests.',
          items: [
            'Widget Inspector — visualize the widget tree, select widgets, inspect properties',
            'Performance View — frame timeline, GPU/CPU profiling, jank detection',
            'CPU Profiler — identify expensive method calls and hot paths',
            'Memory View — heap snapshots, allocation tracking, leak detection',
            'Network View — inspect HTTP requests, headers, payloads',
            'Logging View — app logs with filtering and search',
            'Launch: flutter run → press "d" or run flutter pub global activate devtools',
            'VS Code: Cmd/Ctrl+Shift+P → "Dart: Open DevTools in Web Browser"',
          ],
        },
        {
          title: 'Testing',
          description: 'Flutter supports three types of tests: unit, widget, and integration. All run with flutter test.',
          code: `// test/unit/counter_test.dart — pure Dart logic test
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/features/counter/counter_notifier.dart';

void main() {
  group('CounterNotifier', () {
    late CounterNotifier notifier;

    setUp(() => notifier = CounterNotifier());

    test('starts at 0', () {
      expect(notifier.state, 0);
    });

    test('increments', () {
      notifier.increment();
      expect(notifier.state, 1);
    });

    test('decrements', () {
      notifier.decrement();
      expect(notifier.state, -1);
    });
  });
}

// test/widget/counter_widget_test.dart — widget test
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/features/counter/counter_page.dart';

void main() {
  testWidgets('counter increments when + button pressed', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: CounterPage()));

    expect(find.text('0'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.add));
    await tester.pump(); // trigger rebuild

    expect(find.text('1'), findsOneWidget);
    expect(find.text('0'), findsNothing);
  });
}`,
        },
      ],
    },
  },
]
