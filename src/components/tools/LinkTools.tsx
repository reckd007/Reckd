import React, { useState } from 'react';
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  EyeOff,
  QrCode,
  DollarSign,
  Heart,
  Share2,
  Trash2,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import QRCode from 'qrcode';

interface LinkToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const LinkTools: React.FC<LinkToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. Dereferer
  const [derefUrl, setDerefUrl] = useState<string>('https://example.com/sensitive-article');
  const [derefService, setDerefService] = useState<string>('href.li');
  const getDerefererLink = () => {
    const clean = derefUrl.trim();
    if (!clean) return '';
    if (derefService === 'href.li') return `https://href.li/?${clean}`;
    if (derefService === 'anonymz') return `https://anonymz.com/?${clean}`;
    if (derefService === 'nullrefer') return `https://nullrefer.com/?${clean}`;
    return `https://dereferer.me/?${clean}`;
  };

  // 2. Hide Referrer Link
  const [hideUrl, setHideUrl] = useState<string>('https://destination-website.com');
  const [hideMethod, setHideMethod] = useState<'meta' | 'rel' | 'dataUri'>('meta');

  // 3. URL Shortener
  const [shortTargetUrl, setShortTargetUrl] = useState<string>('https://mywebsite.com/long-promotional-campaign-2026-link');
  const [customSlug, setCustomSlug] = useState<string>('summer-sale');
  const [shortLinksHistory, setShortLinksHistory] = useState<Array<{ id: string; target: string; short: string; clicks: number }>>([
    { id: '1', target: 'https://github.com/torvalds/linux', short: 'reckd.link/linux-kernel', clicks: 142 },
    { id: '2', target: 'https://wikipedia.org/wiki/Privacy', short: 'reckd.link/privacy-wiki', clicks: 89 }
  ]);
  const handleCreateShort = () => {
    if (!shortTargetUrl) return;
    const slug = customSlug.trim() || Math.random().toString(36).substring(2, 8);
    const newShort = {
      id: Date.now().toString(),
      target: shortTargetUrl,
      short: `reckd.link/${slug}`,
      clicks: 0
    };
    setShortLinksHistory([newShort, ...shortLinksHistory]);
  };

  // 4. UTM Builder
  const [utmUrl, setUtmUrl] = useState<string>('https://mybrand.com/product-launch');
  const [utmSource, setUtmSource] = useState<string>('newsletter');
  const [utmMedium, setUtmMedium] = useState<string>('email');
  const [utmCampaign, setUtmCampaign] = useState<string>('spring_promo_2026');
  const [utmTerm, setUtmTerm] = useState<string>('tech-deals');
  const [utmContent, setUtmContent] = useState<string>('hero_cta_button');
  const buildUtmUrl = () => {
    try {
      const u = new URL(utmUrl.startsWith('http') ? utmUrl : `https://${utmUrl}`);
      if (utmSource) u.searchParams.set('utm_source', utmSource);
      if (utmMedium) u.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) u.searchParams.set('utm_campaign', utmCampaign);
      if (utmTerm) u.searchParams.set('utm_term', utmTerm);
      if (utmContent) u.searchParams.set('utm_content', utmContent);
      return u.toString();
    } catch {
      return `${utmUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    }
  };

  // 5. WhatsApp Link Generator
  const [waPhone, setWaPhone] = useState<string>('15551234567');
  const [waMessage, setWaMessage] = useState<string>('Hello! I saw your listing on Reckd and would like more details.');
  const [waQrCode, setWaQrCode] = useState<string>('');
  const getWaLink = () => {
    const cleanPhone = waPhone.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(waMessage);
    return `https://wa.me/${cleanPhone}${waMessage ? `?text=${encodedMsg}` : ''}`;
  };
  React.useEffect(() => {
    const link = getWaLink();
    QRCode.toDataURL(link, { width: 180, margin: 1 })
      .then(setWaQrCode)
      .catch(() => {});
  }, [waPhone, waMessage]);

  // 6. Anonymous URL
  const [anonTarget, setAnonTarget] = useState<string>('https://secret-service.org/report');
  const [anonReferrerPolicy, setAnonReferrerPolicy] = useState<string>('no-referrer');

  // 7. Affiliate Cloaker
  const [affRawLink, setAffRawLink] = useState<string>('https://affiliate-network.com/track?aff_id=98765&offer=2026&sub=reckd');
  const [affSlug, setAffSlug] = useState<string>('vpn-deal');
  const [affDomain, setAffDomain] = useState<string>('mytrusteddomain.com');

  // 8. PayPal Link Generator
  const [ppUsername, setPpUsername] = useState<string>('emportech');
  const [ppAmount, setPpAmount] = useState<string>('49.99');
  const [ppCurrency, setPpCurrency] = useState<string>('USD');
  const [ppNote, setPpNote] = useState<string>('Web design retainer');
  const getPpLink = () => {
    const cleanUser = ppUsername.replace(/^@/, '').trim();
    if (!cleanUser) return '';
    const amt = ppAmount.trim() ? `/${ppAmount.trim()}${ppCurrency}` : '';
    return `https://paypal.me/${cleanUser}${amt}`;
  };

  // 9. PayPal Donation Link
  const [donOrg, setDonOrg] = useState<string>('Open Source Foundation');
  const [donPaypalId, setDonPaypalId] = useState<string>('donate@opensource.org');
  const [donCurrency, setDonCurrency] = useState<string>('USD');
  const [donDesc, setDonDesc] = useState<string>('Supporting Privacy Utilities');

  // 10. Browser Plugins Directory
  const plugins = [
    { name: 'uBlock Origin', cat: 'Content Blocker', desc: 'Lightweight, ultra-efficient ad and tracker blocker.', rating: 5.0, link: 'https://ublockorigin.com' },
    { name: 'Privacy Badger', cat: 'Tracker Shield', desc: 'EFF automatic algorithmic tracker and cookie blocker.', rating: 4.9, link: 'https://privacybadger.org' },
    { name: 'ClearURLs', cat: 'Link Hygiene', desc: 'Removes tracking elements and telemetry fields from visited links.', rating: 4.8, link: 'https://clearurls.rb2.pw' },
    { name: 'Decentraleyes', cat: 'Local CDN', desc: 'Protects against tracking through free, centralized CDN emulation.', rating: 4.7, link: 'https://decentraleyes.org' },
    { name: 'Canvas Blocker', cat: 'Fingerprint Defense', desc: 'Alters canvas and audio API responses to thwart fingerprinting.', rating: 4.8, link: 'https://github.com/kkapsner/CanvasBlocker' },
  ];

  // 11. Referrer Removal Tool
  const [dirtyUrl, setDirtyUrl] = useState<string>(
    'https://example.com/shop/item?id=8923&utm_source=fb&utm_medium=cpc&utm_campaign=retarget&fbclid=IwAR3XYZ123456789&gclid=CjwKCAiA_&ref=partner'
  );
  const cleanUrl = () => {
    try {
      const u = new URL(dirtyUrl);
      const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'fbclid', 'gclid', 'yclid', 'msclkid', 'ttclid', 'twclid', 'ref', 'source',
        '_ga', '_gl', 'mc_cid', 'mc_eid', 'vero_id', 'mkt_tok'
      ];
      trackingParams.forEach((p) => u.searchParams.delete(p));
      return u.toString();
    } catch {
      return dirtyUrl;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. DEREFERER */}
      {toolId === 'dereferer' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center font-bold">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">HTTP Dereferer</h3>
              <p className="text-xs text-zinc-400">Strip the HTTP Referer header before visiting any external link.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Target Destination URL</label>
              <input
                type="url"
                value={derefUrl}
                onChange={(e) => setDerefUrl(e.target.value)}
                placeholder="https://example.com/sensitive-link"
                className={`w-full mt-1.5 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400">Dereferer Gateway Service</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                {['href.li', 'anonymz', 'nullrefer', 'dereferer.me'].map((srv) => (
                  <button
                    key={srv}
                    onClick={() => setDerefService(srv)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                      derefService === srv
                        ? 'bg-[#ff6b00] text-white border-[#ff6b00]'
                        : isDark
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                        : 'bg-zinc-100 border-zinc-300 text-zinc-700'
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#ff6b00]/30 bg-[#ff6b00]/5 space-y-2">
              <span className="text-[11px] font-bold text-[#ff6b00] uppercase tracking-wider">Generated Anonymous Link</span>
              <div className="flex items-center justify-between gap-2 font-mono text-xs break-all text-zinc-200">
                <span className="truncate">{getDerefererLink()}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => copyToClipboard(getDerefererLink(), 'deref')}
                    className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white transition"
                    title="Copy Link"
                  >
                    {copied === 'deref' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={getDerefererLink()}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-2 rounded-lg bg-[#ff6b00] text-white hover:bg-[#e05e00] transition"
                    title="Open Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HIDE REFERRER LINK */}
      {toolId === 'hide-referrer-link' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Hide Referrer Link Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate HTML anchor tags and redirect scripts that guarantee zero referrer leakage.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Target URL</label>
              <input
                type="url"
                value={hideUrl}
                onChange={(e) => setHideUrl(e.target.value)}
                className={`w-full mt-1.5 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideMethod('rel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${hideMethod === 'rel' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'border-zinc-700 text-zinc-400'}`}
              >
                HTML rel="noreferrer"
              </button>
              <button
                onClick={() => setHideMethod('meta')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${hideMethod === 'meta' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'border-zinc-700 text-zinc-400'}`}
              >
                Meta Referrer Policy
              </button>
              <button
                onClick={() => setHideMethod('dataUri')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${hideMethod === 'dataUri' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'border-zinc-700 text-zinc-400'}`}
              >
                Data URI Redirect
              </button>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-emerald-400 relative">
              <button
                onClick={() => {
                  const code =
                    hideMethod === 'rel'
                      ? `<a href="${hideUrl}" rel="noreferrer noopener" target="_blank">Visit Site</a>`
                      : hideMethod === 'meta'
                      ? `<meta name="referrer" content="no-referrer">\n<script>window.location.replace("${hideUrl}");</script>`
                      : `data:text/html;charset=utf-8,<html><head><meta name="referrer" content="no-referrer"></head><body><script>window.location.replace("${hideUrl}");</script></body></html>`;
                  copyToClipboard(code, 'hide-code');
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
              >
                {copied === 'hide-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre className="overflow-x-auto whitespace-pre-wrap pr-8">
                {hideMethod === 'rel' && `<a href="${hideUrl}" rel="noreferrer noopener" target="_blank">Visit Site</a>`}
                {hideMethod === 'meta' &&
                  `<!-- Add to header of your intermediary page -->\n<meta name="referrer" content="no-referrer">\n<script>\n  window.location.replace("${hideUrl}");\n</script>`}
                {hideMethod === 'dataUri' &&
                  `data:text/html;charset=utf-8,<html><head><meta name="referrer" content="no-referrer"></head><body><script>window.location.replace("${hideUrl}");</script></body></html>`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. URL SHORTENER */}
      {toolId === 'url-shortener' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Privacy-Preserving URL Shortener</h3>
          <p className="text-xs text-zinc-400 mb-4">Create clean micro-links with automatic referrer masking and analytics tracking.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">Long Destination URL</label>
              <input
                type="url"
                value={shortTargetUrl}
                onChange={(e) => setShortTargetUrl(e.target.value)}
                className={`w-full mt-1.5 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Custom Alias / Slug</label>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="e.g. spring-promo"
                className={`w-full mt-1.5 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <button
            onClick={handleCreateShort}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs shadow-md shadow-[#ff6b00]/20 transition mb-6"
          >
            <Sparkles className="w-4 h-4" /> Shorten & Protect Link
          </button>

          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Short Links</span>
            {shortLinksHistory.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#ff6b00]">{item.short}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{item.clicks} clicks</span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{item.target}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(`https://${item.short}`, item.id)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    title="Copy"
                  >
                    {copied === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setShortLinksHistory(shortLinksHistory.filter((x) => x.id !== item.id))}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-950/50 hover:text-rose-400 text-zinc-500 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. UTM BUILDER */}
      {toolId === 'utm-builder' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Google Analytics UTM Campaign Builder</h3>
          <p className="text-xs text-zinc-400 mb-4">Construct precise campaign tracking URLs for marketing campaigns and attribution.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">Website URL *</label>
              <input type="text" value={utmUrl} onChange={(e) => setUtmUrl(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Campaign Source * (utm_source)</label>
              <input type="text" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="google, newsletter, twitter" className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Campaign Medium * (utm_medium)</label>
              <input type="text" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="cpc, banner, email" className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Campaign Name * (utm_campaign)</label>
              <input type="text" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="summer_sale" className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Campaign Term (utm_term)</label>
              <input type="text" value={utmTerm} onChange={(e) => setUtmTerm(e.target.value)} placeholder="running+shoes" className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">Campaign Content (utm_content)</label>
              <input type="text" value={utmContent} onChange={(e) => setUtmContent(e.target.value)} placeholder="logolink, textlink" className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#ff6b00]/30 bg-[#ff6b00]/5 flex items-center justify-between gap-3">
            <div className="font-mono text-xs text-zinc-200 truncate">{buildUtmUrl()}</div>
            <button
              onClick={() => copyToClipboard(buildUtmUrl(), 'utm')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6b00] text-white font-bold text-xs shrink-0"
            >
              {copied === 'utm' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy UTM URL
            </button>
          </div>
        </div>
      )}

      {/* 5. WHATSAPP LINK GENERATOR */}
      {toolId === 'whatsapp-link-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">WhatsApp Click-to-Chat Link Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate direct WhatsApp chat links with pre-populated message and QR scan support.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400">Phone Number (with Country Code, no + or spaces)</label>
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="e.g. 15551234567"
                  className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">Pre-filled Message</label>
                <textarea
                  rows={3}
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className={`w-full mt-1 p-3 rounded-xl border text-sm ${inputBg}`}
                />
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs flex items-center justify-between gap-2">
                <span className="truncate text-emerald-400">{getWaLink()}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => copyToClipboard(getWaLink(), 'wa')} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    {copied === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a href={getWaLink()} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#25D366] text-white hover:brightness-110">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 bg-zinc-950">
              {waQrCode ? <img src={waQrCode} alt="WhatsApp QR Code" className="rounded-lg shadow" /> : <div className="text-xs text-zinc-500">Generating QR...</div>}
              <span className="text-[11px] text-zinc-400 mt-2 font-medium">Scan to open chat on phone</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. ANONYMOUS URL */}
      {toolId === 'anonymous-url' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Anonymous URL Gateway</h3>
          <p className="text-xs text-zinc-400 mb-4">Route links through double-blind anonymous proxy redirectors to hide your identity.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Target URL</label>
              <input type="url" value={anonTarget} onChange={(e) => setAnonTarget(e.target.value)} className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Href.li Shield', prefix: 'https://href.li/?' },
                { name: 'NullRefer Gateway', prefix: 'https://nullrefer.com/?' },
                { name: 'Anonymz Proxy', prefix: 'https://anonymz.com/?' },
              ].map((gw) => {
                const link = `${gw.prefix}${anonTarget}`;
                return (
                  <div key={gw.name} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white">{gw.name}</h4>
                      <p className="font-mono text-[11px] text-zinc-400 truncate mt-1">{link}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyToClipboard(link, gw.name)} className="flex-1 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white">
                        {copied === gw.name ? 'Copied!' : 'Copy'}
                      </button>
                      <a href={link} target="_blank" rel="noreferrer noopener" className="p-1.5 rounded-lg bg-[#ff6b00] text-white">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. AFFILIATE CLOAKER */}
      {toolId === 'affiliate-cloaker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Affiliate Link Cloaker & Redirect Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Turn ugly, spammy-looking affiliate URLs into clean, high-converting branded paths.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-3">
              <label className="text-xs font-semibold text-zinc-400">Raw Affiliate Link</label>
              <input type="text" value={affRawLink} onChange={(e) => setAffRawLink(e.target.value)} className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Your Domain</label>
              <input type="text" value={affDomain} onChange={(e) => setAffDomain(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">Cloaked Slug</label>
              <input type="text" value={affSlug} onChange={(e) => setAffSlug(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-300">Clean Public Link:</span>
              <span className="font-mono text-emerald-400">https://{affDomain}/go/{affSlug}</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono bg-zinc-900/80 p-3 rounded-lg overflow-x-auto whitespace-pre">
              {`# Apache .htaccess redirect rule:\nRedirect 301 /go/${affSlug} ${affRawLink}\n\n# Or PHP index.php header:\n<?php header("Location: ${affRawLink}", true, 301); exit; ?>`}
            </div>
          </div>
        </div>
      )}

      {/* 8. PAYPAL LINK GENERATOR */}
      {toolId === 'paypal-link-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Direct PayPal.me Payment Link Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Generate one-click instant payment links with custom preset amounts and currencies.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">PayPal.me Username</label>
              <input type="text" value={ppUsername} onChange={(e) => setPpUsername(e.target.value)} placeholder="username" className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Amount (Optional)</label>
              <input type="number" step="0.01" value={ppAmount} onChange={(e) => setPpAmount(e.target.value)} placeholder="50.00" className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Currency</label>
              <select value={ppCurrency} onChange={(e) => setPpCurrency(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}>
                {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-between gap-3">
            <div className="font-mono text-xs text-blue-400 truncate">{getPpLink()}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => copyToClipboard(getPpLink(), 'pp')} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
                {copied === 'pp' ? 'Copied' : 'Copy PayPal Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. PAYPAL DONATION LINK */}
      {toolId === 'paypal-donation-link' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">PayPal Donation Button & Link Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Create donation buttons and hosted links for open source, non-profits, and creators.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Organization / Cause Name</label>
              <input type="text" value={donOrg} onChange={(e) => setDonOrg(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">PayPal Email / Hosted ID</label>
              <input type="email" value={donPaypalId} onChange={(e) => setDonPaypalId(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`} />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
            <span className="text-xs font-bold text-zinc-300">HTML Embed Button Code</span>
            <pre className="font-mono text-[11px] text-amber-400 overflow-x-auto whitespace-pre-wrap">
              {`<form action="https://www.paypal.com/donate" method="post" target="_top">\n  <input type="hidden" name="business" value="${donPaypalId}" />\n  <input type="hidden" name="item_name" value="${donOrg}" />\n  <input type="hidden" name="currency_code" value="${donCurrency}" />\n  <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />\n</form>`}
            </pre>
            <button
              onClick={() =>
                copyToClipboard(
                  `<form action="https://www.paypal.com/donate" method="post" target="_top">\n  <input type="hidden" name="business" value="${donPaypalId}" />\n  <input type="hidden" name="item_name" value="${donOrg}" />\n  <input type="hidden" name="currency_code" value="${donCurrency}" />\n  <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="Donate with PayPal" alt="Donate" />\n</form>`,
                  'don'
                )
              }
              className="px-4 py-2 rounded-xl bg-[#ff6b00] text-white font-bold text-xs"
            >
              {copied === 'don' ? 'Copied Code' : 'Copy HTML Embed'}
            </button>
          </div>
        </div>
      )}

      {/* 10. BROWSER PLUGINS DIRECTORY */}
      {toolId === 'browser-plugins' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Recommended Privacy Browser Extensions</h3>
          <p className="text-xs text-zinc-400 mb-4">Curated, audit-verified browser extensions to protect against fingerprinting, ads, and trackers.</p>

          <div className="space-y-3">
            {plugins.map((p) => (
              <div key={p.name} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff6b00]/15 text-[#ff6b00] font-semibold">{p.cat}</span>
                    <span className="text-[10px] text-amber-400 font-bold">★ {p.rating}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{p.desc}</p>
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-[#ff6b00] hover:text-white text-xs font-semibold text-zinc-300 transition shrink-0 flex items-center gap-1.5"
                >
                  <span>Install</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. REFERRER REMOVAL TOOL */}
      {toolId === 'referrer-removal-tool' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Referrer & Tracker Parameter Removal Tool</h3>
          <p className="text-xs text-zinc-400 mb-4">Scrub tracking parameters (utm, fbclid, gclid, etc.) from dirty links before sharing.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Dirty / Tracked URL</label>
              <textarea
                rows={3}
                value={dirtyUrl}
                onChange={(e) => setDirtyUrl(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border text-xs font-mono ${inputBg}`}
              />
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Clean Sanitized URL</span>
              <div className="font-mono text-xs text-zinc-200 break-all">{cleanUrl()}</div>
              <button
                onClick={() => copyToClipboard(cleanUrl(), 'clean-url')}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                {copied === 'clean-url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy Clean Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
