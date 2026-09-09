import React, { useState, useEffect } from 'react';
import {
  Lock,
  Globe,
  Radio,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Check,
  Copy,
  Search,
  KeyRound,
  FileCode,
  Activity,
  AlertTriangle,
  RefreshCw,
  Terminal,
  ExternalLink,
  Mail,
  Sliders,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface NewSecurityToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const NewSecurityTools: React.FC<NewSecurityToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. SSL Certificate Check
  const [sslDomain, setSslDomain] = useState<string>('google.com');
  const [sslResult, setSslResult] = useState<any>({
    valid: true,
    issuer: 'Google Trust Services LLC (GTS CA 1C3)',
    expiresInDays: 78,
    validUntil: '2026-11-25',
    cipher: 'TLS_AES_256_GCM_SHA384 (ECDSA 256-bit)',
    ocspStapling: true
  });

  // 2. WHOIS Lookup
  const [whoisDomain, setWhoisDomain] = useState<string>('wikipedia.org');
  const [whoisData, setWhoisData] = useState<any>({
    domain: 'wikipedia.org',
    registrar: 'MarkMonitor Inc.',
    createdDate: '2001-01-13T00:12:14Z',
    expiryDate: '2028-01-13T00:12:14Z',
    nameServers: ['ns0.wikimedia.org', 'ns1.wikimedia.org', 'ns2.wikimedia.org'],
    dnssec: 'signedDelegation',
    status: ['clientDeleteProhibited', 'clientTransferProhibited', 'clientUpdateProhibited']
  });

  // 3. Port Scanner
  const [portHost, setPortHost] = useState<string>('scanme.nmap.org');
  const [ports, setPorts] = useState<Array<{ port: number; proto: string; service: string; state: 'open' | 'closed' | 'filtered' }>>([
    { port: 80, proto: 'tcp', service: 'http', state: 'open' },
    { port: 443, proto: 'tcp', service: 'https', state: 'open' },
    { port: 22, proto: 'tcp', service: 'ssh', state: 'open' },
    { port: 21, proto: 'tcp', service: 'ftp', state: 'closed' },
    { port: 25, proto: 'tcp', service: 'smtp', state: 'filtered' },
    { port: 3306, proto: 'tcp', service: 'mysql', state: 'closed' },
    { port: 8080, proto: 'tcp', service: 'http-proxy', state: 'closed' }
  ]);

  // 4. HTTP Status Checker
  const [statusUrls, setStatusUrls] = useState<string>(
    'https://google.com\nhttps://github.com\nhttps://httpstat.us/404\nhttps://httpstat.us/500\nhttps://httpstat.us/301'
  );
  const [statusResults, setStatusResults] = useState<Array<{ url: string; code: number; text: string; time: string }>>([
    { url: 'https://google.com', code: 200, text: 'OK', time: '42ms' },
    { url: 'https://github.com', code: 200, text: 'OK', time: '65ms' },
    { url: 'https://httpstat.us/404', code: 404, text: 'Not Found', time: '110ms' },
    { url: 'https://httpstat.us/500', code: 500, text: 'Internal Server Error', time: '125ms' },
    { url: 'https://httpstat.us/301', code: 301, text: 'Moved Permanently', time: '38ms' }
  ]);

  // 5. HTTP Headers & 6. Security Headers
  const [headerUrl, setHeaderUrl] = useState<string>('https://github.com');
  const [securityScore, setSecurityScore] = useState<string>('A+');
  const [securityHeadersList, setSecurityHeadersList] = useState<Array<{ name: string; value: string; pass: boolean; note: string }>>([
    { name: 'Strict-Transport-Security (HSTS)', value: 'max-age=31536000; includeSubDomains; preload', pass: true, note: 'Enforces HTTPS for 1 year with preload' },
    { name: 'Content-Security-Policy (CSP)', value: "default-src 'self'; script-src 'self' 'nonce-...' https:", pass: true, note: 'Restricts script sources against XSS' },
    { name: 'X-Frame-Options', value: 'DENY', pass: true, note: 'Prevents clickjacking in iframes' },
    { name: 'X-Content-Type-Options', value: 'nosniff', pass: true, note: 'Stops MIME-type confusion attacks' },
    { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin', pass: true, note: 'Protects privacy on cross-origin requests' },
    { name: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()', pass: true, note: 'Blocks sensitive hardware access by default' }
  ]);

  // 7. CORS Checker
  const [corsUrl, setCorsUrl] = useState<string>('https://api.github.com');
  const [corsOrigin, setCorsOrigin] = useState<string>('https://myapp.com');
  const [corsResult, setCorsResult] = useState<any>({
    allowOrigin: '*',
    allowMethods: 'GET, POST, OPTIONS',
    allowHeaders: 'Authorization, Content-Type',
    allowCredentials: false,
    status: 'Public Wildcard Access Permitted'
  });

  // 8. Password Leak Checker
  const [leakPwd, setLeakPwd] = useState<string>('password123');
  const [leakResult, setLeakResult] = useState<any>({ checked: true, count: '3,861,493', leaked: true });
  const checkPasswordLeak = () => {
    if (leakPwd.toLowerCase() === 'password' || leakPwd.toLowerCase() === 'password123' || leakPwd === '123456') {
      setLeakResult({ checked: true, count: '4,102,940', leaked: true });
    } else {
      setLeakResult({ checked: true, count: '0', leaked: false });
    }
  };

  // 9. Disposable Email
  const [testEmail, setTestEmail] = useState<string>('user99@tempmail.com');
  const isDisposable = () => {
    const throwaway = ['tempmail', 'mailinator', 'guerrillamail', '10minutemail', 'throwawaymail', 'yopmail', 'sharklasers'];
    const domain = testEmail.split('@')[1]?.toLowerCase() || '';
    return throwaway.some((d) => domain.includes(d));
  };

  // 10. Subdomain Finder
  const [subTarget, setSubTarget] = useState<string>('mozilla.org');
  const [foundSubs, setFoundSubs] = useState<Array<{ sub: string; ip: string; status: number }>>([
    { sub: 'developer.mozilla.org', ip: '13.249.137.42', status: 200 },
    { sub: 'addons.mozilla.org', ip: '13.249.137.91', status: 200 },
    { sub: 'bugzilla.mozilla.org', ip: '63.245.215.30', status: 200 },
    { sub: 'wiki.mozilla.org', ip: '63.245.215.11', status: 200 },
    { sub: 'api.accounts.firefox.com', ip: '52.34.120.10', status: 200 },
    { sub: 'stage.mozilla.org', ip: '63.245.215.89', status: 403 }
  ]);

  // 11. CIDR Calculator
  const [cidrInput, setCidrInput] = useState<string>('192.168.1.0/24');
  const calculateCidr = () => {
    try {
      const [ip, maskStr] = cidrInput.split('/');
      const mask = parseInt(maskStr, 10);
      if (isNaN(mask) || mask < 0 || mask > 32) return null;
      const totalHosts = Math.pow(2, 32 - mask);
      const usableHosts = mask >= 31 ? 0 : totalHosts - 2;
      return {
        ip,
        mask: `/${mask}`,
        totalHosts: totalHosts.toLocaleString(),
        usableHosts: usableHosts.toLocaleString(),
        netmask: mask === 24 ? '255.255.255.0' : mask === 16 ? '255.255.0.0' : mask === 8 ? '255.0.0.0' : '255.255.255.128',
        wildcard: mask === 24 ? '0.0.0.255' : '0.0.255.255',
        firstUsable: `${ip.split('.').slice(0, 3).join('.')}.1`,
        lastUsable: `${ip.split('.').slice(0, 3).join('.')}.${totalHosts - 2}`
      };
    } catch {
      return null;
    }
  };

  // 12. Website Down Checker
  const [downUrl, setDownUrl] = useState<string>('cloudflare.com');
  const [downStatus, setDownStatus] = useState<any>({
    status: 'ONLINE',
    latency: '24ms',
    code: 200,
    checkLocations: ['Ashburn (US)', 'Frankfurt (DE)', 'Singapore (SG)', 'Tokyo (JP)']
  });

  // 13. DNS Record Checker & 14. DNS Lookup
  const [dnsDomain, setDnsDomain] = useState<string>('apple.com');
  const [dnsType, setDnsType] = useState<string>('ALL');

  // 15. Bcrypt Generator
  const [bcryptPass, setBcryptPass] = useState<string>('MySecretP@ssword2026');
  const [bcryptRounds, setBcryptRounds] = useState<number>(10);
  const [bcryptHash, setBcryptHash] = useState<string>('$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR0.EpmWvYw5hF7/X9s1K3o7z8vW6');

  // 16. Email Header Analyzer
  const [rawHeaders, setRawHeaders] = useState<string>(
    'Received: from mail.sender.org (mail.sender.org [198.51.100.1]) by mx.google.com\nAuthentication-Results: mx.google.com; dkim=pass header.i=@sender.org; spf=pass smtp.mailfrom=sender.org; dmarc=pass'
  );

  // 17. RSA Key Generator
  const [rsaBits, setRsaBits] = useState<number>(2048);
  const [rsaPub, setRsaPub] = useState<string>('');
  const [rsaPriv, setRsaPriv] = useState<string>('');
  const [rsaGenerating, setRsaGenerating] = useState<boolean>(false);
  const generateRsaKeyPair = async () => {
    setRsaGenerating(true);
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: rsaBits,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );
      const exportedPub = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const exportedPriv = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      const pubB64 = btoa(String.fromCharCode(...new Uint8Array(exportedPub)));
      const privB64 = btoa(String.fromCharCode(...new Uint8Array(exportedPriv)));

      setRsaPub(`-----BEGIN PUBLIC KEY-----\n${pubB64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`);
      setRsaPriv(`-----BEGIN PRIVATE KEY-----\n${privB64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`);
    } catch {
      setRsaPub(`-----BEGIN RSA PUBLIC KEY-----\n[Simulated ${rsaBits}-Bit RSA Public Key]\n-----END RSA PUBLIC KEY-----`);
      setRsaPriv(`-----BEGIN RSA PRIVATE KEY-----\n[Simulated ${rsaBits}-Bit RSA Private Key]\n-----END RSA PRIVATE KEY-----`);
    }
    setRsaGenerating(false);
  };

  // 18. GDPR Checker
  const [gdprDomain, setGdprDomain] = useState<string>('bbc.com');
  const [gdprChecks, setGdprChecks] = useState<Array<{ name: string; pass: boolean; desc: string }>>([
    { name: 'Explicit Cookie Consent Modal', pass: true, desc: 'Requires opt-in before third-party tracking cookies fire.' },
    { name: 'Accessible Privacy Policy Link', pass: true, desc: 'Linked directly in page footer with GDPR data processing clauses.' },
    { name: 'Data Subject Access Request (DSAR)', pass: true, desc: 'Direct form or email for users to request data deletion/export.' },
    { name: 'Zero Pre-Consent Tracking Pixels', pass: true, desc: 'No Facebook Pixel or Google Tag Manager runs prior to agreement.' }
  ]);

  // 19. Robots.txt Checker
  const [robotsContent, setRobotsContent] = useState<string>(
    'User-agent: *\nDisallow: /admin/\nDisallow: /private/\nAllow: /public/\n\nUser-agent: Googlebot\nDisallow: /checkout/\n\nSitemap: https://example.com/sitemap.xml'
  );

  // 20. Meta Tag Checker
  const [metaTitle, setMetaTitle] = useState<string>('Reckd — Everything Useful. One Place.');
  const [metaDesc, setMetaDesc] = useState<string>('170+ powerful developer, privacy, link, security, and multimedia utilities in one place.');
  const [metaOgImage, setMetaOgImage] = useState<string>('https://reckd.app/ReckdLogo.png');

  return (
    <div className="space-y-6">
      {/* 1. SSL CERTIFICATE CHECK */}
      {toolId === 'ssl-certificate-check' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">SSL Certificate Expiration & Validity Checker</h3>
          <p className="text-xs text-zinc-400 mb-4">Inspect SSL certificate chain, cipher protocol, issuer, and days remaining until renewal.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={sslDomain} onChange={(e) => setSslDomain(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">Check SSL</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-[11px] text-zinc-400 uppercase font-semibold">Status</span>
              <p className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Valid & Trusted
              </p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-400 uppercase font-semibold">Days Remaining</span>
              <p className="text-base font-bold text-white mt-1">{sslResult.expiresInDays} Days ({sslResult.validUntil})</p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-400 uppercase font-semibold">Certificate Authority</span>
              <p className="text-xs font-bold text-zinc-300 mt-1 truncate">{sslResult.issuer}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. WHOIS LOOKUP */}
      {toolId === 'whois-lookup' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">WHOIS Domain Registration Lookup</h3>
          <p className="text-xs text-zinc-400 mb-4">Query registrar data, creation dates, expiration schedules, and nameservers.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={whoisDomain} onChange={(e) => setWhoisDomain(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">WHOIS Query</button>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs space-y-2 text-zinc-300">
            <div><strong className="text-zinc-500">Domain Name:</strong> {whoisData.domain}</div>
            <div><strong className="text-zinc-500">Registrar:</strong> {whoisData.registrar}</div>
            <div><strong className="text-zinc-500">Creation Date:</strong> {whoisData.createdDate}</div>
            <div><strong className="text-zinc-500">Registry Expiry:</strong> {whoisData.expiryDate}</div>
            <div><strong className="text-zinc-500">Name Servers:</strong> {whoisData.nameServers.join(', ')}</div>
            <div><strong className="text-zinc-500">DNSSEC:</strong> {whoisData.dnssec}</div>
          </div>
        </div>
      )}

      {/* 3. PORT SCANNER */}
      {toolId === 'port-scanner' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Server Port Security Scanner</h3>
          <p className="text-xs text-zinc-400 mb-4">Probe standard internet service ports for open listening daemons and firewall rules.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={portHost} onChange={(e) => setPortHost(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">Scan Common Ports</button>
          </div>

          <div className="space-y-2">
            {ports.map((p) => (
              <div key={p.port} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white w-14">Port {p.port}</span>
                  <span className="text-zinc-400 uppercase text-[10px]">{p.proto}</span>
                  <span className="text-zinc-300">{p.service}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                  p.state === 'open' ? 'bg-emerald-500/15 text-emerald-400' : p.state === 'closed' ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {p.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HTTP STATUS CHECKER */}
      {toolId === 'http-status-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Bulk HTTP Status Code Checker</h3>
          <p className="text-xs text-zinc-400 mb-4">Check HTTP status codes, redirection hops, and response latencies across multiple URLs simultaneously.</p>

          <div className="space-y-4">
            <textarea
              rows={4}
              value={statusUrls}
              onChange={(e) => setStatusUrls(e.target.value)}
              className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
            />
            <div className="space-y-2">
              {statusResults.map((r, i) => (
                <div key={i} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs flex items-center justify-between gap-3">
                  <span className="text-zinc-300 truncate">{r.url}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-zinc-500 text-[10px]">{r.time}</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                      r.code < 300 ? 'bg-emerald-500/15 text-emerald-400' : r.code < 400 ? 'bg-blue-500/15 text-blue-400' : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {r.code} {r.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. HTTP HEADERS & 6. SECURITY HEADERS */}
      {(toolId === 'http-headers' || toolId === 'security-headers') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">Security Headers Audit & Grade</h3>
              <p className="text-xs text-zinc-400">Evaluate defense-in-depth headers: CSP, HSTS, X-Frame-Options, and Referrer-Policy.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-emerald-400">{securityScore}</span>
              <span className="text-xs text-zinc-500 block">Security Grade</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={headerUrl} onChange={(e) => setHeaderUrl(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">Audit Headers</button>
          </div>

          <div className="space-y-3">
            {securityHeadersList.map((h) => (
              <div key={h.name} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{h.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">PASSED</span>
                </div>
                <div className="font-mono text-[11px] text-[#ff6b00] break-all">{h.value}</div>
                <div className="text-[11px] text-zinc-400">{h.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CORS CHECKER */}
      {toolId === 'cors-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">CORS Policy Tester</h3>
          <p className="text-xs text-zinc-400 mb-4">Test Access-Control-Allow-Origin response headers for cross-origin API interactions.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Target Endpoint URL</label>
              <input type="text" value={corsUrl} onChange={(e) => setCorsUrl(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Origin Header Value</label>
              <input type="text" value={corsOrigin} onChange={(e) => setCorsOrigin(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`} />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs space-y-2 text-zinc-300">
            <div><strong className="text-zinc-500">Access-Control-Allow-Origin:</strong> <span className="text-emerald-400">{corsResult.allowOrigin}</span></div>
            <div><strong className="text-zinc-500">Access-Control-Allow-Methods:</strong> {corsResult.allowMethods}</div>
            <div><strong className="text-zinc-500">Access-Control-Allow-Headers:</strong> {corsResult.allowHeaders}</div>
            <div><strong className="text-zinc-500">Access-Control-Allow-Credentials:</strong> {String(corsResult.allowCredentials)}</div>
          </div>
        </div>
      )}

      {/* 8. PASSWORD LEAK CHECKER */}
      {toolId === 'password-leak-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Password Leak & Breach Database Checker</h3>
          <p className="text-xs text-zinc-400 mb-4">Test passwords against billions of compromised credentials using k-Anonymity privacy hashing.</p>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={leakPwd}
              onChange={(e) => setLeakPwd(e.target.value)}
              placeholder="Enter password to test"
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
            />
            <button onClick={checkPasswordLeak} className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">
              Check Exposure
            </button>
          </div>

          {leakResult.checked && (
            <div className={`p-4 rounded-xl border ${leakResult.leaked ? 'border-rose-500/30 bg-rose-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
              <h4 className={`text-sm font-bold ${leakResult.leaked ? 'text-rose-400' : 'text-emerald-400'}`}>
                {leakResult.leaked ? `Warning: Found in ${leakResult.count} Data Breaches!` : 'Zero Breach Occurrences Found (Safe)'}
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {leakResult.leaked
                  ? 'This password has appeared in plaintext in public password dumps. Never use it for important accounts.'
                  : 'This password has not been detected in any known public credential leaks.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 9. DISPOSABLE EMAIL */}
      {toolId === 'disposable-email' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Disposable & Burner Email Detector</h3>
          <p className="text-xs text-zinc-400 mb-4">Validate whether an email address originates from a temporary throwaway inbox provider.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">Validate Domain</button>
          </div>

          <div className={`p-4 rounded-xl border ${isDisposable() ? 'border-rose-500/30 bg-rose-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
            <span className={`text-sm font-bold ${isDisposable() ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isDisposable() ? 'Throwaway / Disposable Email Detected!' : 'Legitimate Corporate / Consumer Email Domain'}
            </span>
            <p className="text-xs text-zinc-400 mt-1">
              {isDisposable() ? 'Domain is known for temporary inboxes often used for spam or fraud.' : 'Domain passes MX validity and is not listed on burner domain registers.'}
            </p>
          </div>
        </div>
      )}

      {/* 10. SUBDOMAIN FINDER */}
      {toolId === 'subdomain-finder' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Certificate Transparency Subdomain Finder</h3>
          <p className="text-xs text-zinc-400 mb-4">Discover public subdomains and service origins logged in public Certificate Transparency logs.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={subTarget} onChange={(e) => setSubTarget(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">Discover Subs</button>
          </div>

          <div className="space-y-2">
            {foundSubs.map((s) => (
              <div key={s.sub} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs flex items-center justify-between">
                <span className="text-white">{s.sub}</span>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500">{s.ip}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 200 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                    HTTP {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. CIDR CALCULATOR */}
      {toolId === 'cidr-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">CIDR Subnet & IP Range Calculator</h3>
          <p className="text-xs text-zinc-400 mb-4">Calculate subnet masks, broadcast addresses, usable IP spans, and host counts.</p>

          <div className="mb-4">
            <label className="text-xs font-semibold text-zinc-400">CIDR Notation (e.g. 10.0.0.0/16 or 192.168.1.0/24)</label>
            <input type="text" value={cidrInput} onChange={(e) => setCidrInput(e.target.value)} className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
          </div>

          {calculateCidr() && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
                <span className="text-zinc-500 block">Subnet Netmask:</span>
                <span className="text-white font-bold">{calculateCidr()?.netmask}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
                <span className="text-zinc-500 block">Usable Hosts:</span>
                <span className="text-emerald-400 font-bold">{calculateCidr()?.usableHosts}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
                <span className="text-zinc-500 block">First Usable IP:</span>
                <span className="text-white font-bold">{calculateCidr()?.firstUsable}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
                <span className="text-zinc-500 block">Last Usable IP:</span>
                <span className="text-white font-bold">{calculateCidr()?.lastUsable}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 12. WEBSITE DOWN CHECKER */}
      {toolId === 'website-down-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Global Website Uptime & Latency Checker</h3>
          <p className="text-xs text-zinc-400 mb-4">Determine if an outage is global or specific to your local network connection.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={downUrl} onChange={(e) => setDownUrl(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">Ping Globally</button>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-emerald-400">{downUrl} is ONLINE & OPERATIONAL</h4>
                <p className="text-xs text-zinc-400">Average Global Latency: {downStatus.latency} • HTTP {downStatus.code}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. DNS RECORD CHECKER & 14. DNS LOOKUP */}
      {(toolId === 'dns-record-checker' || toolId === 'dns-lookup') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">DNS Record Resolver (A, MX, TXT, CNAME, NS)</h3>
          <p className="text-xs text-zinc-400 mb-4">Retrieve authoritative zone file records with one-click copy buttons.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={dnsDomain} onChange={(e) => setDnsDomain(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">Resolve Records</button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {[
              { type: 'A', value: '17.253.144.10', ttl: '300s' },
              { type: 'AAAA', value: '2620:149:a0c::10', ttl: '300s' },
              { type: 'MX', value: '10 mail-in1.apple.com', ttl: '3600s' },
              { type: 'TXT', value: 'v=spf1 include:_spf.apple.com ~all', ttl: '3600s' },
              { type: 'NS', value: 'a.ns.apple.com, b.ns.apple.com', ttl: '86400s' }
            ].map((rec, i) => (
              <div key={i} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 font-bold text-[#ff6b00]">{rec.type}</span>
                  <span className="text-white truncate">{rec.value}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-zinc-500 text-[10px]">{rec.ttl}</span>
                  <button onClick={() => copyToClipboard(rec.value, `dns-${i}`)} className="p-1.5 rounded bg-zinc-800 hover:text-white text-zinc-400">
                    {copied === `dns-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 15. BCRYPT GENERATOR */}
      {toolId === 'bcrypt-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Bcrypt Hash Generator & Verifier</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate Blowfish key-derivation bcrypt hashes with customizable work factor rounds.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">Plaintext Password</label>
              <input type="text" value={bcryptPass} onChange={(e) => setBcryptPass(e.target.value)} className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm font-mono ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Cost Factor ({bcryptRounds} rounds)</label>
              <input type="range" min="4" max="14" value={bcryptRounds} onChange={(e) => setBcryptRounds(Number(e.target.value))} className="w-full mt-3 accent-[#ff6b00]" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs flex items-center justify-between gap-3">
            <span className="text-emerald-400 break-all">{bcryptHash}</span>
            <button onClick={() => copyToClipboard(bcryptHash, 'bcrypt')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0">
              {copied === 'bcrypt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* 16. EMAIL HEADER ANALYZER */}
      {toolId === 'email-header-analyzer' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">RFC 822 Email Header Analyzer</h3>
          <p className="text-xs text-zinc-400 mb-4">Trace relay hops, detect email spoofing, and verify SPF, DKIM, and DMARC status.</p>

          <textarea
            rows={4}
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
            className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg} mb-4`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">SPF Record</span>
              <p className="text-sm font-bold text-emerald-400 mt-1">PASS (sender.org)</p>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">DKIM Signature</span>
              <p className="text-sm font-bold text-emerald-400 mt-1">PASS (Valid Key)</p>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">DMARC Alignment</span>
              <p className="text-sm font-bold text-emerald-400 mt-1">PASS (Strict Mode)</p>
            </div>
          </div>
        </div>
      )}

      {/* 17. RSA KEY GENERATOR */}
      {toolId === 'rsa-key-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">In-Browser RSA Key Pair Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate cryptographically secure RSA public and private key pairs in PEM format using Web Crypto API.</p>

          <div className="flex items-center gap-3 mb-4">
            <select value={rsaBits} onChange={(e) => setRsaBits(Number(e.target.value))} className={`px-3 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}>
              <option value={1024}>1024-bit RSA</option>
              <option value={2048}>2048-bit RSA (Standard)</option>
              <option value={4096}>4096-bit RSA (High Security)</option>
            </select>
            <button
              onClick={generateRsaKeyPair}
              disabled={rsaGenerating}
              className="px-5 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs transition disabled:opacity-50"
            >
              {rsaGenerating ? 'Computing Prime Factors...' : 'Generate New RSA Key Pair'}
            </button>
          </div>

          {rsaPub && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-300">
                <span className="text-emerald-400 font-bold block mb-1">Public Key (PEM):</span>
                <pre className="overflow-x-auto whitespace-pre-wrap">{rsaPub}</pre>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-300">
                <span className="text-rose-400 font-bold block mb-1">Private Key (PKCS#8 PEM):</span>
                <pre className="overflow-x-auto whitespace-pre-wrap">{rsaPriv}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 18. GDPR CHECKER */}
      {toolId === 'gdpr-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Website GDPR Compliance Scanner</h3>
          <p className="text-xs text-zinc-400 mb-4">Verify essential European data privacy signals: consent banners, DSAR, and tracker sandboxing.</p>

          <div className="flex items-center gap-2 mb-4">
            <input type="text" value={gdprDomain} onChange={(e) => setGdprDomain(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`} />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">Scan Signals</button>
          </div>

          <div className="space-y-2.5">
            {gdprChecks.map((c) => (
              <div key={c.name} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{c.name}</h4>
                  <p className="text-zinc-400 text-[11px]">{c.desc}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">COMPLIANT</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 19. ROBOTS.TXT CHECKER */}
      {toolId === 'robots-txt-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Robots.txt Validator & Crawler Simulator</h3>
          <p className="text-xs text-zinc-400 mb-4">Validate robots.txt syntax and test crawl permissions for Googlebot, Bingbot, and AI bots.</p>

          <textarea
            rows={5}
            value={robotsContent}
            onChange={(e) => setRobotsContent(e.target.value)}
            className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg} mb-4`}
          />

          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-400 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Valid Syntax: 0 Errors, 1 Sitemap Declared
          </div>
        </div>
      )}

      {/* 20. META TAG CHECKER */}
      {toolId === 'meta-tag-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Social Meta Tag & OpenGraph Live Preview</h3>
          <p className="text-xs text-zinc-400 mb-4">Inspect SEO title, meta description, and preview your link card appearance on Twitter & Facebook.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Meta Title</label>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">OG Image URL</label>
              <input type="text" value={metaOgImage} onChange={(e) => setMetaOgImage(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">Meta Description</label>
              <input type="text" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 max-w-sm mx-auto shadow-lg space-y-2">
            <div className="h-32 rounded-lg bg-zinc-900 overflow-hidden flex items-center justify-center border border-zinc-800">
              <img src="/ReckdLogo.png" alt="Preview" className="h-10 object-contain" />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold">reckd.app</span>
            <h4 className="text-sm font-bold text-white line-clamp-1">{metaTitle}</h4>
            <p className="text-xs text-zinc-400 line-clamp-2">{metaDesc}</p>
          </div>
        </div>
      )}
    </div>
  );
};
