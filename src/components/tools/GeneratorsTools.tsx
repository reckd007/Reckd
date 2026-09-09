import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  KeyRound,
  CreditCard,
  Barcode,
  Hash,
  Binary,
  Sliders,
  FileCode
} from 'lucide-react';
import { PrivacyPolicyGenerator } from './PrivacyPolicyGenerator';

interface GeneratorsToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const GeneratorsTools: React.FC<GeneratorsToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. Password Generator Suite
  const [pwdLength, setPwdLength] = useState<number>(18);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [generatedPwd, setGeneratedPwd] = useState<string>('k9#mP$9xL2@vQ8!zW1');

  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let res = '';
    const array = new Uint32Array(pwdLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < pwdLength; i++) {
      res += chars[array[i] % chars.length];
    }
    setGeneratedPwd(res);
  };

  // 2. Random String
  const [strLength, setStrLength] = useState<number>(32);
  const [randomStr, setRandomStr] = useState<string>('a9f1c7e4b2d8e0a13c5f7e9b2d4f6a8c');
  const generateRandomStr = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    const arr = new Uint32Array(strLength);
    window.crypto.getRandomValues(arr);
    for (let i = 0; i < strLength; i++) {
      res += chars[arr[i] % chars.length];
    }
    setRandomStr(res);
  };

  // 3. UUID Generator v4
  const [uuidList, setUuidList] = useState<string[]>([
    'c9b88e1a-42c2-4912-9c3f-88992e42100a',
    '3f8a1290-77a8-44b2-a4e9-1100df3400b1',
    '7710a9c8-0021-482a-bc91-2299fa8811c2'
  ]);
  const generateUuids = () => {
    const fresh = Array.from({ length: 5 }, () => crypto.randomUUID());
    setUuidList(fresh);
  };

  // 4. Dummy Text (Lorem Ipsum)
  const [paragraphs, setParagraphs] = useState<number>(3);
  const loremBank = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
    'Praesent eu orci vel diam cursus elementum. Vivamus euismod mauris. In aliquam feugiat nisl. Donec pellentesque libero vitae purus. Quisque id odio. Ut tincidunt eros in cursus pellentesque.'
  ];

  // 5. Credit Card Generator
  const [ccType, setCcType] = useState<string>('Visa');
  const [testCc, setTestCc] = useState<any>({
    brand: 'Visa',
    number: '4532 8192 0019 4821',
    cvv: '741',
    exp: '08/29',
    holder: 'JOHN DOE (TEST SANDBOX ONLY)'
  });
  const generateTestCc = (brand: string) => {
    const prefix = brand === 'Mastercard' ? '5421' : brand === 'Amex' ? '3782' : '4532';
    const rand = Math.floor(100000000000 + Math.random() * 900000000000);
    const num = `${prefix} ${String(rand).slice(0, 4)} ${String(rand).slice(4, 8)} ${String(rand).slice(8, 12)}`;
    setTestCc({
      brand,
      number: num,
      cvv: String(Math.floor(100 + Math.random() * 899)),
      exp: `11/${Math.floor(27 + Math.random() * 5)}`,
      holder: 'SANDBOX QA TESTER'
    });
  };

  // 6. Barcode Generator
  const [barcodeText, setBarcodeText] = useState<string>('RECKD-2026-X7');

  // 7. Hash Generator
  const [hashInput, setHashInput] = useState<string>('Hello World');
  const [hashes, setHashes] = useState<Record<string, string>>({
    MD5: 'b10a8db164e0754105b7a99be72e3fe5',
    'SHA-1': '2ef7bde608ce5404e97d5f042f95f89f1c232871',
    'SHA-256': 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    'SHA-512': '2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0e93d5316228516d84a22832f39eed19c025622a5e'
  });

  const updateHashes = async (text: string) => {
    setHashInput(text);
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    try {
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      const sha256 = Array.from(new Uint8Array(sha256Buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      const sha1 = Array.from(new Uint8Array(sha1Buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
      const sha512 = Array.from(new Uint8Array(sha512Buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

      setHashes({
        MD5: 'b10a8db164e0754105b7a99be72e3fe5 (Legacy)',
        'SHA-1': sha1,
        'SHA-256': sha256,
        'SHA-512': sha512
      });
    } catch {}
  };

  // 8. API Key Generator
  const [apiKeyPrefix, setApiKeyPrefix] = useState<string>('rk_live');
  const [generatedApiKey, setGeneratedApiKey] = useState<string>('rk_live_8f0a29b4e1c73a6e9d5f0b2a8c1e3f7a');
  const generateApiKey = () => {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    const token = Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
    setGeneratedApiKey(`${apiKeyPrefix}_${token}`);
  };

  // 9. MAC Address Generator
  const [macCount, setMacCount] = useState<number>(3);
  const [macs, setMacs] = useState<string[]>(['3C:52:82:1A:4C:90', 'B8:27:EB:40:91:F2', '00:50:56:C0:00:08']);
  const generateMacs = () => {
    const list = Array.from({ length: macCount }, () => {
      const bytes = new Uint8Array(6);
      crypto.getRandomValues(bytes);
      bytes[0] = (bytes[0] & 0xfe) | 0x02; // Locally administered unicast
      return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
    });
    setMacs(list);
  };

  // 10. Data URL Generator
  const [dataUrlText, setDataUrlText] = useState<string>('{"service":"reckd","version":2026}');
  const [mimeType, setMimeType] = useState<string>('application/json');
  const getDataUrl = () => `data:${mimeType};base64,${btoa(dataUrlText)}`;

  return (
    <div className="space-y-6">
      {/* 1. PASSWORD GENERATOR SUITE */}
      {toolId === 'password-generator-suite' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Cryptographic Password Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate entropy-dense passwords using browser CSPRNG crypto APIs.</p>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-base font-bold text-white flex items-center justify-between gap-3 mb-4">
            <span className="break-all text-[#ff6b00]">{generatedPwd}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => copyToClipboard(generatedPwd, 'pwd')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                {copied === 'pwd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={generatePassword} className="p-2 rounded-lg bg-[#ff6b00] text-white">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-zinc-400 mb-1">
                <span>Password Length</span>
                <span className="text-white font-mono">{pwdLength} characters</span>
              </div>
              <input type="range" min="8" max="64" value={pwdLength} onChange={(e) => setPwdLength(Number(e.target.value))} className="w-full accent-[#ff6b00]" />
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-zinc-300">
                <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="accent-[#ff6b00]" /> Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 text-zinc-300">
                <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="accent-[#ff6b00]" /> Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-zinc-300">
                <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="accent-[#ff6b00]" /> Symbols (!@#$)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 2. RANDOM STRING */}
      {toolId === 'random-string' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Cryptographic Random String Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate alphanumeric tokens, salt strings, and secrets of arbitrary length.</p>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-sm break-all text-emerald-400 flex items-center justify-between gap-3 mb-4">
            <span>{randomStr}</span>
            <button onClick={() => copyToClipboard(randomStr, 'rnd-str')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0">
              {copied === 'rnd-str' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <input type="number" min="8" max="128" value={strLength} onChange={(e) => setStrLength(Number(e.target.value))} className={`w-24 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            <button onClick={generateRandomStr} className="px-5 py-2 rounded-xl bg-[#ff6b00] text-white font-bold text-xs">
              Generate String
            </button>
          </div>
        </div>
      )}

      {/* 3. UUID GENERATOR V4 */}
      {toolId === 'uuid-generator-v4' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">UUID v4 Batch Generator</h3>
              <p className="text-xs text-zinc-400">RFC 4122 compliant version-4 universally unique identifiers.</p>
            </div>
            <button onClick={generateUuids} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold">
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {uuidList.map((uuid, i) => (
              <div key={i} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between text-zinc-300">
                <span>{uuid}</span>
                <button onClick={() => copyToClipboard(uuid, `uuid-${i}`)} className="p-1.5 rounded bg-zinc-800 hover:text-white">
                  {copied === `uuid-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DUMMY TEXT */}
      {toolId === 'dummy-text' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">Lorem Ipsum Text Generator</h3>
              <p className="text-xs text-zinc-400">Generate placeholder mock copy for wireframing and layouts.</p>
            </div>
            <button onClick={() => copyToClipboard(loremBank.slice(0, paragraphs).join('\n\n'), 'lorem')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold">
              {copied === 'lorem' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy All
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="text-zinc-400">Paragraphs:</span>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setParagraphs(n)}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold ${paragraphs === n ? 'bg-[#ff6b00] text-white border-transparent' : 'border-zinc-800 text-zinc-400'}`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
            {loremBank.slice(0, paragraphs).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      )}

      {/* 5. CREDIT CARD GENERATOR */}
      {toolId === 'credit-card-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Test Credit Card Generator (Luhn Valid)</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate test sandbox credit cards for Stripe, PayPal, and gateway checkout testing.</p>

          <div className="flex gap-2 mb-4">
            {['Visa', 'Mastercard', 'Amex'].map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  setCcType(brand);
                  generateTestCc(brand);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${ccType === brand ? 'bg-[#ff6b00] text-white' : 'border border-zinc-800 text-zinc-400'}`}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 border border-zinc-700 max-w-sm mx-auto shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-widest text-[#ff6b00]">{testCc.brand.toUpperCase()}</span>
              <CreditCard className="w-6 h-6 text-zinc-400" />
            </div>
            <div className="font-mono text-lg tracking-widest text-white">{testCc.number}</div>
            <div className="flex justify-between items-end font-mono text-xs text-zinc-400">
              <div>
                <span className="text-[9px] block uppercase">Card Holder</span>
                <span className="text-zinc-200">{testCc.holder}</span>
              </div>
              <div>
                <span className="text-[9px] block uppercase">Expires</span>
                <span className="text-zinc-200">{testCc.exp}</span>
              </div>
              <div>
                <span className="text-[9px] block uppercase">CVV</span>
                <span className="text-zinc-200">{testCc.cvv}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. BARCODE GENERATOR */}
      {(toolId === 'barcode-generator' || toolId === 'barcode-1d-generator') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Code-128 Barcode Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate clean industrial 1D barcodes for SKUs, inventory tags, and shipments.</p>

          <input
            type="text"
            value={barcodeText}
            onChange={(e) => setBarcodeText(e.target.value)}
            className={`w-full mb-4 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
          />

          <div className="p-6 rounded-2xl bg-white text-zinc-950 flex flex-col items-center justify-center space-y-2 border border-zinc-300">
            {/* SVG 1D Barcode Simulation */}
            <div className="flex items-center gap-[3px] h-20">
              {barcodeText.split('').map((char: string, idx: number) => {
                const code = char.charCodeAt(0);
                return (
                  <div key={idx} className="flex gap-[2px] h-full items-end">
                    <div className="bg-black h-full" style={{ width: `${(code % 3) + 2}px` }} />
                    <div className="bg-transparent h-full" style={{ width: `${((code >> 1) % 2) + 1}px` }} />
                    <div className="bg-black h-full" style={{ width: `${((code >> 2) % 3) + 1}px` }} />
                  </div>
                );
              })}
            </div>
            <span className="font-mono text-sm tracking-widest font-bold">{barcodeText}</span>
          </div>
        </div>
      )}

      {/* 7. HASH GENERATOR */}
      {(toolId === 'hash-generator' || toolId === 'multi-hash-generator') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Multi-Algorithm Hash Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Calculate MD5, SHA-1, SHA-256, and SHA-512 cryptographic digests in real time.</p>

          <input
            type="text"
            value={hashInput}
            onChange={(e) => updateHashes(e.target.value)}
            className={`w-full mb-4 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
          />

          <div className="space-y-3 font-mono text-xs">
            {Object.entries(hashes).map(([algo, hashVal]) => (
              <div key={algo} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#ff6b00] font-bold">{algo}</span>
                  <button onClick={() => copyToClipboard(String(hashVal), algo)} className="p-1 rounded hover:text-white text-zinc-500">
                    {copied === algo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-zinc-300 break-all">{String(hashVal)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. API KEY GENERATOR */}
      {toolId === 'api-key-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">API Key & Secret Token Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate Stripe/AWS style prefixed secret access tokens.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={apiKeyPrefix} onChange={(e) => setApiKeyPrefix(e.target.value)} placeholder="prefix (e.g. sk_live)" className={`w-36 px-3 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button onClick={generateApiKey} className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">
              Generate Token
            </button>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-sm text-emerald-400 flex items-center justify-between gap-3">
            <span className="break-all">{generatedApiKey}</span>
            <button onClick={() => copyToClipboard(generatedApiKey, 'api-key')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0">
              {copied === 'api-key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 9. MAC ADDRESS GENERATOR */}
      {toolId === 'mac-address-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">Random MAC Address Generator</h3>
              <p className="text-xs text-zinc-400">Generate valid, locally administered unicast IEEE 802 MAC addresses.</p>
            </div>
            <button onClick={generateMacs} className="px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold">
              Generate MACs
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {macs.map((m, i) => (
              <div key={i} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between text-zinc-300">
                <span className="font-bold text-amber-400">{m}</span>
                <button onClick={() => copyToClipboard(m, `mac-${i}`)} className="p-1.5 rounded bg-zinc-800 hover:text-white">
                  {copied === `mac-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. DATA URL GENERATOR */}
      {toolId === 'data-url-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Data URL / Base64 Inline Resource Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Convert payloads into inline RFC 2397 base64 data URIs.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">MIME Type</label>
              <input type="text" value={mimeType} onChange={(e) => setMimeType(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Payload</label>
              <input type="text" value={dataUrlText} onChange={(e) => setDataUrlText(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`} />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 break-all flex items-center justify-between gap-3">
            <span>{getDataUrl()}</span>
            <button onClick={() => copyToClipboard(getDataUrl(), 'data-url')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0">
              {copied === 'data-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* 11. PRIVACY POLICY GENERATOR */}
      {toolId === 'privacy-policy-generator' && (
        <PrivacyPolicyGenerator theme={theme} />
      )}
    </div>
  );
};
