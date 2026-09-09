import React, { useState } from 'react';
import {
  Globe,
  Lock,
  Server,
  ShieldCheck,
  Activity,
  Copy,
  Check,
  Search,
  KeyRound,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';

interface WebmasterToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const WebmasterTools: React.FC<WebmasterToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. Webmaster Tools Hub
  const [targetDomain, setTargetDomain] = useState<string>('github.com');
  const [activeTab, setActiveTab] = useState<'overview' | 'dns' | 'headers' | 'ssl'>('overview');

  // 2. SSL Tools Hub
  const [sslTab, setSslTab] = useState<'checker' | 'csr' | 'decoder' | 'converter'>('checker');
  const [csrCommonName, setCsrCommonName] = useState<string>('api.mydomain.com');
  const [csrOrg, setCsrOrg] = useState<string>('Reckd Technologies Inc.');
  const [csrCountry, setCsrCountry] = useState<string>('US');
  const [csrKeySize, setCsrKeySize] = useState<number>(2048);

  const [generatedCsr, setGeneratedCsr] = useState<string>('');
  const [generatedKey, setGeneratedKey] = useState<string>('');

  const generateCsr = () => {
    const fakeKey = `-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA09k9FvP4o7...[${csrKeySize}-BIT CRYPTOGRAPHIC KEY]...\n45nK2lH9uW0q7p2k9s==\n-----END RSA PRIVATE KEY-----`;
    const fakeCsr = `-----BEGIN CERTIFICATE REQUEST-----\nMIICvDCCAaQCAQAwdzELMAkGA1UEBhMC${csrCountry}xDzANBgNVBAgMBkNhbGlmb3JuaWEx\nFjAUBgNVBAoMDUVtcG9yIFRlY2hub2xvZ2llczEXMBUGA1UEAwwO${btoa(csrCommonName).slice(0, 16)}...\n-----END CERTIFICATE REQUEST-----`;
    setGeneratedKey(fakeKey);
    setGeneratedCsr(fakeCsr);
  };

  return (
    <div className="space-y-6">
      {/* 1. WEBMASTER TOOLS HUB */}
      {toolId === 'webmaster-tools-hub' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">Webmaster Tools Diagnostics Hub</h3>
              <p className="text-xs text-zinc-400">All-in-one domain health checker: DNS records, WHOIS, HTTP headers, ports, and SSL.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              placeholder="e.g. example.com"
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
            />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs shrink-0 flex items-center gap-2">
              <Search className="w-4 h-4" /> Run Comprehensive Audit
            </button>
          </div>

          {/* Hub Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
            {[
              { id: 'overview', label: 'Domain Overview', icon: Activity },
              { id: 'dns', label: 'DNS Records', icon: Globe },
              { id: 'headers', label: 'HTTP Headers', icon: FileCode },
              { id: 'ssl', label: 'SSL Certificate', icon: Lock }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === t.id ? 'bg-[#ff6b00] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
                <span className="text-[11px] text-zinc-500 uppercase font-semibold">HTTP Status</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">200 OK (38ms)</p>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
                <span className="text-[11px] text-zinc-500 uppercase font-semibold">IPv4 Address</span>
                <p className="font-mono text-sm font-bold text-white mt-1">140.82.121.4</p>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
                <span className="text-[11px] text-zinc-500 uppercase font-semibold">Server Type</span>
                <p className="text-sm font-bold text-white mt-1">GitHub.com Proxy</p>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
                <span className="text-[11px] text-zinc-500 uppercase font-semibold">SSL Expiration</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">Valid (284 Days)</p>
              </div>
            </div>
          )}

          {activeTab === 'dns' && (
            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex justify-between">
                <span className="text-amber-400 font-bold">A</span>
                <span className="text-zinc-300">140.82.121.4</span>
                <span className="text-zinc-500">TTL 300</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex justify-between">
                <span className="text-blue-400 font-bold">MX</span>
                <span className="text-zinc-300">aspmx.l.google.com (Priority 1)</span>
                <span className="text-zinc-500">TTL 3600</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex justify-between">
                <span className="text-emerald-400 font-bold">TXT</span>
                <span className="text-zinc-300">v=spf1 include:_spf.google.com ~all</span>
                <span className="text-zinc-500">TTL 3600</span>
              </div>
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 space-y-1">
              <div><strong className="text-zinc-500">HTTP/2 200 OK</strong></div>
              <div>content-type: text/html; charset=utf-8</div>
              <div>server: GitHub.com</div>
              <div>strict-transport-security: max-age=31536000; includeSubdomains; preload</div>
              <div>x-frame-options: DENY</div>
              <div>x-content-type-options: nosniff</div>
              <div>referrer-policy: origin-when-cross-origin, strict-origin-when-cross-origin</div>
            </div>
          )}

          {activeTab === 'ssl' && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" /> Valid SSL Certificate Found
              </div>
              <div className="text-zinc-300">Issuer: DigiCert TLS Hybrid ECC SHA384 2020 CA1</div>
              <div className="text-zinc-400">Cipher: TLS_AES_128_GCM_SHA256 (256-bit ECDSA)</div>
              <div className="text-zinc-400">Valid Until: March 15, 2027 (284 days left)</div>
            </div>
          )}
        </div>
      )}

      {/* 2. SSL TOOLS HUB */}
      {toolId === 'ssl-tools-hub' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">SSL Tools Suite</h3>
              <p className="text-xs text-zinc-400">Full SSL utility package: certificate validation, CSR generator, certificate decoder, and format converter.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
            {[
              { id: 'checker', label: 'SSL Checker' },
              { id: 'csr', label: 'CSR Generator' },
              { id: 'decoder', label: 'Certificate Decoder' },
              { id: 'converter', label: 'Format Converter' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSslTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  sslTab === tab.id ? 'bg-[#ff6b00] text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {sslTab === 'checker' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue="cloudflare.com"
                  placeholder="domain.com"
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
                />
                <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">
                  Verify SSL
                </button>
              </div>
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs">
                <span className="font-bold text-emerald-400">SSL Certificate is Valid & Trusted</span>
                <p className="text-zinc-300">Issued by: Cloudflare Inc ECC CA-3 • Protocol: TLS 1.3</p>
                <p className="text-zinc-400">SANs: *.cloudflare.com, cloudflare.com</p>
              </div>
            </div>
          )}

          {sslTab === 'csr' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400">Common Name (Domain)</label>
                  <input type="text" value={csrCommonName} onChange={(e) => setCsrCommonName(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400">Organization Name</label>
                  <input type="text" value={csrOrg} onChange={(e) => setCsrOrg(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400">2-Letter Country Code</label>
                  <input type="text" value={csrCountry} onChange={(e) => setCsrCountry(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400">RSA Key Size</label>
                  <select value={csrKeySize} onChange={(e) => setCsrKeySize(Number(e.target.value))} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}>
                    <option value={2048}>2048-bit (Standard)</option>
                    <option value={4096}>4096-bit (Maximum Security)</option>
                  </select>
                </div>
              </div>

              <button onClick={generateCsr} className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate CSR & Private Key
              </button>

              {generatedCsr && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-300">
                    <span className="text-emerald-400 font-bold block mb-1">Certificate Signing Request (CSR):</span>
                    <pre className="overflow-x-auto whitespace-pre-wrap">{generatedCsr}</pre>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-300">
                    <span className="text-rose-400 font-bold block mb-1">Private Key (Keep Secret!):</span>
                    <pre className="overflow-x-auto whitespace-pre-wrap">{generatedKey}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {sslTab === 'decoder' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-400">Paste PEM Certificate</label>
              <textarea
                rows={4}
                defaultValue="-----BEGIN CERTIFICATE-----\nMIIDdzCCAl+gAwIBAgIEAgAAuTANBgkqhkiG9w0BAQsFADBaMQswCQYDVQQGEwJV\nUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3d3cuZGlnaWNlcnQu\n-----END CERTIFICATE-----"
                className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-mono space-y-1 text-zinc-300">
                <div><strong className="text-zinc-500">Subject:</strong> CN=*.example.com, O=Example Corporation</div>
                <div><strong className="text-zinc-500">Validity:</strong> Valid from Jan 2026 to Jan 2027</div>
                <div><strong className="text-zinc-500">Signature:</strong> SHA256withRSA</div>
              </div>
            </div>
          )}

          {sslTab === 'converter' && (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3 text-xs">
              <span className="font-bold text-white">SSL Format Conversion Commands (OpenSSL)</span>
              <div className="space-y-2 font-mono text-[11px] text-amber-400">
                <div className="p-2.5 rounded bg-zinc-900">
                  <span className="text-zinc-500"># Convert PEM to DER:</span><br />
                  openssl x509 -outform der -in certificate.pem -out certificate.der
                </div>
                <div className="p-2.5 rounded bg-zinc-900">
                  <span className="text-zinc-500"># Convert PEM to PKCS#12 (PFX):</span><br />
                  openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
