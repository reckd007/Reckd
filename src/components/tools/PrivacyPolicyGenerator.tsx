import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Building2,
  Mail,
  Calendar,
  Sparkles,
  Eye,
  CheckSquare,
  Square,
  Clock
} from 'lucide-react';

interface PrivacyPolicyGeneratorProps {
  theme: 'dark' | 'light';
}

const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Ireland',
  'Sweden',
  'Switzerland',
  'Norway',
  'Austria',
  'Belgium',
  'Denmark',
  'Finland',
  'Poland',
  'Portugal',
  'New Zealand',
  'Japan',
  'Singapore',
  'India',
  'Brazil',
  'Mexico',
  'South Africa',
  'United Arab Emirates',
  'Israel',
  'South Korea',
  'Argentina',
  'Chile',
  'Colombia',
  'Czech Republic',
  'Greece',
  'Hungary',
  'Iceland',
  'Indonesia',
  'Malaysia',
  'Philippines',
  'Romania',
  'Saudi Arabia',
  'Thailand',
  'Turkey',
  'Ukraine',
  'Vietnam'
];

const FREE_EMAIL_PROVIDERS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'mail.com',
  'zoho.com',
  'proton.me',
  'protonmail.com',
  'yandex.com',
  'gmx.com'
];

export const PrivacyPolicyGenerator: React.FC<PrivacyPolicyGeneratorProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-sm';
  const inputBg = isDark
    ? 'bg-zinc-950/90 border-zinc-800 text-white focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00]'
    : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00]';

  // Form State - About Your Website
  const [siteName, setSiteName] = useState<string>('Acme Tools');
  const [siteUrl, setSiteUrl] = useState<string>('https://yoursite.com');
  const [companyName, setCompanyName] = useState<string>('Acme Ltd');
  const [contactEmail, setContactEmail] = useState<string>('privacy@yoursite.com');
  const [country, setCountry] = useState<string>('United Kingdom');
  const [effectiveDate, setEffectiveDate] = useState<string>('08/09/2026');

  // Form State - Data & Services You Use
  // What data do you collect?
  const [collectEmail, setCollectEmail] = useState<boolean>(true);
  const [collectNames, setCollectNames] = useState<boolean>(true);
  const [collectIp, setCollectIp] = useState<boolean>(true);
  const [collectCookies, setCollectCookies] = useState<boolean>(true);
  const [collectPayment, setCollectPayment] = useState<boolean>(true);
  const [collectLocation, setCollectLocation] = useState<boolean>(false);
  const [collectUsage, setCollectUsage] = useState<boolean>(true);

  // Third-party services used
  const [useGoogleAnalytics, setUseGoogleAnalytics] = useState<boolean>(true);
  const [useGoogleAdSense, setUseGoogleAdSense] = useState<boolean>(false);
  const [useStripe, setUseStripe] = useState<boolean>(true);
  const [useMailchimp, setUseMailchimp] = useState<boolean>(true);
  const [useCloudflare, setUseCloudflare] = useState<boolean>(true);
  const [useAffiliate, setUseAffiliate] = useState<boolean>(false);

  // Log retention period
  const [retentionPeriod, setRetentionPeriod] = useState<string>('90 Days');

  // Output view mode & clipboard
  const [generatedPolicy, setGeneratedPolicy] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<'text' | 'preview'>('text');
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  // Professional Email Validation
  const emailAnalysis = useMemo(() => {
    const trimmed = contactEmail.trim().toLowerCase();
    if (!trimmed) {
      return { isValid: false, isBusiness: false, message: 'Contact email is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { isValid: false, isBusiness: false, message: 'Please enter a valid email format (e.g. privacy@yoursite.com).' };
    }
    const domain = trimmed.split('@')[1];
    const isFree = FREE_EMAIL_PROVIDERS.includes(domain);
    if (isFree) {
      return {
        isValid: true,
        isBusiness: false,
        message: 'Personal webmail detected. A dedicated domain email (e.g. privacy@company.com) is strongly recommended for GDPR and corporate compliance.'
      };
    }
    return {
      isValid: true,
      isBusiness: true,
      message: 'Professional corporate email verified.'
    };
  }, [contactEmail]);

  // Core Privacy Policy Text Builder
  const buildPolicy = () => {
    const safeSiteName = siteName.trim() || 'Our Website / App';
    const safeUrl = siteUrl.trim() || 'https://yoursite.com';
    const safeCompany = companyName.trim() || 'The Company';
    const safeEmail = contactEmail.trim() || 'privacy@yoursite.com';
    const safeCountry = country || 'United Kingdom';
    const safeDate = effectiveDate.trim() || '08/09/2026';

    const collectedDataList: string[] = [];
    if (collectEmail) collectedDataList.push('Email addresses (for authentication, communications, transaction alerts, and service notifications)');
    if (collectNames) collectedDataList.push('Full names / Usernames (for account profile management, billing, and personalized service delivery)');
    if (collectIp) collectedDataList.push('Internet Protocol (IP) addresses and network identifiers (for cybersecurity monitoring, fraud detection, and rate limiting)');
    if (collectCookies) collectedDataList.push('Browser cookies and local session identifiers (to sustain login state, preserve user preferences, and optimize load speed)');
    if (collectPayment) collectedDataList.push('Payment and billing data (processed strictly via PCI-DSS certified payment processors; full credit card details are never stored on our local application servers)');
    if (collectLocation) collectedDataList.push('Geographic location data / Approximate IP-derived location (to localize content, satisfy regional licensing obligations, and enforce tax rules)');
    if (collectUsage) collectedDataList.push('Usage and telemetry telemetry metrics (including page interaction duration, browser type, referral URLs, operating system version, and system logs)');

    const thirdPartiesList: string[] = [];
    if (useGoogleAnalytics) {
      thirdPartiesList.push('• Google Analytics (Google LLC / Google Ireland Ltd): Web analytics service tracking site visits, bounce rates, and navigation patterns. Google utilizes cookies to compile aggregated reports. You can opt out via the Google Analytics Opt-out Browser Add-on.');
    }
    if (useGoogleAdSense) {
      thirdPartiesList.push('• Google AdSense: Advertising service serving personalized or non-personalized advertisements based on user interests and contextual signals. You may manage ad preferences via Google Ad Settings.');
    }
    if (useStripe) {
      thirdPartiesList.push('• Stripe (Stripe, Inc. / Stripe Payments Europe Ltd): Tier-1 PCI-DSS certified payment infrastructure provider processing debit/credit transactions, fraud prevention (Radar), and billing workflows securely.');
    }
    if (useMailchimp) {
      thirdPartiesList.push('• Mailchimp / Email Marketing (Intuit Inc.): Cloud email delivery platform managing newsletter subscriptions, transactional emails, and deliverability analytics. Users can unsubscribe at any time via the link in each email footer.');
    }
    if (useCloudflare) {
      thirdPartiesList.push('• Cloudflare (Cloudflare, Inc.): Content delivery network (CDN), DDoS mitigation, and reverse proxy safeguarding site availability and accelerating global asset distribution through distributed edge nodes.');
    }
    if (useAffiliate) {
      thirdPartiesList.push('• Affiliate Marketing Networks & Tracking: Tracking referral conversions and qualified transactions via affiliate cookies. We may earn commissions on purchases made through eligible tracked links at no additional cost to you.');
    }

    const jurisdictionNote =
      safeCountry === 'United Kingdom'
        ? 'UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, overseen by the Information Commissioner’s Office (ICO).'
        : safeCountry === 'United States'
        ? 'United States federal privacy standards, California Consumer Privacy Act as amended by the CPRA (CCPA/CPRA), CalOPPA, and applicable state data privacy statutes.'
        : ['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Ireland', 'Sweden', 'Poland', 'Austria', 'Belgium'].includes(safeCountry)
        ? `General Data Protection Regulation (EU) 2016/679 (EU GDPR) and national data protection statutory laws of ${safeCountry}.`
        : safeCountry === 'Canada'
        ? 'Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial data privacy legislation.'
        : safeCountry === 'Australia'
        ? 'Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).'
        : `Applicable data privacy regulations, commercial consumer protection laws, and data security mandates of ${safeCountry}.`;

    return `PRIVACY POLICY FOR ${safeSiteName.toUpperCase()}
Effective Date: ${safeDate}
Last Updated: ${safeDate}

1. INTRODUCTION & SCOPE
Welcome to ${safeSiteName} ("we", "us", "our", or the "Service"), operated by ${safeCompany}. We respect the privacy of every individual who visits ${safeUrl} or uses our products and services. 

This Privacy Policy explains in detail how we collect, use, disclose, safeguard, and retain your personal data, as well as your statutory rights under the ${jurisdictionNote}

By accessing or using ${safeUrl}, you acknowledge that you have read, understood, and agree to the data handling practices described herein.

--------------------------------------------------------------------------------

2. DATA CONTROLLER & CONTACT INFORMATION
For the purposes of applicable data protection legislation, the designated Data Controller responsible for your personal information is:

Company / Owner: ${safeCompany}
Website URL: ${safeUrl}
Designated Privacy Officer / Contact Email: ${safeEmail}
Country / Jurisdiction: ${safeCountry}

If you have questions, statutory data subject access requests, or compliance inquiries, please contact our privacy desk directly at ${safeEmail}.

--------------------------------------------------------------------------------

3. CATEGORIES OF PERSONAL DATA WE COLLECT
Depending on how you interact with ${safeSiteName}, we may collect and process the following categories of personal data:

${collectedDataList.length > 0 ? collectedDataList.map((item, idx) => `${idx + 1}. ${item}`).join('\n') : '• General non-personally identifiable technical telemetry necessary for basic network routing and protocol handshake.'}

We do not intentionally collect Special Category Data (such as biometric identifiers, genetic data, health metrics, religious or philosophical beliefs, or political opinions) unless required by statutory regulations with explicit explicit consent.

--------------------------------------------------------------------------------

4. LEGAL BASES FOR PROCESSING (GDPR / UK GDPR COMPLIANCE)
We process your personal information strictly when permitted by law under Article 6 of the General Data Protection Regulation:
a) Consent: When you have granted unambiguous permission to collect and process your information for designated purposes (e.g., subscribing to optional marketing updates).
b) Contractual Performance: When processing is necessary to execute an agreement with you (e.g., fulfilling orders, account provisioning, processing digital payments).
c) Legitimate Interests: When required to conduct our business operations without overriding your fundamental rights (e.g., safeguarding platform infrastructure, troubleshooting, analytics optimization).
d) Legal & Regulatory Obligation: When required to adhere to statutory accounting, fiscal reporting, fraud prevention, or lawful court orders.

--------------------------------------------------------------------------------

5. THIRD-PARTY SERVICES & SUBPROCESSORS
To operate ${safeSiteName} securely and deliver high-performance tools, we share necessary data with trusted third-party service providers who are contractually bound to confidentiality and GDPR data processing agreements:

${thirdPartiesList.length > 0 ? thirdPartiesList.join('\n\n') : '• No commercial third-party marketing trackers are enabled by default on this platform.'}

All third-party subprocessors adhere to industry-standard encryption, strict data processing addenda (DPAs), and certified security frameworks.

--------------------------------------------------------------------------------

6. DATA RETENTION POLICY
We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.

• Standard Technical & Operational Server Logs Retention Period: ${retentionPeriod.toUpperCase()}
Technical activity logs, server connection records, and diagnostic telemetry are routinely rotated and purged after ${retentionPeriod}, unless prolonged retention is required to investigate security anomalies or fulfill statutory preservation orders.

• Account & Transactional Records:
Invoices, accounting records, and payment confirmations are maintained in accordance with national tax and financial bookkeeping regulations (typically 6 to 7 statutory fiscal years).

• Marketing Preferences:
Your contact information for promotional communications will be retained until you exercise your right to unsubscribe or revoke consent.

--------------------------------------------------------------------------------

7. COOKIES & TRACKING TECHNOLOGIES
${safeSiteName} utilizes cookies, web beacons, and browser storage tokens to distinguish you from other users, preserve your active sessions, optimize UI preferences, and assess traffic distribution.

• Strictly Necessary Cookies: Essential for basic navigation, security, and authentication.
• Functional Cookies: Enable enhanced personalization and remember chosen settings (such as dark/light themes).
• Analytics & Performance Cookies: Allow us to evaluate visitor numbers and traffic pathways to improve site functionality.
• Advertising Cookies: Measure promotional campaign efficiency and provide relevant digital notices.

Browser Management: You can configure your browser to decline all or some cookies, or alert you when websites set or access cookies. Note that disabling necessary cookies may impair platform functionality.

--------------------------------------------------------------------------------

8. YOUR STATUTORY PRIVACY RIGHTS
Depending on your geographical residency and jurisdiction (${safeCountry}), you possess enforceable privacy rights regarding your personal information:

A. Rights under GDPR & UK GDPR:
• Right to Access: Request confirmation and copies of your personal data held by us.
• Right to Rectification: Correct inaccurate or incomplete personal records.
• Right to Erasure ("Right to be Forgotten"): Request irreversible deletion of your data when retention grounds cease.
• Right to Restriction of Processing: Limit how we process your personal data in contested circumstances.
• Right to Data Portability: Obtain your data in a structured, commonly used, machine-readable format.
• Right to Object: Object at any time to processing predicated on legitimate interests or direct marketing.
• Right to Withdraw Consent: Revoke previously granted consent without affecting the lawfulness of prior processing.

B. Rights under California Law (CCPA / CPRA / CalOPPA):
• Right to Know: Request disclosure of categories and specific pieces of personal data collected.
• Right to Delete: Request removal of personal information collected from you.
• Right to Correct: Rectify inaccurate personal records.
• Right to Opt-Out: We do not sell or share personal data for monetary or cross-context behavioral advertising.
• Right to Non-Discrimination: We will never deny services, charge different rates, or provide lower quality because you exercise statutory privacy rights.

Exercising Your Rights:
To exercise any statutory rights, submit your request to ${safeEmail}. We verify identity before fulfilling requests and respond within thirty (30) calendar days as prescribed by law.

--------------------------------------------------------------------------------

9. INTERNATIONAL DATA TRANSFERS
Your information may be processed and stored on cloud servers located outside your home state, province, or country. When transferring personal data from the UK or European Economic Area (EEA) to third countries lacking an adequacy decision, we ensure robust safeguards such as standard contractual clauses (SCCs) approved by the European Commission or the UK Information Commissioner's Office.

--------------------------------------------------------------------------------

10. CYBERSECURITY & TECHNICAL SAFEGUARDS
We deploy enterprise-grade administrative, technical, and physical safeguards designed to prevent unauthorized access, accidental alteration, disclosure, or destruction of personal data. These measures include:
• Industry-standard Transport Layer Security (TLS/SSL) encryption for all active web sessions.
• Strict least-privilege role-based access controls and multi-factor authentication for administrative accounts.
• Continuous infrastructure monitoring, rate-limiting, and network perimeter firewall inspection.

However, no digital transmission over the public Internet or method of electronic storage is 100% immune from malicious compromise.

--------------------------------------------------------------------------------

11. PROTECTION OF MINORS (CHILDREN'S PRIVACY)
${safeSiteName} is not intended for individuals under the age of 16 (or 13 in the United States under COPPA). We do not knowingly solicit or collect personal data from minors. If you believe a child has provided us with personal information, please contact ${safeEmail} so we can promptly delete such data from our systems.

--------------------------------------------------------------------------------

12. AMENDMENTS TO THIS PRIVACY POLICY
We reserve the right to revise this Privacy Policy periodically to reflect technological updates, legal developments, or adjustments to our business operations. When amendments occur, we will update the "Effective Date" at the head of this document. Material changes will be communicated prominently via our website or direct email notice where appropriate.

--------------------------------------------------------------------------------

13. SUPERVISORY AUTHORITY & COMPLAINTS
If you believe our processing of your personal information infringes relevant data privacy statutes, you have the right to lodge a formal complaint with the competent data protection supervisory authority:
• In the United Kingdom: The Information Commissioner's Office (ICO) at https://ico.org.uk.
• In the European Union: Your resident National Data Protection Authority (DPA).
• In Other Jurisdictions: The statutory consumer protection or privacy commissioner of your country (${safeCountry}).

We encourage you to contact us first at ${safeEmail} so we may resolve your concern directly and expeditiously.`;
  };

  // Handle generation click
  const handleGenerate = () => {
    const text = buildPolicy();
    setGeneratedPolicy(text);
    setHasGenerated(true);
  };

  // Generate on initial mount or preset change
  React.useEffect(() => {
    setGeneratedPolicy(buildPolicy());
    setHasGenerated(true);
  }, []);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPolicy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download as .txt
  const handleDownloadTxt = () => {
    const blob = new Blob([generatedPolicy], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'website';
    a.href = url;
    a.download = `privacy-policy-${safeName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // Download as .md (Markdown)
  const handleDownloadMd = () => {
    const blob = new Blob([generatedPolicy], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'website';
    a.href = url;
    a.download = `privacy-policy-${safeName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // Word count & stats
  const stats = useMemo(() => {
    const words = generatedPolicy.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 220);
    return { words, readingTime };
  }, [generatedPolicy]);

  // Quick Preset Handlers
  const applyPreset = (type: 'saas' | 'ecommerce' | 'blog' | 'agency') => {
    if (type === 'saas') {
      setSiteName('CloudFlow Suite');
      setSiteUrl('https://cloudflow.io');
      setCompanyName('CloudFlow Technologies Ltd');
      setContactEmail('privacy@cloudflow.io');
      setCountry('United Kingdom');
      setEffectiveDate('08/09/2026');
      setCollectEmail(true);
      setCollectNames(true);
      setCollectIp(true);
      setCollectCookies(true);
      setCollectPayment(true);
      setCollectLocation(false);
      setCollectUsage(true);
      setUseGoogleAnalytics(true);
      setUseGoogleAdSense(false);
      setUseStripe(true);
      setUseMailchimp(true);
      setUseCloudflare(true);
      setUseAffiliate(false);
      setRetentionPeriod('90 Days');
    } else if (type === 'ecommerce') {
      setSiteName('Velvet & Oak Store');
      setSiteUrl('https://velvetandoak.com');
      setCompanyName('Velvet & Oak Retail Corp');
      setContactEmail('compliance@velvetandoak.com');
      setCountry('United Kingdom');
      setEffectiveDate('08/09/2026');
      setCollectEmail(true);
      setCollectNames(true);
      setCollectIp(true);
      setCollectCookies(true);
      setCollectPayment(true);
      setCollectLocation(true);
      setCollectUsage(true);
      setUseGoogleAnalytics(true);
      setUseGoogleAdSense(false);
      setUseStripe(true);
      setUseMailchimp(true);
      setUseCloudflare(true);
      setUseAffiliate(true);
      setRetentionPeriod('1 Year');
    } else if (type === 'blog') {
      setSiteName('TechBytes Digest');
      setSiteUrl('https://techbytes.blog');
      setCompanyName('TechBytes Media Group');
      setContactEmail('editor@techbytes.blog');
      setCountry('United Kingdom');
      setEffectiveDate('08/09/2026');
      setCollectEmail(true);
      setCollectNames(false);
      setCollectIp(true);
      setCollectCookies(true);
      setCollectPayment(false);
      setCollectLocation(false);
      setCollectUsage(true);
      setUseGoogleAnalytics(true);
      setUseGoogleAdSense(true);
      setUseStripe(false);
      setUseMailchimp(true);
      setUseCloudflare(true);
      setUseAffiliate(true);
      setRetentionPeriod('30 Days');
    } else if (type === 'agency') {
      setSiteName('Apex Digital Studio');
      setSiteUrl('https://apexdigital.co.uk');
      setCompanyName('Apex Digital Creative LLP');
      setContactEmail('legal@apexdigital.co.uk');
      setCountry('United Kingdom');
      setEffectiveDate('08/09/2026');
      setCollectEmail(true);
      setCollectNames(true);
      setCollectIp(true);
      setCollectCookies(true);
      setCollectPayment(true);
      setCollectLocation(false);
      setCollectUsage(true);
      setUseGoogleAnalytics(true);
      setUseGoogleAdSense(false);
      setUseStripe(true);
      setUseMailchimp(false);
      setUseCloudflare(true);
      setUseAffiliate(false);
      setRetentionPeriod('6 Months');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Preset Quick Select */}
      <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#ff6b00]/15 text-[#ff6b00]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold font-display">Privacy Policy Generator</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              GDPR & CCPA Compliant
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Answer the questions below to draft a legally sound, customized Privacy Policy tailored to your jurisdiction, data collection practices, and third-party integrations.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-zinc-400">Presets:</span>
          <button
            onClick={() => applyPreset('saas')}
            className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition font-medium cursor-pointer"
          >
            SaaS App
          </button>
          <button
            onClick={() => applyPreset('ecommerce')}
            className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition font-medium cursor-pointer"
          >
            E-Commerce
          </button>
          <button
            onClick={() => applyPreset('blog')}
            className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition font-medium cursor-pointer"
          >
            Blog / AdSense
          </button>
        </div>
      </div>

      {/* Main Two-Column Questionnaire Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT BOX: About Your Website */}
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h4 className="font-bold text-base flex items-center gap-2 text-[#ff6b00]">
              <Building2 className="w-4 h-4" /> About Your Website
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">* Required fields</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Website / App Name */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Website / App Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g. Acme Tools"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition ${inputBg}`}
              />
            </div>

            {/* Your Website URL */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Your Website URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono transition ${inputBg}`}
              />
            </div>

            {/* Company / Owner Name */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Company / Owner Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Ltd or John Smith"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition ${inputBg}`}
              />
            </div>

            {/* Contact Email with Professional Check */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-zinc-300">
                  Contact Email <span className="text-rose-400">*</span>
                </label>
                {emailAnalysis.isValid && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      emailAnalysis.isBusiness
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {emailAnalysis.isBusiness ? 'Professional Email Verified' : 'Personal Webmail Detected'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="privacy@yoursite.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono transition ${inputBg} ${
                    !emailAnalysis.isValid ? 'border-rose-500/50' : emailAnalysis.isBusiness ? 'border-emerald-500/50' : 'border-amber-500/50'
                  }`}
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
              </div>

              {/* Email validation feedback message */}
              <div className="mt-1.5 flex items-start gap-1.5">
                {emailAnalysis.isBusiness ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span
                  className={`text-[11px] leading-tight ${
                    emailAnalysis.isBusiness
                      ? 'text-emerald-400 font-medium'
                      : emailAnalysis.isValid
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {emailAnalysis.message}
                </span>
              </div>
            </div>

            {/* Country / Jurisdiction (Selectable with all countries) */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Country / Jurisdiction</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${inputBg}`}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Determines applicable legal framework (UK GDPR, EU GDPR, CCPA/CPRA, etc.).
              </span>
            </div>

            {/* Effective Date */}
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Effective Date</label>
              <div className="relative">
                <input
                  type="text"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  placeholder="08/09/2026"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono transition ${inputBg}`}
                />
                <Calendar className="w-4 h-4 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT BOX: Data & Services You Use */}
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-5`}>
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h4 className="font-bold text-base flex items-center gap-2 text-[#ff6b00]">
              <Sparkles className="w-4 h-4" /> Data & Services You Use
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">Tailors policy clauses</span>
          </div>

          {/* Section 1: What data do you collect? */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">What data do you collect?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCollectEmail(true);
                    setCollectNames(true);
                    setCollectIp(true);
                    setCollectCookies(true);
                    setCollectPayment(true);
                    setCollectLocation(true);
                    setCollectUsage(true);
                  }}
                  className="text-[10px] text-[#ff6b00] hover:underline"
                >
                  Select all
                </button>
                <span className="text-zinc-600">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setCollectEmail(false);
                    setCollectNames(false);
                    setCollectIp(false);
                    setCollectCookies(false);
                    setCollectPayment(false);
                    setCollectLocation(false);
                    setCollectUsage(false);
                  }}
                  className="text-[10px] text-zinc-400 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={collectEmail}
                  onChange={(e) => setCollectEmail(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Email addresses</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={collectNames}
                  onChange={(e) => setCollectNames(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Names</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={collectIp}
                  onChange={(e) => setCollectIp(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">IP addresses</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={collectCookies}
                  onChange={(e) => setCollectCookies(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Cookies</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={collectPayment}
                  onChange={(e) => setCollectPayment(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Payment information</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={collectLocation}
                  onChange={(e) => setCollectLocation(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Location data</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition sm:col-span-2">
                <input
                  type="checkbox"
                  checked={collectUsage}
                  onChange={(e) => setCollectUsage(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Usage / analytics data</span>
              </label>
            </div>
          </div>

          {/* Section 2: Third-party services used */}
          <div>
            <span className="font-bold text-xs text-white block mb-2">Third-party services used</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={useGoogleAnalytics}
                  onChange={(e) => setUseGoogleAnalytics(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Google Analytics</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={useGoogleAdSense}
                  onChange={(e) => setUseGoogleAdSense(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Google AdSense</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={useStripe}
                  onChange={(e) => setUseStripe(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Stripe (payments)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={useMailchimp}
                  onChange={(e) => setUseMailchimp(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Mailchimp / email</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={useCloudflare}
                  onChange={(e) => setUseCloudflare(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Cloudflare</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={useAffiliate}
                  onChange={(e) => setUseAffiliate(e.target.checked)}
                  className="accent-[#ff6b00] rounded w-3.5 h-3.5"
                />
                <span className="text-zinc-200">Affiliate programs</span>
              </label>
            </div>
          </div>

          {/* Section 3: Log retention period */}
          <div>
            <label className="block font-bold text-xs text-white mb-1">Log retention period</label>
            <select
              value={retentionPeriod}
              onChange={(e) => setRetentionPeriod(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${inputBg}`}
            >
              <option value="30 Days" className="bg-zinc-900 text-white">
                30 Days
              </option>
              <option value="90 Days" className="bg-zinc-900 text-white">
                90 Days
              </option>
              <option value="6 Months" className="bg-zinc-900 text-white">
                6 Months
              </option>
              <option value="1 Year" className="bg-zinc-900 text-white">
                1 Year
              </option>
              <option value="2 Years" className="bg-zinc-900 text-white">
                2 Years
              </option>
            </select>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Explicit retention window declared in Clause 6 of your generated policy.
            </span>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/25 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Generate & Refresh Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* OUTPUT SECTION: Formatted Textbox with Copy & Download */}
      <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
        {/* Output Header with Stats and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <h4 className="font-bold text-base flex items-center gap-2 text-white">
              <FileText className="w-4 h-4 text-[#ff6b00]" /> Generated Privacy Policy Document
            </h4>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5 font-mono">
              <span>{stats.words.toLocaleString()} words</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{stats.readingTime} min read
              </span>
              <span>•</span>
              <span className="text-emerald-400">13 Standard Legal Clauses</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition cursor-pointer"
              title="Copy plain text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Policy'}
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold transition shadow-md shadow-[#ff6b00]/20 cursor-pointer"
              title="Download clean .txt file"
            >
              <Download className="w-3.5 h-3.5" /> Download .TXT
            </button>

            <button
              onClick={handleDownloadMd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              title="Download Markdown format for GitHub / static sites"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" /> .MD
            </button>
          </div>
        </div>

        {/* Textbox / Textarea containing the policy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>Editable text area — you can make final tweaks before copying:</span>
            <span>UTF-8 Plain Text</span>
          </div>

          <textarea
            value={generatedPolicy}
            onChange={(e) => setGeneratedPolicy(e.target.value)}
            rows={18}
            className={`w-full p-4 rounded-xl border text-xs font-mono leading-relaxed transition ${
              isDark
                ? 'bg-zinc-950 text-zinc-200 border-zinc-800 focus:border-[#ff6b00]'
                : 'bg-zinc-50 text-zinc-800 border-zinc-300 focus:border-[#ff6b00]'
            }`}
            placeholder="Your generated policy will appear here..."
          />
        </div>

        {/* Footer Notes & Legal Disclaimer */}
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-2.5">
          <InfoIcon className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-zinc-200">Legal Notice & Best Practices:</strong> This generated Privacy Policy provides a comprehensive draft compliant with GDPR, UK GDPR, and CCPA standards based on your specified data practices. While it covers standard statutory disclosure requirements, consulting with a qualified legal professional is advised to guarantee alignment with unique regional laws or proprietary business workflows.
          </p>
        </div>
      </div>
    </div>
  );
};

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
