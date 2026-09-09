import React, { useState } from 'react';
import { AiWebsiteDetector } from './AiWebsiteDetector';
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Smile,
  Frown,
  Meh,
  Send,
  Code,
  FileText,
  Key,
  Wand2,
  Sliders,
  Palette,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AiToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const AiTools: React.FC<AiToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. AI Text Summarizer
  const [sumInput, setSumInput] = useState<string>(
    'Artificial intelligence and cryptographic privacy tools have converged to provide zero-knowledge computing environments. Rather than sending plaintext queries across cloud servers, decentralized zero-latency utilities run mathematical transformations locally on client devices. This architecture completely prevents server-side tracking, database breaches, and unauthorized surveillance while retaining instant responsiveness.'
  );
  const [sumLength, setSumLength] = useState<'bullets' | 'brief' | 'tldr'>('bullets');
  const [summaryOutput, setSummaryOutput] = useState<string>(
    '• Decentralized, zero-latency utilities run computations directly on client devices.\n• Local processing eliminates server-side data leaks, tracking, and latency bottlenecks.'
  );
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = () => {
    setIsSummarizing(true);
    setTimeout(() => {
      const sentences = sumInput
        .split(/[.?!]\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10);

      if (sentences.length === 0) {
        setSummaryOutput('Please enter at least one complete sentence to summarize.');
        setIsSummarizing(false);
        return;
      }

      if (sumLength === 'tldr') {
        setSummaryOutput(`TL;DR: ${sentences[0]}${sentences[0].endsWith('.') ? '' : '.'}`);
      } else if (sumLength === 'brief') {
        const brief = sentences.slice(0, Math.min(2, sentences.length)).join('. ') + '.';
        setSummaryOutput(brief);
      } else {
        // Bullets
        const bullets = sentences
          .slice(0, Math.min(4, sentences.length))
          .map((s) => `• ${s.replace(/^[•\-\*\s]+/, '')}${s.endsWith('.') ? '' : '.'}`)
          .join('\n');
        setSummaryOutput(bullets);
      }
      setIsSummarizing(false);
    }, 250);
  };

  // 2. AI Paraphraser
  const [paraInput, setParaInput] = useState<string>(
    'Our team is dedicated to building the most intuitive and secure web tool suite on the internet.'
  );
  const [paraTone, setParaTone] = useState<'Formal' | 'Casual' | 'Concise' | 'Creative' | 'Technical'>('Formal');
  const [paraOutput, setParaOutput] = useState<string>(
    'Our engineering group remains committed to developing the web’s most reliable, intuitive, and hardened utility platform.'
  );

  const handleParaphrase = (tone = paraTone) => {
    const text = paraInput.trim();
    if (!text) {
      setParaOutput('Please enter text to paraphrase.');
      return;
    }

    if (tone === 'Formal') {
      setParaOutput(
        text
          .replace(/I am|I'm/gi, 'The undersigned is')
          .replace(/We are|We're/gi, 'Our organization remains')
          .replace(/good|great|cool/gi, 'exceptional')
          .replace(/help|helps/gi, 'facilitates')
          .replace(/fix|fixes/gi, 'remediates')
          .replace(/fast|quick/gi, 'expeditious') + ' Furthermore, all deliverables adhere strictly to operational standards.'
      );
    } else if (tone === 'Casual') {
      setParaOutput(
        text
          .replace(/dedicated to/gi, 'all about')
          .replace(/intuitive and secure/gi, 'super smooth and rock-solid')
          .replace(/internet/gi, 'web') + ' Honestly, it makes life so much easier.'
      );
    } else if (tone === 'Concise') {
      const words = text.split(' ');
      const shortened = words.slice(0, Math.max(5, Math.floor(words.length * 0.65))).join(' ');
      setParaOutput(shortened + (shortened.endsWith('.') ? '' : '.'));
    } else if (tone === 'Creative') {
      setParaOutput(
        `Crafted with precision, ${text.toLowerCase()} — transforming everyday friction into pure effortless velocity.`
      );
    } else if (tone === 'Technical') {
      setParaOutput(
        `System baseline: ${text} Architecture enforces strict zero-latency client-side execution boundaries.`
      );
    }
  };

  // 3. AI Grammar Checker
  const [gramText, setGramText] = useState<string>(
    'Their is alot of tools here that helps developers fix they code.'
  );
  const [correctedText, setCorrectedText] = useState<string>(
    'There are a lot of tools here that help developers fix their code.'
  );
  const [detectedIssues, setDetectedIssues] = useState<Array<{ wrong: string; right: string; reason: string }>>([
    { wrong: 'Their', right: 'There', reason: 'Possessive vs. expletive adverb' },
    { wrong: 'alot', right: 'a lot', reason: 'Two separate words' },
    { wrong: 'helps', right: 'help', reason: 'Subject-verb agreement (plural tools)' },
    { wrong: 'they', right: 'their', reason: 'Possessive pronoun required' }
  ]);

  const handleCheckGrammar = () => {
    let corrected = gramText;
    const issues: Array<{ wrong: string; right: string; reason: string }> = [];

    const typoRules = [
      { pattern: /\btheir is\b/gi, right: 'there is', reason: 'Incorrect homophone (use "there is")' },
      { pattern: /\bthere is a lot of tools\b/gi, right: 'there are a lot of tools', reason: 'Subject-verb agreement' },
      { pattern: /\btheir are\b/gi, right: 'there are', reason: 'Incorrect homophone' },
      { pattern: /\balot\b/gi, right: 'a lot', reason: 'Spelling error (must be two words)' },
      { pattern: /\bteh\b/gi, right: 'the', reason: 'Common typo' },
      { pattern: /\brecieve\b/gi, right: 'receive', reason: 'I before E except after C' },
      { pattern: /\bseperate\b/gi, right: 'separate', reason: 'Spelling error' },
      { pattern: /\buntill\b/gi, right: 'until', reason: 'Single L spelling' },
      { pattern: /\bthey code\b/gi, right: 'their code', reason: 'Possessive adjective required' },
      { pattern: /\bhelps developers\b/gi, right: 'help developers', reason: 'Plural verb agreement' },
      { pattern: /\byour welcome\b/gi, right: "you're welcome", reason: 'Contraction of "you are"' },
      { pattern: /\bits a\b/gi, right: "it's a", reason: 'Contraction of "it is"' }
    ];

    typoRules.forEach((rule) => {
      const match = gramText.match(rule.pattern);
      if (match) {
        match.forEach((m) => {
          issues.push({ wrong: m, right: rule.right, reason: rule.reason });
          corrected = corrected.replace(new RegExp(m, 'g'), rule.right);
        });
      }
    });

    if (issues.length === 0) {
      // Capitalize first letter and check ending punctuation
      if (corrected.length > 0 && !corrected.endsWith('.') && !corrected.endsWith('!') && !corrected.endsWith('?')) {
        corrected += '.';
        issues.push({ wrong: 'Missing end punctuation', right: '.', reason: 'Sentence punctuation' });
      }
    }

    setCorrectedText(corrected);
    setDetectedIssues(issues.length > 0 ? issues : [{ wrong: 'None', right: 'Text is Clean', reason: 'No obvious syntax or spelling faults detected' }]);
  };

  // 4. AI Code Explainer
  const [codeSnippet, setCodeSnippet] = useState<string>(
    'const memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n};'
  );
  const [codeLang, setCodeLang] = useState<string>('JavaScript');
  const [codeExplanation, setCodeExplanation] = useState<{
    summary: string;
    points: string[];
    complexity: string;
  }>({
    summary: 'Higher-order memoization wrapper utilizing an in-memory Map cache to eliminate redundant computations.',
    points: [
      'Encapsulates a persistent key-value `Map` in a JavaScript closure.',
      'Serializes incoming function arguments via `JSON.stringify(args)` as the hash key.',
      'Performs O(1) cache lookup; returns precomputed value if found, avoiding heavy re-execution.',
      'Executes source function on cache misses and stores result before returning.'
    ],
    complexity: 'Time: O(1) on cache hit, O(f(n)) on miss. Space: O(k) entries stored in memory.'
  });

  const handleExplainCode = () => {
    const lines = codeSnippet.split('\n').filter((l) => l.trim().length > 0);
    const hasMap = codeSnippet.includes('Map') || codeSnippet.includes('cache') || codeSnippet.includes('dict');
    const hasAsync = codeSnippet.includes('async') || codeSnippet.includes('await') || codeSnippet.includes('Promise');
    const hasLoop = codeSnippet.includes('for') || codeSnippet.includes('while') || codeSnippet.includes('.map(') || codeSnippet.includes('.forEach(');
    const hasFetch = codeSnippet.includes('fetch') || codeSnippet.includes('http') || codeSnippet.includes('axios');

    const points: string[] = [];
    let summary = `Analyzed ${lines.length} lines of ${codeLang} code.`;

    if (hasAsync) {
      summary = `Asynchronous ${codeLang} routine coordinating non-blocking concurrent operations.`;
      points.push('Handles async execution with promises/await pattern to prevent UI or thread blocking.');
    } else if (hasMap) {
      summary = `Stateful caching/lookup routine in ${codeLang} storing key-value pairs for rapid retrieval.`;
      points.push('Maintains an indexed key-value mapping to achieve rapid amortized O(1) query speeds.');
    } else if (hasLoop) {
      summary = `Iterative processing pipeline transforming sequential collections of data elements.`;
      points.push('Iterates across dataset elements applying inline transformations or accumulator filters.');
    } else {
      summary = `Modular ${codeLang} utility function executing deterministic transformations on inputs.`;
      points.push('Pure or modular function receiving input parameters and producing standardized outputs.');
    }

    if (hasFetch) {
      points.push('Dispatches network HTTP/REST requests and parses outbound responses.');
    }
    points.push(`Contains ${lines.length} non-empty lines with clean syntactic formatting.`);

    setCodeExplanation({
      summary,
      points,
      complexity: hasLoop ? 'Time: O(n) linear complexity over input collections. Space: O(n) buffer allocations.' : 'Time: O(1) constant time execution. Space: O(1) minimal auxiliary memory.'
    });
  };

  // 5. AI Prompt Generator (System Prompt Engineer)
  const [promptTopic, setPromptTopic] = useState<string>('Full-Stack Web Architecture Audit');
  const [promptPersona, setPromptPersona] = useState<string>('Staff Cybersecurity Architect');
  const [outputStyle, setOutputStyle] = useState<string>('Structured Markdown with Priorities');
  const [craftedPrompt, setCraftedPrompt] = useState<string>(
    'Act as a Principal Cloud Architect and Staff Cybersecurity Auditor. Conduct a comprehensive security and latency review of the following architecture diagram and tech stack. Identify potential OWASP top 10 vulnerabilities, single points of failure, bottlenecked database queries, and caching deficiencies. Provide prioritized remediation recommendations ranked by risk severity.'
  );

  const handleCraftPrompt = () => {
    const topic = promptTopic.trim() || 'Software Engineering Review';
    const crafted = `You are a world-class ${promptPersona} with deep domain expertise in ${topic}.

# Core Mission & Objective
Your task is to analyze, execute, and deliver optimal solutions for: "${topic}".

# Operational Guidelines & Rules
1. Maintain rigorous technical depth and precision; do not use conversational filler, generic marketing buzzwords, or hand-wavy suggestions.
2. Provide concrete, copy-pasteable code implementations or specific mathematical proofs whenever applicable.
3. Identify potential edge cases, failure modes, security attack surfaces, and performance bottlenecks upfront.
4. Adhere strictly to the requested output format: ${outputStyle}.

# Response Format
- Executive Brief (1-2 sentences)
- Core Analysis & Root Diagnostics
- Concrete Implementation / Action Plan
- Key Caveats & Edge Cases`;

    setCraftedPrompt(crafted);
  };

  // 6. AI IMAGE PROMPT GENERATOR
  const [imgTheme, setImgTheme] = useState<string>('Cyberpunk Tokyo Night Market');
  const [imgStyle, setImgStyle] = useState<string>('Photorealistic 8K');
  const [imgLighting, setImgLighting] = useState<string>('Moody Neon & Wet Asphalt Reflections');
  const [imgCamera, setImgCamera] = useState<string>('35mm Lens, f/1.4 Bokeh');
  const [imgEngine, setImgEngine] = useState<string>('Midjourney v6.0');
  const [imgAspectRatio, setImgAspectRatio] = useState<string>('16:9');
  const [isGeneratingImgPrompt, setIsGeneratingImgPrompt] = useState(false);
  const [promptSeed, setPromptSeed] = useState<number>(() => Math.floor(Math.random() * 899999) + 100000);
  const [generationCount, setGenerationCount] = useState(1);
  const [imgPrompt, setImgPrompt] = useState<string>(
    'Photorealistic 8k cinematic shot of Cyberpunk Tokyo Night Market. Wet asphalt reflecting vivid orange and cyan holographic billboards, steam rising from street food vendor stalls, hyper-detailed textures, volumetric haze, shot on 35mm lens, f/1.4 aperture, cinematic color grading, Unreal Engine 5 render style --ar 16:9 --v 6.0 --stylize 750 --seed 482910'
  );
  const [sdNegativePrompt, setSdNegativePrompt] = useState<string>(
    'blurry, low quality, distorted anatomy, extra limbs, watermark, signature, oversaturated, deformed face, bad eyes, cartoonish'
  );
  const [promptUpdatedBadge, setPromptUpdatedBadge] = useState(false);

  const imagePresets = [
    'Cyberpunk Tokyo Night Market',
    'Surreal Floating Island with Ancient Tree of Life',
    'Macro Raindrop on Luminescent Orchid Petal',
    'Futuristic Mecha Hangar Under Maintenance',
    'Hyperrealistic Portrait of Arctic Fox in Blizzard',
    'Isometric 3D Cozy Library with Warm Fireplace',
    'Astronaut Stargazing on Edge of Nebula',
    '1970s Vintage Muscle Car in Dusty Mojave Sunset'
  ];

  const handleGenerateImagePrompt = (
    themeOverride?: string,
    styleOverride?: string,
    lightingOverride?: string,
    cameraOverride?: string,
    engineOverride?: string,
    aspectOverride?: string
  ) => {
    setIsGeneratingImgPrompt(true);

    const activeTheme = (themeOverride ?? imgTheme).trim() || 'Ethereal Cybernetic Horizon';
    const activeStyle = styleOverride ?? imgStyle;
    const activeLighting = lightingOverride ?? imgLighting;
    const activeCamera = cameraOverride ?? imgCamera;
    const activeEngine = engineOverride ?? imgEngine;
    const activeAspect = aspectOverride ?? imgAspectRatio;

    if (themeOverride && themeOverride !== imgTheme) {
      setImgTheme(themeOverride);
    }

    const newSeed = Math.floor(Math.random() * 899999) + 100000;
    setPromptSeed(newSeed);
    setGenerationCount((prev) => prev + 1);

    // Dynamic atmospheric modifiers for fresh creative variations on every click
    const atmosphericModifiers = [
      'volumetric god rays, atmospheric haze, ray-traced reflections, octane render',
      'cinematic depth of field, hyper-detailed surface micro-textures, 8k uhd',
      'subsurface scattering, subtle airborne particulates, masterpiece composition',
      'anamorphic lens flare, award-winning cinematography, pristine focal clarity',
      'dramatic tonal range, golden ratio composition, filmic grain texture',
      'unreal engine 5 lumen lighting, global illumination, photorealistic detail'
    ];
    const randomModifier = atmosphericModifiers[Math.floor(Math.random() * atmosphericModifiers.length)];
    const stylizeValue = Math.floor(Math.random() * 350) + 600; // 600 - 950

    let promptResult = '';

    if (activeEngine === 'Midjourney v6.0') {
      promptResult = `${activeTheme}, ${activeStyle.toLowerCase()} aesthetic, illuminated by ${activeLighting.toLowerCase()}, captured on ${activeCamera.toLowerCase()}, ${randomModifier}, masterwork --ar ${activeAspect} --v 6.0 --stylize ${stylizeValue} --seed ${newSeed}`;
    } else if (activeEngine === 'Stable Diffusion XL') {
      promptResult = `(masterpiece:1.2), best quality, ultra-detailed, ${activeTheme}, ${activeStyle}, ${activeLighting}, ${activeCamera}, ${randomModifier}, sharp focus, trending on ArtStation, seed: ${newSeed}`;
    } else if (activeEngine === 'Flux.1 Dev') {
      promptResult = `A cinematic, ultra-high-definition photograph of ${activeTheme}. Rendered in ${activeStyle} aesthetic, framed by ${activeLighting} and shot on ${activeCamera}. Features ${randomModifier}. Flawless composition and pristine visual clarity, seed: ${newSeed}`;
    } else {
      // DALL-E 3 / Unreal
      promptResult = `A hyper-detailed 3D render of ${activeTheme}. Style: ${activeStyle}. Atmosphere and environment feature ${activeLighting}, framed through ${activeCamera}. ${randomModifier}. Rendered with Octane Render shaders, global illumination, and high dynamic range.`;
    }

    // Dynamic negative prompt tailored to engine
    if (activeEngine === 'Stable Diffusion XL' || activeEngine === 'Flux.1 Dev') {
      const negAdditions = ['bad hands, missing fingers, extra digits', 'jpeg artifacts, blur, cropped', 'mutated anatomy, lowres'];
      const randomNeg = negAdditions[Math.floor(Math.random() * negAdditions.length)];
      setSdNegativePrompt(`blurry, low quality, distorted anatomy, extra limbs, watermark, signature, oversaturated, deformed face, bad eyes, cartoonish, ${randomNeg}`);
    }

    setTimeout(() => {
      setImgPrompt(promptResult);
      setIsGeneratingImgPrompt(false);
      setPromptUpdatedBadge(true);
      setTimeout(() => setPromptUpdatedBadge(false), 2500);
    }, 180);
  };

  const handleRandomizeImagePrompt = () => {
    const randomTheme = imagePresets[Math.floor(Math.random() * imagePresets.length)];
    const styles = [
      'Photorealistic 8K',
      'Cyberpunk / Synthwave',
      'Anime / Makoto Shinkai',
      'Dark Fantasy / Elden Ring',
      'Unreal Engine 5 Render',
      '3D Isometric Clay',
      'Oil Painting on Canvas'
    ];
    const lightings = [
      'Volumetric Golden Hour Sunbeams',
      'Moody Neon & Wet Asphalt Reflections',
      'Studio Softbox Dual-Tone',
      'Bioluminescent Ethereal Glow',
      'Dramatic Chiaroscuro Rim Light',
      'Dark Moody Film Noir'
    ];
    const cameras = [
      '35mm Lens, f/1.4 Bokeh',
      'Wide-Angle 16mm Panoramic',
      'Macro 100mm Extreme Detail',
      'Cinematic Anamorphic 2.39:1',
      'Aerial Drone Perspective',
      '85mm Portrait Studio'
    ];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomLighting = lightings[Math.floor(Math.random() * lightings.length)];
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];

    setImgTheme(randomTheme);
    setImgStyle(randomStyle);
    setImgLighting(randomLighting);
    setImgCamera(randomCamera);

    handleGenerateImagePrompt(randomTheme, randomStyle, randomLighting, randomCamera);
  };

  // 7. AI Sentiment Analysis
  const [sentimentText, setSentimentText] = useState<string>(
    'This tool suite is ridiculously fast, remarkably polished, and respects my privacy completely. Absolute game changer!'
  );
  const getSentiment = (text: string) => {
    const lower = text.toLowerCase();
    const positiveWords = ['fast', 'polished', 'game changer', 'great', 'love', 'amazing', 'respects', 'best', 'super', 'awesome', 'secure', 'flawless', 'clean', 'excellent', 'helpful', 'intuitive'];
    const negativeWords = ['slow', 'bad', 'broken', 'error', 'hate', 'terrible', 'worst', 'clunky', 'buggy', 'awful', 'annoying', 'useless', 'horrible', 'crash'];
    let score = 0;
    positiveWords.forEach((w) => { if (lower.includes(w)) score += 2; });
    negativeWords.forEach((w) => { if (lower.includes(w)) score -= 2; });

    if (score > 1) return { label: 'Strongly Positive', score: Math.min(99, 75 + score * 5), icon: Smile, color: 'text-emerald-400' };
    if (score < -1) return { label: 'Negative / Critical', score: Math.max(10, 35 + score * 5), icon: Frown, color: 'text-rose-400' };
    return { label: 'Neutral / Balanced', score: 54, icon: Meh, color: 'text-amber-400' };
  };
  const sentiment = getSentiment(sentimentText);

  // 8. AI Text Expander
  const [bulletNotes, setBulletNotes] = useState<string>(
    '- launched v2 update\n- 70+ new tools added\n- zero tracking\n- dark theme by default'
  );
  const [expandedArticle, setExpandedArticle] = useState<string>(
    'We are thrilled to officially announce the release of Reckd v2! This milestone release introduces over 70 new zero-latency web utilities across security, link management, DNS, and privacy domains. Staying true to our core mission, every single tool operates with strict zero-tracking guarantees, offering effortless performance in an eye-safe dark aesthetic.'
  );

  const handleExpandText = () => {
    const lines = bulletNotes
      .split('\n')
      .map((l) => l.replace(/^[-*•\s]+/, '').trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setExpandedArticle('Please provide bullet points to expand into a complete announcement or article.');
      return;
    }

    const titleLead = `Announcement & Comprehensive Overview: ${lines[0]}`;
    const middleSection = lines.slice(1).map((point, idx) => {
      return `Key Focus ${idx + 1}: ${point}. This represents a foundational capability engineered to streamline production workflows while eliminating third-party intermediaries.`;
    }).join(' ');

    const conclusion = `In summary, these developments ensure users retain full sovereign control over their computing workflows with maximal reliability and high-speed responsiveness.`;

    setExpandedArticle(`${titleLead}\n\n${middleSection}\n\n${conclusion}`);
  };

  // 9. AI Email Writer
  const [emailScenario, setEmailScenario] = useState<string>('Request a follow-up meeting after a software demo');
  const [emailRecipient, setEmailRecipient] = useState<string>('Sarah Jenkins');
  const [emailTone, setEmailTone] = useState<string>('Professional');
  const [emailDraft, setEmailDraft] = useState<string>(
    `Subject: Quick Follow-Up: Reckd Platform Demo & Next Steps\n\nHi Sarah,\n\nThank you for taking the time to join our demo session earlier this week. I wanted to follow up and see if any questions arose as your engineering team reviewed our security architecture.\n\nWould you have 15 minutes this Thursday or Friday for a brief call to align on onboarding timelines?\n\nBest regards,\nAlex Vance`
  );

  const handleDraftEmail = () => {
    const scenario = emailScenario.trim() || 'Project check-in';
    const recipient = emailRecipient.trim() || 'Colleague';

    let subject = `Follow-Up: ${scenario}`;
    let body = `Hi ${recipient},\n\n`;

    if (emailTone === 'Professional') {
      subject = `Status Update: ${scenario}`;
      body += `I hope this note finds you well. I am reaching out regarding ${scenario.toLowerCase()}.\n\nCould you kindly share an update on your team's availability this week so we can review the latest milestones and confirm next steps?\n\nThank you for your time and continued collaboration.\n\nBest regards,\nYour Name`;
    } else if (emailTone === 'Urgent') {
      subject = `[URGENT] Action Required: ${scenario}`;
      body += `I hope you are having a productive day. I am writing with urgent priority regarding ${scenario.toLowerCase()}.\n\nWe require feedback or sign-off by end-of-day today to maintain project momentum. Please let me know immediately if you have any questions or blockers.\n\nBest regards,\nYour Name`;
    } else if (emailTone === 'Warm & Friendly') {
      subject = `Quick hello & checking in on ${scenario}!`;
      body += `Hope you're having a wonderful week! Just wanted to quickly circle back on ${scenario.toLowerCase()} and see how things are going on your end.\n\nNo huge rush at all, but let me know whenever you have a free moment to chat.\n\nCheers,\nYour Name`;
    } else {
      // Sales Outreach
      subject = `Idea for your team: ${scenario}`;
      body += `I've been following your recent initiatives and wanted to connect regarding ${scenario.toLowerCase()}.\n\nWe recently helped teams streamline zero-latency developer tooling without introducing cloud dependencies. Would you be open to a brief 10-minute coffee chat next Tuesday?\n\nWarmly,\nYour Name`;
    }

    setEmailDraft(body);
  };

  // 10. AI Keyword Extractor
  const [kwText, setKwText] = useState<string>(
    'Decentralized identity, cryptographic verification, zero-knowledge proofs, and client-side encryption empower users to browse anonymously without leaking tracking telemetry to ad networks.'
  );
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([
    'Client-side encryption', 'Cryptographic verification', 'Decentralized identity', 'Zero-knowledge proofs', 'Anonymous browsing', 'Telemetry protection'
  ]);

  const handleExtractKeywords = () => {
    const stopWords = new Set([
      'the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'was', 'he', 'for', 'it', 'with', 'as', 'his', 'on', 'be', 'at', 'by', 'i', 'this', 'had', 'not', 'are', 'but', 'from', 'or', 'have', 'an', 'they', 'which', 'one', 'you', 'were', 'her', 'all', 'she', 'there', 'would', 'their', 'we', 'him', 'been', 'has', 'when', 'who', 'will', 'more', 'no', 'if', 'out', 'so', 'said', 'what', 'up', 'its', 'about', 'into', 'than', 'them', 'can', 'only', 'other', 'new', 'some', 'could', 'time', 'these', 'two', 'may', 'then', 'do', 'first', 'any', 'my', 'now', 'such', 'like', 'our', 'over', 'me', 'even', 'most', 'made', 'after', 'also', 'did', 'many', 'before', 'must', 'through', 'back', 'years', 'where', 'much', 'your', 'way', 'well', 'down', 'should', 'because', 'each', 'just', 'those', 'people', 'mr', 'how', 'too', 'little', 'state', 'good', 'very', 'make', 'world', 'still', 'own', 'see', 'men', 'work', 'long', 'get', 'here', 'between', 'both', 'life', 'being', 'under', 'never', 'day', 'same', 'another', 'know', 'while', 'last', 'might', 'us', 'great', 'old', 'year', 'off', 'come', 'since', 'against', 'go', 'came', 'right', 'used', 'take', 'three'
    ]);

    const clean = kwText.toLowerCase().replace(/[^a-zA-Z0-9\s-]/g, ' ');
    const tokens = clean.split(/\s+/).filter((t) => t.length > 3 && !stopWords.has(t));

    const freq: Record<string, number> = {};
    tokens.forEach((t) => {
      freq[t] = (freq[t] || 0) + 1;
    });

    // Also look for capitalized phrases from original text
    const capitalized: string[] = kwText.match(/[A-Z][a-zA-Z0-9-]+(?:\s+[A-Z][a-zA-Z0-9-]+)*/g) || [];
    const entityList = Array.from(new Set<string>(capitalized)).filter((e: string) => e.length > 3 && !stopWords.has(e.toLowerCase()));

    const topWords = Object.keys(freq)
      .sort((a, b) => freq[b] - freq[a])
      .slice(0, 8)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1));

    const combined: string[] = Array.from(new Set<string>([...entityList, ...topWords])).slice(0, 10);
    setExtractedKeywords(combined.length > 0 ? combined : ['No Distinct Keywords Found']);
  };

  return (
    <div className="space-y-6">
      {/* 1. AI TEXT SUMMARIZER */}
      {toolId === 'ai-text-summarizer' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold font-display">AI Executive Text Summarizer</h3>
              <p className="text-xs text-zinc-400">Condense lengthy documentation, articles, and research into actionable key takeaways.</p>
            </div>
            <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['bullets', 'brief', 'tldr'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setSumLength(l);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${sumLength === l ? 'bg-[#ff6b00] text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  {l === 'tldr' ? 'TL;DR' : l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Original Document</label>
              <textarea
                rows={7}
                value={sumInput}
                onChange={(e) => setSumInput(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border text-xs ${inputBg}`}
                placeholder="Paste article, technical documentation, or research paper..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400">Key Takeaways</label>
                <button onClick={() => copyToClipboard(summaryOutput, 'sum')} className="text-xs text-[#ff6b00] flex items-center gap-1 hover:underline">
                  {copied === 'sum' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Summary
                </button>
              </div>
              <textarea
                readOnly
                rows={7}
                value={summaryOutput}
                className={`w-full mt-1 p-3 rounded-xl border text-xs bg-zinc-950/80 text-emerald-400 border-zinc-800 whitespace-pre-line font-mono`}
              />
            </div>
          </div>

          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> {isSummarizing ? 'Summarizing...' : 'Summarize Text'}
          </button>
        </div>
      )}

      {/* 2. AI PARAPHRASER */}
      {toolId === 'ai-paraphraser' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">Multi-Tone AI Paraphraser</h3>
              <p className="text-xs text-zinc-400">Rewrite sentences across professional, casual, concise, and creative tones.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['Formal', 'Casual', 'Concise', 'Creative', 'Technical'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setParaTone(t);
                    handleParaphrase(t);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${paraTone === t ? 'bg-[#ff6b00] text-white' : 'border border-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              rows={3}
              value={paraInput}
              onChange={(e) => setParaInput(e.target.value)}
              placeholder="Enter text to paraphrase..."
              className={`w-full p-3 rounded-xl border text-sm ${inputBg}`}
            />

            <button
              onClick={() => handleParaphrase(paraTone)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Paraphrase in {paraTone} Tone
            </button>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                  Rewritten ({paraTone})
                </span>
                <p className="text-sm font-semibold text-white leading-relaxed">{paraOutput}</p>
              </div>
              <button onClick={() => copyToClipboard(paraOutput, 'para')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0 hover:text-white">
                {copied === 'para' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI GRAMMAR CHECKER */}
      {toolId === 'ai-grammar-checker' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">AI Syntax & Grammar Corrector</h3>
          <p className="text-xs text-zinc-400 mb-4">Identify grammatical errors, spelling typos, and pronoun mismatches.</p>

          <textarea
            rows={3}
            value={gramText}
            onChange={(e) => setGramText(e.target.value)}
            placeholder="Type or paste sentences with grammar or spelling issues..."
            className={`w-full p-3 rounded-xl border text-sm ${inputBg} mb-3`}
          />

          <div className="flex gap-3 mb-4">
            <button
              onClick={handleCheckGrammar}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> Scan & Fix Grammar
            </button>
            <button
              onClick={() => {
                setGramText(correctedText);
                copyToClipboard(correctedText, 'gram');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:text-white transition"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Apply & Copy Corrected Text
            </button>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 mb-4">
            <span className="text-[10px] text-zinc-400 uppercase font-bold">Suggested Correction</span>
            <p className="text-sm font-bold text-emerald-400 mt-1">{correctedText}</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400">Issues Detected ({detectedIssues.length}):</span>
            {detectedIssues.map((f, i) => (
              <div key={i} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
                <div>
                  <span className="line-through text-rose-400 mr-2 font-mono">{f.wrong}</span>
                  <span className="font-bold text-emerald-400 mr-2 font-mono">→ {f.right}</span>
                </div>
                <span className="text-zinc-500 text-[11px]">{f.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AI CODE EXPLAINER */}
      {toolId === 'ai-code-explainer' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold font-display">AI Code Explainer & Architecture Breakdown</h3>
              <p className="text-xs text-zinc-400">Break down complex algorithms, closures, and concurrency logic into plain English.</p>
            </div>
            <select
              value={codeLang}
              onChange={(e) => setCodeLang(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${inputBg}`}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="SQL">SQL</option>
              <option value="Rust">Rust</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Source Code</label>
              <textarea
                rows={9}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Paste code snippet to explain..."
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-xs space-y-3 text-zinc-300">
              <div>
                <span className="font-bold text-[#ff6b00] block text-sm mb-1">Architecture Summary:</span>
                <p className="text-white font-medium">{codeExplanation.summary}</p>
              </div>

              <div>
                <span className="font-bold text-zinc-400 block text-xs mb-1">Key Mechanisms:</span>
                <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                  {codeExplanation.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-400">
                {codeExplanation.complexity}
              </div>
            </div>
          </div>

          <button
            onClick={handleExplainCode}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <Code className="w-4 h-4" /> Explain Code Architecture
          </button>
        </div>
      )}

      {/* 5. AI PROMPT GENERATOR */}
      {toolId === 'ai-prompt-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">System Prompt Engineer & Optimizer</h3>
          <p className="text-xs text-zinc-400 mb-4">Transform simple tasks into highly structured few-shot LLM system prompts.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">Task or Domain Topic</label>
              <input
                type="text"
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                placeholder="e.g. Cybersecurity Audit, Rust Memory Safety Tutor, Next.js Architect"
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Persona Role</label>
              <select
                value={promptPersona}
                onChange={(e) => setPromptPersona(e.target.value)}
                className={`w-full mt-1 px-3 py-2.5 rounded-xl border text-xs font-semibold ${inputBg}`}
              >
                <option value="Staff Cybersecurity Architect">Staff Cybersecurity Architect</option>
                <option value="Principal Cloud Architect">Principal Cloud Architect</option>
                <option value="Senior Staff Software Engineer">Senior Staff Software Engineer</option>
                <option value="Executive Marketing Strategist">Executive Marketing Strategist</option>
                <option value="Socratic Coding Tutor">Socratic Coding Tutor</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCraftPrompt}
            className="flex items-center justify-center gap-2 w-full mb-4 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <Wand2 className="w-4 h-4" /> Craft Production System Prompt
          </button>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed flex items-start justify-between gap-3 whitespace-pre-wrap">
            <p className="flex-1">{craftedPrompt}</p>
            <button onClick={() => copyToClipboard(craftedPrompt, 'craft-p')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0 hover:text-white">
              {copied === 'craft-p' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 6. AI IMAGE PROMPT GENERATOR */}
      {toolId === 'ai-image-prompt-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="text-xl font-bold font-display">Midjourney & Diffusion Image Prompt Crafter</h3>
              <p className="text-xs text-zinc-400">Generate lighting parameters, lens settings, artistic styles, aspect ratios, and negative prompts.</p>
            </div>
            <button
              onClick={handleRandomizeImagePrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" /> Surprise Me / Randomize
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-[11px] text-zinc-500 font-bold self-center mr-1">Inspirations:</span>
            {imagePresets.slice(0, 5).map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setImgTheme(preset);
                  handleGenerateImagePrompt(preset);
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-[#ff6b00] hover:border-[#ff6b00]/40 text-[11px] font-medium transition"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Subject & Scene Description</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={imgTheme}
                  onChange={(e) => setImgTheme(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateImagePrompt();
                  }}
                  placeholder="e.g. Cyberpunk Tokyo Night Market, Bioluminescent jellyfish forest..."
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
                />
                <button
                  onClick={() => handleGenerateImagePrompt()}
                  disabled={isGeneratingImgPrompt}
                  className="px-6 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition shrink-0 flex items-center gap-2 shadow-lg shadow-[#ff6b00]/20 disabled:opacity-80 cursor-pointer"
                >
                  <Wand2 className={`w-4 h-4 ${isGeneratingImgPrompt ? 'animate-spin' : ''}`} />
                  {isGeneratingImgPrompt ? 'Crafting Prompt...' : 'Generate Art Prompt'}
                </button>
              </div>
            </div>

            {/* Parameter selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 font-bold block mb-1">Art Style</label>
                <select
                  value={imgStyle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImgStyle(val);
                    handleGenerateImagePrompt(undefined, val, undefined, undefined, undefined, undefined);
                  }}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
                >
                  <option value="Photorealistic 8K">Photorealistic 8K</option>
                  <option value="Cyberpunk / Synthwave">Cyberpunk / Synthwave</option>
                  <option value="Anime / Makoto Shinkai">Anime / Makoto Shinkai</option>
                  <option value="Dark Fantasy / Elden Ring">Dark Fantasy / Elden Ring</option>
                  <option value="Unreal Engine 5 Render">Unreal Engine 5 Render</option>
                  <option value="Minimalist Vector Art">Minimalist Vector Art</option>
                  <option value="Oil Painting on Canvas">Oil Painting on Canvas</option>
                  <option value="3D Isometric Clay">3D Isometric Clay</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-bold block mb-1">Lighting</label>
                <select
                  value={imgLighting}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImgLighting(val);
                    handleGenerateImagePrompt(undefined, undefined, val, undefined, undefined, undefined);
                  }}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
                >
                  <option value="Moody Neon & Wet Asphalt Reflections">Moody Neon & Reflections</option>
                  <option value="Volumetric Golden Hour Sunbeams">Volumetric Golden Hour</option>
                  <option value="Dramatic Chiaroscuro Rim Light">Dramatic Chiaroscuro</option>
                  <option value="Studio Softbox Dual-Tone">Studio Softbox</option>
                  <option value="Bioluminescent Ethereal Glow">Bioluminescent Glow</option>
                  <option value="Dark Moody Film Noir">Dark Film Noir</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-bold block mb-1">Lens & Camera</label>
                <select
                  value={imgCamera}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImgCamera(val);
                    handleGenerateImagePrompt(undefined, undefined, undefined, val, undefined, undefined);
                  }}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
                >
                  <option value="35mm Lens, f/1.4 Bokeh">35mm f/1.4 Bokeh</option>
                  <option value="Wide-Angle 16mm Panoramic">Wide-Angle 16mm</option>
                  <option value="Macro 100mm Extreme Detail">Macro Extreme Detail</option>
                  <option value="Cinematic Anamorphic 2.39:1">Cinematic Anamorphic</option>
                  <option value="Aerial Drone Perspective">Aerial Drone View</option>
                  <option value="85mm Portrait Studio">85mm Portrait Studio</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-bold block mb-1">Target Engine</label>
                <select
                  value={imgEngine}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImgEngine(val);
                    handleGenerateImagePrompt(undefined, undefined, undefined, undefined, val, undefined);
                  }}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
                >
                  <option value="Midjourney v6.0">Midjourney v6.0</option>
                  <option value="Stable Diffusion XL">Stable Diffusion XL</option>
                  <option value="Flux.1 Dev">Flux.1 Dev</option>
                  <option value="DALL-E 3">DALL-E 3</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-bold block mb-1">Aspect Ratio</label>
                <select
                  value={imgAspectRatio}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImgAspectRatio(val);
                    handleGenerateImagePrompt(undefined, undefined, undefined, undefined, undefined, val);
                  }}
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Story / Reel)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Social Post)</option>
                  <option value="21:9">21:9 (Ultrawide)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generated Prompt Output Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" /> Generated Prompt ({imgEngine})
                </span>
                {promptUpdatedBadge && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold animate-pulse">
                    Updated!
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                  Seed #{promptSeed} • Rev {generationCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerateImagePrompt()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold hover:text-white hover:bg-zinc-700 transition"
                  title="Generate a fresh variation with new modifiers and seed"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingImgPrompt ? 'animate-spin' : ''}`} />
                  Re-roll
                </button>
                <button
                  onClick={() => copyToClipboard(imgPrompt, 'img-p')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ff6b00] text-white text-xs font-semibold hover:bg-[#e05e00] transition shadow-md shadow-[#ff6b00]/20"
                >
                  {copied === 'img-p' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy Prompt
                </button>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-200 font-mono leading-relaxed break-words transition-all duration-300 ${
                promptUpdatedBadge ? 'ring-1 ring-[#ff6b00] shadow-md shadow-[#ff6b00]/10' : ''
              }`}
            >
              {imgPrompt}
            </div>

            {/* Negative Prompt for SD / Flux */}
            {(imgEngine === 'Stable Diffusion XL' || imgEngine === 'Flux.1 Dev') && (
              <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-rose-400">Negative Prompt (Weights & Exclusions):</span>
                  <button
                    onClick={() => copyToClipboard(sdNegativePrompt, 'neg-p')}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    {copied === 'neg-p' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy Negative
                  </button>
                </div>
                <p className="font-mono text-zinc-400 text-[11px]">{sdNegativePrompt}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. AI SENTIMENT ANALYSIS */}
      {toolId === 'ai-sentiment-analysis' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Real-Time NLP Sentiment Analyzer</h3>
          <p className="text-xs text-zinc-400 mb-4">Score emotional valence and tonal polarity from user reviews and social mentions.</p>

          <textarea
            rows={3}
            value={sentimentText}
            onChange={(e) => setSentimentText(e.target.value)}
            placeholder="Type or paste review or comment to evaluate emotional tone..."
            className={`w-full p-3 rounded-xl border text-sm ${inputBg} mb-4`}
          />

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <sentiment.icon className={`w-8 h-8 ${sentiment.color}`} />
              <div>
                <h4 className={`text-base font-bold ${sentiment.color}`}>{sentiment.label}</h4>
                <p className="text-xs text-zinc-400">Confidence Metric: {sentiment.score}%</p>
              </div>
            </div>
            <span className="text-2xl font-extrabold text-white font-mono">{sentiment.score}/100</span>
          </div>
        </div>
      )}

      {/* 8. AI TEXT EXPANDER */}
      {toolId === 'ai-text-expander' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Bullet Note to Full Article Expander</h3>
          <p className="text-xs text-zinc-400 mb-4">Turn rough outlines and bullet notes into polished prose announcements.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Bullet Notes</label>
              <textarea
                rows={6}
                value={bulletNotes}
                onChange={(e) => setBulletNotes(e.target.value)}
                placeholder="- main point 1&#10;- key metric 2&#10;- strategic takeaway 3"
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-zinc-400">Expanded Article</label>
                <button onClick={() => copyToClipboard(expandedArticle, 'art')} className="text-xs text-[#ff6b00] flex items-center gap-1 hover:underline">
                  {copied === 'art' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={expandedArticle}
                className={`w-full mt-1 p-3 rounded-xl border text-xs bg-zinc-950/80 text-zinc-200 border-zinc-800 leading-relaxed`}
              />
            </div>
          </div>

          <button
            onClick={handleExpandText}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <Sparkles className="w-4 h-4" /> Expand Bullet Points into Article
          </button>
        </div>
      )}

      {/* 9. AI EMAIL WRITER */}
      {toolId === 'ai-email-writer' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Business & Technical Email Composer</h3>
          <p className="text-xs text-zinc-400 mb-4">Draft professional cold outreach, meeting requests, and status briefings.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400">Email Purpose / Scenario</label>
              <input
                type="text"
                value={emailScenario}
                onChange={(e) => setEmailScenario(e.target.value)}
                placeholder="e.g. Request a follow-up meeting after demo, Inquire about open contract..."
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Tone</label>
              <select
                value={emailTone}
                onChange={(e) => setEmailTone(e.target.value)}
                className={`w-full mt-1 px-3 py-2.5 rounded-xl border text-xs font-semibold ${inputBg}`}
              >
                <option value="Professional">Professional & Courteous</option>
                <option value="Urgent">Urgent / Action Required</option>
                <option value="Warm & Friendly">Warm & Friendly</option>
                <option value="Sales Outreach">Sales Outreach</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleDraftEmail}
            className="flex items-center justify-center gap-2 w-full mb-4 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <Send className="w-4 h-4" /> Draft Email Message
          </button>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap flex items-start justify-between gap-3">
            <div className="flex-1">{emailDraft}</div>
            <button onClick={() => copyToClipboard(emailDraft, 'eml')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0 hover:text-white">
              {copied === 'eml' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 10. AI KEYWORD EXTRACTOR */}
      {toolId === 'ai-keyword-extractor' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">SEO & Technical Keyword Extractor</h3>
          <p className="text-xs text-zinc-400 mb-4">Extract high-relevance search terms and semantic entities for tagging and indexing.</p>

          <textarea
            rows={3}
            value={kwText}
            onChange={(e) => setKwText(e.target.value)}
            placeholder="Paste article, abstract, or web copy to extract key entities..."
            className={`w-full p-3 rounded-xl border text-sm ${inputBg} mb-3`}
          />

          <button
            onClick={handleExtractKeywords}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition mb-4"
          >
            <Key className="w-4 h-4" /> Extract Keywords & Entities
          </button>

          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400">Extracted Key Phrases ({extractedKeywords.length}):</span>
            <div className="flex flex-wrap gap-2">
              {extractedKeywords.map((kw, i) => (
                <span
                  key={i}
                  onClick={() => copyToClipboard(kw, `kw-${i}`)}
                  className="px-3 py-1.5 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] border border-[#ff6b00]/30 text-xs font-semibold cursor-pointer hover:bg-[#ff6b00]/25 transition flex items-center gap-1.5"
                >
                  {kw}
                  {copied === `kw-${i}` && <Check className="w-3 h-3 text-emerald-400" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 11. AI WEBSITE DETECTOR */}
      {toolId === 'ai-website-detector' && (
        <AiWebsiteDetector theme={theme} />
      )}
    </div>
  );
};
