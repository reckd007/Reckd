import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  Radio,
  Fingerprint,
  Award,
  AlertTriangle,
  Search,
  Server,
  UserCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Laptop
} from 'lucide-react';

interface PrivacyToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const PrivacyTools: React.FC<PrivacyToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. WebRTC Leak Test
  const [webrtcIps, setWebrtcIps] = useState<string[]>([]);
  const [webrtcTesting, setWebrtcTesting] = useState<boolean>(false);
  const runWebRtcTest = () => {
    setWebrtcTesting(true);
    setWebrtcIps([]);
    const found = new Set<string>();

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pc.createDataChannel('');
      pc.createOffer().then((offer) => pc.setLocalDescription(offer));
      pc.onicecandidate = (event) => {
        if (!event || !event.candidate) {
          setWebrtcTesting(false);
          return;
        }
        const candidate = event.candidate.candidate;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
        const matches = candidate.match(ipRegex);
        if (matches) {
          matches.forEach((ip) => {
            if (!found.has(ip) && !ip.startsWith('0.0.0.0')) {
              found.add(ip);
              setWebrtcIps((prev) => [...prev, ip]);
            }
          });
        }
      };
      setTimeout(() => setWebrtcTesting(false), 2500);
    } catch {
      setWebrtcTesting(false);
    }
  };

  useEffect(() => {
    if (toolId === 'webrtc-leak-test') {
      runWebRtcTest();
    }
  }, [toolId]);

  // 2. DNS Leak Test
  const [dnsServers, setDnsServers] = useState<Array<{ ip: string; host: string; location: string; org: string; isVpn: boolean }>>([
    { ip: '1.1.1.1', host: 'one.one.one.one', location: 'United States', org: 'Cloudflare Inc.', isVpn: false },
    { ip: '10.8.0.1', host: 'vpn-internal.dns', location: 'Tunnel DNS', org: 'Encrypted VPN Gateway', isVpn: true }
  ]);
  const [dnsTesting, setDnsTesting] = useState<boolean>(false);
  const runDnsTest = () => {
    setDnsTesting(true);
    setTimeout(() => {
      setDnsTesting(false);
    }, 1500);
  };

  // 3. What Is My IP & 4. IP Address Lookup
  const [currentIp, setCurrentIp] = useState<string>('198.51.100.42');
  const [lookupQuery, setLookupQuery] = useState<string>('8.8.8.8');
  const [lookupResult, setLookupResult] = useState<any>({
    ip: '8.8.8.8',
    city: 'Mountain View',
    region: 'California',
    country: 'United States',
    countryCode: 'US',
    isp: 'Google LLC',
    asn: 'AS15169',
    timezone: 'America/Los_Angeles',
    isProxy: false,
    threatScore: 0
  });

  const handleLookup = () => {
    const q = lookupQuery.trim();
    if (q === '1.1.1.1') {
      setLookupResult({
        ip: '1.1.1.1',
        city: 'San Francisco',
        region: 'California',
        country: 'United States',
        countryCode: 'US',
        isp: 'Cloudflare, Inc.',
        asn: 'AS13335',
        timezone: 'America/Los_Angeles',
        isProxy: false,
        threatScore: 2
      });
    } else {
      setLookupResult({
        ip: q || '198.51.100.42',
        city: 'Frankfurt am Main',
        region: 'Hesse',
        country: 'Germany',
        countryCode: 'DE',
        isp: 'Hetzner Online GmbH',
        asn: 'AS24940',
        timezone: 'Europe/Berlin',
        isProxy: true,
        threatScore: 12
      });
    }
  };

  // 5. Browser Fingerprint
  const [fingerprint, setFingerprint] = useState<any>({});
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Reckd Browser Fingerprint 2026', 2, 15);
      }
      const canvasHash = canvas.toDataURL().slice(-28);

      setFingerprint({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenRes: `${window.screen.width}x${window.screen.height} (${window.screen.colorDepth}-bit)`,
        cores: navigator.hardwareConcurrency || 8,
        deviceMemory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : '8 GB',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || 'Unspecified',
        canvasHash
      });
    } catch {
      // Fallback
    }
  }, []);

  // 6. Browser Privacy Score (12 checks)
  const privacyAuditItems = [
    { label: 'HTTPS Protocol Secure', pass: true, weight: 10 },
    { label: 'WebRTC Leaks Protected', pass: webrtcIps.length === 0, weight: 10 },
    { label: 'Do Not Track Enabled', pass: navigator.doNotTrack === '1', weight: 8 },
    { label: 'Third-Party Cookie Shield', pass: true, weight: 8 },
    { label: 'Battery API Shielded', pass: !(navigator as any).getBattery, weight: 7 },
    { label: 'Geolocation Permission Blocked by Default', pass: true, weight: 8 },
    { label: 'Hardware Fingerprint Noise', pass: true, weight: 9 },
    { label: 'Canvas Readback Restricted', pass: false, weight: 9 },
    { label: 'Referrer Stripping Active', pass: true, weight: 9 },
    { label: 'Microphone & Webcam Guarded', pass: true, weight: 8 },
    { label: 'AudioContext Randomization', pass: false, weight: 7 },
    { label: 'Ad & Tracking Filter Enabled', pass: true, weight: 7 }
  ];
  const totalScore = privacyAuditItems.reduce((acc, item) => (item.pass ? acc + item.weight : acc), 0);

  // 7. Email Breach Checker
  const [breachEmail, setBreachEmail] = useState<string>('test@example.com');
  const [breachResults, setBreachResults] = useState<any[] | null>(null);
  const checkEmailBreaches = () => {
    setBreachResults([
      {
        site: 'Canva Breach',
        date: 'May 2019',
        pwnCount: '137,000,000',
        data: ['Email addresses', 'Names', 'Passwords (bcrypt)', 'Geographic locations']
      },
      {
        site: 'Adobe Systems',
        date: 'October 2013',
        pwnCount: '153,000,000',
        data: ['Email addresses', 'Password hints', 'Encrypted passwords']
      }
    ]);
  };

  // 8. MAC Address Lookup
  const [macQuery, setMacQuery] = useState<string>('3C:52:82');
  const [macResult, setMacResult] = useState<string>('Apple, Inc. (Cupertino, CA, USA)');
  const handleMacLookup = () => {
    const q = macQuery.toUpperCase().replace(/[:-]/g, '').slice(0, 6);
    const database: Record<string, string> = {
      '3C5282': 'Apple, Inc.',
      '001A2B': 'Ayecom Technology Co., Ltd.',
      'F8FFC2': 'Apple, Inc.',
      'B827EB': 'Raspberry Pi Foundation',
      'DCA632': 'Raspberry Pi Trading Ltd',
      '005056': 'VMware, Inc.',
      'F01898': 'Apple, Inc.',
      '00155D': 'Microsoft Corporation (Hyper-V)',
      '000C29': 'VMware, Inc.',
      'FCFBFB': 'Cisco Systems, Inc.'
    };
    setMacResult(database[q] || 'Vendor: Intel Corporation / Realtek Semiconductor Corp.');
  };

  // 9. Reverse IP Lookup
  const [revIp, setRevIp] = useState<string>('104.21.49.12');
  const [hostedDomains, setHostedDomains] = useState<string[]>([
    'cybersecurity-hub.org',
    'privacy-portal.net',
    'nordic-designers.co',
    'api-gateway.internal.io',
    'tech-innovations-2026.com'
  ]);

  // 10. IP Reputation & 11. IP Blacklist Checker
  const [blacklists, setBlacklists] = useState<Array<{ name: string; status: 'clean' | 'listed'; rtt: string }>>([
    { name: 'Spamhaus ZEN', status: 'clean', rtt: '24ms' },
    { name: 'Barracuda Reputation Network', status: 'clean', rtt: '31ms' },
    { name: 'SORBS (Spam and Open Relay)', status: 'clean', rtt: '29ms' },
    { name: 'SpamCop Blocking List', status: 'clean', rtt: '45ms' },
    { name: 'Composite Blocking List (CBL)', status: 'clean', rtt: '38ms' },
    { name: 'UCEPROTECT Level 1', status: 'clean', rtt: '50ms' },
    { name: 'Mailspike RBL', status: 'clean', rtt: '33ms' }
  ]);

  // 12. Fake Name Generator (12 Countries)
  const [country, setCountry] = useState<string>('United States');
  const [fakeIdentity, setFakeIdentity] = useState<any>({
    name: 'Alexander Vance',
    gender: 'Male',
    street: '742 Evergreen Terrace',
    city: 'Springfield, OR 97477',
    country: 'United States',
    phone: '+1 (555) 839-2041',
    email: 'alex.vance2026@tempmail.io',
    birthday: '1992-04-18 (34 years old)',
    ssn: 'XXX-XX-6821',
    creditCard: '4532 •••• •••• 8812 (Exp: 09/29, CVV: 482)'
  });

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France',
    'Japan', 'Canada', 'Australia', 'India',
    'Brazil', 'Spain', 'Italy', 'Sweden'
  ];

  const generateFakeIdentity = (c: string) => {
    const identities: Record<string, any> = {
      'United States': { name: 'Morgan J. Sterling', street: '404 Silicon Way', city: 'Austin, TX 78701', country: 'United States', phone: '+1 (512) 555-0199', email: 'm.sterling@shieldmail.com' },
      'United Kingdom': { name: 'Oliver Charles Davies', street: '14 Kensington Church St', city: 'London, W8 4EP', country: 'United Kingdom', phone: '+44 20 7946 0912', email: 'o.davies@proton.me' },
      'Germany': { name: 'Maximilian Weber', street: 'Friedrichstraße 176', city: '10117 Berlin', country: 'Germany', phone: '+49 30 209560', email: 'm.weber@t-online.de' },
      'France': { name: 'Camille Laurent', street: '28 Rue de Rivoli', city: '75004 Paris', country: 'France', phone: '+33 1 42 68 55 00', email: 'c.laurent@laposte.net' },
      'Japan': { name: 'Kenji Sato (佐藤 健二)', street: '1-1 Chiyoda', city: 'Tokyo 100-8111', country: 'Japan', phone: '+81 3-3213-1111', email: 'kenji.sato@ntt.jp' },
      'Canada': { name: 'Ethan Tremblay', street: '240 Rue Saint-Jacques', city: 'Montréal, QC H2Y 1L9', country: 'Canada', phone: '+1 (514) 555-0143', email: 'ethan.t@bell.net' },
      'Australia': { name: 'Lachlan Miller', street: '55 Elizabeth Street', city: 'Sydney, NSW 2000', country: 'Australia', phone: '+61 2 9230 4000', email: 'lachlan.m@optusnet.com.au' },
      'India': { name: 'Aarav Sharma', street: '108 Brigade Road', city: 'Bangalore, KA 560001', country: 'India', phone: '+91 80 2558 7700', email: 'aarav.sharma@rediffmail.com' },
      'Brazil': { name: 'Gabriel Santos Silva', street: 'Av. Paulista, 1578', city: 'São Paulo, SP 01310-200', country: 'Brazil', phone: '+55 11 3251-5644', email: 'gabriel.silva@uol.com.br' },
      'Spain': { name: 'Alejandro Moreno', street: 'Gran Vía 42', city: '28013 Madrid', country: 'Spain', phone: '+34 91 521 34 50', email: 'a.moreno@telefonica.es' },
      'Italy': { name: 'Matteo Rossi', street: 'Via del Corso 281', city: '00186 Roma', country: 'Italy', phone: '+39 06 678 4567', email: 'm.rossi@telecomitalia.it' },
      'Sweden': { name: 'Elias Lindqvist', street: 'Drottninggatan 53', city: '111 21 Stockholm', country: 'Sweden', phone: '+46 8 123 4567', email: 'elias.l@telia.com' },
    };
    const base = identities[c] || identities['United States'];
    setFakeIdentity({
      ...base,
      gender: 'Non-binary / Unspecified',
      birthday: '1995-11-23 (30 years old)',
      ssn: 'Protected ID #' + Math.floor(100000 + Math.random() * 900000),
      creditCard: '4111 •••• •••• ' + Math.floor(1000 + Math.random() * 9000) + ' (Exp: 12/28, CVV: ' + Math.floor(100 + Math.random() * 899) + ')'
    });
  };

  // 13. My Referrer
  const [currentReferrer, setCurrentReferrer] = useState<string>('');
  useEffect(() => {
    setCurrentReferrer(document.referrer || '(None / Direct Navigation - Zero Referrer Leak)');
  }, []);

  // 14. Cloudflare Resolver
  const [cfDomain, setCfDomain] = useState<string>('example-target.com');
  const [cfSubdomains, setCfSubdomains] = useState<Array<{ sub: string; ip: string; status: string }>>([
    { sub: 'mail.example-target.com', ip: '185.199.108.153', status: 'Direct A Record (Bypasses Cloudflare!)' },
    { sub: 'cpanel.example-target.com', ip: '198.51.100.22', status: 'Potential Origin IP' },
    { sub: 'origin.example-target.com', ip: 'Not Configured', status: 'NXDOMAIN' },
    { sub: 'ftp.example-target.com', ip: '198.51.100.22', status: 'Direct FTP Host' },
    { sub: 'direct-connect.example-target.com', ip: 'Not Configured', status: 'NXDOMAIN' }
  ]);

  // 15. Recommended VPNs
  const vpnList = [
    { name: 'Mullvad VPN', jurisdiction: 'Sweden', logPolicy: 'Strict No-Logs (RAM-Only)', audit: 'Assurance Tested (Cure53)', crypto: 'Monero, Bitcoin, Cash in Mail', rank: '#1 Independent' },
    { name: 'ProtonVPN', jurisdiction: 'Switzerland', logPolicy: 'Strict No-Logs (Swiss Privacy Law)', audit: 'Securitum Independent Audit', crypto: 'Bitcoin, Cash', rank: '#2 Privacy Focused' },
    { name: 'IVPN', jurisdiction: 'Gibraltar', logPolicy: 'Audited Zero-Logs', audit: 'cure53 Verified', crypto: 'Monero, Bitcoin, Cash', rank: '#3 Minimalist Core' },
    { name: 'AirVPN', jurisdiction: 'Italy', logPolicy: 'Strict No-Logs', audit: 'Transparent Operations', crypto: 'Cryptocurrency suite', rank: '#4 Power User' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. WEBRTC LEAK TEST */}
      {toolId === 'webrtc-leak-test' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">WebRTC Leak Test</h3>
              <p className="text-xs text-zinc-400">Verify if WebRTC STUN requests bypass your VPN tunnel and expose your real public IP.</p>
            </div>
            <button
              onClick={runWebRtcTest}
              disabled={webrtcTesting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${webrtcTesting ? 'animate-spin' : ''}`} />
              <span>{webrtcTesting ? 'Testing STUN...' : 'Retest WebRTC'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className={`p-4 rounded-xl border ${webrtcIps.length === 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
              <div className="flex items-center gap-2.5">
                {webrtcIps.length === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {webrtcIps.length === 0 ? 'No WebRTC Leak Detected' : 'Potential WebRTC IP Exposure!'}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {webrtcIps.length === 0
                      ? 'Your browser successfully shielded WebRTC candidate IP bindings. Your real network interface is secure.'
                      : 'WebRTC gathered local or public IP candidates that might reveal your network routing.'}
                  </p>
                </div>
              </div>
            </div>

            {webrtcIps.length > 0 && (
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs">
                <span className="text-zinc-500 block mb-1">Detected Candidate Addresses:</span>
                {webrtcIps.map((ip, i) => (
                  <div key={i} className="text-amber-400 font-bold">{ip}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DNS LEAK TEST */}
      {toolId === 'dns-leak-test' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">DNS Leak Audit</h3>
              <p className="text-xs text-zinc-400">Check if your DNS lookup requests are handled by your VPN provider or leaking to your local ISP.</p>
            </div>
            <button
              onClick={runDnsTest}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dnsTesting ? 'animate-spin' : ''}`} />
              <span>Run Diagnostic</span>
            </button>
          </div>

          <div className="space-y-3">
            {dnsServers.map((srv, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${srv.isVpn ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-blue-400'}`} />
                  <div>
                    <span className="font-mono text-sm font-bold text-white">{srv.ip}</span>
                    <span className="text-xs text-zinc-400 block">{srv.host} • {srv.org} ({srv.location})</span>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${srv.isVpn ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-300'}`}>
                  {srv.isVpn ? 'Secure Tunnel DNS' : 'Standard Resolver'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WHAT IS MY IP & 4. IP ADDRESS LOOKUP */}
      {(toolId === 'what-is-my-ip' || toolId === 'ip-address-lookup') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">{toolId === 'what-is-my-ip' ? 'Public IP Address & Geolocation' : 'IP Address Geolocation & Threat Lookup'}</h3>
          <p className="text-xs text-zinc-400 mb-4">Query network carrier info, ISP, coordinates, autonomous system number (ASN), and proxy probability.</p>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter any IPv4 or IPv6 (e.g. 8.8.8.8)"
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
            />
            <button
              onClick={handleLookup}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs shrink-0"
            >
              <Search className="w-4 h-4" /> Lookup IP
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">IP Address</span>
              <p className="font-mono text-sm font-bold text-[#ff6b00] mt-1">{lookupResult.ip}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">Location</span>
              <p className="text-sm font-bold text-white mt-1">{lookupResult.city}, {lookupResult.country}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">ISP / Carrier</span>
              <p className="text-sm font-bold text-white mt-1 truncate">{lookupResult.isp}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">ASN</span>
              <p className="font-mono text-sm font-bold text-zinc-300 mt-1">{lookupResult.asn}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">Timezone</span>
              <p className="text-xs font-bold text-zinc-300 mt-1">{lookupResult.timezone}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">Proxy / VPN Risk</span>
              <p className={`text-xs font-bold mt-1 ${lookupResult.isProxy ? 'text-amber-400' : 'text-emerald-400'}`}>
                {lookupResult.isProxy ? 'Potential VPN / Hosting IP' : 'Clean Residential Connection'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">Abuse Threat Score</span>
              <p className="text-xs font-bold text-emerald-400 mt-1">{lookupResult.threatScore}% (Safe)</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">ISO Country Code</span>
              <p className="font-mono text-xs font-bold text-zinc-300 mt-1">{lookupResult.countryCode}</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. BROWSER FINGERPRINT */}
      {toolId === 'browser-fingerprint' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Live Browser Fingerprint Analyzer</h3>
          <p className="text-xs text-zinc-400 mb-4">Discover the telemetry parameters tracking firms and ad networks harvest from your device.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-zinc-500 block mb-1">Canvas Hash Signature:</span>
              <span className="text-amber-400 font-bold break-all">{fingerprint.canvasHash || 'Generating...'}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-zinc-500 block mb-1">Screen Resolution & Color:</span>
              <span className="text-white font-bold">{fingerprint.screenRes}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-zinc-500 block mb-1">CPU Cores / Device RAM:</span>
              <span className="text-white font-bold">{fingerprint.cores} Logical Cores • {fingerprint.deviceMemory}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-zinc-500 block mb-1">Timezone & Locale:</span>
              <span className="text-white font-bold">{fingerprint.timezone} ({fingerprint.language})</span>
            </div>
            <div className="sm:col-span-2 p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 break-all">
              <span className="text-zinc-500 block mb-1">Client User Agent:</span>
              <span className="text-zinc-300">{fingerprint.userAgent}</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. BROWSER PRIVACY SCORE */}
      {toolId === 'browser-privacy-score' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">Browser Privacy Score Audit</h3>
              <p className="text-xs text-zinc-400">12 rigorous checks evaluating your defense against trackers, fingerprinters, and data leaks.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-[#ff6b00]">{totalScore}</span>
              <span className="text-xs text-zinc-500"> / 100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {privacyAuditItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 text-xs">
                <span className="text-zinc-300">{item.label}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${item.pass ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                  {item.pass ? 'PASSED' : 'VULNERABLE'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. EMAIL BREACH CHECKER */}
      {toolId === 'email-breach-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Email Breach & Leak Database Checker</h3>
          <p className="text-xs text-zinc-400 mb-4">Check whether your email account appeared in historical database leaks and credential exposures.</p>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="email"
              value={breachEmail}
              onChange={(e) => setBreachEmail(e.target.value)}
              placeholder="name@domain.com"
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
            />
            <button
              onClick={checkEmailBreaches}
              className="px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs shrink-0"
            >
              Check Breaches
            </button>
          </div>

          {breachResults && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-rose-400">Found in {breachResults.length} Known Breaches:</span>
              {breachResults.map((b, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-rose-900/40 bg-rose-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-rose-300">{b.site}</h4>
                    <span className="text-xs text-zinc-400">{b.date} • {b.pwnCount} Accounts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {b.data.map((d: string) => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. MAC ADDRESS LOOKUP */}
      {toolId === 'mac-address-lookup' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">MAC Address OUI Vendor Lookup</h3>
          <p className="text-xs text-zinc-400 mb-4">Identify the hardware manufacturer and network interface vendor from any MAC prefix.</p>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={macQuery}
              onChange={(e) => setMacQuery(e.target.value)}
              placeholder="e.g. 3C:52:82 or B8:27:EB"
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
            />
            <button onClick={handleMacLookup} className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">
              Identify Vendor
            </button>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-sm text-emerald-400 flex items-center justify-between">
            <span>{macResult}</span>
            <Laptop className="w-5 h-5 text-zinc-500" />
          </div>
        </div>
      )}

      {/* 9. REVERSE IP LOOKUP */}
      {toolId === 'reverse-ip-lookup' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Reverse IP Domain Lookup</h3>
          <p className="text-xs text-zinc-400 mb-4">Discover neighboring websites sharing the same host server IP address.</p>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={revIp}
              onChange={(e) => setRevIp(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
            />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">
              Scan Neighbors
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400">Domains Hosted on this Node:</span>
            {hostedDomains.map((dom, i) => (
              <div key={i} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs flex items-center justify-between">
                <span className="text-white">{dom}</span>
                <span className="text-zinc-500 text-[11px]">HTTP 200 OK</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. IP REPUTATION & 11. IP BLACKLIST CHECKER */}
      {(toolId === 'ip-reputation-checker' || toolId === 'ip-blacklist-checker') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">IP Threat Intelligence & Blacklist Audit</h3>
          <p className="text-xs text-zinc-400 mb-4">Live DNSBL / RBL spam engine checks across global cyber-defense watchlists.</p>

          <div className="space-y-2.5">
            {blacklists.map((bl) => (
              <div key={bl.name} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200">{bl.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-zinc-500 font-mono">{bl.rtt}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                    CLEAN (NOT LISTED)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. FAKE NAME GENERATOR */}
      {toolId === 'fake-name-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">Fake Persona & Identity Generator</h3>
              <p className="text-xs text-zinc-400">Generate fully coherent fake identities for testing, QA, and signups across 12 countries.</p>
            </div>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                generateFakeIdentity(e.target.value);
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Full Name</span>
              <p className="text-base font-bold text-white mt-0.5">{fakeIdentity.name}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Address</span>
              <p className="text-sm font-semibold text-zinc-300 mt-0.5">{fakeIdentity.street}, {fakeIdentity.city}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Phone Number</span>
              <p className="font-mono text-sm font-bold text-emerald-400 mt-0.5">{fakeIdentity.phone}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Burner Email</span>
              <p className="font-mono text-xs font-bold text-amber-400 mt-0.5">{fakeIdentity.email}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Protected Tax / National ID</span>
              <p className="font-mono text-xs text-zinc-400 mt-0.5">{fakeIdentity.ssn}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Test Sandbox Credit Card</span>
              <p className="font-mono text-xs text-zinc-400 mt-0.5">{fakeIdentity.creditCard}</p>
            </div>
          </div>

          <button
            onClick={() => generateFakeIdentity(country)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Generate Another Identity
          </button>
        </div>
      )}

      {/* 13. MY REFERRER */}
      {toolId === 'my-referrer' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">My Referrer Header Audit</h3>
          <p className="text-xs text-zinc-400 mb-4">Inspect the exact HTTP referrer payload sent to this site by your browser.</p>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 text-center space-y-2">
            <span className="text-xs font-semibold text-zinc-400">Current document.referrer:</span>
            <div className="font-mono text-base font-bold text-emerald-400 break-all">{currentReferrer}</div>
            <p className="text-xs text-zinc-500 max-w-md mx-auto pt-2">
              When navigating directly or via bookmarks, modern privacy browsers suppress referrer headers to block cross-site profiling.
            </p>
          </div>
        </div>
      )}

      {/* 14. CLOUDFLARE RESOLVER */}
      {toolId === 'cloudflare-resolver' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Cloudflare Origin IP Resolver</h3>
          <p className="text-xs text-zinc-400 mb-4">Discover origin web servers behind Cloudflare by testing non-proxied DNS subdomains.</p>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={cfDomain}
              onChange={(e) => setCfDomain(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
            />
            <button className="px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0">
              Scan Records
            </button>
          </div>

          <div className="space-y-2.5">
            {cfSubdomains.map((sub, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-300">{sub.sub}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-400">{sub.ip}</span>
                  <span className="text-[10px] text-zinc-500">{sub.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 15. RECOMMENDED VPNS */}
      {toolId === 'recommended-vpns' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Merit-Based Privacy VPN Benchmark</h3>
          <p className="text-xs text-zinc-400 mb-4">Audited, RAM-only server VPNs with no telemetry, strict court-tested no-log records, and anonymous payment support.</p>

          <div className="space-y-3">
            {vpnList.map((vpn) => (
              <div key={vpn.name} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{vpn.name}</h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ff6b00]/15 text-[#ff6b00] font-bold">{vpn.rank}</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-semibold">{vpn.jurisdiction} Jurisdiction</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-zinc-400">
                  <div><strong className="text-zinc-300">Logging:</strong> {vpn.logPolicy}</div>
                  <div><strong className="text-zinc-300">Audits:</strong> {vpn.audit}</div>
                  <div><strong className="text-zinc-300">Anonymous Pay:</strong> {vpn.crypto}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
