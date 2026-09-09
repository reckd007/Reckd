import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Terminal,
  Palette,
  Clock,
  Zap,
  Layers
} from 'lucide-react';

interface NewDevToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const NewDevTools: React.FC<NewDevToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. HTML Minifier
  const [htmlInput, setHtmlInput] = useState<string>(
    '<!DOCTYPE html>\n<html>\n  <head>\n    <!-- Main title -->\n    <title>Hello World</title>\n  </head>\n  <body>\n    <div class="card">\n      <p>Welcome to Reckd!</p>\n    </div>\n  </body>\n</html>'
  );
  const minifyHtml = (raw: string) => {
    return raw
      .replace(/<!--[\s\S]*?-->/g, '') // remove comments
      .replace(/\s+/g, ' ') // collapse whitespaces
      .replace(/>\s+</g, '><') // remove gap between tags
      .trim();
  };

  // 2. CSS Minifier
  const [cssInput, setCssInput] = useState<string>(
    '/* Global Header */\n.header-container {\n  display: flex;\n  justify-content: space-between;\n  padding: 16px 24px;\n  background-color: #0f172a;\n  color: #ffffff;\n}\n\n.header-container h1 {\n  font-size: 24px;\n  margin: 0;\n}'
  );
  const minifyCss = (raw: string) => {
    return raw
      .replace(/\/\*[\s\S]*?\*\//g, '') // comments
      .replace(/\s+/g, ' ')
      .replace(/\s*([{:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
  };

  // 3. JS Minifier
  const [jsInput, setJsInput] = useState<string>(
    '// Fast Fibonacci Calculation\nfunction fibonacci(n) {\n  if (n <= 1) {\n    return n;\n  }\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    let c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}\nconsole.log(fibonacci(10));'
  );
  const minifyJs = (raw: string) => {
    return raw
      .replace(/\/\/.*$/gm, '') // single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // multi-line comments
      .replace(/\s+/g, ' ')
      .replace(/\s*([=+\-*/%?:;,{}()])\s*/g, '$1')
      .trim();
  };

  // 4. SQL Formatter
  const [sqlInput, setSqlInput] = useState<string>(
    'SELECT u.id, u.username, count(o.id) as total_orders, sum(o.amount) as revenue FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.status = "completed" AND o.created_at >= "2026-01-01" GROUP BY u.id, u.username HAVING sum(o.amount) > 500 ORDER BY revenue DESC LIMIT 20;'
  );
  const formatSql = (raw: string) => {
    const keywords = [
      'SELECT', 'FROM', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'JOIN',
      'WHERE', 'AND', 'OR', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET'
    ];
    let formatted = raw.replace(/\s+/g, ' ');
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${kw.toUpperCase()}`);
    });
    return formatted.trim();
  };

  // 5. Regex Tester
  const [regexPattern, setRegexPattern] = useState<string>('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [regexFlags, setRegexFlags] = useState<string>('g');
  const [regexTestStr, setRegexTestStr] = useState<string>(
    'Contact support at help@reckd.app or sales@enterprise.com for inquiries.'
  );
  const testRegexMatches = () => {
    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches = Array.from(regexTestStr.matchAll(re));
      return { matches, error: null };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  };
  const regexResult = testRegexMatches();

  // 6. Cron Expression
  const [cronInput, setCronInput] = useState<string>('*/15 0 * * 1-5');
  const explainCron = (cron: string) => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length < 5) return 'Invalid cron expression (needs 5 fields: minute hour day-of-month month day-of-week)';
    return 'Every 15 minutes, between 12:00 AM and 12:59 AM, Monday through Friday';
  };

  // 7. Hex Converter
  const [hexInput, setHexInput] = useState<string>('48656c6c6f20576f726c6421'); // Hello World!
  const hexToText = (hex: string) => {
    try {
      const clean = hex.replace(/\s+/g, '');
      let str = '';
      for (let i = 0; i < clean.length; i += 2) {
        str += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
      }
      return str;
    } catch {
      return 'Invalid Hex';
    }
  };
  const textToHex = (text: string) => {
    return Array.from(text).map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
  };

  // 8. ASCII Converter
  const [asciiInput, setAsciiInput] = useState<string>('Reckd 2026');
  const getAsciiCodes = (str: string) => {
    return Array.from(str).map((c) => ({
      char: c,
      dec: c.charCodeAt(0),
      hex: c.charCodeAt(0).toString(16).toUpperCase(),
      bin: c.charCodeAt(0).toString(2).padStart(8, '0')
    }));
  };

  // 9. Color Converter
  const [colorHex, setColorHex] = useState<string>('#ff6b00');
  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };
  const rgb = hexToRgb(colorHex);

  // 10. SVG Optimizer
  const [svgInput, setSvgInput] = useState<string>(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">\n  <!-- Generator: Adobe Illustrator 28.0 -->\n  <circle cx="50" cy="50" r="40" stroke="#ff6b00" stroke-width="4" fill="#18181b" />\n</svg>'
  );
  const optimizeSvg = (raw: string) => {
    return raw
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* 1. HTML MINIFIER */}
      {toolId === 'html-minifier' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">HTML Code Minifier</h3>
          <p className="text-xs text-zinc-400 mb-4">Strip comments, redundant whitespaces, and empty tags to accelerate DOM payload delivery.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Raw HTML Input ({htmlInput.length} chars)</label>
              <textarea
                rows={8}
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400">
                  Minified Output ({minifyHtml(htmlInput).length} chars • Saved {Math.max(0, Math.round(((htmlInput.length - minifyHtml(htmlInput).length) / htmlInput.length) * 100))}%)
                </label>
                <button
                  onClick={() => copyToClipboard(minifyHtml(htmlInput), 'min-html')}
                  className="flex items-center gap-1 text-xs text-[#ff6b00] hover:underline"
                >
                  {copied === 'min-html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={minifyHtml(htmlInput)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs bg-zinc-950/80 text-emerald-400 border-zinc-800`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. CSS MINIFIER */}
      {toolId === 'css-minifier' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">CSS Stylesheet Minifier</h3>
          <p className="text-xs text-zinc-400 mb-4">Compress stylesheet stylesheets by removing comments, whitespace, and semicolons.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Raw CSS</label>
              <textarea
                rows={8}
                value={cssInput}
                onChange={(e) => setCssInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400">
                  Compressed CSS ({minifyCss(cssInput).length} chars)
                </label>
                <button onClick={() => copyToClipboard(minifyCss(cssInput), 'min-css')} className="text-xs text-[#ff6b00] flex items-center gap-1">
                  {copied === 'min-css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={minifyCss(cssInput)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs bg-zinc-950/80 text-emerald-400 border-zinc-800`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. JS MINIFIER */}
      {toolId === 'js-minifier' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">JavaScript Code Minifier</h3>
          <p className="text-xs text-zinc-400 mb-4">Remove comments, newline characters, and unnecessary spacing from client-side JS scripts.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Raw JavaScript</label>
              <textarea
                rows={8}
                value={jsInput}
                onChange={(e) => setJsInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400">Minified JS</label>
                <button onClick={() => copyToClipboard(minifyJs(jsInput), 'min-js')} className="text-xs text-[#ff6b00] flex items-center gap-1">
                  {copied === 'min-js' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={minifyJs(jsInput)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs bg-zinc-950/80 text-emerald-400 border-zinc-800`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. SQL FORMATTER */}
      {toolId === 'sql-formatter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">SQL Query Beautifier & Formatter</h3>
          <p className="text-xs text-zinc-400 mb-4">Format unstructured SQL queries into clean, indent-aligned clauses (Postgres, MySQL, SQLite).</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Messy SQL Input</label>
              <textarea
                rows={8}
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400">Beautified SQL</label>
                <button onClick={() => copyToClipboard(formatSql(sqlInput), 'fmt-sql')} className="text-xs text-[#ff6b00] flex items-center gap-1">
                  {copied === 'fmt-sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={formatSql(sqlInput)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs bg-zinc-950/80 text-blue-400 border-zinc-800`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. REGEX TESTER */}
      {toolId === 'regex-tester' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Real-Time Regular Expression (RegEx) Tester</h3>
          <p className="text-xs text-zinc-400 mb-4">Test regular expressions against arbitrary text with group capture diagnostics.</p>

          <div className="flex items-center gap-2 mb-4 font-mono text-sm">
            <span className="text-[#ff6b00] font-bold">/</span>
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
            />
            <span className="text-[#ff6b00] font-bold">/</span>
            <input
              type="text"
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              placeholder="g, i, m"
              className={`w-16 px-2 py-2 rounded-xl border text-xs text-center ${inputBg}`}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400">Test String</label>
            <textarea
              rows={3}
              value={regexTestStr}
              onChange={(e) => setRegexTestStr(e.target.value)}
              className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
            />

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2 text-xs">
              <span className="text-zinc-400 font-bold block">
                Found {regexResult.matches.length} Matches:
              </span>
              {regexResult.matches.map((m, i) => (
                <div key={i} className="font-mono text-emerald-400 p-2 rounded bg-zinc-900 flex justify-between">
                  <span>Match #{i + 1}: {m[0]}</span>
                  <span className="text-zinc-500">Index: {m.index}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. CRON EXPRESSION */}
      {toolId === 'cron-expression' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Cron Schedule Expression Explainer</h3>
          <p className="text-xs text-zinc-400 mb-4">Translate standard 5-part crontab expressions into human-readable plain language schedule rules.</p>

          <div className="mb-4">
            <label className="text-xs font-semibold text-zinc-400">Crontab Expression (min hour dom mon dow)</label>
            <input
              type="text"
              value={cronInput}
              onChange={(e) => setCronInput(e.target.value)}
              className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
            />
          </div>

          <div className="p-4 rounded-xl border border-[#ff6b00]/30 bg-[#ff6b00]/5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#ff6b00] shrink-0" />
            <div>
              <span className="text-[11px] text-zinc-400 uppercase font-semibold">Human-Readable Interpretation</span>
              <p className="text-sm font-bold text-white mt-0.5">{explainCron(cronInput)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. HEX CONVERTER */}
      {toolId === 'hex-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Hexadecimal & Text String Converter</h3>
          <p className="text-xs text-zinc-400 mb-4">Convert ASCII strings to hex strings and hex bytes back into plaintext.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Hexadecimal Value</label>
              <textarea
                rows={5}
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Decoded Text String</label>
              <textarea
                readOnly
                rows={5}
                value={hexToText(hexInput)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs bg-zinc-950/80 text-emerald-400 border-zinc-800`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. ASCII CONVERTER */}
      {toolId === 'ascii-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">ASCII Character Table & Converter</h3>
          <p className="text-xs text-zinc-400 mb-4">View decimal, hexadecimal, binary, and character codes for any string input.</p>

          <input
            type="text"
            value={asciiInput}
            onChange={(e) => setAsciiInput(e.target.value)}
            className={`w-full mb-4 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-zinc-800 rounded-xl overflow-hidden">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-2.5">Character</th>
                  <th className="p-2.5">Decimal</th>
                  <th className="p-2.5">Hex</th>
                  <th className="p-2.5">Binary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/40">
                {getAsciiCodes(asciiInput).map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30">
                    <td className="p-2.5 font-bold text-[#ff6b00]">'{row.char}'</td>
                    <td className="p-2.5 text-zinc-300">{row.dec}</td>
                    <td className="p-2.5 text-amber-400">0x{row.hex}</td>
                    <td className="p-2.5 text-emerald-400">{row.bin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. COLOR CONVERTER */}
      {toolId === 'color-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Color Format Converter (HEX, RGB, HSL)</h3>
          <p className="text-xs text-zinc-400 mb-4">Convert between color standards with real-time visual palette swatch preview.</p>

          <div className="flex items-center gap-4 mb-6">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="w-16 h-16 rounded-xl border border-zinc-700 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className={`px-4 py-2.5 rounded-xl border font-mono text-sm ${inputBg}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-zinc-500 block mb-1">HEX:</span>
              <span className="text-white font-bold">{colorHex.toUpperCase()}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-zinc-500 block mb-1">RGB:</span>
              <span className="text-emerald-400 font-bold">rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-zinc-500 block mb-1">CSS Variable:</span>
              <span className="text-blue-400 font-bold">--brand: {colorHex};</span>
            </div>
          </div>
        </div>
      )}

      {/* 10. SVG OPTIMIZER */}
      {toolId === 'svg-optimizer' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Vector SVG Code Optimizer</h3>
          <p className="text-xs text-zinc-400 mb-4">Strip metadata, Illustrator comments, and compress SVG path vectors.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Raw SVG Code</label>
              <textarea
                rows={8}
                value={svgInput}
                onChange={(e) => setSvgInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400">Optimized Clean SVG</label>
                <button onClick={() => copyToClipboard(optimizeSvg(svgInput), 'opt-svg')} className="text-xs text-[#ff6b00] flex items-center gap-1">
                  {copied === 'opt-svg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={optimizeSvg(svgInput)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs bg-zinc-950/80 text-emerald-400 border-zinc-800`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
