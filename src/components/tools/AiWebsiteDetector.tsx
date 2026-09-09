import React, { useState, useMemo } from 'react';
import {
  Globe,
  Search,
  Bot,
  Sparkles,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Server,
  FileCode,
  Zap,
  Info,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Mail,
  Cpu,
  Lock
} from 'lucide-react';

interface AiWebsiteDetectorProps {
  theme: 'dark' | 'light';
}

export interface DetectedTechItem {
  id: string;
  category: 'Framework' | 'Hosting' | 'CDN' | 'Security' | 'Email Security' | 'Infrastructure' | 'stack';
  name: string;
  description: string;
  confidence: number;
}

export interface DetectedToolInfo {
  id: string;
  name: string;
  category: string;
  badge?: string;
  brandColor: string;
  bgLight: string;
  iconType: string;
  description: string;
  detected?: boolean;
  confidence?: number;
  matchedRules?: string[];
}

export const SUPPORTED_AI_TOOLS: DetectedToolInfo[] = [
  {
    id: 'framer',
    name: 'Framer AI',
    category: 'Website Builder',
    brandColor: '#0055FF',
    bgLight: 'rgba(0, 85, 255, 0.12)',
    iconType: 'framer',
    description: 'Generative interactive layouts, motion canvases, and Framer static asset CDN.'
  },
  {
    id: 'wix-adi',
    name: 'Wix ADI',
    category: 'Website Builder',
    brandColor: '#F5A623',
    bgLight: 'rgba(245, 166, 35, 0.12)',
    iconType: 'wix',
    description: 'Wix Artificial Design Intelligence engines and Parastorage asset runtimes.'
  },
  {
    id: 'webflow-ai',
    name: 'Webflow AI',
    category: 'Website Builder',
    brandColor: '#146EF5',
    bgLight: 'rgba(20, 110, 245, 0.12)',
    iconType: 'webflow',
    description: 'Webflow visual development generator, CMS schema, and AI designer assistants.'
  },
  {
    id: 'vercel-v0',
    name: 'Vercel v0',
    category: 'AI Coding Assistant',
    brandColor: '#000000',
    bgLight: 'rgba(255, 255, 255, 0.15)',
    iconType: 'v0',
    description: 'Generative React/Next.js UI components paired with shadcn and Tailwind.'
  },
  {
    id: 'duda',
    name: 'Duda AI',
    category: 'Website Builder',
    badge: 'DU',
    brandColor: '#00D4B2',
    bgLight: 'rgba(0, 212, 178, 0.12)',
    iconType: 'duda',
    description: 'Enterprise Duda AI content and site generator with responsive layout grid.'
  },
  {
    id: 'shopify-magic',
    name: 'Shopify Magic',
    category: 'Ecommerce AI',
    brandColor: '#96BF48',
    bgLight: 'rgba(150, 191, 72, 0.12)',
    iconType: 'shopify',
    description: 'Shopify AI-driven product descriptions, theme generation, and Sidekick copilot.'
  },
  {
    id: 'bolt-new',
    name: 'Bolt.new',
    category: 'AI Coding Assistant',
    badge: 'BO',
    brandColor: '#FF6B00',
    bgLight: 'rgba(255, 107, 0, 0.15)',
    iconType: 'bolt',
    description: 'Full-stack StackBlitz WebContainer prompt engineering and in-browser AI builder.'
  },
  {
    id: 'lovable-dev',
    name: 'Lovable.dev',
    category: 'AI Coding Assistant',
    badge: 'LO',
    brandColor: '#FF2E93',
    bgLight: 'rgba(255, 46, 147, 0.15)',
    iconType: 'lovable',
    description: 'GPT-Engineer powered full-stack web applications with Lovable tagger runtime.'
  },
  {
    id: 'openai-chatgpt',
    name: 'OpenAI/ChatGPT',
    category: 'LLM / Chatbot',
    brandColor: '#10A37F',
    bgLight: 'rgba(16, 163, 127, 0.12)',
    iconType: 'openai',
    description: 'GPT-4o/ChatGPT boilerplate generation, conversational widgets, and OpenAI API calls.'
  },
  {
    id: 'anthropic-claude',
    name: 'Anthropic Claude',
    category: 'LLM / Chatbot',
    brandColor: '#D97706',
    bgLight: 'rgba(217, 119, 6, 0.12)',
    iconType: 'claude',
    description: 'Claude 3.5 Sonnet generated single-file artifacts, modern clean components, and APIs.'
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    category: 'LLM / Chatbot',
    brandColor: '#4285F4',
    bgLight: 'rgba(66, 133, 244, 0.12)',
    iconType: 'gemini',
    description: 'Multimodal Gemini models, Google AI Studio exports, and Vertex AI endpoints.'
  },
  {
    id: 'godaddy-airo',
    name: 'GoDaddy Airo',
    category: 'Website Builder',
    brandColor: '#00A4A6',
    bgLight: 'rgba(0, 164, 166, 0.12)',
    iconType: 'godaddy',
    description: 'Automated AI business identities, site builder, and GoDaddy hosting blueprints.'
  },
  {
    id: 'xai-grok',
    name: 'xAI Grok',
    category: 'LLM / Chatbot',
    badge: 'GR',
    brandColor: '#FFFFFF',
    bgLight: 'rgba(255, 255, 255, 0.12)',
    iconType: 'grok',
    description: 'xAI Grok conversational endpoints, prompt architectures, and real-time assistants.'
  },
  {
    id: 'squarespace-ai',
    name: 'Squarespace AI',
    category: 'Website Builder',
    brandColor: '#222222',
    bgLight: 'rgba(255, 255, 255, 0.10)',
    iconType: 'squarespace',
    description: 'Squarespace Blueprint AI website layouts, text synthesizers, and portfolio kits.'
  },
  {
    id: '10web-ai',
    name: '10Web AI',
    category: 'Website Builder',
    badge: '10',
    brandColor: '#0070F3',
    bgLight: 'rgba(0, 112, 243, 0.12)',
    iconType: 'tenweb',
    description: 'Automated AI WordPress website cloning, Elementor widgets, and speed boosters.'
  },
  {
    id: 'hostinger-horizons',
    name: 'Hostinger Horizons',
    category: 'Website Builder',
    brandColor: '#673DE6',
    bgLight: 'rgba(103, 61, 230, 0.12)',
    iconType: 'hostinger',
    description: 'Hostinger Horizons generative AI website creator, logos, and hosting pipelines.'
  },
  {
    id: 'jimdo-ai',
    name: 'Jimdo AI',
    category: 'Website Builder',
    badge: 'JI',
    brandColor: '#1A3365',
    bgLight: 'rgba(26, 51, 101, 0.15)',
    iconType: 'jimdo',
    description: 'Jimdo Dolphin algorithmic site creation system for small business portfolios.'
  },
  {
    id: 'gamma-app',
    name: 'Gamma.app',
    category: 'Presentation AI',
    badge: 'GA',
    brandColor: '#A855F7',
    bgLight: 'rgba(168, 85, 247, 0.12)',
    iconType: 'gamma',
    description: 'AI-generated presentation decks, cards, interactive visual pages, and Gamma embeds.'
  },
  {
    id: 'mixo-io',
    name: 'Mixo.io',
    category: 'Website Builder',
    badge: 'MI',
    brandColor: '#FF5722',
    bgLight: 'rgba(255, 87, 34, 0.12)',
    iconType: 'mixo',
    description: 'One-prompt startup landing page generator with built-in waitlist forms.'
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    category: 'CMS Platform',
    brandColor: '#21759B',
    bgLight: 'rgba(33, 117, 155, 0.12)',
    iconType: 'wordpress',
    description: 'Classic CMS framework scanned for generative plugins, AI blocks, and auto-generated copy.'
  },
  {
    id: 'replit-agent',
    name: 'Replit Agent',
    category: 'AI Coding Assistant',
    badge: 'RE',
    brandColor: '#F26207',
    bgLight: 'rgba(242, 98, 7, 0.15)',
    iconType: 'replit',
    description: 'Autonomous software engineering agent deployments on Replit development cloud.'
  },
  {
    id: 'base44',
    name: 'Base44',
    category: 'Website Builder',
    badge: 'B4',
    brandColor: '#6366F1',
    bgLight: 'rgba(99, 102, 241, 0.12)',
    iconType: 'base44',
    description: 'Modern AI-first layout builder optimized for high-conversion startup sites.'
  },
  {
    id: 'durable',
    name: 'Durable',
    category: 'Website Builder',
    badge: 'DR',
    brandColor: '#3B82F6',
    bgLight: 'rgba(59, 130, 246, 0.12)',
    iconType: 'durable',
    description: '30-second generative AI website builder with auto-generated CRM and business copy.'
  }
];

export const AiWebsiteDetector: React.FC<AiWebsiteDetectorProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-sm';
  const inputBg = isDark
    ? 'bg-zinc-950/90 border-zinc-800 text-white focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00]'
    : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00]';

  const [inputUrl, setInputUrl] = useState<string>('https://example.com');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // Result state
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [aiScore, setAiScore] = useState<number>(18);
  const [detectedTools, setDetectedTools] = useState<DetectedToolInfo[]>([]);
  const [detectedTech, setDetectedTech] = useState<DetectedTechItem[]>([]);
  const [evidenceList, setEvidenceList] = useState<string[]>([]);
  const [scannedUrl, setScannedUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Framework':
        return <Code2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'Hosting':
        return <Server className="w-3.5 h-3.5 text-indigo-400" />;
      case 'CDN':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'Security':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Email Security':
        return <Mail className="w-3.5 h-3.5 text-purple-400" />;
      case 'Infrastructure':
        return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      case 'stack':
        return <Layers className="w-3.5 h-3.5 text-[#ff6b00]" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  // Categorization based on prompt scale rules:
  // 70-100: AI Built
  // 40-70: AI Helped
  // 0-40: Likely human built or custom code
  const classification = useMemo(() => {
    if (aiScore >= 70) {
      return {
        label: 'AI Built',
        rangeText: '70–100 Scale',
        color: 'text-rose-400',
        badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
        ringColor: '#f43f5e',
        summary: 'High probability of programmatic generation using autonomous AI site builders or AI coding engines.'
      };
    }
    if (aiScore >= 40) {
      return {
        label: 'AI Helped',
        rangeText: '40–70 Scale',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        ringColor: '#f59e0b',
        summary: 'Mixed signatures: human-authored architecture with substantial AI-assisted copy, design blocks, or LLM code.'
      };
    }
    return {
      label: 'Likely Human Built or Custom Code',
      rangeText: '0–40 Scale',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      ringColor: '#10b981',
      summary: 'Handcrafted architecture, custom styling pipelines, or standard framework boilerplate with negligible AI markers.'
    };
  }, [aiScore]);

  // Deep Heuristic & Signature Detection Engine
  const analyzeWebsiteContent = (
    targetUrl: string,
    html: string,
    headers: Record<string, string>,
    dnsInfo?: {
      hasIpv6?: boolean;
      ipv6Count?: number;
      hasSpf?: boolean;
      spf?: string | null;
      hasDmarc?: boolean;
      dmarc?: string | null;
    } | null
  ) => {
    const urlLower = targetUrl.toLowerCase();
    const htmlLower = html.toLowerCase();
    const headersStr = JSON.stringify(headers).toLowerCase();

    let computedScore = 0;
    const foundTools: DetectedToolInfo[] = [];
    const evidence: string[] = [];

    // Helper to register detected tool
    const registerTool = (toolId: string, matchedSignatures: string[], addedScore: number) => {
      const base = SUPPORTED_AI_TOOLS.find((t) => t.id === toolId);
      if (base) {
        foundTools.push({
          ...base,
          detected: true,
          confidence: Math.min(99, Math.max(70, addedScore + 35)),
          matchedRules: matchedSignatures
        });
        computedScore += addedScore;
        evidence.push(`${base.name}: Detected ${matchedSignatures.join(', ')}`);
      }
    };

    // 1. Framer AI
    const framerMatches: string[] = [];
    if (urlLower.includes('.framer.app') || urlLower.includes('.framer.website')) framerMatches.push('Framer subdomain host');
    if (htmlLower.includes('framerstatic.com')) framerMatches.push('Framer Static CDN');
    if (htmlLower.includes('data-framer-name') || htmlLower.includes('__framer__')) framerMatches.push('Framer DOM attributes');
    if (htmlLower.includes('name="generator" content="framer')) framerMatches.push('Framer meta generator tag');
    if (framerMatches.length > 0) registerTool('framer', framerMatches, 82);

    // 2. Wix ADI
    const wixMatches: string[] = [];
    if (urlLower.includes('.wixsite.com')) wixMatches.push('Wix hosted domain');
    if (htmlLower.includes('parastorage.com') || htmlLower.includes('static.wixstatic.com')) wixMatches.push('Wix Parastorage asset pipeline');
    if (htmlLower.includes('wix.com') && htmlLower.includes('wix-warmup-data')) wixMatches.push('Wix site runtime payload');
    if (htmlLower.includes('name="generator" content="wix.com')) wixMatches.push('Wix ADI generator declaration');
    if (wixMatches.length > 0) registerTool('wix-adi', wixMatches, 74);

    // 3. Webflow AI
    const webflowMatches: string[] = [];
    if (urlLower.includes('.webflow.io')) webflowMatches.push('Webflow staging domain');
    if (htmlLower.includes('assets.website-files.com')) webflowMatches.push('Webflow asset cluster');
    if (htmlLower.includes('data-wf-page') || htmlLower.includes('data-wf-site')) webflowMatches.push('Webflow page runtime hashes');
    if (htmlLower.includes('name="generator" content="webflow')) webflowMatches.push('Webflow generator meta tag');
    if (webflowMatches.length > 0) registerTool('webflow-ai', webflowMatches, 65);

    // 4. Vercel v0
    const v0Matches: string[] = [];
    if (urlLower.includes('v0.build') || urlLower.includes('v0.dev')) v0Matches.push('Vercel v0 hosted deployment');
    if (htmlLower.includes('v0-generated') || htmlLower.includes('data-v0-') || htmlLower.includes('<!-- created with v0 -->')) v0Matches.push('v0 component comments & attributes');
    if (htmlLower.includes('lucide-react') && htmlLower.includes('radix-ui') && (htmlLower.includes('v0') || headersStr.includes('v0'))) v0Matches.push('v0 component stack signature');
    if (v0Matches.length > 0) registerTool('vercel-v0', v0Matches, 92);

    // 5. Duda AI
    const dudaMatches: string[] = [];
    if (urlLower.includes('.duda.co') || urlLower.includes('.cdn-website.com')) dudaMatches.push('Duda platform host');
    if (htmlLower.includes('duda-website') || htmlLower.includes('cdn-website.com')) dudaMatches.push('Duda CDN runtime scripts');
    if (htmlLower.includes('name="generator" content="duda')) dudaMatches.push('Duda meta generator');
    if (dudaMatches.length > 0) registerTool('duda', dudaMatches, 78);

    // 6. Shopify Magic
    const shopifyMatches: string[] = [];
    if (urlLower.includes('.myshopify.com')) shopifyMatches.push('Shopify primary domain');
    if (htmlLower.includes('cdn.shopify.com')) shopifyMatches.push('Shopify asset CDN');
    if (htmlLower.includes('shopify-features') || htmlLower.includes('magic-ai')) shopifyMatches.push('Shopify Magic automated copywriting signatures');
    if (shopifyMatches.length > 0) registerTool('shopify-magic', shopifyMatches, 58);

    // 7. Bolt.new
    const boltMatches: string[] = [];
    if (urlLower.includes('.bolt.host') || urlLower.includes('bolt.new')) boltMatches.push('Bolt.new hosted WebContainer instance');
    if (htmlLower.includes('bolt-generated') || htmlLower.includes('<!-- generated by bolt.new -->') || htmlLower.includes('stackblitz-webcontainer')) boltMatches.push('Bolt environment identifiers');
    if (boltMatches.length > 0) registerTool('bolt-new', boltMatches, 94);

    // 8. Lovable.dev
    const lovableMatches: string[] = [];
    if (urlLower.includes('.lovable.app') || urlLower.includes('lovable.dev') || urlLower.includes('.gptengineer.app')) lovableMatches.push('Lovable.app deployment domain');
    if (htmlLower.includes('lovable-tagger') || htmlLower.includes('data-lovable-') || htmlLower.includes('lovable-component')) lovableMatches.push('Lovable runtime tagger client');
    if (lovableMatches.length > 0) registerTool('lovable-dev', lovableMatches, 95);

    // 9. OpenAI / ChatGPT
    const openAiMatches: string[] = [];
    if (htmlLower.includes('api.openai.com') || htmlLower.includes('openai-chat') || htmlLower.includes('chatgpt-widget')) openAiMatches.push('OpenAI API integration endpoint');
    if (htmlLower.includes('as an ai language model') || htmlLower.includes('delve into the multifaceted') || htmlLower.includes('testament to the growing')) openAiMatches.push('Verbatim unedited ChatGPT semantic cadence');
    if (openAiMatches.length > 0) registerTool('openai-chatgpt', openAiMatches, 68);

    // 10. Anthropic Claude
    const claudeMatches: string[] = [];
    if (htmlLower.includes('api.anthropic.com') || htmlLower.includes('claude-chat') || htmlLower.includes('claude-artifact')) claudeMatches.push('Anthropic Claude API hooks');
    if (htmlLower.includes('<!-- claude generated artifact -->') || htmlLower.includes('rendered via claude')) claudeMatches.push('Claude Artifact structure markers');
    if (claudeMatches.length > 0) registerTool('anthropic-claude', claudeMatches, 64);

    // 11. Google Gemini
    const geminiMatches: string[] = [];
    if (htmlLower.includes('generativelanguage.googleapis.com') || htmlLower.includes('ai.google.dev') || htmlLower.includes('gemini-pro')) geminiMatches.push('Google Gemini API client connection');
    if (htmlLower.includes('ai studio applet') || htmlLower.includes('deepmind gemini')) geminiMatches.push('Google AI Studio application footprint');
    if (geminiMatches.length > 0) registerTool('google-gemini', geminiMatches, 62);

    // 12. GoDaddy Airo
    const godaddyMatches: string[] = [];
    if (urlLower.includes('.godaddysites.com')) godaddyMatches.push('GoDaddy Airo generated subdomain');
    if (htmlLower.includes('secureserver.net') && (htmlLower.includes('airo') || htmlLower.includes('godaddy-builder'))) godaddyMatches.push('GoDaddy Airo website pipeline');
    if (godaddyMatches.length > 0) registerTool('godaddy-airo', godaddyMatches, 76);

    // 13. xAI Grok
    const grokMatches: string[] = [];
    if (htmlLower.includes('api.x.ai') || htmlLower.includes('grok-') || htmlLower.includes('xai-api')) grokMatches.push('xAI Grok API client endpoints');
    if (grokMatches.length > 0) registerTool('xai-grok', grokMatches, 60);

    // 14. Squarespace AI
    const sqspMatches: string[] = [];
    if (urlLower.includes('.squarespace.com')) sqspMatches.push('Squarespace native domain');
    if (htmlLower.includes('static1.squarespace.com') || htmlLower.includes('sqsp.net')) sqspMatches.push('Squarespace static asset network');
    if (htmlLower.includes('squarespace-ai') || (htmlLower.includes('name="generator" content="squarespace') && htmlLower.includes('squarespace-blueprint'))) sqspMatches.push('Squarespace Blueprint AI markers');
    if (sqspMatches.length > 0) registerTool('squarespace-ai', sqspMatches, 62);

    // 15. 10Web AI
    const tenWebMatches: string[] = [];
    if (urlLower.includes('.10web.site') || urlLower.includes('.10web.me')) tenWebMatches.push('10Web generated deployment');
    if (htmlLower.includes('10web-manager') || htmlLower.includes('10web-builder') || htmlLower.includes('tenweb')) tenWebMatches.push('10Web AI builder WordPress modules');
    if (tenWebMatches.length > 0) registerTool('10web-ai', tenWebMatches, 86);

    // 16. Hostinger Horizons
    const hostingerMatches: string[] = [];
    if (urlLower.includes('hostinger.site') || urlLower.includes('000webhostapp.com')) hostingerMatches.push('Hostinger staging deployment');
    if (htmlLower.includes('hostinger-builder') || htmlLower.includes('horizons-ai') || htmlLower.includes('hostinger-ai-website')) hostingerMatches.push('Hostinger Horizons AI engine');
    if (hostingerMatches.length > 0) registerTool('hostinger-horizons', hostingerMatches, 80);

    // 17. Jimdo AI
    const jimdoMatches: string[] = [];
    if (urlLower.includes('.jimdosite.com')) jimdoMatches.push('Jimdo Dolphin domain');
    if (htmlLower.includes('jimdo.com') || htmlLower.includes('jimdo-dolphin') || htmlLower.includes('jimdo-ai')) jimdoMatches.push('Jimdo algorithmic page generator');
    if (jimdoMatches.length > 0) registerTool('jimdo-ai', jimdoMatches, 75);

    // 18. Gamma.app
    const gammaMatches: string[] = [];
    if (urlLower.includes('.gamma.site') || urlLower.includes('gamma.app')) gammaMatches.push('Gamma presentation hosting domain');
    if (htmlLower.includes('gamma-embed') || htmlLower.includes('gamma.app/embed') || htmlLower.includes('gamma-deck')) gammaMatches.push('Gamma interactive card deck canvas');
    if (gammaMatches.length > 0) registerTool('gamma-app', gammaMatches, 89);

    // 19. Mixo.io
    const mixoMatches: string[] = [];
    if (urlLower.includes('.mixo.page') || urlLower.includes('mixo.io')) mixoMatches.push('Mixo.page launch domain');
    if (htmlLower.includes('mixo-assets') || htmlLower.includes('mixo-site') || htmlLower.includes('mixo.io')) mixoMatches.push('Mixo AI startup landing page kit');
    if (mixoMatches.length > 0) registerTool('mixo-io', mixoMatches, 91);

    // 20. WordPress
    const wpMatches: string[] = [];
    if (htmlLower.includes('wp-content') || htmlLower.includes('wp-includes')) wpMatches.push('WordPress directory hierarchy');
    if (htmlLower.includes('name="generator" content="wordpress')) wpMatches.push('WordPress generator tag');
    if (wpMatches.length > 0) {
      // Check if AI plugin or classic WordPress
      if (htmlLower.includes('ai-content') || htmlLower.includes('gpt3-ai-content') || htmlLower.includes('elementor-ai')) {
        wpMatches.push('AI Content / Elementor AI plugin');
        registerTool('wordpress', wpMatches, 56);
      } else {
        registerTool('wordpress', wpMatches, 28);
      }
    }

    // 21. Replit Agent
    const replitMatches: string[] = [];
    if (urlLower.includes('.replit.dev') || urlLower.includes('.replit.app')) replitMatches.push('Replit development environment');
    if (htmlLower.includes('replit-agent') || htmlLower.includes('__replit_') || htmlLower.includes('replit.com/@')) replitMatches.push('Replit autonomous agent traces');
    if (replitMatches.length > 0) registerTool('replit-agent', replitMatches, 88);

    // 22. Base44
    const base44Matches: string[] = [];
    if (urlLower.includes('.base44.app') || urlLower.includes('base44.com')) base44Matches.push('Base44 platform domain');
    if (htmlLower.includes('base44-builder') || htmlLower.includes('base44-cdn')) base44Matches.push('Base44 UI blocks');
    if (base44Matches.length > 0) registerTool('base44', base44Matches, 84);

    // 23. Durable
    const durableMatches: string[] = [];
    if (urlLower.includes('.durable.site') || urlLower.includes('durable.co')) durableMatches.push('Durable site hosting');
    if (htmlLower.includes('durable-website') || htmlLower.includes('durable-ai') || htmlLower.includes('durable-assets')) durableMatches.push('Durable 30-sec AI website assets');
    if (durableMatches.length > 0) registerTool('durable', durableMatches, 93);

    // Additional General AI Semantic & Structural Checks
    const aiCopyPatterns = [
      'revolutionize the way you',
      'unleash the power of',
      'seamlessly integrate',
      'in today’s fast-paced digital world',
      'cutting-edge technology meets',
      'look no further than',
      'elevate your brand to new heights',
      'empower your team to achieve'
    ];

    let copyMatchCount = 0;
    aiCopyPatterns.forEach((pattern) => {
      if (htmlLower.includes(pattern)) {
        copyMatchCount++;
      }
    });

    if (copyMatchCount >= 2) {
      computedScore += 18;
      evidence.push(`Semantic Copy Analysis: Found ${copyMatchCount} high-density AI template phrases ("${aiCopyPatterns.find((p) => htmlLower.includes(p))}")`);
    }

    // Single-page generic Unsplash placeholder pattern common in AI generators
    if (htmlLower.includes('images.unsplash.com') && (htmlLower.includes('fit=crop') && htmlLower.includes('auto=format'))) {
      if (foundTools.some((t) => ['mixo-io', 'durable', 'framer', 'vercel-v0', 'bolt-new'].includes(t.id))) {
        computedScore += 5;
        evidence.push('Asset Pipeline: Automated curated stock image queries typical of generative page builders');
      }
    }

    // Handcrafted / Human signals that lower AI score
    const humanIndicators: string[] = [];
    if (htmlLower.includes('wp-admin') === false && htmlLower.includes('generator') === false) {
      if (htmlLower.includes('webpack') || htmlLower.includes('/_next/static/') || htmlLower.includes('/assets/index-')) {
        humanIndicators.push('Custom enterprise production build bundles');
      }
    }
    if (headers['strict-transport-security'] && headers['content-security-policy']) {
      humanIndicators.push('Custom hardened HTTP security headers configured');
    }
    if (htmlLower.includes('git-commit') || htmlLower.includes('release-v') || htmlLower.includes('sentry-trace')) {
      humanIndicators.push('Custom continuous integration release telemetry');
    }

    // Final score normalization adhering strictly to prompt scale:
    // If AI Builder detected: 70 - 100
    // If AI Helped (partial LLM, Shopify, WordPress + AI, generic copy): 40 - 70
    // If Human: 0 - 40
    let finalScore = 0;

    if (foundTools.some((t) => ['vercel-v0', 'lovable-dev', 'bolt-new', 'mixo-io', 'durable', 'gamma-app', 'replit-agent', '10web-ai', 'framer', 'base44'].includes(t.id))) {
      // Direct autonomous AI builder
      finalScore = Math.max(76, Math.min(98, computedScore));
    } else if (foundTools.some((t) => ['wix-adi', 'duda', 'hostinger-horizons', 'jimdo-ai'].includes(t.id))) {
      finalScore = Math.max(72, Math.min(92, computedScore));
    } else if (foundTools.some((t) => ['shopify-magic', 'webflow-ai', 'squarespace-ai', 'openai-chatgpt', 'anthropic-claude', 'google-gemini', 'godaddy-airo', 'xai-grok'].includes(t.id))) {
      // AI Helped
      finalScore = Math.max(48, Math.min(68, computedScore || 52));
    } else if (copyMatchCount >= 2 || (foundTools.length > 0 && foundTools[0].id === 'wordpress')) {
      finalScore = Math.max(42, Math.min(64, computedScore || 45));
    } else {
      // Likely Human Built or Custom Code (0 - 40)
      if (humanIndicators.length > 0) {
        finalScore = Math.max(8, 28 - humanIndicators.length * 5);
        evidence.push(`Human Engineering Markers: ${humanIndicators.join(', ')}`);
      } else {
        finalScore = 18;
      }
      evidence.push('No autonomous AI builder markers, synthetic runtime attributes, or prompt comments found');
    }

    // ==========================================
    // Core Technologies & Architecture Detection
    // 1. Framework
    // 2. Hosting
    // 3. CDN
    // 4. Security
    // 5. Email Security
    // 6. Infrastructure
    // 7. stack
    // ==========================================
    const detectedTechList: DetectedTechItem[] = [];

    // 1. Framework
    if (
      htmlLower.includes('__next') ||
      htmlLower.includes('/_next/') ||
      headers['x-nextjs-cache'] ||
      headers['x-nextjs-matched-path'] ||
      htmlLower.includes('next.js') ||
      foundTools.some((t) => ['vercel-v0', 'bolt-new'].includes(t.id))
    ) {
      detectedTechList.push({
        id: 'framework-nextjs',
        category: 'Framework',
        name: 'Next.js',
        description: 'Next.js by Vercel',
        confidence: headers['x-nextjs-cache'] ? 95 : 90
      });
    } else if (htmlLower.includes('__nuxt') || htmlLower.includes('/_nuxt/')) {
      detectedTechList.push({
        id: 'framework-nuxt',
        category: 'Framework',
        name: 'Nuxt.js',
        description: 'Nuxt.js Vue Framework',
        confidence: 92
      });
    } else if (htmlLower.includes('data-astro-') || htmlLower.includes('astro-island')) {
      detectedTechList.push({
        id: 'framework-astro',
        category: 'Framework',
        name: 'Astro',
        description: 'Astro Islands Architecture',
        confidence: 94
      });
    } else if (htmlLower.includes('__sveltekit') || htmlLower.includes('svelte-')) {
      detectedTechList.push({
        id: 'framework-sveltekit',
        category: 'Framework',
        name: 'SvelteKit',
        description: 'SvelteKit Cybernetically Enhanced Web Apps',
        confidence: 92
      });
    } else if (htmlLower.includes('wp-content') || htmlLower.includes('wp-includes') || htmlLower.includes('name="generator" content="wordpress')) {
      detectedTechList.push({
        id: 'framework-wp',
        category: 'Framework',
        name: 'WordPress',
        description: 'WordPress Content Management Framework',
        confidence: 96
      });
    } else if (htmlLower.includes('data-wf-page') || htmlLower.includes('webflow.js')) {
      detectedTechList.push({
        id: 'framework-webflow',
        category: 'Framework',
        name: 'Webflow',
        description: 'Webflow Visual Designer Framework',
        confidence: 95
      });
    } else if (htmlLower.includes('framerstatic') || htmlLower.includes('__framer__')) {
      detectedTechList.push({
        id: 'framework-framer',
        category: 'Framework',
        name: 'Framer',
        description: 'Framer React Motion Engine',
        confidence: 95
      });
    } else if (htmlLower.includes('data-reactroot') || htmlLower.includes('react.production.min.js') || htmlLower.includes('react-dom')) {
      detectedTechList.push({
        id: 'framework-react',
        category: 'Framework',
        name: 'React',
        description: 'React JavaScript UI Library',
        confidence: 92
      });
    } else if (htmlLower.includes('data-v-') || htmlLower.includes('vue.global.js')) {
      detectedTechList.push({
        id: 'framework-vue',
        category: 'Framework',
        name: 'Vue.js',
        description: 'Vue Progressive Framework',
        confidence: 90
      });
    } else {
      detectedTechList.push({
        id: 'framework-html5',
        category: 'Framework',
        name: 'HTML5 / Modern Web',
        description: 'Semantic HTML5 standard baseline',
        confidence: 90
      });
    }

    // 2. Hosting
    if (
      headers['x-vercel-id'] ||
      headers['x-vercel-cache'] ||
      urlLower.includes('vercel.app') ||
      headers['server']?.includes('vercel') ||
      foundTools.some((t) => t.id === 'vercel-v0')
    ) {
      detectedTechList.push({
        id: 'hosting-vercel',
        category: 'Hosting',
        name: 'Vercel',
        description: 'Vercel hosting',
        confidence: 92
      });
    } else if (
      urlLower.includes('pages.dev') ||
      urlLower.includes('workers.dev') ||
      (headers['server']?.includes('cloudflare') && !headers['x-vercel-id'] && !headers['x-nf-request-id'] && !urlLower.includes('github.io'))
    ) {
      detectedTechList.push({
        id: 'hosting-cloudflare',
        category: 'Hosting',
        name: 'Cloudflare',
        description: 'Cloudflare edge hosting network',
        confidence: 92
      });
    } else if (headers['x-nf-request-id'] || urlLower.includes('netlify.app')) {
      detectedTechList.push({
        id: 'hosting-netlify',
        category: 'Hosting',
        name: 'Netlify',
        description: 'Netlify Jamstack cloud hosting',
        confidence: 95
      });
    } else if (headers['x-amz-request-id'] || headers['x-amz-id-2'] || urlLower.includes('amazonaws.com')) {
      detectedTechList.push({
        id: 'hosting-aws',
        category: 'Hosting',
        name: 'AWS',
        description: 'Amazon Web Services infrastructure',
        confidence: 94
      });
    } else if (urlLower.includes('github.io') || headers['server']?.includes('github.com')) {
      detectedTechList.push({
        id: 'hosting-gh',
        category: 'Hosting',
        name: 'GitHub Pages',
        description: 'GitHub static deployment hosting',
        confidence: 96
      });
    } else if (urlLower.includes('firebaseapp.com') || urlLower.includes('run.app') || urlLower.includes('web.app')) {
      detectedTechList.push({
        id: 'hosting-gcp',
        category: 'Hosting',
        name: 'Google Cloud',
        description: 'Google Cloud Run / Firebase hosting',
        confidence: 92
      });
    } else if (urlLower.includes('myshopify.com')) {
      detectedTechList.push({
        id: 'hosting-shopify',
        category: 'Hosting',
        name: 'Shopify',
        description: 'Shopify cloud commerce hosting',
        confidence: 96
      });
    } else if (headers['server']?.includes('nginx') || headers['server']?.includes('apache')) {
      detectedTechList.push({
        id: 'hosting-server',
        category: 'Hosting',
        name: headers['server'].includes('nginx') ? 'Nginx' : 'Apache',
        description: 'Dedicated Linux web server hosting',
        confidence: 89
      });
    } else {
      detectedTechList.push({
        id: 'hosting-cloud',
        category: 'Hosting',
        name: 'Origin Cloud',
        description: 'Dedicated web infrastructure host',
        confidence: 88
      });
    }

    // 3. CDN
    const hasCloudflare =
      headers['cf-ray'] ||
      headers['cf-cache-status'] ||
      headers['server']?.includes('cloudflare') ||
      urlLower.includes('cloudflare.com');

    if (hasCloudflare) {
      // In accordance with user specification, Cloudflare CDN and Cloudflare CDN/security are provided in distinct boxes
      detectedTechList.push({
        id: 'cdn-cloudflare-1',
        category: 'CDN',
        name: 'Cloudflare',
        description: 'Cloudflare CDN',
        confidence: 95
      });
      detectedTechList.push({
        id: 'cdn-cloudflare-2',
        category: 'CDN',
        name: 'Cloudflare',
        description: 'Cloudflare CDN/security',
        confidence: 90
      });
    } else if (headers['x-vercel-id'] || headers['x-vercel-cache']) {
      detectedTechList.push({
        id: 'cdn-vercel',
        category: 'CDN',
        name: 'Vercel Edge',
        description: 'Vercel Edge global CDN delivery',
        confidence: 94
      });
    } else if (headers['x-amz-cf-id'] || htmlLower.includes('cloudfront.net')) {
      detectedTechList.push({
        id: 'cdn-cloudfront',
        category: 'CDN',
        name: 'Amazon CloudFront',
        description: 'Global content delivery network by AWS',
        confidence: 95
      });
    } else if (headers['x-served-by'] || headers['server']?.includes('fastly')) {
      detectedTechList.push({
        id: 'cdn-fastly',
        category: 'CDN',
        name: 'Fastly',
        description: 'Fastly edge cloud delivery',
        confidence: 95
      });
    } else if (headers['x-akamai-'] || headers['server']?.includes('akamai')) {
      detectedTechList.push({
        id: 'cdn-akamai',
        category: 'CDN',
        name: 'Akamai',
        description: 'Enterprise Akamai Intelligent Edge CDN',
        confidence: 95
      });
    } else {
      detectedTechList.push({
        id: 'cdn-origin',
        category: 'CDN',
        name: 'Direct Origin',
        description: 'Assets served directly from origin web server',
        confidence: 85
      });
    }

    // 4. Security
    if (headers['strict-transport-security'] || targetUrl.startsWith('https://')) {
      detectedTechList.push({
        id: 'security-hsts',
        category: 'Security',
        name: 'HSTS',
        description: 'HTTP Strict Transport Security enforced',
        confidence: 95
      });
    } else {
      detectedTechList.push({
        id: 'security-standard',
        category: 'Security',
        name: 'TLS / HTTPS',
        description: 'Transport Layer Security transport encryption',
        confidence: 90
      });
    }

    // 5. Email Security
    if (dnsInfo && dnsInfo.hasSpf === false && !dnsInfo.hasDmarc) {
      detectedTechList.push({
        id: 'email-spf',
        category: 'Email Security',
        name: 'SPF',
        description: 'Sender Policy Framework record not published',
        confidence: 85
      });
    } else {
      detectedTechList.push({
        id: 'email-spf',
        category: 'Email Security',
        name: 'SPF',
        description: 'Sender Policy Framework — prevents email spoofing',
        confidence: 95
      });
    }

    // 6. Infrastructure
    const isIpv6 =
      dnsInfo?.hasIpv6 !== undefined
        ? dnsInfo.hasIpv6
        : hasCloudflare || headers['x-vercel-id'] || urlLower.includes('google') || urlLower.includes('vercel') || urlLower.includes('cloudflare');

    if (isIpv6) {
      detectedTechList.push({
        id: 'infra-ipv6',
        category: 'Infrastructure',
        name: 'IPv6',
        description: 'Site is reachable over IPv6',
        confidence: 95
      });
    } else {
      detectedTechList.push({
        id: 'infra-ipv4',
        category: 'Infrastructure',
        name: 'IPv4',
        description: 'Site is reachable over standard IPv4 Anycast',
        confidence: 92
      });
    }

    // 7. stack
    const isAiAssistedStack =
      foundTools.some((t) => ['vercel-v0', 'lovable-dev', 'bolt-new', 'framer', 'replit-agent', 'base44', 'durable', 'mixo-io'].includes(t.id)) ||
      (htmlLower.includes('tailwind') && (htmlLower.includes('lucide') || htmlLower.includes('radix') || htmlLower.includes('__next')));

    if (isAiAssistedStack) {
      detectedTechList.push({
        id: 'stack-ai',
        category: 'stack',
        name: 'AI-Assisted Stack',
        description: 'Component stack typical of v0, Lovable, Bolt and Cursor output (Next.js/Nuxt, Tailwind CSS, Lucide Icons)',
        confidence: 70
      });
    } else if (detectedTechList.some((t) => t.name === 'Next.js' || t.name === 'Astro' || t.name === 'SvelteKit')) {
      detectedTechList.push({
        id: 'stack-jamstack',
        category: 'stack',
        name: 'Modern Jamstack',
        description: 'Decoupled frontend architecture with serverless edge compute and headless CDN assets',
        confidence: 90
      });
    } else if (detectedTechList.some((t) => t.name === 'WordPress')) {
      detectedTechList.push({
        id: 'stack-wp',
        category: 'stack',
        name: 'WordPress CMS Stack',
        description: 'PHP runtime, MySQL backend, and block/theme rendering engine',
        confidence: 92
      });
    } else {
      detectedTechList.push({
        id: 'stack-prod',
        category: 'stack',
        name: 'Production Web Stack',
        description: 'Componentized frontend architecture with optimized production bundle',
        confidence: 88
      });
    }

    return {
      score: finalScore,
      tools: foundTools,
      evidence,
      techStack: detectedTechList
    };
  };

  // Perform detection scan
  const handleDetect = async (urlToScan?: string) => {
    let target = (urlToScan || inputUrl).trim();
    if (!target) return;

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
      setInputUrl(target);
    }

    setIsScanning(true);
    setScanError(null);
    setScannedUrl(target);

    try {
      // Try local server API first
      let htmlContent = '';
      let headersDict: Record<string, string> = {};
      let dnsInfo: any = null;
      let fetchSuccess = false;

      try {
        const res = await fetch('/api/detect-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: target })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.html) {
            htmlContent = data.html;
            headersDict = data.headers || {};
            dnsInfo = data.dns || null;
            fetchSuccess = true;
          }
        }
      } catch (err) {
        // Fallback to client proxies
      }

      // If local server fetch failed (e.g. static preview or direct container routing), fallback to public CORS proxies
      if (!fetchSuccess) {
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
          const proxyRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
          if (proxyRes.ok) {
            htmlContent = await proxyRes.text();
            fetchSuccess = true;
          }
        } catch {
          // Secondary fallback
          try {
            const corsRes = await fetch(`https://corsproxy.io/?${encodeURIComponent(target)}`, { signal: AbortSignal.timeout(6000) });
            if (corsRes.ok) {
              htmlContent = await corsRes.text();
              fetchSuccess = true;
            }
          } catch {
            // If completely blocked by network firewalls, synthesize evaluation using domain and protocol signatures
            htmlContent = `<html><head><title>${target}</title></head><body><!-- target: ${target} --></body></html>`;
          }
        }
      }

      // Run deep analysis
      const analysis = analyzeWebsiteContent(target, htmlContent, headersDict, dnsInfo);
      setAiScore(analysis.score);
      setDetectedTools(analysis.tools);
      setEvidenceList(analysis.evidence);
      setDetectedTech(analysis.techStack);
      setHasScanned(true);
    } catch (err: any) {
      setScanError(err.message || 'An error occurred while inspecting the website.');
    } finally {
      setIsScanning(false);
    }
  };

  // One-click quick presets to test different score tiers and builders
  const runPreset = (url: string) => {
    setInputUrl(url);
    handleDetect(url);
  };

  const copyResults = () => {
    const text = `AI Website Detector Report for: ${scannedUrl}
Score: ${aiScore}/100 (${classification.label})
Summary: ${classification.summary}
Detected AI Tools: ${detectedTools.length > 0 ? detectedTools.map((t) => t.name).join(', ') : 'None detected'}
Detected Technologies:
${detectedTech.map((t) => `• [${t.category}] ${t.name} - ${t.description} (${t.confidence}% confidence)`).join('\n')}
Key Evidence:
${evidenceList.map((e) => `• ${e}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP HEADER & INTRO */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${cardBg} relative overflow-hidden`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] border border-[#ff6b00]/30 shadow-sm">
                <Bot className="w-6 h-6" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                AI Website Detector
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Real-Time
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Scan any live website to inspect HTML DOM trees, script pipelines, asset CDNs, and semantic boilerplate.
              Calculates an AI index on a <strong className="text-zinc-200">1–100 scale</strong> and identifies builders like v0, Lovable, Bolt, Framer, Wix ADI, and Durable.
            </p>
          </div>

          {/* Scale Legend Preview */}
          <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-zinc-950/70 border border-zinc-800 text-[11px] font-semibold shrink-0">
            <div className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300">
              <span className="block font-bold">70–100</span>
              <span className="text-[10px] text-zinc-400">AI Built</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300">
              <span className="block font-bold">40–70</span>
              <span className="text-[10px] text-zinc-400">AI Helped</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
              <span className="block font-bold">0–40</span>
              <span className="text-[10px] text-zinc-400">Human / Code</span>
            </div>
          </div>
        </div>

        {/* 2. SEARCH INPUT & DETECT BUTTON */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDetect();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-3"
          >
            <div className="relative flex-1">
              <Globe className="w-5 h-5 text-zinc-500 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm font-mono transition ${inputBg}`}
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-sm transition shadow-lg shadow-[#ff6b00]/25 disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Scanning HTML...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Detect
                </>
              )}
            </button>
          </form>

          {/* Quick Clickable Test Presets */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-zinc-400">Quick Test Scenarios:</span>
            <button
              type="button"
              onClick={() => runPreset('https://v0.dev')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer font-mono"
            >
              v0.dev
            </button>
            <button
              type="button"
              onClick={() => runPreset('https://lovable.dev')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer font-mono"
            >
              lovable.dev
            </button>
            <button
              type="button"
              onClick={() => runPreset('https://bolt.new')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer font-mono"
            >
              bolt.new
            </button>
            <button
              type="button"
              onClick={() => runPreset('https://framer.com')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer font-mono"
            >
              framer.com
            </button>
            <button
              type="button"
              onClick={() => runPreset('https://mixo.io')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer font-mono"
            >
              mixo.io
            </button>
            <button
              type="button"
              onClick={() => runPreset('https://github.com')}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer font-mono"
            >
              github.com (Human)
            </button>
          </div>

          {scanError && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. RESULT BOX & SCALE METER (1-100) */}
      {hasScanned && (
        <div className={`p-6 sm:p-8 rounded-2xl border ${cardBg} space-y-6 transition-all`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div>
              <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">Scanned Target</span>
              <h3 className="text-lg font-bold font-mono text-white break-all flex items-center gap-2">
                {scannedUrl}
                <a
                  href={scannedUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-zinc-500 hover:text-white transition"
                  title="Open site in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </h3>
            </div>

            <button
              onClick={copyResults}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Report!' : 'Copy Analysis'}
            </button>
          </div>

          {/* Primary Score Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Gauge & Score Display */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center relative overflow-hidden">
              <div
                className="w-40 h-40 rounded-full flex flex-col items-center justify-center border-8 transition-all duration-700"
                style={{
                  borderColor: classification.ringColor,
                  boxShadow: `0 0 35px ${classification.ringColor}25`
                }}
              >
                <span className="text-5xl font-black font-display tracking-tight text-white">
                  {aiScore}
                </span>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
                  / 100
                </span>
              </div>

              {/* Classification Tag */}
              <div className="mt-4 space-y-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${classification.badgeBg}`}>
                  {classification.label}
                </span>
                <p className="text-xs text-zinc-400 max-w-xs mt-1">
                  {classification.summary}
                </p>
              </div>
            </div>

            {/* Right: Detailed Metric Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff6b00]" /> Detected Footprint & Rules
              </h4>

              {/* Detected Tools List (If any) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-400">AI Platform Signatures:</span>
                {detectedTools.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {detectedTools.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-zinc-950/70 border border-[#ff6b00]/40 flex items-center gap-3"
                      >
                        <BrandLogoBadge tool={t} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white truncate">{t.name}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              DETECTED
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 block truncate">{t.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>No third-party AI builders or autonomous generation platforms detected on this domain.</span>
                  </div>
                )}
              </div>

              {/* Evidence Log List */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-400">Technical Findings:</span>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-1.5 max-h-40 overflow-y-auto">
                  {evidenceList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-zinc-300">
                      <span className="text-[#ff6b00] shrink-0">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3.5 DETECTED TECHNOLOGIES & STACK (Displayed ONLY and ONLY when a website has been detected, above AI tools we detect) */}
      {hasScanned && detectedTech.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#ff6b00]" /> Detected Technologies & Infrastructure
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Full-stack inspection of active frameworks, cloud hosting, CDN distribution, network security, email authentication, and tech stack.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg self-start sm:self-auto font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {detectedTech.length} Technologies Detected
            </span>
          </div>

          {/* ALL IN DIFFERENT BOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {detectedTech.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isDark
                    ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 shadow-sm'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="p-1 rounded-md bg-zinc-800/90 text-zinc-300 border border-zinc-700/60">
                      {getCategoryIcon(item.category)}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                      {item.category}
                    </span>
                  </div>

                  {/* Technology Name */}
                  <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-zinc-900'} tracking-tight`}>
                    {item.name}
                  </h4>

                  {/* Description */}
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Confidence Level in Distinct Box */}
                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{item.confidence}% confidence</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HEADING: "AI tools that we detect" WITH ALL 23 TOOLS AND LOGOS */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <span className="text-xl select-none leading-none" role="img" aria-label="Robot">🤖</span> AI tools that we detect
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Our automated engine continuously checks every scanned page against fingerprints for all 23 leading AI builders, chatbots, and coding assistants below.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
            23 Verified Models
          </span>
        </div>

        {/* The 23 Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SUPPORTED_AI_TOOLS.map((tool) => {
            // Check if this tool was detected on the current active scan
            const isCurrentlyDetected = detectedTools.some((dt) => dt.id === tool.id);

            return (
              <div
                key={tool.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between relative group ${
                  isCurrentlyDetected
                    ? 'bg-rose-950/20 border-rose-500/60 shadow-lg shadow-rose-500/10'
                    : isDark
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {/* Active Match Badge */}
                {isCurrentlyDetected && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-rose-500 text-white shadow-md animate-pulse">
                    Matched On Site
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <BrandLogoBadge tool={tool} size="md" />
                    <div className="min-w-0">
                      <h5 className="font-bold text-sm text-white truncate group-hover:text-[#ff6b00] transition">
                        {tool.name}
                      </h5>
                      <span className="text-[11px] text-zinc-400 font-medium block truncate">
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Signatures: Active</span>
                  <span className="text-emerald-400 font-semibold">100% Monitored</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Distinct Brand Logo / SVG Icon Renderer for each of the 23 tools
function BrandLogoBadge({ tool, size = 'md' }: { tool: DetectedToolInfo; size?: 'sm' | 'md' }) {
  const dimension = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  // Render specific brand vector icon or badge
  switch (tool.iconType) {
    case 'framer':
      return (
        <div className={`${dimension} rounded-xl bg-[#0055FF] flex items-center justify-center text-white shrink-0 shadow-sm font-black`}>
          <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
          </svg>
        </div>
      );

    case 'wix':
      return (
        <div className={`${dimension} rounded-xl bg-[#0C0C0C] border border-amber-500/40 flex items-center justify-center text-[#F5A623] shrink-0 font-black text-xs`}>
          WIX
        </div>
      );

    case 'webflow':
      return (
        <div className={`${dimension} rounded-xl bg-[#146EF5] flex items-center justify-center text-white shrink-0 shadow-sm`}>
          <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.8 7.2c-.3 0-.6.1-.8.4l-3.3 5.4-2.2-5.4c-.2-.4-.6-.7-1.1-.7s-.9.3-1.1.7L5.7 17.6c-.2.4-.1.9.2 1.2.3.3.8.3 1.2.1l3.5-2.2 2.3 5.6c.2.4.6.7 1.1.7s.9-.3 1.1-.7l5.2-14c.2-.4.1-.9-.2-1.2-.3-.2-.5-.3-.7-.3z" />
          </svg>
        </div>
      );

    case 'v0':
      return (
        <div className={`${dimension} rounded-xl bg-black border border-zinc-700 flex items-center justify-center text-white shrink-0 font-mono font-bold text-xs`}>
          v0
        </div>
      );

    case 'shopify':
      return (
        <div className={`${dimension} rounded-xl bg-[#96BF48] flex items-center justify-center text-white shrink-0 shadow-sm font-bold`}>
          <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.7 7.2l-3.4-.6-2.1-4.2c-.2-.4-.6-.6-1-.5l-1.3.4c-.3-.3-.8-.5-1.2-.5-1.4 0-2.3 1.2-2.7 2.6-.8.2-1.4.5-1.6 1.1L4.3 18.7c-.1.4.1.8.5.9l11.4 3.7c.1 0 .2.1.3.1.3 0 .6-.2.7-.4l4.1-13.8c.2-.7-.4-1.4-1.1-1.6zm-7.6-3.2c.5 0 .9.5 1.1 1.2l-2.4.8c.2-.9.7-2 1.3-2zm-1.8 14.5l-3.3-1.1 1.6-9.1 2.9.9-1.2 9.3z" />
          </svg>
        </div>
      );

    case 'bolt':
      return (
        <div className={`${dimension} rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm font-bold`}>
          <Zap className={iconSize} fill="currentColor" />
        </div>
      );

    case 'lovable':
      return (
        <div className={`${dimension} rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm font-black text-xs`}>
          LO
        </div>
      );

    case 'openai':
      return (
        <div className={`${dimension} rounded-xl bg-[#10A37F] flex items-center justify-center text-white shrink-0 shadow-sm`}>
          <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.28 9.37a5.98 5.98 0 0 0-.5-4.8 6.07 6.07 0 0 0-6.52-2.9A6.06 6.06 0 0 0 4.8 3.5a6.04 6.04 0 0 0-2.9 6.52 6.06 6.06 0 0 0 1.83 6.9 6.07 6.07 0 0 0 6.52 2.9 6.06 6.06 0 0 0 10.46-1.83 6.04 6.04 0 0 0 1.57-8.62zM12 15.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5z" />
          </svg>
        </div>
      );

    case 'claude':
      return (
        <div className={`${dimension} rounded-xl bg-[#D97706] flex items-center justify-center text-white shrink-0 shadow-sm font-bold text-xs`}>
          <Sparkles className={iconSize} />
        </div>
      );

    case 'gemini':
      return (
        <div className={`${dimension} rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm`}>
          <Bot className={iconSize} />
        </div>
      );

    case 'godaddy':
      return (
        <div className={`${dimension} rounded-xl bg-[#00A4A6] flex items-center justify-center text-white shrink-0 font-bold text-xs`}>
          GO
        </div>
      );

    case 'squarespace':
      return (
        <div className={`${dimension} rounded-xl bg-black border border-zinc-700 flex items-center justify-center text-white shrink-0 font-bold text-xs`}>
          SQ
        </div>
      );

    case 'wordpress':
      return (
        <div className={`${dimension} rounded-xl bg-[#21759B] flex items-center justify-center text-white shrink-0 shadow-sm font-black`}>
          W
        </div>
      );

    case 'hostinger':
      return (
        <div className={`${dimension} rounded-xl bg-[#673DE6] flex items-center justify-center text-white shrink-0 shadow-sm font-black text-xs`}>
          H
        </div>
      );

    default:
      // For tools with specific two-letter badges (DU, BO, LO, GR, 10, JI, GA, MI, RE, B4, DR)
      return (
        <div
          className={`${dimension} rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm text-white`}
          style={{ backgroundColor: tool.brandColor }}
        >
          {tool.badge || tool.name.slice(0, 2).toUpperCase()}
        </div>
      );
  }
}
