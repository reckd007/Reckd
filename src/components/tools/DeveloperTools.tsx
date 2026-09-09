import React, { useState, useEffect } from 'react';
import { Copy, Check, Code, Play, RefreshCw, Layers, Sliders, ExternalLink } from 'lucide-react';

interface DeveloperToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. JSON Formatter
  const [jsonInput, setJsonInput] = useState<string>('{"name":"Reckd","version":2.0,"features":["crypto","calculators","media"],"status":"active"}');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const formatJson = (indent: number) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, indent));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };
  useEffect(() => {
    formatJson(2);
  }, [jsonInput]);

  // 2. Base64 Encoder / Decoder
  const [b64Input, setB64Input] = useState<string>('Reckd: Modern Utility Platform');
  const [b64Output, setB64Output] = useState<string>('');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');

  useEffect(() => {
    try {
      if (b64Mode === 'encode') {
        setB64Output(btoa(unescape(encodeURIComponent(b64Input))));
      } else {
        setB64Output(decodeURIComponent(escape(atob(b64Input))));
      }
    } catch {
      setB64Output('Invalid input for conversion.');
    }
  }, [b64Input, b64Mode]);

  // 3. URL Encoder / Decoder
  const [urlInput, setUrlInput] = useState<string>('https://reckd.app/search?query=hello world & category=crypto');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');
  const urlOutput = urlMode === 'encode' ? encodeURIComponent(urlInput) : decodeURIComponent(urlInput);

  // 4. HTML Entities
  const [htmlInput, setHtmlInput] = useState<string>('<div class="reckd">"Innovate" & Explore</div>');
  const [htmlMode, setHtmlMode] = useState<'encode' | 'decode'>('encode');
  const htmlOutput =
    htmlMode === 'encode'
      ? htmlInput.replace(/[\u00A0-\u9999<>&"']/gim, (i) => '&#' + i.charCodeAt(0) + ';')
      : htmlInput.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));

  // 5. Regex Tester
  const [regexPattern, setRegexPattern] = useState<string>('[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState<string>('gi');
  const [regexTestStr, setRegexTestStr] = useState<string>('Contact support@reckd.app or ceo@company.org for assistance.');
  const [regexMatches, setRegexMatches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const reg = new RegExp(regexPattern, regexFlags);
      const m = regexTestStr.match(reg);
      setRegexMatches(m || []);
    } catch {
      setRegexMatches([]);
    }
  }, [regexPattern, regexFlags, regexTestStr]);

  // 6. Cron Expression Generator
  const [cronMinute, setCronMinute] = useState<string>('0');
  const [cronHour, setCronHour] = useState<string>('12');
  const [cronDom, setCronDom] = useState<string>('*');
  const [cronMonth, setCronMonth] = useState<string>('*');
  const [cronDow, setCronDow] = useState<string>('*');
  const fullCron = `${cronMinute} ${cronHour} ${cronDom} ${cronMonth} ${cronDow}`;

  // 7. Color Converter
  const [hexColor, setHexColor] = useState<string>('#ff6b00');
  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };
  const rgb = hexToRgb(hexColor);
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // 8. CSS Gradient Generator
  const [gradColor1, setGradColor1] = useState<string>('#ff6b00');
  const [gradColor2, setGradColor2] = useState<string>('#0a0a0a');
  const [gradAngle, setGradAngle] = useState<number>(135);
  const gradientCss = `linear-gradient(${gradAngle}deg, ${gradColor1} 0%, ${gradColor2} 100%)`;

  // 9. CSS Box Shadow Generator
  const [bsX, setBsX] = useState<number>(0);
  const [bsY, setBsY] = useState<number>(10);
  const [bsBlur, setBsBlur] = useState<number>(25);
  const [bsSpread, setBsSpread] = useState<number>(-5);
  const [bsColor, setBsColor] = useState<string>('rgba(255, 107, 0, 0.4)');
  const boxShadowCss = `${bsX}px ${bsY}px ${bsBlur}px ${bsSpread}px ${bsColor}`;

  // 10. CSS Flexbox Playground
  const [flexDir, setFlexDir] = useState<'row' | 'row-reverse' | 'column'>('row');
  const [justify, setJustify] = useState<'start' | 'center' | 'end' | 'between' | 'around'>('center');
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('center');
  const [gap, setGap] = useState<number>(12);

  // 11. CSS Grid Playground
  const [gridCols, setGridCols] = useState<number>(3);
  const [gridGap, setGridGap] = useState<number>(12);

  // 12. Meta Tag Generator
  const [metaTitle, setMetaTitle] = useState<string>('Reckd | Everything Useful. One Place.');
  const [metaDesc, setMetaDesc] = useState<string>('Modern, ultra-fast utility tools suite featuring 100+ browser tools.');
  const [metaUrl, setMetaUrl] = useState<string>('https://reckd.app');
  const [metaImg, setMetaImg] = useState<string>('https://reckd.app/og-image.png');

  const metaTagSnippet = `<!-- Primary Meta Tags -->
<title>${metaTitle}</title>
<meta name="title" content="${metaTitle}" />
<meta name="description" content="${metaDesc}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${metaUrl}" />
<meta property="og:title" content="${metaTitle}" />
<meta property="og:description" content="${metaDesc}" />
<meta property="og:image" content="${metaImg}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${metaUrl}" />
<meta property="twitter:title" content="${metaTitle}" />
<meta property="twitter:description" content="${metaDesc}" />
<meta property="twitter:image" content="${metaImg}" />`;

  // 13. HTTP Status Codes Directory
  const [httpSearch, setHttpSearch] = useState<string>('');
  const httpCodes = [
    { code: 200, name: 'OK', desc: 'Standard response for successful HTTP requests.' },
    { code: 201, name: 'Created', desc: 'Request fulfilled, resulting in the creation of a new resource.' },
    { code: 204, name: 'No Content', desc: 'Request processed successfully, but no content is returned.' },
    { code: 301, name: 'Moved Permanently', desc: 'The requested resource has been assigned a new permanent URI.' },
    { code: 304, name: 'Not Modified', desc: 'Resource has not been modified since the version specified in request.' },
    { code: 400, name: 'Bad Request', desc: 'The server cannot or will not process request due to client error.' },
    { code: 401, name: 'Unauthorized', desc: 'Authentication is required and has failed or has not yet been provided.' },
    { code: 403, name: 'Forbidden', desc: 'The request contained valid data and was understood, but server refuses action.' },
    { code: 404, name: 'Not Found', desc: 'The requested resource could not be found but may be available in future.' },
    { code: 429, name: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time (rate limit).' },
    { code: 500, name: 'Internal Server Error', desc: 'Generic error message when unexpected condition occurred.' },
    { code: 502, name: 'Bad Gateway', desc: 'The server received an invalid response from an inbound gateway/proxy.' },
    { code: 503, name: 'Service Unavailable', desc: 'The server cannot handle request due to overload or maintenance.' },
  ];
  const filteredHttp = httpCodes.filter(
    (c) => c.code.toString().includes(httpSearch) || c.name.toLowerCase().includes(httpSearch.toLowerCase())
  );

  // 14. Key Code Detector
  const [lastKeyEvent, setLastKeyEvent] = useState<{
    key: string;
    code: string;
    keyCode: number;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
  }>({
    key: 'Space',
    code: 'Space',
    keyCode: 32,
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setLastKeyEvent({
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 15. Lorem Picsum Generator
  const [picWidth, setPicWidth] = useState<number>(600);
  const [picHeight, setPicHeight] = useState<number>(400);
  const [picGrayscale, setPicGrayscale] = useState<boolean>(false);
  const [picBlur, setPicBlur] = useState<number>(0);

  const picUrl = `https://picsum.photos/${picWidth}/${picHeight}${picGrayscale ? '?grayscale' : ''}${
    picBlur > 0 ? (picGrayscale ? `&blur=${picBlur}` : `?blur=${picBlur}`) : ''
  }`;

  return (
    <div className="space-y-6">
      {/* 1. JSON FORMATTER */}
      {toolId === 'json-formatter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">JSON Formatter & Validator</h3>
            <div className="flex gap-2">
              <button
                onClick={() => formatJson(2)}
                className="px-3 py-1.5 rounded-lg bg-[#ff6b00] text-white text-xs font-semibold"
              >
                Prettify
              </button>
              <button
                onClick={() => formatJson(0)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Minify
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={8}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
            />
            <div className="relative">
              <textarea
                rows={8}
                readOnly
                value={jsonError || jsonOutput}
                className={`w-full p-3 rounded-xl border font-mono text-xs ${
                  jsonError ? 'text-rose-400 border-rose-500/30' : 'text-emerald-400'
                } ${inputBg}`}
              />
              {!jsonError && (
                <button
                  onClick={() => copyToClipboard(jsonOutput, 'json')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  {copied === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. BASE64 ENCODER */}
      {toolId === 'base64-encoder' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Base64 Converter</h3>
            <div className="flex rounded-lg overflow-hidden border border-zinc-800">
              <button
                onClick={() => setB64Mode('encode')}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  b64Mode === 'encode' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setB64Mode('decode')}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  b64Mode === 'decode' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Decode
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={5}
              value={b64Input}
              onChange={(e) => setB64Input(e.target.value)}
              className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
            />
            <textarea
              rows={5}
              readOnly
              value={b64Output}
              className={`w-full p-3 rounded-xl border font-mono text-xs text-[#ff6b00] ${inputBg}`}
            />
          </div>
        </div>
      )}

      {/* 3. URL ENCODER */}
      {toolId === 'url-encoder' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">URL Percent-Encoder</h3>
            <div className="flex rounded-lg overflow-hidden border border-zinc-800">
              <button
                onClick={() => setUrlMode('encode')}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  urlMode === 'encode' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setUrlMode('decode')}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  urlMode === 'decode' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Decode
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={5}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
            />
            <textarea
              rows={5}
              readOnly
              value={urlOutput}
              className={`w-full p-3 rounded-xl border font-mono text-xs text-[#ff6b00] ${inputBg}`}
            />
          </div>
        </div>
      )}

      {/* 4. HTML ENTITIES */}
      {toolId === 'html-entities' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">HTML Entities Encoder</h3>
            <div className="flex rounded-lg overflow-hidden border border-zinc-800">
              <button
                onClick={() => setHtmlMode('encode')}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  htmlMode === 'encode' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setHtmlMode('decode')}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  htmlMode === 'decode' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Decode
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              rows={5}
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
            />
            <textarea
              rows={5}
              readOnly
              value={htmlOutput}
              className={`w-full p-3 rounded-xl border font-mono text-xs text-[#ff6b00] ${inputBg}`}
            />
          </div>
        </div>
      )}

      {/* 5. REGEX TESTER */}
      {toolId === 'regex-tester' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Live Regular Expression Evaluator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            <div className="sm:col-span-3">
              <label className="text-xs text-zinc-400">Pattern</label>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                className={`w-full mt-1 px-4 py-2 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Flags</label>
              <input
                type="text"
                value={regexFlags}
                onChange={(e) => setRegexFlags(e.target.value)}
                className={`w-full mt-1 px-4 py-2 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-zinc-400">Test String</label>
            <textarea
              rows={3}
              value={regexTestStr}
              onChange={(e) => setRegexTestStr(e.target.value)}
              className={`w-full mt-1 p-3 rounded-xl border text-xs font-mono ${inputBg}`}
            />
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-xs text-zinc-400 block mb-2 font-semibold">
              Matches Found: <strong className="text-[#ff6b00]">{regexMatches.length}</strong>
            </span>
            <div className="flex flex-wrap gap-2">
              {regexMatches.map((m, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-[#ff6b00]/20 text-[#ff6b00] font-mono text-xs border border-[#ff6b00]/30">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. CRON EXPRESSION GENERATOR */}
      {toolId === 'cron-expression-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Cron Expression Generator</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            <div>
              <label className="text-xs text-zinc-400">Minute (0-59)</label>
              <input
                type="text"
                value={cronMinute}
                onChange={(e) => setCronMinute(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-xl border font-mono text-xs text-center ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Hour (0-23)</label>
              <input
                type="text"
                value={cronHour}
                onChange={(e) => setCronHour(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-xl border font-mono text-xs text-center ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Day of Month</label>
              <input
                type="text"
                value={cronDom}
                onChange={(e) => setCronDom(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-xl border font-mono text-xs text-center ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Month (1-12)</label>
              <input
                type="text"
                value={cronMonth}
                onChange={(e) => setCronMonth(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-xl border font-mono text-xs text-center ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Day of Week</label>
              <input
                type="text"
                value={cronDow}
                onChange={(e) => setCronDow(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-xl border font-mono text-xs text-center ${inputBg}`}
              />
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between ${inputBg}`}>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Standard 5-Part Cron Syntax</span>
              <p className="font-mono text-2xl font-black text-[#ff6b00] mt-1 tracking-widest">{fullCron}</p>
            </div>
            <button
              onClick={() => copyToClipboard(fullCron, 'cron')}
              className="p-2.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
            >
              {copied === 'cron' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 7. COLOR CONVERTER */}
      {toolId === 'color-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Hex / RGB / CSS Color Studio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400">Hex Code</label>
                <input
                  type="text"
                  value={hexColor}
                  onChange={(e) => setHexColor(e.target.value)}
                  className={`w-full mt-1 px-4 py-2.5 rounded-xl border font-mono text-sm ${inputBg}`}
                />
              </div>
              <input
                type="color"
                value={hexColor.startsWith('#') && hexColor.length === 7 ? hexColor : '#ff6b00'}
                onChange={(e) => setHexColor(e.target.value)}
                className="w-full h-12 rounded-xl cursor-pointer bg-transparent"
              />
            </div>

            <div className="p-6 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center min-h-[160px]" style={{ backgroundColor: hexColor }}>
              <div className="p-3 rounded-xl bg-black/60 backdrop-blur text-center font-mono text-xs text-white space-y-1">
                <p>HEX: {hexColor}</p>
                <p>{rgbStr}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CSS GRADIENT GENERATOR */}
      {toolId === 'css-gradient-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">CSS Linear Gradient Studio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400">Color 1</label>
                  <input
                    type="color"
                    value={gradColor1}
                    onChange={(e) => setGradColor1(e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Color 2</label>
                  <input
                    type="color"
                    value={gradColor2}
                    onChange={(e) => setGradColor2(e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400">Angle: {gradAngle}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradAngle}
                  onChange={(e) => setGradAngle(Number(e.target.value))}
                  className="w-full accent-[#ff6b00]"
                />
              </div>
            </div>

            <div
              className="h-44 rounded-2xl border border-zinc-700/50 shadow-inner flex items-center justify-center"
              style={{ background: gradientCss }}
            >
              <span className="p-2 rounded-lg bg-black/50 backdrop-blur font-mono text-xs text-white">
                {gradAngle}°
              </span>
            </div>
          </div>

          <div className={`mt-4 p-4 rounded-xl border font-mono text-xs flex items-center justify-between text-[#ff6b00] ${inputBg}`}>
            <span>background: {gradientCss};</span>
            <button
              onClick={() => copyToClipboard(`background: ${gradientCss};`, 'grad')}
              className="p-1.5 text-zinc-400 hover:text-white"
            >
              {copied === 'grad' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 9. BOX SHADOW GENERATOR */}
      {toolId === 'css-box-shadow-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">CSS Box-Shadow Generator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-xs">
              <div>
                <span>X Offset: {bsX}px</span>
                <input type="range" min="-50" max="50" value={bsX} onChange={(e) => setBsX(Number(e.target.value))} className="w-full accent-[#ff6b00]" />
              </div>
              <div>
                <span>Y Offset: {bsY}px</span>
                <input type="range" min="-50" max="50" value={bsY} onChange={(e) => setBsY(Number(e.target.value))} className="w-full accent-[#ff6b00]" />
              </div>
              <div>
                <span>Blur: {bsBlur}px</span>
                <input type="range" min="0" max="100" value={bsBlur} onChange={(e) => setBsBlur(Number(e.target.value))} className="w-full accent-[#ff6b00]" />
              </div>
              <div>
                <span>Spread: {bsSpread}px</span>
                <input type="range" min="-30" max="30" value={bsSpread} onChange={(e) => setBsSpread(Number(e.target.value))} className="w-full accent-[#ff6b00]" />
              </div>
            </div>

            <div className="p-12 flex justify-center items-center bg-zinc-950/60 rounded-2xl border border-zinc-800">
              <div
                className="w-32 h-32 rounded-2xl bg-[#0a0a0a] border border-zinc-700 flex items-center justify-center font-bold text-xs"
                style={{ boxShadow: boxShadowCss }}
              >
                Shadow Box
              </div>
            </div>
          </div>

          <div className={`mt-4 p-4 rounded-xl border font-mono text-xs flex items-center justify-between text-[#ff6b00] ${inputBg}`}>
            <span>box-shadow: {boxShadowCss};</span>
            <button
              onClick={() => copyToClipboard(`box-shadow: ${boxShadowCss};`, 'bs')}
              className="p-1.5 text-zinc-400 hover:text-white"
            >
              {copied === 'bs' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 10. FLEXBOX PLAYGROUND */}
      {toolId === 'css-flexbox-playground' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">CSS Flexbox Interactive Playground</h3>
          <div className="flex flex-wrap gap-4 mb-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Direction</label>
              <select value={flexDir} onChange={(e) => setFlexDir(e.target.value as any)} className={`p-2 rounded-lg border ${inputBg}`}>
                <option value="row">row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Justify Content</label>
              <select value={justify} onChange={(e) => setJustify(e.target.value as any)} className={`p-2 rounded-lg border ${inputBg}`}>
                <option value="start">flex-start</option>
                <option value="center">center</option>
                <option value="end">flex-end</option>
                <option value="between">space-between</option>
                <option value="around">space-around</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Align Items</label>
              <select value={align} onChange={(e) => setAlign(e.target.value as any)} className={`p-2 rounded-lg border ${inputBg}`}>
                <option value="start">flex-start</option>
                <option value="center">center</option>
                <option value="end">flex-end</option>
              </select>
            </div>
          </div>

          <div
            className={`min-h-[180px] p-4 rounded-xl border border-zinc-800 flex bg-zinc-950/60 ${
              flexDir === 'column' ? 'flex-col' : flexDir === 'row-reverse' ? 'flex-row-reverse' : 'flex-row'
            } ${
              justify === 'start'
                ? 'justify-start'
                : justify === 'center'
                ? 'justify-center'
                : justify === 'end'
                ? 'justify-end'
                : justify === 'between'
                ? 'justify-between'
                : 'justify-around'
            } ${align === 'start' ? 'items-start' : align === 'center' ? 'items-center' : 'items-end'}`}
            style={{ gap: `${gap}px` }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-14 h-14 rounded-xl bg-[#ff6b00] text-white flex items-center justify-center font-bold shadow-lg shadow-[#ff6b00]/20">
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. GRID PLAYGROUND */}
      {toolId === 'css-grid-playground' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">CSS Grid Playground</h3>
          <div className="flex gap-4 mb-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Columns ({gridCols})</label>
              <input type="range" min="1" max="6" value={gridCols} onChange={(e) => setGridCols(Number(e.target.value))} className="accent-[#ff6b00]" />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Gap ({gridGap}px)</label>
              <input type="range" min="4" max="32" value={gridGap} onChange={(e) => setGridGap(Number(e.target.value))} className="accent-[#ff6b00]" />
            </div>
          </div>

          <div
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 grid"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              gap: `${gridGap}px`,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-16 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-bold text-white">
                Item {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. META TAG GENERATOR */}
      {toolId === 'meta-tag-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">SEO & Open Graph Meta Tag Generator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-400">Page Title</label>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Page URL</label>
              <input type="text" value={metaUrl} onChange={(e) => setMetaUrl(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-zinc-400">Description</label>
              <input type="text" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
          </div>

          <div className="relative">
            <textarea rows={8} readOnly value={metaTagSnippet} className={`w-full p-3 rounded-xl border font-mono text-xs text-emerald-400 ${inputBg}`} />
            <button
              onClick={() => copyToClipboard(metaTagSnippet, 'meta')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
            >
              {copied === 'meta' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 13. HTTP STATUS CODES */}
      {toolId === 'http-status-codes' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">HTTP Status Codes Index</h3>
            <input
              type="text"
              placeholder="Search code or name..."
              value={httpSearch}
              onChange={(e) => setHttpSearch(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs ${inputBg}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredHttp.map((c) => (
              <div key={c.code} className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-black text-sm px-2 py-0.5 rounded ${
                      c.code >= 500
                        ? 'bg-rose-500/20 text-rose-400'
                        : c.code >= 400
                        ? 'bg-orange-500/20 text-orange-400'
                        : c.code >= 300
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {c.code}
                  </span>
                  <span className="font-bold text-sm text-white">{c.name}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. KEY CODE DETECTOR */}
      {toolId === 'key-code-detector' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-2">JavaScript Keydown Event Inspector</h3>
          <p className="text-xs text-zinc-400 mb-6">Press any key on your keyboard to instantly inspect keydown properties.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">event.key</span>
              <p className="text-2xl font-black font-mono text-[#ff6b00] mt-1">{lastKeyEvent.key}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">event.code</span>
              <p className="text-xl font-black font-mono text-white mt-1">{lastKeyEvent.code}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">event.which / keyCode</span>
              <p className="text-2xl font-black font-mono text-emerald-400 mt-1">{lastKeyEvent.keyCode}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Modifiers</span>
              <p className="text-xs font-mono text-zinc-300 mt-2">
                Shift: {lastKeyEvent.shiftKey ? 'Yes' : 'No'} | Ctrl: {lastKeyEvent.ctrlKey ? 'Yes' : 'No'} | Alt: {lastKeyEvent.altKey ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 15. LOREM PICSUM TOOL */}
      {toolId === 'lorem-picsum-tool' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Lorem Picsum Image Generator</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 items-center">
            <div>
              <label className="text-xs text-zinc-400">Width (px)</label>
              <input type="number" value={picWidth} onChange={(e) => setPicWidth(Number(e.target.value))} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Height (px)</label>
              <input type="number" value={picHeight} onChange={(e) => setPicHeight(Number(e.target.value))} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input type="checkbox" checked={picGrayscale} onChange={(e) => setPicGrayscale(e.target.checked)} className="accent-[#ff6b00]" />
                Grayscale
              </label>
            </div>
            <div>
              <label className="text-xs text-zinc-400">Blur ({picBlur})</label>
              <input type="range" min="0" max="10" value={picBlur} onChange={(e) => setPicBlur(Number(e.target.value))} className="w-full accent-[#ff6b00]" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 flex flex-col items-center justify-center gap-3 bg-zinc-950">
            <img src={picUrl} alt="Picsum placeholder" className="max-h-64 rounded-xl object-cover shadow" />
            <span className="font-mono text-xs text-zinc-400 break-all">{picUrl}</span>
          </div>
        </div>
      )}
    </div>
  );
};
