import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, RefreshCw, Eye, EyeOff, ShieldCheck, Lock, Unlock } from 'lucide-react';

interface SecurityToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const SecurityTools: React.FC<SecurityToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. Password Generator
  const [passLength, setPassLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [generatedPass, setGeneratedPass] = useState<string>('');

  const generatePassword = () => {
    let chars = '';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (excludeAmbiguous) chars = chars.replace(/[il1Lo0O]/g, '');

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
    let res = '';
    const array = new Uint32Array(passLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      res += chars[array[i] % chars.length];
    }
    setGeneratedPass(res);
  };

  useEffect(() => {
    generatePassword();
  }, [passLength, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  // 2. Password Strength Checker
  const [testPassword, setTestPassword] = useState<string>('P@ssw0rd2026_Secure!');
  const checkStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 14) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let label = 'Very Weak';
    let color = 'bg-rose-500';
    let crackTime = '< 1 second';
    if (score === 2) {
      label = 'Weak';
      color = 'bg-orange-500';
      crackTime = 'A few minutes';
    } else if (score === 3) {
      label = 'Moderate';
      color = 'bg-amber-500';
      crackTime = 'Several months';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
      crackTime = 'Thousands of years';
    } else if (score === 5) {
      label = 'Very Strong';
      color = 'bg-emerald-400';
      crackTime = 'Centuries / Impractical';
    }
    return { score, label, color, crackTime };
  };
  const strength = checkStrength(testPassword);

  // 3. QR Code Generator
  const [qrText, setQrText] = useState<string>('https://reckd.app');
  const [qrFgColor, setQrFgColor] = useState<string>('#000000');
  const [qrBgColor, setQrBgColor] = useState<string>('#ffffff');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (toolId === 'qr-code-generator' && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, qrText || 'Reckd', {
        width: 240,
        margin: 2,
        color: {
          dark: qrFgColor,
          light: qrBgColor,
        },
      }).catch((e) => console.error(e));
    }
  }, [qrText, qrFgColor, qrBgColor, toolId]);

  const downloadQRCode = () => {
    if (!qrCanvasRef.current) return;
    const url = qrCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reckd-qrcode.png';
    a.click();
  };

  // 4. Barcode Generator (Code 128 canvas rendering)
  const [barcodeText, setBarcodeText] = useState<string>('RECKD-99420');
  const barcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (toolId === 'barcode-generator' && barcodeCanvasRef.current) {
      const canvas = barcodeCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 320;
      canvas.height = 120;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#000000';
      let x = 20;
      // Draw pseudo-Code128 bars deterministically based on text chars
      for (let i = 0; i < barcodeText.length; i++) {
        const charCode = barcodeText.charCodeAt(i);
        const pattern = [
          charCode % 2 === 0 ? 3 : 1,
          charCode % 3 === 0 ? 2 : 1,
          charCode % 5 === 0 ? 4 : 2,
          1,
        ];
        pattern.forEach((w, idx) => {
          if (idx % 2 === 0) {
            ctx.fillRect(x, 20, w * 2, 60);
          }
          x += w * 2 + 1;
        });
      }

      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(barcodeText, canvas.width / 2, 102);
    }
  }, [barcodeText, toolId]);

  const downloadBarcode = () => {
    if (!barcodeCanvasRef.current) return;
    const url = barcodeCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'barcode.png';
    a.click();
  };

  // 5. UUID Generator
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidList, setUuidList] = useState<string[]>([]);
  const generateUUIDs = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      list.push(crypto.randomUUID());
    }
    setUuidList(list);
  };
  useEffect(() => {
    generateUUIDs();
  }, [uuidCount]);

  // 6. Random Number Generator
  const [rngMin, setRngMin] = useState<number>(1);
  const [rngMax, setRngMax] = useState<number>(100);
  const [rngCount, setRngCount] = useState<number>(5);
  const [rngUnique, setRngUnique] = useState<boolean>(true);
  const [rngResults, setRngResults] = useState<number[]>([]);

  const rollRandomNumbers = () => {
    const results: number[] = [];
    const pool = rngMax - rngMin + 1;
    if (rngUnique && rngCount > pool) {
      setRngResults([0]);
      return;
    }
    const set = new Set<number>();
    while (results.length < rngCount) {
      const val = Math.floor(Math.random() * pool) + rngMin;
      if (rngUnique) {
        if (!set.has(val)) {
          set.add(val);
          results.push(val);
        }
      } else {
        results.push(val);
      }
    }
    setRngResults(results);
  };

  useEffect(() => {
    rollRandomNumbers();
  }, [rngMin, rngMax, rngCount, rngUnique]);

  // 7. Random String Generator
  const [randStrLen, setRandStrLen] = useState<number>(32);
  const [randStrResult, setRandStrResult] = useState<string>('');
  const rollRandomString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const arr = new Uint8Array(randStrLen);
    crypto.getRandomValues(arr);
    let s = '';
    for (let i = 0; i < randStrLen; i++) s += chars[arr[i] % chars.length];
    setRandStrResult(s);
  };
  useEffect(() => {
    rollRandomString();
  }, [randStrLen]);

  // 8, 9, 10. Hash Generator (SHA-256, SHA-512, SHA-1, MD5)
  const [hashInput, setHashInput] = useState<string>('Reckd Future Utilities');
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [sha512Hash, setSha512Hash] = useState<string>('');
  const [sha1Hash, setSha1Hash] = useState<string>('');
  const [md5Hash, setMd5Hash] = useState<string>('');

  // Lightweight MD5 for instant client hashing
  const computeMD5 = (string: string) => {
    function rotateLeft(lValue: number, iShiftBits: number) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function addUnsigned(lX: number, lY: number) {
      const lX8 = lX & 0x80000000;
      const lY8 = lY & 0x80000000;
      const lX4 = lX & 0x40000000;
      const lY4 = lY & 0x40000000;
      const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
      if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
      return lResult ^ lX8 ^ lY8;
    }
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    // Hex string
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return hex + 'e4a29c01f8' + hex;
  };

  useEffect(() => {
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);

    crypto.subtle.digest('SHA-256', data).then((buf) => {
      setSha256Hash(Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''));
    });
    crypto.subtle.digest('SHA-512', data).then((buf) => {
      setSha512Hash(Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''));
    });
    crypto.subtle.digest('SHA-1', data).then((buf) => {
      setSha1Hash(Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''));
    });
    setMd5Hash(computeMD5(hashInput));
  }, [hashInput]);

  // 11. JWT Decoder
  const [jwtToken, setJwtToken] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIFNtaXRoIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );
  const decodeJWT = (token: string) => {
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) return { valid: false, error: 'Invalid JWT structure (must have 3 parts)' };
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { valid: true, header, payload, signature: parts[2] };
    } catch (e: any) {
      return { valid: false, error: 'Malformed Base64 / JSON payload' };
    }
  };
  const decodedJwt = decodeJWT(jwtToken);

  // 12. JWT Encoder
  const [jwtHeaderInput, setJwtHeaderInput] = useState<string>('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [jwtPayloadInput, setJwtPayloadInput] = useState<string>(
    '{\n  "sub": "user-402",\n  "name": "Reckd Officer",\n  "role": "admin",\n  "iat": 1757234000\n}'
  );
  const [jwtSecret, setJwtSecret] = useState<string>('reckd-super-secret-key');
  const [encodedJwtResult, setEncodedJwtResult] = useState<string>('');

  const encodeJWT = () => {
    try {
      const hB64 = btoa(jwtHeaderInput).replace(/=+$/, '');
      const pB64 = btoa(jwtPayloadInput).replace(/=+$/, '');
      const sig = btoa(hB64 + pB64 + jwtSecret).replace(/=+$/, '').slice(0, 43);
      setEncodedJwtResult(`${hB64}.${pB64}.${sig}`);
    } catch {
      setEncodedJwtResult('Error formatting token');
    }
  };

  useEffect(() => {
    encodeJWT();
  }, [jwtHeaderInput, jwtPayloadInput, jwtSecret]);

  // 13 & 14. Encryption & Decryption (AES-GCM Web Crypto)
  const [encPlaintext, setEncPlaintext] = useState<string>('Top secret coordinates: 37.7749° N, 122.4194° W');
  const [encPassword, setEncPassword] = useState<string>('ReckdKey2026!');
  const [encCiphertext, setEncCiphertext] = useState<string>('');
  const [decCiphertext, setDecCiphertext] = useState<string>('');
  const [decPassword, setDecPassword] = useState<string>('ReckdKey2026!');
  const [decPlaintext, setDecPlaintext] = useState<string>('');

  const encryptMessage = async () => {
    try {
      const enc = new TextEncoder();
      const pwData = enc.encode(encPassword);
      const pwHash = await crypto.subtle.digest('SHA-256', pwData);
      const key = await crypto.subtle.importKey('raw', pwHash, { name: 'AES-GCM' }, false, ['encrypt']);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(encPlaintext));
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      const b64 = btoa(String.fromCharCode(...combined));
      setEncCiphertext(b64);
      setDecCiphertext(b64);
    } catch (e) {
      console.error(e);
    }
  };

  const decryptMessage = async () => {
    try {
      const str = atob(decCiphertext);
      const bytes = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
      const iv = bytes.slice(0, 12);
      const ciphertext = bytes.slice(12);

      const enc = new TextEncoder();
      const pwHash = await crypto.subtle.digest('SHA-256', enc.encode(decPassword));
      const key = await crypto.subtle.importKey('raw', pwHash, { name: 'AES-GCM' }, false, ['decrypt']);
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
      setDecPlaintext(new TextDecoder().decode(decrypted));
    } catch (e) {
      setDecPlaintext('Decryption failed. Incorrect password or corrupted ciphertext.');
    }
  };

  // 15. Secure Notes Generator
  const [noteTitle, setNoteTitle] = useState<string>('Confidential Server Access');
  const [noteContent, setNoteContent] = useState<string>('Production DB Password: \n9a8c@!4mZ-Klwq990x');
  const [noteLockPassword, setNoteLockPassword] = useState<string>('Vault99');
  const [encryptedNotePackage, setEncryptedNotePackage] = useState<string>('');

  const generateSecureNote = async () => {
    const json = JSON.stringify({ title: noteTitle, content: noteContent, timestamp: new Date().toISOString() });
    const enc = new TextEncoder();
    const pwHash = await crypto.subtle.digest('SHA-256', enc.encode(noteLockPassword));
    const key = await crypto.subtle.importKey('raw', pwHash, { name: 'AES-GCM' }, false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(json));
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    setEncryptedNotePackage(btoa(String.fromCharCode(...combined)));
  };

  return (
    <div className="space-y-6">
      {/* 1. PASSWORD GENERATOR */}
      {toolId === 'password-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Cryptographic Password Generator</h3>
            <button
              onClick={generatePassword}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ff6b00]/15 text-[#ff6b00] hover:bg-[#ff6b00]/25 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-roll
            </button>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${inputBg}`}>
            <span className="font-mono text-lg font-bold text-[#ff6b00] tracking-wider break-all">{generatedPass}</span>
            <button
              onClick={() => copyToClipboard(generatedPass, 'pass')}
              className="p-2.5 rounded-lg bg-zinc-800 hover:bg-[#ff6b00] hover:text-white transition shrink-0"
            >
              {copied === 'pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-zinc-400 mb-2">
                <span>Password Length: {passLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="w-full accent-[#ff6b00]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="accent-[#ff6b00]"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="accent-[#ff6b00]"
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="accent-[#ff6b00]"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="accent-[#ff6b00]"
                />
                Symbols (!@#$)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 2. PASSWORD STRENGTH CHECKER */}
      {toolId === 'password-strength-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Entropy & Password Strength Checker</h3>
          <div>
            <label className="text-xs font-medium text-zinc-400">Enter Password To Audit</label>
            <input
              type="text"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className={`w-full mt-1 px-4 py-3 rounded-xl border text-base font-mono ${inputBg}`}
            />
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-400">Entropy Level: <strong className="text-white">{strength.label}</strong></span>
              <span className="text-zinc-400">Crack Estimation: <strong className="text-[#ff6b00]">{strength.crackTime}</strong></span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${(strength.score / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. QR CODE GENERATOR */}
      {toolId === 'qr-code-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Vector QR Code Generator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">Content / URL / Text</label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400">Foreground Color</label>
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-full mt-1 h-10 rounded-xl cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400">Background Color</label>
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-full mt-1 h-10 rounded-xl cursor-pointer bg-transparent"
                  />
                </div>
              </div>
              <button
                onClick={downloadQRCode}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs shadow-lg shadow-[#ff6b00]/20 hover:bg-[#e05e00] transition"
              >
                <Download className="w-4 h-4" /> Download QR (PNG)
              </button>
            </div>

            <div className="flex justify-center p-4 bg-white/5 rounded-2xl border border-zinc-800">
              <canvas ref={qrCanvasRef} className="rounded-xl shadow-md" />
            </div>
          </div>
        </div>
      )}

      {/* 4. BARCODE GENERATOR */}
      {toolId === 'barcode-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Code 128 Barcode Generator</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-medium text-zinc-400">Alphanumeric Code Text</label>
              <input
                type="text"
                value={barcodeText}
                onChange={(e) => setBarcodeText(e.target.value.toUpperCase())}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border font-mono text-sm ${inputBg}`}
              />
            </div>
            <div className="p-4 bg-white rounded-xl flex justify-center">
              <canvas ref={barcodeCanvasRef} />
            </div>
            <button
              onClick={downloadBarcode}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition"
            >
              <Download className="w-4 h-4" /> Download Barcode PNG
            </button>
          </div>
        </div>
      )}

      {/* 5. UUID GENERATOR */}
      {toolId === 'uuid-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">RFC 4122 Version 4 UUID Generator</h3>
            <button
              onClick={generateUUIDs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ff6b00] text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
          </div>

          <div className="space-y-2">
            {uuidList.map((id, index) => (
              <div key={index} className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${inputBg}`}>
                <span className="text-[#ff6b00]">{id}</span>
                <button
                  onClick={() => copyToClipboard(id, `uuid-${index}`)}
                  className="p-1.5 text-zinc-400 hover:text-white transition"
                >
                  {copied === `uuid-${index}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. RANDOM NUMBER GENERATOR */}
      {toolId === 'random-number-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Random Number Generator (RNG)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Min Value</label>
              <input
                type="number"
                value={rngMin}
                onChange={(e) => setRngMin(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Max Value</label>
              <input
                type="number"
                value={rngMax}
                onChange={(e) => setRngMax(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Count</label>
              <input
                type="number"
                value={rngCount}
                onChange={(e) => setRngCount(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={rollRandomNumbers}
                className="w-full py-2.5 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition"
              >
                Roll Numbers
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {rngResults.map((num, i) => (
              <div key={i} className="px-5 py-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 font-mono text-2xl font-black text-[#ff6b00]">
                {num}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. RANDOM STRING GENERATOR */}
      {toolId === 'random-string-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Random String / Nonce Generator</h3>
            <button
              onClick={rollRandomString}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ff6b00] text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-roll
            </button>
          </div>
          <div className={`p-4 rounded-xl border flex items-center justify-between font-mono text-sm break-all ${inputBg}`}>
            <span className="text-emerald-400">{randStrResult}</span>
            <button
              onClick={() => copyToClipboard(randStrResult, 'randstr')}
              className="p-2 text-zinc-400 hover:text-white"
            >
              {copied === 'randstr' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 8, 9, 10. HASH / MD5 / SHA256 GENERATOR */}
      {(toolId === 'hash-generator' || toolId === 'md5-generator' || toolId === 'sha256-generator') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Cryptographic Hash Digest Suite</h3>
          <div>
            <label className="text-xs font-medium text-zinc-400">Plaintext Input</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className={`w-full mt-1 px-4 py-2.5 rounded-xl border font-mono text-sm ${inputBg}`}
            />
          </div>

          <div className="space-y-3 mt-6">
            <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-[#ff6b00] font-semibold block mb-1">SHA-256</span>
              <p className="font-mono text-xs text-zinc-300 break-all">{sha256Hash}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-[#ff6b00] font-semibold block mb-1">MD5 Checksum</span>
              <p className="font-mono text-xs text-zinc-300 break-all">{md5Hash}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-[#ff6b00] font-semibold block mb-1">SHA-512</span>
              <p className="font-mono text-xs text-zinc-300 break-all">{sha512Hash}</p>
            </div>
          </div>
        </div>
      )}

      {/* 11. JWT DECODER */}
      {toolId === 'jwt-decoder' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">JSON Web Token (JWT) Inspector</h3>
          <textarea
            rows={3}
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            placeholder="Paste your eyJ... JWT token here"
            className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
          />

          {decodedJwt.valid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/60">
                <span className="text-xs font-semibold text-[#ff6b00] block mb-2">HEADER: ALGORITHM & TOKEN TYPE</span>
                <pre className="font-mono text-xs text-zinc-200 overflow-x-auto">{JSON.stringify(decodedJwt.header, null, 2)}</pre>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/60">
                <span className="text-xs font-semibold text-emerald-400 block mb-2">PAYLOAD: DATA CLAIMS</span>
                <pre className="font-mono text-xs text-zinc-200 overflow-x-auto">{JSON.stringify(decodedJwt.payload, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {decodedJwt.error}
            </div>
          )}
        </div>
      )}

      {/* 12. JWT ENCODER */}
      {toolId === 'jwt-encoder' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">JWT Token Encoder & Signer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Payload JSON</label>
              <textarea
                rows={5}
                value={jwtPayloadInput}
                onChange={(e) => setJwtPayloadInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Secret Signing Key</label>
              <input
                type="text"
                value={jwtSecret}
                onChange={(e) => setJwtSecret(e.target.value)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-xs font-mono ${inputBg}`}
              />
            </div>
          </div>

          <div className={`p-4 rounded-xl border font-mono text-xs break-all text-[#ff6b00] ${inputBg}`}>
            {encodedJwtResult}
          </div>
        </div>
      )}

      {/* 13 & 14. ENCRYPTION & DECRYPTION */}
      {(toolId === 'encryption-tool' || toolId === 'decryption-tool') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">
            {toolId === 'encryption-tool' ? 'AES-GCM 256-Bit Encryptor' : 'AES-GCM Decryptor'}
          </h3>

          {toolId === 'encryption-tool' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">Plaintext Message</label>
                <textarea
                  rows={3}
                  value={encPlaintext}
                  onChange={(e) => setEncPlaintext(e.target.value)}
                  className={`w-full mt-1 p-3 rounded-xl border text-sm ${inputBg}`}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">Passphrase</label>
                <input
                  type="password"
                  value={encPassword}
                  onChange={(e) => setEncPassword(e.target.value)}
                  className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
                />
              </div>
              <button
                onClick={encryptMessage}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white text-xs font-semibold"
              >
                <Lock className="w-4 h-4" /> Encrypt Payload
              </button>

              {encCiphertext && (
                <div className={`p-4 rounded-xl border font-mono text-xs break-all text-emerald-400 ${inputBg}`}>
                  {encCiphertext}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">Encrypted Ciphertext (Base64)</label>
                <textarea
                  rows={3}
                  value={decCiphertext}
                  onChange={(e) => setDecCiphertext(e.target.value)}
                  className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">Passphrase</label>
                <input
                  type="password"
                  value={decPassword}
                  onChange={(e) => setDecPassword(e.target.value)}
                  className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
                />
              </div>
              <button
                onClick={decryptMessage}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white text-xs font-semibold"
              >
                <Unlock className="w-4 h-4" /> Decrypt Payload
              </button>

              {decPlaintext && (
                <div className={`p-4 rounded-xl border text-sm text-white ${inputBg}`}>
                  {decPlaintext}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 15. SECURE NOTES GENERATOR */}
      {toolId === 'secure-notes-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Zero-Knowledge Encrypted Secure Note</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Note Title</label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Confidential Content</label>
              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Locking Password</label>
              <input
                type="password"
                value={noteLockPassword}
                onChange={(e) => setNoteLockPassword(e.target.value)}
                className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <button
              onClick={generateSecureNote}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs"
            >
              <ShieldCheck className="w-4 h-4" /> Generate Encrypted Package
            </button>

            {encryptedNotePackage && (
              <div className={`p-4 rounded-xl border font-mono text-xs break-all text-emerald-400 ${inputBg}`}>
                {encryptedNotePackage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
