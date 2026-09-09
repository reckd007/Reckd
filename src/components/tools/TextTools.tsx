import React, { useState } from 'react';
import { Copy, Check, Sparkles, Volume2, ArrowUpDown, Shuffle, Trash2 } from 'lucide-react';

interface TextToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const TextTools: React.FC<TextToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1 & 2. Word & Character Counter
  const [wordCountText, setWordCountText] = useState<string>(
    'Reckd delivers futuristic utility tools straight into your browser with zero latency. Everything useful in one place.'
  );

  const words = wordCountText.trim() ? wordCountText.trim().split(/\s+/).length : 0;
  const charsWithSpaces = wordCountText.length;
  const charsNoSpaces = wordCountText.replace(/\s/g, '').length;
  const paragraphs = wordCountText.trim() ? wordCountText.split(/\n+/).length : 0;
  const sentences = wordCountText.trim() ? (wordCountText.match(/[^.!?]+[.!?]+/g) || []).length || (wordCountText.trim().length > 0 ? 1 : 0) : 0;
  const readingTimeMin = Math.ceil(words / 200);
  const speakingTimeMin = Math.ceil(words / 130);

  // 3. Case Converter
  const [caseInput, setCaseInput] = useState<string>('Next generation browser utility platform for creators');
  const toTitleCase = (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  const toCamelCase = (str: string) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  const toSnakeCase = (str: string) => str.toLowerCase().trim().replace(/[^a-zA-Z0-9]+/g, '_');
  const toKebabCase = (str: string) => str.toLowerCase().trim().replace(/[^a-zA-Z0-9]+/g, '-');
  const toPascalCase = (str: string) => (' ' + str).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  const toAlternatingCase = (str: string) => str.split('').map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('');

  // 4. Lorem Ipsum Generator
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [loremCount, setLoremCount] = useState<number>(3);
  const [loremResult, setLoremResult] = useState<string>('');

  const generateLorem = () => {
    const baseSentences = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Curabitur pretium tincidunt lacus, nec vehicula diam elementum id.',
      'Vivamus hendrerit arcu sed erat molestie vehicula.',
    ];
    if (loremType === 'words') {
      const words = baseSentences.join(' ').split(' ');
      setLoremResult(words.slice(0, loremCount).join(' ') + '.');
    } else if (loremType === 'sentences') {
      const arr: string[] = [];
      for (let i = 0; i < loremCount; i++) {
        arr.push(baseSentences[i % baseSentences.length]);
      }
      setLoremResult(arr.join(' '));
    } else {
      const paras: string[] = [];
      for (let i = 0; i < loremCount; i++) {
        paras.push(baseSentences.slice(0, 4).join(' '));
      }
      setLoremResult(paras.join('\n\n'));
    }
  };

  // 5. Text Diff Checker
  const [diffOriginal, setDiffOriginal] = useState<string>('The fast orange fox jumped over the sleeping dog.');
  const [diffModified, setDiffModified] = useState<string>('The swift orange fox leaped over the resting canine.');

  // 6. Markdown Editor & Live Preview
  const [markdownText, setMarkdownText] = useState<string>(
    `# Welcome to Reckd\n\n- **Fast**: 100+ utilities\n- **Client-Side**: 100% private\n\n> "Everything Useful. One Place."\n\n\`\`\`javascript\nconsole.log("Future is here");\n\`\`\``
  );

  // 7. Remove Duplicate Lines
  const [dupLinesInput, setDupLinesInput] = useState<string>("apple\norange\nbanana\napple\ngrape\norange\nwatermelon");
  const [dedupSorted, setDedupSorted] = useState<boolean>(false);
  const getDedupedLines = () => {
    const lines = dupLinesInput.split('\n').filter((l) => l.trim() !== '');
    let unique: string[] = Array.from(new Set(lines));
    if (dedupSorted) unique = unique.sort((a, b) => a.localeCompare(b));
    return unique.join('\n');
  };

  // 8. Find and Replace
  const [frSource, setFrSource] = useState<string>('Hello world, welcome to our world of utilities.');
  const [frFind, setFrFind] = useState<string>('world');
  const [frReplace, setFrReplace] = useState<string>('universe');
  const [frCaseSensitive, setFrCaseSensitive] = useState<boolean>(false);
  const getReplacedText = () => {
    if (!frFind) return frSource;
    try {
      const regex = new RegExp(frFind, frCaseSensitive ? 'g' : 'gi');
      return frSource.replace(regex, frReplace);
    } catch {
      return frSource;
    }
  };

  // 9. Text Sorter
  const [sortInput, setSortInput] = useState<string>("Zeta\nAlpha\nGamma\nBeta\nDelta");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'reverse' | 'shuffle'>('asc');
  const getSortedLines = () => {
    const lines = sortInput.split('\n');
    if (sortOrder === 'asc') return [...lines].sort((a, b) => a.localeCompare(b)).join('\n');
    if (sortOrder === 'desc') return [...lines].sort((a, b) => b.localeCompare(a)).join('\n');
    if (sortOrder === 'reverse') return [...lines].reverse().join('\n');
    if (sortOrder === 'shuffle') return [...lines].sort(() => Math.random() - 0.5).join('\n');
    return sortInput;
  };

  // 10. Slug Generator
  const [slugSource, setSlugSource] = useState<string>('10 Best Design Systems & Animations in 2026!');
  const generateSlug = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  // 11. Morse Code
  const [morseInput, setMorseInput] = useState<string>('SOS RECKD');
  const morseDict: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
    I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
    Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
    Y: '-.--', Z: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': ' / ',
  };
  const toMorse = (str: string) =>
    str.toUpperCase().split('').map((c) => morseDict[c] || c).join(' ');

  // 12. String Reverser
  const [revInput, setRevInput] = useState<string>('Hello Reckd World');
  const reversedChars = revInput.split('').reverse().join('');
  const reversedWords = revInput.split(' ').reverse().join(' ');

  // 13. Palindrome Checker
  const [palinText, setPalinText] = useState<string>('A man a plan a canal Panama');
  const cleanPalin = palinText.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isPalindrome = cleanPalin.length > 0 && cleanPalin === cleanPalin.split('').reverse().join('');

  // 14. Fancy Text Generator
  const [fancyInput, setFancyInput] = useState<string>('Reckd Future');
  const fancyStyles = [
    {
      name: 'Bold Serif',
      fn: (s: string) => s.replace(/[a-zA-Z]/g, (c) => String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 119743 : 119737))),
    },
    {
      name: 'Circled',
      fn: (s: string) => s.replace(/[a-zA-Z0-9]/g, (c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code + 9333);
        if (code >= 97 && code <= 122) return String.fromCodePoint(code + 9327);
        return c;
      }),
    },
    {
      name: 'Monospace',
      fn: (s: string) => s.replace(/[a-zA-Z0-9]/g, (c) => String.fromCodePoint(c.charCodeAt(0) + 65248)),
    },
    {
      name: 'Upside Down',
      fn: (s: string) => {
        const flipMap: Record<string, string> = {
          a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ı',
          j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
          s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
        };
        return s.toLowerCase().split('').reverse().map((ch) => flipMap[ch] || ch).join('');
      },
    },
  ];

  // 15. Readability Calculator
  const [readText, setReadText] = useState<string>(
    'Simplicity is prerequisite for reliability. Complex systems tend to fail in complex and unexpected manners.'
  );
  const rWords = readText.trim().split(/\s+/).filter(Boolean).length;
  const rSentences = (readText.match(/[^.!?]+[.!?]+/g) || []).length || 1;
  const rSyllables = readText.toLowerCase().replace(/[^a-z]/g, '').replace(/[aeiouy]{1,2}/g, 'x').replace(/[^x]/g, '').length || 1;
  // Flesch Reading Ease = 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  const fleschScore = Math.max(0, Math.min(100, 206.835 - 1.015 * (rWords / rSentences) - 84.6 * (rSyllables / rWords)));

  return (
    <div className="space-y-6">
      {/* 1 & 2. WORD & CHAR COUNTER */}
      {(toolId === 'word-counter' || toolId === 'character-counter') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Live Real-Time Text Metrics</h3>
          <textarea
            rows={5}
            value={wordCountText}
            onChange={(e) => setWordCountText(e.target.value)}
            className={`w-full p-4 rounded-xl border text-sm ${inputBg}`}
            placeholder="Type or paste your text here..."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Words</span>
              <p className="text-2xl font-black font-mono text-[#ff6b00]">{words}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Characters</span>
              <p className="text-2xl font-black font-mono text-white">{charsWithSpaces}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">No Spaces</span>
              <p className="text-2xl font-black font-mono text-zinc-300">{charsNoSpaces}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Sentences</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{sentences}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Reading Time</span>
              <p className="text-2xl font-black font-mono text-cyan-400">{readingTimeMin}m</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Speaking Time</span>
              <p className="text-2xl font-black font-mono text-amber-400">{speakingTimeMin}m</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. CASE CONVERTER */}
      {toolId === 'case-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Multi-Format Case Converter</h3>
          <input
            type="text"
            value={caseInput}
            onChange={(e) => setCaseInput(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium ${inputBg}`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {[
              { label: 'UPPERCASE', val: caseInput.toUpperCase() },
              { label: 'lowercase', val: caseInput.toLowerCase() },
              { label: 'Title Case', val: toTitleCase(caseInput) },
              { label: 'camelCase', val: toCamelCase(caseInput) },
              { label: 'snake_case', val: toSnakeCase(caseInput) },
              { label: 'kebab-case', val: toKebabCase(caseInput) },
              { label: 'PascalCase', val: toPascalCase(caseInput) },
              { label: 'aLtErNaTiNg', val: toAlternatingCase(caseInput) },
            ].map((c) => (
              <div
                key={c.label}
                className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#ff6b00]">{c.label}</span>
                  <p className="font-mono text-xs text-white truncate max-w-[200px] sm:max-w-xs">{c.val}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(c.val, c.label)}
                  className="p-1.5 text-zinc-400 hover:text-white"
                >
                  {copied === c.label ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LOREM IPSUM */}
      {toolId === 'lorem-ipsum-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-xl font-bold font-display">Lorem Ipsum Generator</h3>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg overflow-hidden border border-zinc-800">
                {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setLoremType(t)}
                    className={`px-3 py-1.5 text-xs font-semibold capitalize ${
                      loremType === t ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max="20"
                value={loremCount}
                onChange={(e) => setLoremCount(Number(e.target.value))}
                className={`w-16 px-2 py-1 rounded-lg border text-xs text-center font-mono ${inputBg}`}
              />
              <button
                onClick={generateLorem}
                className="px-4 py-1.5 rounded-lg bg-[#ff6b00] text-white text-xs font-semibold hover:bg-[#e05e00] transition"
              >
                Generate
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${inputBg}`}>
            {loremResult || 'Click Generate to produce placeholder text...'}
          </div>
        </div>
      )}

      {/* 5. TEXT DIFF CHECKER */}
      {toolId === 'text-diff-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Visual Diff Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Original Text</label>
              <textarea
                rows={4}
                value={diffOriginal}
                onChange={(e) => setDiffOriginal(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border text-xs font-mono ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Modified Text</label>
              <textarea
                rows={4}
                value={diffModified}
                onChange={(e) => setDiffModified(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border text-xs font-mono ${inputBg}`}
              />
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
            <span className="text-zinc-500 block mb-2 font-sans font-semibold">Inline Diff Visualizer</span>
            <div className="space-y-1">
              <div className="bg-rose-500/10 text-rose-300 p-2 rounded">
                - {diffOriginal}
              </div>
              <div className="bg-emerald-500/10 text-emerald-300 p-2 rounded">
                + {diffModified}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MARKDOWN EDITOR */}
      {toolId === 'markdown-editor' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Real-Time Markdown Editor & Visualizer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={10}
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              className={`w-full p-4 rounded-xl border font-mono text-xs ${inputBg}`}
            />
            <div className={`p-4 rounded-xl border overflow-y-auto max-h-72 prose prose-invert text-xs ${inputBg}`}>
              <pre className="whitespace-pre-wrap font-sans">{markdownText}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 7. REMOVE DUPLICATE LINES */}
      {toolId === 'remove-duplicate-lines' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Duplicate Lines Sanitizer</h3>
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={dedupSorted}
                onChange={(e) => setDedupSorted(e.target.checked)}
                className="accent-[#ff6b00]"
              />
              Sort Alphabetically
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400">Raw Lines</label>
              <textarea
                rows={6}
                value={dupLinesInput}
                onChange={(e) => setDupLinesInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Unique Sanitized Lines</label>
              <textarea
                rows={6}
                readOnly
                value={getDedupedLines()}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs text-[#ff6b00] ${inputBg}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. FIND AND REPLACE */}
      {toolId === 'find-and-replace' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Find & Replace Engine</h3>
          <textarea
            rows={4}
            value={frSource}
            onChange={(e) => setFrSource(e.target.value)}
            className={`w-full p-3 rounded-xl border text-sm ${inputBg}`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 items-center">
            <input
              type="text"
              placeholder="Find..."
              value={frFind}
              onChange={(e) => setFrFind(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs ${inputBg}`}
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={frReplace}
              onChange={(e) => setFrReplace(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs ${inputBg}`}
            />
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={frCaseSensitive}
                onChange={(e) => setFrCaseSensitive(e.target.checked)}
                className="accent-[#ff6b00]"
              />
              Match Case
            </label>
          </div>
          <div className={`mt-4 p-4 rounded-xl border text-sm font-medium ${inputBg}`}>
            {getReplacedText()}
          </div>
        </div>
      )}

      {/* 9. TEXT SORTER */}
      {toolId === 'text-sorter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-bold font-display">Line Sorter & Organizer</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder('asc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  sortOrder === 'asc' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                A → Z
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  sortOrder === 'desc' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Z → A
              </button>
              <button
                onClick={() => setSortOrder('reverse')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  sortOrder === 'reverse' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Reverse
              </button>
              <button
                onClick={() => setSortOrder('shuffle')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  sortOrder === 'shuffle' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Shuffle
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={6}
              value={sortInput}
              onChange={(e) => setSortInput(e.target.value)}
              className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
            />
            <textarea
              rows={6}
              readOnly
              value={getSortedLines()}
              className={`w-full p-3 rounded-xl border font-mono text-xs text-[#ff6b00] ${inputBg}`}
            />
          </div>
        </div>
      )}

      {/* 10. SLUG GENERATOR */}
      {toolId === 'slug-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">SEO URL Slug Generator</h3>
          <input
            type="text"
            value={slugSource}
            onChange={(e) => setSlugSource(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm ${inputBg}`}
          />
          <div className={`mt-4 p-4 rounded-xl border flex items-center justify-between font-mono text-sm ${inputBg}`}>
            <span className="text-[#ff6b00] font-semibold">{generateSlug(slugSource)}</span>
            <button
              onClick={() => copyToClipboard(generateSlug(slugSource), 'slug')}
              className="p-1.5 text-zinc-400 hover:text-white"
            >
              {copied === 'slug' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 11. MORSE CODE TRANSLATOR */}
      {toolId === 'morse-code-translator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Morse Code Audio & Text Translator</h3>
          <input
            type="text"
            value={morseInput}
            onChange={(e) => setMorseInput(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono ${inputBg}`}
          />
          <div className={`mt-4 p-4 rounded-xl border font-mono text-base tracking-widest text-[#ff6b00] ${inputBg}`}>
            {toMorse(morseInput)}
          </div>
        </div>
      )}

      {/* 12. STRING REVERSER */}
      {toolId === 'string-reverser' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">String & Word Reverser</h3>
          <input
            type="text"
            value={revInput}
            onChange={(e) => setRevInput(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm ${inputBg}`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Reversed Characters</span>
              <p className="font-mono text-base font-bold text-[#ff6b00] mt-1">{reversedChars}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Reversed Word Order</span>
              <p className="font-mono text-base font-bold text-emerald-400 mt-1">{reversedWords}</p>
            </div>
          </div>
        </div>
      )}

      {/* 13. PALINDROME CHECKER */}
      {toolId === 'palindrome-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Palindrome Verification Engine</h3>
          <input
            type="text"
            value={palinText}
            onChange={(e) => setPalinText(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm ${inputBg}`}
          />
          <div className="mt-4 flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold ${
                isPalindrome ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isPalindrome ? 'Is a Valid Palindrome' : 'Not a Palindrome'}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Normalized: {cleanPalin}
            </span>
          </div>
        </div>
      )}

      {/* 14. FANCY TEXT GENERATOR */}
      {toolId === 'fancy-text-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Unicode Fancy Font Stylizer</h3>
          <input
            type="text"
            value={fancyInput}
            onChange={(e) => setFancyInput(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm ${inputBg}`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {fancyStyles.map((st) => {
              const res = st.fn(fancyInput);
              return (
                <div key={st.name} className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{st.name}</span>
                    <p className="text-base text-white mt-0.5">{res}</p>
                  </div>
                  <button onClick={() => copyToClipboard(res, st.name)} className="p-2 text-zinc-400 hover:text-white">
                    {copied === st.name ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 15. READABILITY CALCULATOR */}
      {toolId === 'readability-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Flesch-Kincaid Readability Analyzer</h3>
          <textarea
            rows={4}
            value={readText}
            onChange={(e) => setReadText(e.target.value)}
            className={`w-full p-3 rounded-xl border text-sm ${inputBg}`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Reading Ease Score</span>
              <p className="text-3xl font-black font-mono text-[#ff6b00] mt-1">{fleschScore.toFixed(1)} / 100</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Estimated Grade Level</span>
              <p className="text-3xl font-black font-mono text-emerald-400 mt-1">
                {fleschScore > 70 ? 'Grade 5-7 (Plain English)' : fleschScore > 50 ? 'Grade 8-12 (Conversational)' : 'College / Academic'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Audience Suitability</span>
              <p className="text-sm font-semibold text-zinc-200 mt-2">
                {fleschScore > 60 ? 'Easily understood by 85%+ of consumers.' : 'Suitable for technical & professional documentation.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
