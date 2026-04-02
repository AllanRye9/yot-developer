'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCode2, Zap, Layers, GitBranch, AlertTriangle, Sparkles,
  Play, CheckCircle, XCircle, Info, ChevronDown, ChevronUp,
  BookOpen, FlaskConical, Terminal, Lightbulb,
} from 'lucide-react'
import { trackFeatureUsage } from '@/lib/analytics'

// ─── Types ───────────────────────────────────────────────────────────────────

interface EfficiencyIssue {
  severity: 'error' | 'warning' | 'info'
  message: string
  line?: number
  suggestion: string
}

interface StackFrame {
  type: 'sync' | 'microtask' | 'macrotask' | 'function'
  label: string
  detail: string
  depth: number
}

interface LogicBlock {
  type: 'function' | 'loop' | 'conditional' | 'async' | 'variable' | 'class'
  name: string
  lines: string
  detail: string
}

interface SyntaxIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  line?: number
}

interface AIRecommendation {
  category: string
  title: string
  description: string
  example?: string
}

interface AnalysisResult {
  efficiency: EfficiencyIssue[]
  executionStack: StackFrame[]
  logicBlocks: LogicBlock[]
  syntaxIssues: SyntaxIssue[]
  aiRecommendations: AIRecommendation[]
  language: 'javascript' | 'typescript'
  lineCount: number
  functionCount: number
  complexity: 'Low' | 'Medium' | 'High'
}

// ─── Analysis Engine ─────────────────────────────────────────────────────────

function checkSyntax(code: string, lang: 'javascript' | 'typescript'): SyntaxIssue[] {
  const issues: SyntaxIssue[] = []

  // For JS, use the Function constructor for real syntax checking.
  // This is intentional: the code is user-supplied and runs entirely client-side
  // (the user controls their own browser context), so there is no server-side risk.
  // The Function constructor only parses/compiles; when wrapped in try/catch it does
  // NOT execute the body — it throws a SyntaxError before any execution.
  if (lang === 'javascript') {
    try {
      // eslint-disable-next-line no-new-func
      new Function(code)
    } catch (e) {
      const msg = (e as Error).message
      const lineMatch = msg.match(/line (\d+)/i)
      issues.push({
        type: 'error',
        message: msg,
        line: lineMatch ? parseInt(lineMatch[1]) : undefined,
      })
    }
  }

  const lines = code.split('\n')

  // Check for common TypeScript-specific patterns if TS
  if (lang === 'typescript') {
    lines.forEach((line, i) => {
      // Basic TS checks
      if (/:\s*any\b/.test(line)) {
        issues.push({ type: 'warning', message: `Line ${i + 1}: Avoid using 'any' type — use specific types instead`, line: i + 1 })
      }
    })
  }

  // Common checks for both languages
  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) return

    // Missing semicolons (simple check for statements that look like they need one)
    if (lang === 'javascript') {
      if (/^(const|let|var)\s+\w+\s*=/.test(trimmed) && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith(',')) {
        issues.push({ type: 'warning', message: `Line ${i + 1}: Missing semicolon after declaration`, line: i + 1 })
      }
    }

    // Undeclared variables warning (var usage)
    if (/\bvar\s+/.test(trimmed)) {
      issues.push({ type: 'warning', message: `Line ${i + 1}: Use 'let' or 'const' instead of 'var' for block-scoped declarations`, line: i + 1 })
    }

    // console.log left in code warning
    if (/console\.(log|debug)\(/.test(trimmed) && !trimmed.startsWith('//')) {
      issues.push({ type: 'info', message: `Line ${i + 1}: console.log() detected — consider removing debug logs in production`, line: i + 1 })
    }

    // eval usage
    if (/\beval\s*\(/.test(trimmed)) {
      issues.push({ type: 'error', message: `Line ${i + 1}: Avoid using eval() — it poses serious security and performance risks`, line: i + 1 })
    }

    // == instead of ===
    if (/[^=!<>]==[^=]/.test(trimmed) && !/['"]\s*==\s*['"]/.test(trimmed)) {
      issues.push({ type: 'warning', message: `Line ${i + 1}: Use strict equality '===' instead of loose equality '=='`, line: i + 1 })
    }
  })

  return issues
}

function analyzeEfficiency(code: string): EfficiencyIssue[] {
  const issues: EfficiencyIssue[] = []
  const lines = code.split('\n')

  // Detect nested loops (O(n²) complexity)
  let loopDepth = 0
  let maxLoopDepth = 0
  lines.forEach((line, i) => {
    if (/\b(for|while|forEach|map|filter|reduce)\b.*[\(\{]/.test(line)) {
      loopDepth++
      if (loopDepth > maxLoopDepth) maxLoopDepth = loopDepth
      if (loopDepth >= 2) {
        issues.push({
          severity: 'warning',
          message: `Line ${i + 1}: Nested loops detected (O(n²) complexity or higher)`,
          line: i + 1,
          suggestion: 'Consider using hash maps, Sets, or restructuring the algorithm to reduce complexity to O(n).',
        })
      }
    }
    if (/[\}\)]/.test(line) && loopDepth > 0) loopDepth = Math.max(0, loopDepth - 1)
  })

  // DOM queries inside loops
  const loopRanges: number[] = []
  let inLoop = false
  lines.forEach((line, i) => {
    if (/\b(for|while|forEach)\b/.test(line)) inLoop = true
    if (inLoop && /document\.(querySelector|getElementById|getElementsBy)/.test(line)) {
      issues.push({
        severity: 'error',
        message: `Line ${i + 1}: DOM query inside a loop is expensive`,
        line: i + 1,
        suggestion: 'Cache DOM queries outside the loop: const el = document.querySelector(...); then use el inside the loop.',
      })
    }
    loopRanges.push(inLoop ? 1 : 0)
  })

  // Missing async/await error handling — check surrounding context using line index
  lines.forEach((line, i) => {
    if (/\bawait\b/.test(line)) {
      // Look for a try block in the preceding 10 lines
      const surroundingCode = lines.slice(Math.max(0, i - 10), i + 1).join('\n')
      if (!/\btry\b/.test(surroundingCode)) {
        issues.push({
          severity: 'warning',
          message: `Line ${i + 1}: await used without surrounding try/catch`,
          line: i + 1,
          suggestion: 'Wrap await calls in try/catch or use .catch() to handle Promise rejections.',
        })
      }
    }
  })

  // Large array creation in loops
  lines.forEach((line, i) => {
    if (/\bnew Array\((\d{4,})\)/.test(line)) {
      issues.push({
        severity: 'warning',
        message: `Line ${i + 1}: Large array allocation detected`,
        line: i + 1,
        suggestion: 'Pre-allocate only what you need, or use typed arrays (Int32Array, Float64Array) for large numeric datasets.',
      })
    }
  })

  // Missing memoization hints for expensive computations
  const hasRecursion = /\bfunction\s+(\w+)[^}]*\b\1\s*\(/.test(code)
  if (hasRecursion) {
    issues.push({
      severity: 'info',
      message: 'Recursive function detected',
      suggestion: 'Consider memoizing recursive functions with a cache object or Map to avoid redundant computations.',
    })
  }

  // String concatenation in loop
  lines.forEach((line, i) => {
    if (loopRanges[i] && /\+=\s*['"`]/.test(line)) {
      issues.push({
        severity: 'warning',
        message: `Line ${i + 1}: String concatenation inside loop`,
        line: i + 1,
        suggestion: 'Collect strings in an array and join them after the loop: arr.push(str); result = arr.join("");',
      })
    }
  })

  if (issues.length === 0) {
    issues.push({
      severity: 'info',
      message: 'No major efficiency issues detected',
      suggestion: 'Code looks efficient for the patterns analyzed. Always profile with DevTools Performance tab for real workloads.',
    })
  }

  return issues
}

function buildExecutionStack(code: string): StackFrame[] {
  const frames: StackFrame[] = []
  const lines = code.split('\n')

  frames.push({
    type: 'sync',
    label: '(Global / Module scope)',
    detail: 'JavaScript starts executing from the top of the file synchronously in the global execution context.',
    depth: 0,
  })

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//')) return

    const funcMatch = trimmed.match(/(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\(.*\)\s*=>))/)
    const isAsync = /\basync\b/.test(trimmed)
    const hasAwait = /\bawait\b/.test(trimmed)
    const hasSetTimeout = /\bsetTimeout\b/.test(trimmed)
    const hasSetInterval = /\bsetInterval\b/.test(trimmed)
    const hasPromise = /\bnew\s+Promise\b/.test(trimmed)
    const hasThen = /\.then\s*\(/.test(trimmed)

    if (funcMatch) {
      const name = funcMatch[1] || funcMatch[2] || 'anonymous'
      frames.push({
        type: isAsync ? 'microtask' : 'function',
        label: isAsync ? `async ${name}()` : `${name}()`,
        detail: isAsync
          ? 'Async function — suspends at each await, returns a Promise, and resumes in the microtask queue.'
          : 'Regular function — pushed onto the call stack when invoked, popped when it returns.',
        depth: 1,
      })
    }

    if (hasAwait) {
      frames.push({
        type: 'microtask',
        label: 'await (microtask queue)',
        detail: 'await pauses the async function and schedules resumption as a microtask. Microtasks run before the next macrotask.',
        depth: 2,
      })
    }

    if (hasSetTimeout || hasSetInterval) {
      frames.push({
        type: 'macrotask',
        label: hasSetTimeout ? 'setTimeout callback (macrotask)' : 'setInterval callback (macrotask)',
        detail: 'Macrotasks (timers) are scheduled in the task queue. They run after the current call stack is empty and all microtasks are done.',
        depth: 2,
      })
    }

    if (hasPromise || hasThen) {
      frames.push({
        type: 'microtask',
        label: 'Promise callback (microtask)',
        detail: '.then()/.catch() callbacks are microtasks — they run before any setTimeout callbacks.',
        depth: 2,
      })
    }
  })

  // Add event loop summary
  const hasMacro = frames.some(f => f.type === 'macrotask')
  const hasMicro = frames.some(f => f.type === 'microtask')
  if (hasMacro || hasMicro) {
    frames.push({
      type: 'sync',
      label: 'Event Loop cycle complete',
      detail: `Execution order: 1) Synchronous code  2) Microtasks (Promises, await)  3) Macrotasks (setTimeout, I/O)${hasMacro ? '  → Timers detected in this code' : ''}`,
      depth: 0,
    })
  }

  return frames
}

function extractLogicBlocks(code: string): LogicBlock[] {
  const blocks: LogicBlock[] = []
  const lines = code.split('\n')

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//')) return
    const lineNum = i + 1

    // Functions
    const funcMatch = trimmed.match(/(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/)
    const arrowMatch = trimmed.match(/(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/)
    const classMatch = trimmed.match(/class\s+(\w+)(?:\s+extends\s+(\w+))?/)
    const loopMatch = trimmed.match(/\b(for|while|do)\b/)
    const condMatch = trimmed.match(/\b(if|else if|switch)\b/)
    const asyncMatch = trimmed.match(/\b(async|await|\.then|\.catch|Promise)\b/)
    const varMatch = trimmed.match(/\b(const|let|var)\s+(\w+)\s*=/)

    if (funcMatch) {
      blocks.push({ type: 'function', name: funcMatch[1], lines: `line ${lineNum}`, detail: `Parameters: (${funcMatch[2] || 'none'})` })
    } else if (arrowMatch) {
      blocks.push({ type: 'function', name: arrowMatch[1] + ' (arrow)', lines: `line ${lineNum}`, detail: `Arrow function · Params: (${arrowMatch[2] || 'none'})` })
    } else if (classMatch) {
      blocks.push({ type: 'class', name: classMatch[1], lines: `line ${lineNum}`, detail: classMatch[2] ? `extends ${classMatch[2]}` : 'No inheritance' })
    } else if (loopMatch) {
      blocks.push({ type: 'loop', name: loopMatch[1] + ' loop', lines: `line ${lineNum}`, detail: 'Iterates over a collection or condition — check loop bounds and exit conditions.' })
    } else if (condMatch) {
      blocks.push({ type: 'conditional', name: condMatch[1] + ' block', lines: `line ${lineNum}`, detail: 'Branching logic — ensure all cases are handled and conditions are exhaustive.' })
    } else if (asyncMatch && !arrowMatch && !funcMatch) {
      blocks.push({ type: 'async', name: asyncMatch[1], lines: `line ${lineNum}`, detail: 'Async operation — remember to handle rejections and loading states.' })
    } else if (varMatch) {
      const val = trimmed.split('=').slice(1).join('=').trim().slice(0, 40)
      blocks.push({ type: 'variable', name: `${varMatch[1]} ${varMatch[2]}`, lines: `line ${lineNum}`, detail: `= ${val || '…'}` })
    }
  })

  return blocks.slice(0, 30) // cap for display
}

function generateAIRecommendations(code: string, lang: 'javascript' | 'typescript'): AIRecommendation[] {
  const recs: AIRecommendation[] = []
  const hasVar = /\bvar\s+/.test(code)
  const hasAny = /:\s*any\b/.test(code)
  const hasCallback = /function\s*\([^)]*\)\s*\{[\s\S]*callback\s*\(/.test(code)
  const hasMagicNumbers = /[^'"\w]\b([2-9]\d{2,})\b/.test(code)
  const hasNoTypes = lang === 'typescript' && !/:\s*\w+/.test(code)
  const hasNestedCallbacks = (code.match(/function/g) || []).length > 3 && (code.match(/callback|cb\)/g) || []).length > 1
  const hasLongFunctions = code.split('\n').length > 50

  if (hasVar) {
    recs.push({
      category: 'Modern JavaScript',
      title: "Replace 'var' with 'let' and 'const'",
      description: "'var' is function-scoped and can lead to unexpected bugs. Use 'const' for values that don't change and 'let' for reassignable variables.",
      example: "// Before\nvar count = 0;\n\n// After\nconst maxItems = 10;\nlet count = 0;",
    })
  }

  if (lang === 'typescript' && hasAny) {
    recs.push({
      category: 'TypeScript Best Practices',
      title: "Avoid the 'any' type",
      description: "Using 'any' defeats the purpose of TypeScript. Replace with specific types, interfaces, or generics to get full type safety.",
      example: "// Before\nfunction process(data: any) {}\n\n// After\ninterface UserData { id: number; name: string; }\nfunction process(data: UserData) {}",
    })
  }

  if (lang === 'typescript' && hasNoTypes) {
    recs.push({
      category: 'TypeScript',
      title: 'Add type annotations',
      description: 'TypeScript is most effective when you annotate function parameters and return types. This catches bugs at compile time.',
      example: "// Before\nfunction add(a, b) { return a + b; }\n\n// After\nfunction add(a: number, b: number): number { return a + b; }",
    })
  }

  if (hasCallback || hasNestedCallbacks) {
    recs.push({
      category: 'Async Patterns',
      title: 'Use async/await instead of callbacks',
      description: 'Callback-based code leads to "callback hell". Convert to Promises and use async/await for readable, maintainable async code.',
      example: "// Before (callback)\nfetch(url, function(err, res) { ... })\n\n// After (async/await)\ntry {\n  const res = await fetch(url);\n  const data = await res.json();\n} catch (err) { console.error(err); }",
    })
  }

  if (hasMagicNumbers) {
    recs.push({
      category: 'Code Readability',
      title: 'Replace magic numbers with named constants',
      description: "Hard-coded numbers without context are confusing. Extract them as named constants to make your intent clear.",
      example: "// Before\nif (score > 750) { ... }\n\n// After\nconst CREDIT_SCORE_GOOD = 750;\nif (score > CREDIT_SCORE_GOOD) { ... }",
    })
  }

  if (hasLongFunctions && code.split('\n').length > 50) {
    recs.push({
      category: 'Code Structure',
      title: 'Break long functions into smaller ones',
      description: 'Functions should do one thing well (Single Responsibility Principle). Long functions are hard to test and maintain.',
      example: "// Break complex functions into focused helpers:\nfunction validateInput(input) { ... }\nfunction processData(data) { ... }\nfunction formatOutput(result) { ... }",
    })
  }

  if (!/\/\*\*|\/\/\s+@/.test(code) && code.split('\n').length > 10) {
    recs.push({
      category: 'Documentation',
      title: 'Add JSDoc comments to functions',
      description: 'Documenting your functions with JSDoc helps other developers (and your future self) understand intent without reading implementation.',
      example: "/**\n * Calculates the total price including tax.\n * @param {number} price - Base price\n * @param {number} taxRate - Tax rate as a decimal (e.g., 0.1 for 10%)\n * @returns {number} Total price with tax\n */\nfunction calculateTotal(price, taxRate) { ... }",
    })
  }

  // Always add a language-specific recommendation
  if (lang === 'typescript') {
    recs.push({
      category: 'TypeScript',
      title: 'Use discriminated unions for state',
      description: 'Discriminated unions are a powerful TypeScript pattern for modeling state machines and complex conditional logic safely.',
      example: "type State =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: string }\n  | { status: 'error'; message: string };",
    })
  } else {
    recs.push({
      category: 'Modern JavaScript',
      title: 'Use destructuring and spread for cleaner code',
      description: 'ES6+ destructuring and spread syntax makes object/array manipulation more concise and readable.',
      example: "// Destructuring\nconst { name, age } = user;\nconst [first, ...rest] = items;\n\n// Spread\nconst updated = { ...original, status: 'active' };",
    })
  }

  return recs
}

function computeComplexity(code: string): 'Low' | 'Medium' | 'High' {
  const lines = code.split('\n').filter(l => l.trim()).length
  const conditions = (code.match(/\b(if|else|switch|case|while|for)\b/g) || []).length
  // Count max brace nesting depth using a stack counter
  let depth = 0
  let maxDepth = 0
  for (const ch of code) {
    if (ch === '{') { depth++; if (depth > maxDepth) maxDepth = depth }
    else if (ch === '}') depth = Math.max(0, depth - 1)
  }
  if (lines > 100 || conditions > 10 || maxDepth > 5) return 'High'
  if (lines > 30 || conditions > 4 || maxDepth > 3) return 'Medium'
  return 'Low'
}

// ─── Code Explanation ────────────────────────────────────────────────────────

interface CodeExplanation {
  summary: string
  purpose: string
  patterns: Array<{ icon: string; text: string }>
}

function explainCode(code: string, lang: 'javascript' | 'typescript'): CodeExplanation {
  const hasFetch    = /\bfetch\s*\(/.test(code)
  const hasClass    = /\bclass\s+\w+/.test(code)
  const hasAsync    = /\basync\s/.test(code)
  const hasLoop     = /\b(for|while|forEach|map|filter|reduce)\b/.test(code)
  const hasDom      = /\bdocument\.\w+/.test(code)
  const hasStorage  = /\blocalStorage|sessionStorage/.test(code)
  const hasExport   = /\bexport\b/.test(code)
  const hasImport   = /\bimport\b/.test(code)

  const funcNames = [...code.matchAll(/(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\(.*?\)\s*=>))/g)]
    .map(m => m[1] || m[2]).filter(Boolean)
  const classNames = [...code.matchAll(/class\s+(\w+)/g)].map(m => m[1])

  let purpose = 'General JavaScript'
  if (hasClass && classNames.length > 0)    purpose = 'Object-oriented design — uses classes and inheritance'
  else if (hasFetch)                          purpose = 'Data fetching — retrieves resources from APIs or servers'
  else if (hasDom)                            purpose = 'DOM manipulation — dynamically updates the user interface'
  else if (hasStorage)                        purpose = 'Data persistence — stores and retrieves data from browser storage'
  else if (hasAsync)                          purpose = 'Async programming — handles operations that take time (network, timers)'
  else if (hasLoop && funcNames.length > 2)   purpose = 'Data processing — transforms and analyzes collections'
  else if (funcNames.length > 0)              purpose = 'Utility functions — reusable helper logic'

  const parts: string[] = []
  if (hasClass)            parts.push(`defines ${classNames.length > 0 ? classNames.join(', ') : 'a class'}`)
  if (funcNames.length > 0) parts.push(`contains ${funcNames.length} function${funcNames.length > 1 ? 's' : ''} (${funcNames.slice(0, 3).join(', ')}${funcNames.length > 3 ? '…' : ''})`)
  if (hasFetch)            parts.push('makes network requests')
  if (hasAsync)            parts.push('runs asynchronously')
  if (hasLoop)             parts.push('iterates over data')
  if (hasDom)              parts.push('updates the DOM')
  const summary = parts.length > 0
    ? `This code ${parts.join(', ')}.`
    : 'This code contains JavaScript statements.'

  const patterns: Array<{ icon: string; text: string }> = []
  if (hasAsync)              patterns.push({ icon: '⟳', text: 'Async/await — uses Promises; await pauses execution until the Promise resolves, then resumes without blocking the UI thread' })
  if (hasFetch)              patterns.push({ icon: '🌐', text: 'Fetch API — makes HTTP requests to retrieve data from external URLs; returns a Promise that resolves to a Response object' })
  if (hasClass)              patterns.push({ icon: '◈', text: 'Classes — blueprint for creating objects; groups related state (properties) and behaviour (methods) together; supports inheritance via extends' })
  if (hasLoop)               patterns.push({ icon: '↻', text: 'Loops/Iteration — repeatedly applies logic to each element in a collection; map/filter/reduce return new arrays without mutating the original' })
  if (hasDom)                patterns.push({ icon: '🔲', text: 'DOM API — reads and writes the live HTML document; querySelector finds elements, and setting properties like textContent updates what users see' })
  if (hasStorage)            patterns.push({ icon: '💾', text: 'Web Storage — localStorage persists across sessions; sessionStorage lasts only for the current tab; both store strings, so JSON.stringify/parse is used for objects' })
  if (hasExport || hasImport) patterns.push({ icon: '📦', text: 'ES Modules — import/export statements split code into separate files; enables tree-shaking and organised, maintainable codebases' })
  if (lang === 'typescript') patterns.push({ icon: '🔷', text: 'TypeScript — adds static types to JavaScript; type annotations are checked at compile time and stripped from the final JavaScript output' })

  return { summary, purpose, patterns }
}

// ─── Block Test Generator ─────────────────────────────────────────────────────

function generateBlockTestCode(block: LogicBlock, fullCode: string): string {
  const lines = fullCode.split('\n')
  const lineMatch = block.lines.match(/\d+/)
  const startLine = lineMatch ? parseInt(lineMatch[0]) - 1 : 0

  if (block.type === 'function') {
    const funcName = block.name.replace(' (arrow)', '').trim()
    // Extract function/arrow body until balanced braces close
    let funcCode = ''
    let depth = 0
    let started = false
    for (let i = startLine; i < lines.length; i++) {
      funcCode += lines[i] + '\n'
      for (const ch of lines[i]) {
        if (ch === '{') { depth++; started = true }
        if (ch === '}') depth--
      }
      if (started && depth <= 0) break
    }
    // Detect param names from signature
    const paramRe = new RegExp(`(?:function\\s+${funcName}|const\\s+${funcName}\\s*=\\s*(?:async\\s+)?\\()([^)]*?)\\)`)
    const paramMatch = fullCode.match(paramRe)
    const rawParams = paramMatch ? paramMatch[1] : ''
    const params = rawParams.split(',').map((p: string) => p.trim().replace(/[=:][\s\S]*/, '').trim()).filter(Boolean)
    const testArgs = params.map((p: string) => {
      const lower = p.toLowerCase()
      if (/id|count|num|age|size|len|index/.test(lower)) return '42'
      if (/name|str|text|label|title|msg/.test(lower)) return '"test"'
      if (/url|uri|href|path/.test(lower)) return '"https://example.com"'
      if (/arr|list|items|data/.test(lower)) return '[1, 2, 3]'
      if (/obj|config|options|opts/.test(lower)) return '{}'
      if (/flag|enabled|active/.test(lower)) return 'true'
      return '42'
    })
    const callLine = `${funcName}(${testArgs.join(', ')})`
    return `${funcCode}
// ─── Automated test ───────────────────────────────────────
try {
  const result = ${callLine};
  console.log("✓ ${funcName}() returned:", result !== undefined ? JSON.stringify(result) : "undefined");
} catch (e) {
  console.error("✗ ${funcName}() threw:", e.message);
}`
  }

  if (block.type === 'class') {
    const className = block.name
    let classCode = ''
    let depth = 0
    let started = false
    for (let i = startLine; i < lines.length; i++) {
      classCode += lines[i] + '\n'
      for (const ch of lines[i]) {
        if (ch === '{') { depth++; started = true }
        if (ch === '}') depth--
      }
      if (started && depth === 0) break
    }
    return `${classCode}
// ─── Automated test ───────────────────────────────────────
try {
  const instance = new ${className}();
  console.log("✓ ${className} instance created successfully");
  const methods = Object.getOwnPropertyNames(${className}.prototype).filter(m => m !== "constructor");
  console.log("  Methods:", methods.join(", ") || "none");
} catch (e) {
  console.error("✗ Could not instantiate ${className}:", e.message);
}`
  }

  // For other block types run context around the line
  const ctxStart = Math.max(0, startLine - 2)
  const ctxEnd   = Math.min(lines.length, startLine + 6)
  const snippet  = lines.slice(ctxStart, ctxEnd).join('\n')
  return `// Context around ${block.type} at line ${startLine + 1}
${snippet}
console.log("✓ Block executed without errors");`
}

function runBlockCode(code: string): string[] {
  const outputs: string[] = []
  const mockConsole = {
    log:   (...a: unknown[]) => outputs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ')),
    error: (...a: unknown[]) => outputs.push('ERROR: ' + a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
    warn:  (...a: unknown[]) => outputs.push('WARN: ' + a.map(x => String(x)).join(' ')),
    info:  (...a: unknown[]) => outputs.push('INFO: ' + a.map(x => String(x)).join(' ')),
    table: (d: unknown)      => outputs.push('TABLE:\n' + JSON.stringify(d, null, 2)),
    dir:   (o: unknown)      => outputs.push('DIR: ' + JSON.stringify(o, null, 2)),
    time:  (l: string)       => outputs.push(`timer "${l}" started`),
    timeEnd:(l: string)      => outputs.push(`timer "${l}": ~2ms`),
    group: (l: string)       => outputs.push(`▶ ${l}`),
    groupCollapsed: (l: string) => outputs.push(`▶ ${l}`),
    groupEnd: ()             => outputs.push('◀ end'),
    assert: (c: boolean, ...a: unknown[]) => { if (!c) outputs.push('Assertion failed: ' + a.join(' ')) },
    clear: ()                => outputs.push('[Console cleared]'),
    trace: (...a: unknown[]) => outputs.push('Trace: ' + a.join(' ')),
  }
  try {
    // The code executed here is the user's own code, pasted into this client-side tool.
    // It runs entirely in the user's own browser context — there is no server involved.
    // The mock console intercepts output; all other browser APIs remain accessible,
    // which is intentional so users can test real browser APIs in their snippets.
    // eslint-disable-next-line no-new-func
    const fn = new Function('console', code)
    fn(mockConsole)
  } catch (e) {
    outputs.push('Error: ' + (e as Error).message)
  }
  return outputs
}

async function performAnalysis(code: string, lang: 'javascript' | 'typescript'): Promise<AnalysisResult> {
  await new Promise(r => setTimeout(r, 600))
  const lines = code.split('\n')
  const funcCount = (code.match(/\bfunction\b|=>\s*\{|=>\s*\w/g) || []).length
  return {
    efficiency: analyzeEfficiency(code),
    executionStack: buildExecutionStack(code),
    logicBlocks: extractLogicBlocks(code),
    syntaxIssues: checkSyntax(code, lang),
    aiRecommendations: generateAIRecommendations(code, lang),
    language: lang,
    lineCount: lines.filter(l => l.trim()).length,
    functionCount: funcCount,
    complexity: computeComplexity(code),
  }
}

// ─── Sample code ─────────────────────────────────────────────────────────────

const JS_SAMPLE = `// Sample JavaScript — click Analyze to inspect
async function fetchUserData(userId) {
  var url = "https://api.example.com/users/" + userId
  const response = await fetch(url)
  const data = await response.json()
  return data
}

function processItems(items) {
  var results = []
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (items[i] == items[j] && i != j) {
        results.push(items[i])
      }
    }
  }
  return results
}

setTimeout(() => {
  console.log("Timer fired after 1000ms")
}, 1000)

const doubled = [1, 2, 3, 4, 5].map(n => n * 2)
console.log(doubled)
`

const TS_SAMPLE = `// Sample TypeScript — click Analyze to inspect
interface User {
  id: number
  name: string
  role: any   // avoid 'any' in real code
}

async function getUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`)
  const data = await res.json()
  return data
}

function mergeObjects(a: any, b: any) {
  return Object.assign({}, a, b)
}

class UserService {
  private users: User[] = []

  add(user: User) {
    this.users.push(user)
  }

  findById(id: number): User | undefined {
    return this.users.find(u => u.id == id)
  }
}

const service = new UserService()
setTimeout(() => {
  console.log("Service ready")
}, 500)
`

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeverityIcon({ severity }: { severity: 'error' | 'warning' | 'info' }) {
  if (severity === 'error') return <XCircle size={14} className="text-[#ef4444] shrink-0" />
  if (severity === 'warning') return <AlertTriangle size={14} className="text-[#f59e0b] shrink-0" />
  return <Info size={14} className="text-[#38bdf8] shrink-0" />
}

function StackTypeChip({ type }: { type: StackFrame['type'] }) {
  const map: Record<StackFrame['type'], { label: string; color: string }> = {
    sync: { label: 'Sync', color: '#6366f1' },
    microtask: { label: 'Microtask', color: '#8b5cf6' },
    macrotask: { label: 'Macrotask', color: '#f59e0b' },
    function: { label: 'Function', color: '#10b981' },
  }
  const { label, color } = map[type]
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border"
      style={{ color, borderColor: `${color}40`, background: `${color}15` }}>
      {label}
    </span>
  )
}

const BLOCK_COLORS: Record<LogicBlock['type'], string> = {
  function: '#6366f1',
  loop: '#f59e0b',
  conditional: '#10b981',
  async: '#8b5cf6',
  variable: '#64748b',
  class: '#06b6d4',
}

const BLOCK_ICONS: Record<LogicBlock['type'], string> = {
  function: 'ƒ',
  loop: '↻',
  conditional: '⋯',
  async: '⟳',
  variable: '=',
  class: '◈',
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── Code Conversion ─────────────────────────────────────────────────────────

type ConvertLang = 'typescript' | 'python' | 'java' | 'csharp' | 'go' | 'rust' | 'cpp' | 'php' | 'ruby' | 'swift'

const CONVERT_LANG_LABELS: Record<ConvertLang, string> = {
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  cpp: 'C++',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
}

function convertCode(code: string, from: 'javascript' | 'typescript', to: ConvertLang): string {
  const lines = code.split('\n')

  if (to === 'typescript' && from === 'javascript') {
    // JS → TS: add type annotations
    return lines.map(line => {
      let l = line
      // const/let without type
      l = l.replace(/^(\s*)(const|let)\s+(\w+)\s*=\s*(\d+\.?\d*)\s*;?/, '$1$2 $3: number = $4;')
      l = l.replace(/^(\s*)(const|let)\s+(\w+)\s*=\s*(['"`].*['"`])\s*;?/, '$1$2 $3: string = $4;')
      l = l.replace(/^(\s*)(const|let)\s+(\w+)\s*=\s*(true|false)\s*;?/, '$1$2 $3: boolean = $4;')
      l = l.replace(/^(\s*)(const|let)\s+(\w+)\s*=\s*\[\s*\]\s*;?/, '$1$2 $3: unknown[] = [];')
      l = l.replace(/^(\s*)(const|let)\s+(\w+)\s*=\s*\{\s*\}\s*;?/, '$1$2 $3: Record<string, unknown> = {};')
      // function → typed function
      l = l.replace(/^(\s*)function\s+(\w+)\s*\(([^)]*)\)/, (_, indent, name, params) => {
        const typedParams = params ? params.split(',').map((p: string) => `${p.trim()}: unknown`).join(', ') : ''
        return `${indent}function ${name}(${typedParams}): unknown`
      })
      return l
    }).join('\n')
  }

  if (to === 'python') {
    return [
      '# Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to Python',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\/\/(.*)/, '#$1')                             // comments
        l = l.replace(/\bconsole\.log\((.*)\)/, 'print($1)')         // console.log → print
        l = l.replace(/\bconst\s+(\w+)\s*=/, '$1 =')                 // const → =
        l = l.replace(/\blet\s+(\w+)\s*=/, '$1 =')                   // let → =
        l = l.replace(/\bvar\s+(\w+)\s*=/, '$1 =')                   // var → =
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*\{/, 'def $1($2):')  // function → def
        l = l.replace(/\}\s*$/, '')                                   // remove closing braces
        l = l.replace(/;\s*$/, '')                                    // remove semicolons
        l = l.replace(/\bfalse\b/, 'False')
        l = l.replace(/\btrue\b/, 'True')
        l = l.replace(/\bnull\b/, 'None')
        l = l.replace(/\bundefined\b/, 'None')
        l = l.replace(/\bthis\./, 'self.')
        l = l.replace(/===/, '==')
        l = l.replace(/!==/, '!=')
        return l
      })
    ].join('\n')
  }

  if (to === 'java') {
    return [
      '// Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to Java',
      'public class ConvertedCode {',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\bconst\s+(\w+)\s*=\s*(\d+)/, 'final int $1 = $2')
        l = l.replace(/\bconst\s+(\w+)\s*=\s*(['"`].*['"`])/, 'final String $1 = $2')
        l = l.replace(/\blet\s+(\w+)\s*=\s*(\d+)/, 'int $1 = $2')
        l = l.replace(/\blet\s+(\w+)\s*=\s*(['"`].*['"`])/, 'String $1 = $2')
        l = l.replace(/\bconsole\.log\((.*)\)/, 'System.out.println($1)')
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*\{/, 'public static void $1($2) {')
        l = l.replace(/===/, '==')
        l = l.replace(/!==/, '!=')
        return '    ' + l
      }),
      '}',
    ].join('\n')
  }

  if (to === 'csharp') {
    return [
      '// Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to C#',
      'using System;',
      '',
      'class ConvertedCode {',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\bconst\s+(\w+)\s*=\s*(\d+)/, 'const int $1 = $2')
        l = l.replace(/\blet\s+(\w+)\s*=\s*(\d+)/, 'int $1 = $2')
        l = l.replace(/\bconst\s+(\w+)\s*=\s*(['"`].*['"`])/, 'const string $1 = $2')
        l = l.replace(/\bconsole\.log\((.*)\)/, 'Console.WriteLine($1)')
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*\{/, 'static void $1($2) {')
        l = l.replace(/===/, '==')
        l = l.replace(/!==/, '!=')
        return '    ' + l
      }),
      '}',
    ].join('\n')
  }

  if (to === 'go') {
    return [
      '// Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to Go',
      'package main',
      '',
      'import "fmt"',
      '',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\bconsole\.log\((.*)\)/, 'fmt.Println($1)')
        l = l.replace(/\bconst\s+(\w+)\s*=\s*(.+)/, 'const $1 = $2')
        l = l.replace(/\blet\s+(\w+)\s*=\s*(.+)/, '$1 := $2')
        l = l.replace(/\bvar\s+(\w+)\s*=\s*(.+)/, 'var $1 = $2')
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*\{/, 'func $1($2) {')
        l = l.replace(/===/, '==')
        l = l.replace(/!==/, '!=')
        l = l.replace(/;\s*$/, '')
        return l
      }),
    ].join('\n')
  }

  if (to === 'rust') {
    return [
      '// Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to Rust',
      '',
      'fn main() {',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\bconsole\.log\((.*)\)/, 'println!($1)')
        l = l.replace(/\bconst\s+(\w+)\s*=\s*(.+)/, 'const $1: i32 = $2')
        l = l.replace(/\blet\s+(\w+)\s*=\s*(.+)/, 'let mut $1 = $2')
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*\{/, 'fn $1($2) {')
        l = l.replace(/===/, '==')
        l = l.replace(/!==/, '!=')
        l = l.replace(/;\s*$/, ';')
        return '    ' + l
      }),
      '}',
    ].join('\n')
  }

  if (to === 'cpp') {
    return [
      '// Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to C++',
      '#include <iostream>',
      '#include <string>',
      'using namespace std;',
      '',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\bconsole\.log\((.*)\)/, 'cout << $1 << endl')
        l = l.replace(/\bconst\s+(\w+)\s*=\s*(\d+)/, 'const int $1 = $2')
        l = l.replace(/\blet\s+(\w+)\s*=\s*(\d+)/, 'int $1 = $2')
        l = l.replace(/\bconst\s+(\w+)\s*=\s*(['"`].*['"`])/, 'const string $1 = $2')
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*\{/, 'void $1($2) {')
        l = l.replace(/===/, '==')
        l = l.replace(/!==/, '!=')
        return l
      }),
    ].join('\n')
  }

  if (to === 'php') {
    return [
      '<?php',
      '// Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to PHP',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\/\/(.*)/, '//$1')
        l = l.replace(/\bconsole\.log\((.*)\)/, 'echo $1 . "\\n"')
        l = l.replace(/\bconst\s+(\w+)\s*=/, 'define("$1",')
        l = l.replace(/\blet\s+(\w+)\s*=/, '\\$$1 =')
        l = l.replace(/\bvar\s+(\w+)\s*=/, '\\$$1 =')
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*\{/, 'function $1($2) {')
        return l
      }),
      '?>',
    ].join('\n')
  }

  if (to === 'ruby') {
    return [
      '# Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to Ruby',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\/\/(.*)/, '#$1')
        l = l.replace(/\bconsole\.log\((.*)\)/, 'puts $1')
        l = l.replace(/\bconst\s+(\w+)\s*=/, '$1 =')
        l = l.replace(/\blet\s+(\w+)\s*=/, '$1 =')
        l = l.replace(/\bvar\s+(\w+)\s*=/, '$1 =')
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)/, 'def $1($2)')
        l = l.replace(/\}\s*$/, 'end')
        l = l.replace(/;\s*$/, '')
        l = l.replace(/===/, '==')
        l = l.replace(/!==/, '!=')
        l = l.replace(/\bnull\b/, 'nil')
        return l
      }),
    ].join('\n')
  }

  if (to === 'swift') {
    return [
      '// Converted from ' + (from === 'typescript' ? 'TypeScript' : 'JavaScript') + ' to Swift',
      'import Foundation',
      '',
      ...lines.map(line => {
        let l = line
        l = l.replace(/\bconsole\.log\((.*)\)/, 'print($1)')
        l = l.replace(/\bconst\s+(\w+)\s*=/, 'let $1 =')
        l = l.replace(/\blet\s+(\w+)\s*=/, 'var $1 =')
        l = l.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*\{/, 'func $1($2) {')
        l = l.replace(/===/, '==')
        l = l.replace(/!==/, '!=')
        l = l.replace(/;\s*$/, '')
        l = l.replace(/\bnull\b/, 'nil')
        return l
      }),
    ].join('\n')
  }

  return code
}

// ─── Lined Code Editor ───────────────────────────────────────────────────────

function LinedCodeEditor({
  value,
  onChange,
  highlightLine,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  highlightLine?: number | null
  placeholder?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const lines = value.split('\n')
  const lineCount = Math.max(lines.length, 1)

  // Sync scroll between line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  // Jump to a specific line
  const jumpToLine = useCallback((lineNum: number) => {
    const ta = textareaRef.current
    if (!ta) return
    const lines = ta.value.split('\n')
    let pos = 0
    for (let i = 0; i < Math.min(lineNum - 1, lines.length); i++) {
      pos += lines[i].length + 1
    }
    ta.focus()
    ta.setSelectionRange(pos, pos + (lines[lineNum - 1]?.length ?? 0))
    // Scroll to the line
    const lineHeight = 21 // approx px per line at text-sm leading-relaxed
    ta.scrollTop = Math.max(0, (lineNum - 5) * lineHeight)
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = ta.scrollTop
    }
  }, [])

  // Expose jumpToLine via a data attribute trick — use a custom event
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    const handler = (e: Event) => {
      const custom = e as CustomEvent<number>
      jumpToLine(custom.detail)
    }
    el.addEventListener('jump-to-line', handler)
    return () => el.removeEventListener('jump-to-line', handler)
  }, [jumpToLine])

  return (
    <div className="flex-1 flex overflow-hidden min-h-[400px] font-mono text-sm leading-relaxed">
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className="flex-shrink-0 py-4 px-2 overflow-hidden select-none text-right"
        style={{
          width: `${Math.max(String(lineCount).length * 9 + 20, 44)}px`,
          background: 'var(--color-bg)',
          borderRight: '1px solid var(--color-border)',
          color: 'var(--foreground-muted)',
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => i + 1).map(n => (
          <div
            key={n}
            style={{
              lineHeight: '1.625rem',
              background: highlightLine === n ? 'rgba(99,102,241,0.15)' : undefined,
              color: highlightLine === n ? 'var(--color-accent)' : undefined,
              fontWeight: highlightLine === n ? 700 : undefined,
            }}
          >
            {n}
          </div>
        ))}
      </div>
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onScroll={handleScroll}
        spellCheck={false}
        className="code-analyzer-textarea flex-1 resize-none py-4 px-4 outline-none leading-relaxed"
        style={{ background: 'transparent', color: 'var(--foreground)' }}
        placeholder={placeholder}
        onKeyDown={e => {
          if (e.key === 'Tab') {
            e.preventDefault()
            const s = e.currentTarget.selectionStart
            const newCode = value.substring(0, s) + '  ' + value.substring(e.currentTarget.selectionEnd)
            onChange(newCode)
            requestAnimationFrame(() => {
              e.currentTarget.selectionStart = e.currentTarget.selectionEnd = s + 2
            })
          }
        }}
      />
    </div>
  )
}

export default function CodeAnalyzer() {
  const [code, setCode] = useState(JS_SAMPLE)
  const [language, setLanguage] = useState<'javascript' | 'typescript'>('javascript')
  const [activeTab, setActiveTab] = useState<'efficiency' | 'stack' | 'logic' | 'syntax' | 'ai' | 'explain'>('efficiency')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [expandedRec, setExpandedRec] = useState<number | null>(null)
  const [highlightLine, setHighlightLine] = useState<number | null>(null)
  const [showConvert, setShowConvert] = useState(false)
  const [convertTo, setConvertTo] = useState<ConvertLang>('python')
  const [convertedCode, setConvertedCode] = useState('')
  const [convertCopied, setConvertCopied] = useState(false)
  // Block test state
  const [activeBlockTest, setActiveBlockTest] = useState<number | null>(null)
  const [blockTestOutputs, setBlockTestOutputs] = useState<Record<number, string[]>>({})
  const [runningBlockTest, setRunningBlockTest] = useState<number | null>(null)


  const handleLanguageSwitch = useCallback((lang: 'javascript' | 'typescript') => {
    setLanguage(lang)
    setCode(lang === 'typescript' ? TS_SAMPLE : JS_SAMPLE)
    setResult(null)
    setHighlightLine(null)
  }, [])

  const analyze = useCallback(async () => {
    if (!code.trim() || analyzing) return
    setAnalyzing(true)
    setResult(null)
    setHighlightLine(null)
    trackFeatureUsage('Code Analyzer')
    const res = await performAnalysis(code, language)
    setResult(res)
    setAnalyzing(false)
  }, [code, language, analyzing])

  const handleJumpToLine = useCallback((line: number | undefined) => {
    if (!line) return
    setHighlightLine(line)
    // Dispatch custom event to LinedCodeEditor
    const textarea = document.querySelector<HTMLTextAreaElement>('.code-analyzer-textarea')
    if (textarea) {
      textarea.dispatchEvent(new CustomEvent('jump-to-line', { detail: line }))
    }
    // Clear highlight after 3 seconds
    setTimeout(() => setHighlightLine(null), 3000)
  }, [])

  const handleConvert = useCallback(() => {
    const converted = convertCode(code, language, convertTo)
    setConvertedCode(converted)
  }, [code, language, convertTo])

  const handleRunBlockTest = useCallback(async (blockIndex: number, block: LogicBlock) => {
    setRunningBlockTest(blockIndex)
    setActiveBlockTest(blockIndex)
    await new Promise(r => setTimeout(r, 250))
    const testCode = generateBlockTestCode(block, code)
    const outputs = runBlockCode(testCode)
    setBlockTestOutputs(prev => ({ ...prev, [blockIndex]: outputs }))
    setRunningBlockTest(null)
  }, [code])

  const tabs = [
    { id: 'efficiency' as const, label: 'Efficiency', icon: Zap },
    { id: 'stack' as const, label: 'Execution Stack', icon: Layers },
    { id: 'logic' as const, label: 'Logic', icon: GitBranch },
    { id: 'syntax' as const, label: 'Syntax', icon: AlertTriangle },
    { id: 'ai' as const, label: 'AI Tips', icon: Sparkles },
    { id: 'explain' as const, label: 'Explain', icon: BookOpen },
  ]

  const complexityColor = result ? {
    Low: 'text-[#10b981]', Medium: 'text-[#f59e0b]', High: 'text-[#ef4444]',
  }[result.complexity] : ''

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between flex-wrap gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="w-10 h-10 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366f1]/30"
          >
            <FileCode2 size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Code Analyzer</h1>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Analyze efficiency, execution, logic, syntax & get AI recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language selector */}
          <div className="flex gap-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-1">
            {(['javascript', 'typescript'] as const).map(lang => (
              <motion.button
                key={lang}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLanguageSwitch(lang)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  language === lang ? 'bg-[var(--color-accent)] text-[var(--foreground)]' : 'hover:opacity-80'
                }`}
                style={language !== lang ? { color: 'var(--foreground-muted)' } : {}}
              >
                {lang === 'javascript' ? 'JS' : 'TS'}
              </motion.button>
            ))}
          </div>
          {/* Convert toggle */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowConvert(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              showConvert
                ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--foreground)]'
                : 'bg-[var(--color-card)] border-[var(--color-border)] hover:opacity-80'
            }`}
            style={!showConvert ? { color: 'var(--foreground-muted)' } : {}}
          >
            <FileCode2 size={12} />Convert
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={analyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] hover:opacity-90 disabled:opacity-60 text-[var(--foreground)] text-sm font-medium rounded-lg transition-opacity"
          >
            {analyzing ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Play size={14} />
            )}
            {analyzing ? 'Analyzing…' : 'Analyze'}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Code Editor with line numbers */}
        <motion.div
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]/60" />
              </div>
              <span className="text-xs font-mono ml-1" style={{ color: 'var(--foreground-muted)' }}>
                {language === 'javascript' ? 'script.js' : 'script.ts'}
              </span>
            </div>
            <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{code.split('\n').length} lines</span>
          </div>
          <LinedCodeEditor
            value={code}
            onChange={v => { setCode(v); setResult(null); setHighlightLine(null) }}
            highlightLine={highlightLine}
            placeholder="Paste your JavaScript or TypeScript code here…"
          />
        </motion.div>

        {/* Analysis Panel */}
        <motion.div
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {/* Tabs */}
          <div className="flex overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === id
                    ? 'border-[var(--color-accent)]'
                    : 'border-transparent hover:opacity-80'
                }`}
                style={{ color: activeTab === id ? 'var(--foreground)' : 'var(--foreground-muted)' }}
              >
                <Icon size={13} />
                {label}
                {result && id === 'syntax' && result.syntaxIssues.some(i => i.type === 'error') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                )}
              </button>
            ))}
          </div>

          {/* Summary bar */}
          {result && (
            <div className="flex items-center gap-4 px-4 py-2 border-b border-[var(--color-border)] text-xs flex-wrap" style={{ color: 'var(--foreground-muted)' }}>
              <span>{result.lineCount} lines</span>
              <span>{result.functionCount} functions</span>
              <span>Complexity: <span className={complexityColor}>{result.complexity}</span></span>
              <span className="ml-auto capitalize" style={{ color: 'var(--color-accent)' }}>{result.language}</span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 min-h-[340px]">
            {!result && !analyzing && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)' }}>
                  <Play size={22} style={{ color: 'var(--color-accent)' }} />
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Click <strong style={{ color: 'var(--foreground)' }}>Analyze</strong> to inspect your code</p>
                <p className="text-xs" style={{ color: 'var(--foreground-muted)', opacity: 0.7 }}>Detects efficiency issues, execution order, logic structure, syntax errors and provides AI recommendations</p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-10">
                <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Analyzing your code…</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  {/* ── Efficiency Tab ── */}
                  {activeTab === 'efficiency' && result.efficiency.map((issue, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-3 border space-y-1.5 transition-colors"
                      style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                    >
                      <div className="flex items-start gap-2">
                        <SeverityIcon severity={issue.severity} />
                        <p className="text-sm leading-snug flex-1" style={{ color: 'var(--foreground)' }}>{issue.message}</p>
                        {issue.line && (
                          <button
                            onClick={() => handleJumpToLine(issue.line)}
                            className="text-[10px] px-2 py-0.5 rounded border flex-shrink-0 hover:opacity-80 transition-opacity font-mono"
                            style={{ color: 'var(--color-accent)', borderColor: 'color-mix(in srgb, var(--color-accent) 30%, transparent)', background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)' }}
                            title="Click to jump to this line in the editor"
                          >
                            line {issue.line}
                          </button>
                        )}
                      </div>
                      <div className="ml-5 text-xs rounded p-2 leading-relaxed" style={{ color: 'var(--color-accent)', background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)' }}>
                        💡 {issue.suggestion}
                      </div>
                    </div>
                  ))}

                  {/* ── Execution Stack Tab ── */}
                  {activeTab === 'stack' && (
                    <div className="space-y-2">
                      <p className="text-xs mb-3" style={{ color: 'var(--foreground-muted)' }}>JavaScript execution order — synchronous first, then microtasks, then macrotasks.</p>
                      {result.executionStack.map((frame, i) => (
                        <div key={i} className="flex items-start gap-2" style={{ paddingLeft: `${frame.depth * 16}px` }}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5" style={{ background: 'var(--color-border)', color: 'var(--foreground-muted)' }}>
                            {i + 1}
                          </div>
                          <div className="flex-1 rounded-lg p-2.5 border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <StackTypeChip type={frame.type} />
                              <span className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>{frame.label}</span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{frame.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Logic Tab ── */}
                  {activeTab === 'logic' && (
                    <div className="space-y-2">
                      <p className="text-xs mb-3" style={{ color: 'var(--foreground-muted)' }}>
                        Structural elements detected in your code. Click any block to jump to it in the editor, or click <strong style={{ color: 'var(--foreground)' }}>Test</strong> to run automated tests with sample data.
                      </p>
                      {result.logicBlocks.length === 0 ? (
                        <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>No named structures found — try adding functions, classes, or control flow.</p>
                      ) : (
                        result.logicBlocks.map((block, i) => {
                          const color = BLOCK_COLORS[block.type]
                          const icon = BLOCK_ICONS[block.type]
                          const lineMatch = block.lines.match(/\d+/)
                          const lineNum = lineMatch ? parseInt(lineMatch[0]) : undefined
                          const canTest = block.type === 'function' || block.type === 'class'
                          const isTestOpen = activeBlockTest === i
                          const testOut = blockTestOutputs[i]
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className="border rounded-lg overflow-hidden"
                              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                            >
                              <div
                                className="flex items-center gap-3 p-3 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => lineNum && handleJumpToLine(lineNum)}
                                title={lineNum ? `Click to jump to line ${lineNum}` : undefined}
                              >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                                  style={{ background: `${color}20`, color }}>
                                  {icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{block.name}</span>
                                    <span className="text-[10px] shrink-0" style={{ color: 'var(--foreground-muted)' }}>{block.lines}</span>
                                  </div>
                                  <p className="text-xs truncate" style={{ color: 'var(--foreground-muted)' }}>{block.detail}</p>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded border shrink-0 capitalize"
                                  style={{ color, borderColor: `${color}40`, background: `${color}15` }}>
                                  {block.type}
                                </span>
                                {canTest && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={e => { e.stopPropagation(); handleRunBlockTest(i, block) }}
                                    disabled={runningBlockTest === i}
                                    className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-medium border shrink-0 transition-colors"
                                    style={{ background: 'color-mix(in srgb, #6366f1 12%, transparent)', borderColor: '#6366f140', color: '#6366f1' }}
                                    title={`Run automated test for ${block.name}`}
                                  >
                                    {runningBlockTest === i ? (
                                      <div className="w-2.5 h-2.5 rounded-full border border-t-transparent animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
                                    ) : (
                                      <FlaskConical size={10} />
                                    )}
                                    Test
                                  </motion.button>
                                )}
                              </div>
                              {/* Inline test output */}
                              <AnimatePresence>
                                {isTestOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                                      <div className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ background: 'color-mix(in srgb, #0a0a0f 60%, var(--color-card))', borderColor: 'var(--color-border)' }}>
                                        <Terminal size={11} style={{ color: '#6366f1' }} />
                                        <span className="text-[10px] font-mono font-semibold" style={{ color: '#6366f1' }}>Test Output — {block.name}</span>
                                        <button
                                          onClick={() => { setActiveBlockTest(null); setBlockTestOutputs(p => { const n = { ...p }; delete n[i]; return n }) }}
                                          className="ml-auto text-[10px] px-1.5 py-0.5 rounded hover:opacity-70"
                                          style={{ color: 'var(--foreground-muted)' }}
                                        >✕</button>
                                      </div>
                                      <div className="p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto" style={{ background: 'color-mix(in srgb, #0a0a0f 80%, transparent)' }}>
                                        {runningBlockTest === i ? (
                                          <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
                                            <div className="w-3 h-3 rounded-full border border-t-transparent animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
                                            Running tests…
                                          </div>
                                        ) : testOut && testOut.length > 0 ? (
                                          testOut.map((line, li) => (
                                            <motion.div
                                              key={li}
                                              initial={{ opacity: 0, x: -8 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: li * 0.04 }}
                                              className={`whitespace-pre-wrap break-all ${
                                                line.startsWith('ERROR:') ? 'text-[#ef4444]'
                                                : line.startsWith('WARN:') ? 'text-[#f59e0b]'
                                                : line.startsWith('✓') ? 'text-[#10b981]'
                                                : line.startsWith('✗') ? 'text-[#ef4444]'
                                                : 'text-[var(--foreground)]'
                                              }`}
                                            >
                                              {line}
                                            </motion.div>
                                          ))
                                        ) : (
                                          <div style={{ color: '#64748b' }}>No output</div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )
                        })
                      )}
                    </div>
                  )}

                  {/* ── Syntax Tab ── */}
                  {activeTab === 'syntax' && (
                    <div className="space-y-2">
                      <p className="text-xs mb-1" style={{ color: 'var(--foreground-muted)' }}>
                        JS uses real browser parsing; TS uses heuristic pattern checks. These are educational hints, not a full compiler.
                      </p>
                      {result.syntaxIssues.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-[#10b981]">
                          <CheckCircle size={16} />
                          No syntax issues detected
                        </div>
                      ) : (
                        result.syntaxIssues.map((issue, i) => (
                          <div
                            key={i}
                            className="rounded-lg p-3 border flex items-start gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                            onClick={() => issue.line && handleJumpToLine(issue.line)}
                            title={issue.line ? `Click to jump to line ${issue.line}` : undefined}
                          >
                            {issue.type === 'error'
                              ? <XCircle size={14} className="text-[#ef4444] shrink-0 mt-0.5" />
                              : issue.type === 'warning'
                              ? <AlertTriangle size={14} className="text-[#f59e0b] shrink-0 mt-0.5" />
                              : <Info size={14} className="text-[#38bdf8] shrink-0 mt-0.5" />
                            }
                            <p className="text-sm leading-snug flex-1" style={{ color: 'var(--foreground)' }}>{issue.message}</p>
                            {issue.line && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded border shrink-0 font-mono"
                                style={{ color: 'var(--color-accent)', borderColor: 'color-mix(in srgb, var(--color-accent) 30%, transparent)', background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)' }}
                              >
                                :{issue.line}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* ── AI Tips Tab ── */}
                  {activeTab === 'ai' && (
                    <div className="space-y-3">
                      <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>AI-powered recommendations to improve your {language === 'typescript' ? 'TypeScript' : 'JavaScript'} code.</p>
                      {result.aiRecommendations.map((rec, i) => (
                        <div key={i} className="border rounded-lg overflow-hidden" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                          <button
                            className="w-full flex items-center gap-3 px-3 py-3 text-left transition-colors hover:opacity-80"
                            onClick={() => setExpandedRec(expandedRec === i ? null : i)}
                          >
                            <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center shrink-0">
                              <Sparkles size={12} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{rec.title}</span>
                              </div>
                              <span className="text-[10px]" style={{ color: 'var(--color-accent)' }}>{rec.category}</span>
                            </div>
                            {expandedRec === i
                              ? <ChevronUp size={14} style={{ color: 'var(--foreground-muted)' }} className="shrink-0" />
                              : <ChevronDown size={14} style={{ color: 'var(--foreground-muted)' }} className="shrink-0" />
                            }
                          </button>
                          <AnimatePresence>
                            {expandedRec === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 pt-1 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{rec.description}</p>
                                  {rec.example && (
                                    <pre className="rounded-lg p-3 text-xs font-mono overflow-x-auto border leading-relaxed"
                                      style={{ background: 'var(--color-card)', color: '#a5b4fc', borderColor: 'var(--color-border)' }}>
                                      {rec.example}
                                    </pre>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* ── Explain Tab ── */}
                  {activeTab === 'explain' && (() => {
                    const explanation = explainCode(code, language)
                    return (
                      <div className="space-y-4">
                        {/* Purpose badge */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-start gap-3 rounded-xl p-4 border"
                          style={{ background: 'color-mix(in srgb, var(--color-accent) 8%, var(--color-bg))', borderColor: 'color-mix(in srgb, var(--color-accent) 25%, transparent)' }}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--color-accent) 20%, transparent)' }}>
                            <Lightbulb size={16} style={{ color: 'var(--color-accent)' }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-accent)' }}>
                              {explanation.purpose}
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                              {explanation.summary}
                            </p>
                          </div>
                        </motion.div>

                        {/* Pattern explanations */}
                        {explanation.patterns.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-2" style={{ color: 'var(--foreground-muted)' }}>Key patterns & concepts used:</p>
                            <div className="space-y-2">
                              {explanation.patterns.map((p, pi) => (
                                <motion.div
                                  key={pi}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: pi * 0.06 }}
                                  className="flex items-start gap-3 rounded-lg p-3 border"
                                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                                >
                                  <span className="text-lg leading-none shrink-0">{p.icon}</span>
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{p.text}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {explanation.patterns.length === 0 && (
                          <div className="text-sm text-center py-4" style={{ color: 'var(--foreground-muted)' }}>
                            No specific patterns detected. Try pasting more complex code.
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ─── Code Conversion Panel ─── */}
      <AnimatePresence>
        {showConvert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border rounded-xl overflow-hidden"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b flex-wrap" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
              <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                <FileCode2 size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Code Converter — {language === 'javascript' ? 'JavaScript' : 'TypeScript'} →
              </span>
              {/* Target language selector */}
              <div className="flex flex-wrap gap-1">
                {(Object.keys(CONVERT_LANG_LABELS) as ConvertLang[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setConvertTo(lang)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                      convertTo === lang ? 'text-white' : 'hover:opacity-80'
                    }`}
                    style={
                      convertTo === lang
                        ? { background: 'var(--color-accent)', borderColor: 'var(--color-accent)' }
                        : { borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }
                    }
                  >
                    {CONVERT_LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
              <button
                onClick={handleConvert}
                className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-[var(--foreground)] transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-accent)' }}
              >
                <Play size={12} />Convert
              </button>
            </div>

            {convertedCode && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>
                    Converted to {CONVERT_LANG_LABELS[convertTo]}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(convertedCode).then(() => {
                        setConvertCopied(true)
                        setTimeout(() => setConvertCopied(false), 2000)
                      }).catch(() => {})
                    }}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors hover:opacity-80"
                    style={{ color: 'var(--foreground-muted)', borderColor: 'var(--color-border)' }}
                  >
                    {convertCopied ? <CheckCircle size={11} className="text-[#10b981]" /> : <FileCode2 size={11} />}
                    {convertCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre
                  className="text-xs font-mono p-4 rounded-xl border overflow-x-auto leading-relaxed"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--foreground)' }}
                >
                  {convertedCode}
                </pre>
                <p className="text-xs mt-2" style={{ color: 'var(--foreground-muted)', opacity: 0.6 }}>
                  ⚠️ This is a structural conversion to help you get started. Review and adjust types, idioms, and library APIs for your target language.
                </p>
              </div>
            )}

            {!convertedCode && (
              <div className="p-8 text-center" style={{ color: 'var(--foreground-muted)' }}>
                <FileCode2 size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Select a target language above and click Convert</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Footer */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        {[
          { icon: Zap, title: 'Efficiency', color: '#6366f1', desc: 'Identifies algorithmic complexity issues (O(n²) loops, DOM queries in loops, missing memoization) that slow down your app.' },
          { icon: Layers, title: 'Execution Stack', color: '#8b5cf6', desc: 'Visualizes how JavaScript executes your code: call stack → microtasks (Promises) → macrotasks (timers). Essential for debugging async bugs.' },
          { icon: BookOpen, title: 'Explain & Test', color: '#10b981', desc: 'Explains what your code is trying to achieve in plain English, and lets you run automated tests on each detected function or class.' },
        ].map(({ icon: Icon, title, color, desc }) => (
          <motion.div
            key={title}
            whileHover={{ y: -2 }}
            className="border rounded-xl p-4 flex items-start gap-3"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
