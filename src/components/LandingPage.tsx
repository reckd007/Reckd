import React, { useState } from 'react';
import { toolCategories, allTools } from '../data/toolsData';
import { CelestialOrbSystem } from './CelestialOrbSystem';
import { Magnetic } from './Magnetic';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Sliders,
  Send,
  MessageSquare,
  Search,
} from 'lucide-react';

interface LandingPageProps {
  theme: 'dark' | 'light';
  onNavigateToTools: (categoryId?: string, toolId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  theme,
  onNavigateToTools,
}) => {
  const isDark = theme === 'dark';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactTopic, setContactTopic] = useState<string>('general question');
  const [contactMsg, setContactMsg] = useState<string>('');
  const [contactSent, setContactSent] = useState<boolean>(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim() || !contactEmail.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactTopic('general question');
      setContactMsg('');
    }, 4500);
  };

  const faqs = [
    {
      question: 'Are all the tools on Reckd completely free to use?',
      answer:
        'Yes, 100% free with no hidden fees, paywalls, premium tiers, or credit card requirements. Every one of our 105+ utilities is available for unlimited daily usage.',
    },
    {
      question: 'Is my sensitive data (files, passwords, API keys) ever sent to your server?',
      answer:
        'Never. Reckd is architected with a strict client-side-first execution model. Computations, cryptographic hashes, image conversions, and document minifications run directly inside your browser sandbox using Web APIs and WebAssembly. Your data never leaves your device.',
    },
    {
      question: 'Do I need to create an account or sign up to access tools?',
      answer:
        'No registration or login is required. You never have to provide personal credentials, cookies, or account verification. Simply open any tool in the directory and compute immediately.',
    },
    {
      question: 'Can Reckd utilities work offline or during network dropouts?',
      answer:
        'Yes. Once the applet assets are cached in your browser, virtually all tools—including formatters, minifiers, encoders, converters, and generators—operate seamlessly without needing an active internet connection.',
    },
    {
      question: 'How does the AI Website Detector recognize underlying stacks?',
      answer:
        'The detector inspects DNS records, HTTP response headers, hosting providers, CDN proxies, and web component signatures. It combines live diagnostic probes with heuristic pattern matching to detect AI frameworks, hosting backends, and security protocols with high confidence.',
    },
    {
      question: 'Can I request a custom calculation or suggest a new tool?',
      answer:
        'Absolutely! We actively build and launch new utilities based on community requests. Use our Contact Us form below to submit formulas, suggestions, or feature requests.',
    },
  ];

  return (
    <div className="relative z-10">
      {/* Top Floating Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 transition-all bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
              <img
                src="/ReckdLogo.png"
                alt="RECKD"
                className="h-7 sm:h-8 md:h-8 lg:h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_14px_rgba(255,107,0,0.35)]"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] text-[#ff6b00] font-mono tracking-widest hidden lg:inline-block uppercase font-bold border-l border-white/10 pl-3">
                Future Utility Suite
              </span>
            </a>
          </div>

          {/* Desktop & Tablet Navigatory Buttons: tight, carefully proportioned spacing so it NEVER overlaps or covers Contact on tablets */}
          <div className="hidden md:flex items-center gap-3.5 lg:gap-6 xl:gap-8 text-[11px] lg:text-xs font-semibold text-zinc-400 shrink-0">
            <a href="#categories" className="hover:text-[#ff6b00] transition whitespace-nowrap">
              100+ Directory
            </a>
            <a href="#why-reckd" className="hover:text-[#ff6b00] transition whitespace-nowrap">
              Why Reckd
            </a>
            <a href="#process" className="hover:text-[#ff6b00] transition whitespace-nowrap">
              How It Works
            </a>
            <a href="#faqs" className="hover:text-[#ff6b00] transition whitespace-nowrap">
              FAQs
            </a>
            <a href="#contact" className="hover:text-[#ff6b00] transition whitespace-nowrap">
              Contact Us
            </a>
          </div>

          {/* Action Button: sized responsibly on tablet & mobile */}
          <div className="flex items-center gap-2 shrink-0">
            <Magnetic strength={0.35}>
              <button
                onClick={() => onNavigateToTools()}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-[11px] sm:text-xs shadow-lg shadow-[#ff6b00]/25 transition active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Explore All Tools</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Mobile Navigatory Links Sub-Strip: compact, smaller buttons for mobile mode */}
        <div className="md:hidden flex items-center justify-start overflow-x-auto no-scrollbar px-3 py-1.5 border-t border-white/5 bg-black/80 backdrop-blur-lg gap-1.5 text-[10px] font-medium text-zinc-400">
          <a
            href="#categories"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/80 hover:text-[#ff6b00] hover:border-[#ff6b00]/40 transition whitespace-nowrap active:scale-95"
          >
            100+ Directory
          </a>
          <a
            href="#why-reckd"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/80 hover:text-[#ff6b00] hover:border-[#ff6b00]/40 transition whitespace-nowrap active:scale-95"
          >
            Why Reckd
          </a>
          <a
            href="#process"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/80 hover:text-[#ff6b00] hover:border-[#ff6b00]/40 transition whitespace-nowrap active:scale-95"
          >
            How It Works
          </a>
          <a
            href="#faqs"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/80 hover:text-[#ff6b00] hover:border-[#ff6b00]/40 transition whitespace-nowrap active:scale-95"
          >
            FAQs
          </a>
          <a
            href="#contact"
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/80 hover:text-[#ff6b00] hover:border-[#ff6b00]/40 transition whitespace-nowrap active:scale-95"
          >
            Contact Us
          </a>
        </div>
      </nav>

      {/* FULL-SCREEN ANIMATED HERO */}
      <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 relative pt-20 overflow-hidden">
        {/* Hero Content Container with high contrast z-10 */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
          {/* Brand Title: RECKD with Celestial Orb Centered Directly Behind it */}
          <div className="relative inline-flex items-center justify-center my-2">
            {/* BIG ORANGE SPINNING BALL WITH REVOLVING WAVES CENTERED EXACTLY BEHIND RECKD */}
            <CelestialOrbSystem />

            {/* Large Animated Brand Title: RECKD */}
            <h1 className="relative z-10 text-6xl sm:text-8xl md:text-9xl font-black font-display tracking-tight text-white select-none drop-shadow-[0_12px_36px_rgba(0,0,0,0.95)]">
              RECK<span className="text-[#ff6b00] drop-shadow-[0_0_40px_rgba(255,107,0,0.85)]">D</span>
            </h1>
          </div>

          {/* Animated Slogan */}
          <p className="mt-4 text-lg sm:text-2xl md:text-3xl font-medium tracking-wide text-zinc-100 max-w-2xl font-display drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Everything Useful. <span className="text-[#ff6b00] font-bold">One Place.</span>
          </p>

          <p className="mt-4 text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            From finance & currency converters to cryptographic generators, image processors, and developer suites. Fully private, browser-based, with zero server storage.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Magnetic strength={0.35} className="w-full sm:w-auto">
              <button
                onClick={() => onNavigateToTools()}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 sm:gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#ff6b00]/30 transition border border-[#ff944d]/30 active:scale-95"
              >
                <span>All Tools</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </Magnetic>

            <a
              href="#categories"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-4 rounded-xl sm:rounded-2xl border border-zinc-800 bg-[#0a0a0a]/80 hover:bg-zinc-900 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm backdrop-blur-md transition"
            >
              <span>Explore 13 Categories</span>
            </a>
          </div>
        </div>
      </section>

      {/* DEDICATED PAGE PROMINENT CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          onClick={() => onNavigateToTools()}
          className="cursor-pointer p-6 sm:p-8 rounded-3xl border border-[#ff6b00]/40 bg-gradient-to-r from-[#ff6b00]/15 via-zinc-900/80 to-black backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-[#ff6b00] transition-all"
        >
          <div className="flex items-center gap-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-black/60 border border-[#ff6b00]/30 p-2.5 flex items-center justify-center shrink-0 shadow-lg shadow-[#ff6b00]/25 group-hover:scale-105 group-hover:border-[#ff6b00] transition">
              <img src="/ReckdFav.png" alt="Reckd" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#ff6b00]">
                All Tools
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
                150+ Tools
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
                Looking for the complete suite? Our separate full-page directory lets you search, filter, and launch all 150+ utilities without distractions.
              </p>
            </div>
          </div>

          <Magnetic strength={0.35}>
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ff6b00] text-white font-bold text-xs shrink-0 transition shadow-lg shadow-[#ff6b00]/25 hover:bg-[#e05e00]">
              <span>All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Magnetic>
        </div>
      </section>

      {/* 13 CATEGORY SHOWCASE */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">
            Complete Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
            13 Comprehensive Categories
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Click any domain below to jump directly to its tools on the dedicated platform page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {toolCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateToTools(cat.id)}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-[#ff6b00]/40 transition duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#ff6b00]/15 text-[#ff6b00]">
                  {cat.tools.length} Tools
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#ff6b00] group-hover:translate-x-1 transition" />
              </div>

              <h3 className="text-lg font-bold font-display text-white group-hover:text-[#ff6b00] transition flex items-center gap-2">
                <span className="text-xl select-none">{cat.emoji}</span>
                <span>{cat.name}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {cat.description}
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[11px] text-zinc-500">
                Includes: {cat.tools.slice(0, 3).map((t) => t.name).join(', ')}...
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE RECKD */}
      <section id="why-reckd" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">
            Architecture & Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
            Why Choose Reckd?
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Engineered for developers, professionals, and creators who value speed and total privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold font-display text-base text-white">100% Client-Side Privacy</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Your passwords, PDFs, secrets, and images never touch an external server. Everything executes within your browser sandboxed runtime.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold font-display text-base text-white">Sub-Millisecond Engine</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              No server cold starts, API queues, or network round-trips. Instant math, encoding, and image processing with WebAssembly.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold font-display text-base text-white">All-In-One Unified Suite</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Eliminate the clutter of 30 different ad-infested tool websites. Access 105+ utilities in one single modern dashboard.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold font-display text-base text-white">No Logins or Paywalls</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Completely open. No subscriptions, paywalls, or registrations needed to unlock tools. Just bookmark and get things done.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PROCESS */}
      <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
            How It Works
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Three simple steps to execute any daily calculation or conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 relative">
            <span className="text-5xl font-black font-mono text-zinc-800 absolute top-4 right-6">
              01
            </span>
            <h3 className="text-xl font-bold font-display text-white mt-4">Select or Search</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Open the dedicated tools directory and quickly find your required utility using real-time search, category filters, or quick tags.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 relative">
            <span className="text-5xl font-black font-mono text-zinc-800 absolute top-4 right-6">
              02
            </span>
            <h3 className="text-xl font-bold font-display text-white mt-4">Compute in Browser</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Enter inputs or drag files. Calculations and transformations are immediately compiled client-side in sub-milliseconds.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 relative">
            <span className="text-5xl font-black font-mono text-zinc-800 absolute top-4 right-6">
              03
            </span>
            <h3 className="text-xl font-bold font-display text-white mt-4">Copy or Download</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              One-click copy formatted outputs or download generated PNGs, PDFs, QR codes, and barcodes directly to your device.
            </p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <section id="faqs" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">
            Common Queries
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Everything you need to know about our privacy-first architecture, local execution, and free access.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 select-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold font-display text-base sm:text-lg text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#ff6b00]/15 border-[#ff6b00]/30 text-[#ff6b00]'
                        : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#ff6b00]' : ''
                      }`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PLATFORM STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-y border-zinc-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl sm:text-5xl font-black font-display text-[#ff6b00]">105+</p>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1 block">
              Active Tools
            </span>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black font-display text-white">0 ms</p>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1 block">
              Server Latency
            </span>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black font-display text-emerald-400">100%</p>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1 block">
              Private Runtime
            </span>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black font-display text-cyan-400">0</p>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-1 block">
              Accounts or Fees
            </span>
          </div>
        </div>
      </section>

      {/* CONTACT / FEEDBACK SECTION */}
      <section id="contact" className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center relative">
        <span id="feedback" className="sr-only">Contact</span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">
          Get in Touch
        </span>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
          Contact Us
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          Have a question, feedback, bug report, or partnership inquiry? Reach out directly below.
        </p>

        {/* 3 Information Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-8 mb-8 text-left">
          {/* Box 1: Email */}
          <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex items-start gap-3.5">
            <div className="text-2xl select-none shrink-0 p-2 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20">
              ✉️
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-white">Email</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                We reply within 24 hours on business days
              </p>
            </div>
          </div>

          {/* Box 2: Response Time */}
          <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex items-start gap-3.5">
            <div className="text-2xl select-none shrink-0 p-2 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20">
              ⏱️
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-white">Response Time</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Within 24 hours — usually much faster
              </p>
            </div>
          </div>

          {/* Box 3: Privacy */}
          <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex items-start gap-3.5">
            <div className="text-2xl select-none shrink-0 p-2 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20">
              🛡️
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-white">Privacy</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Your message is never shared with third parties
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">
                Your Name <span className="text-[#ff6b00]">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-sm focus:border-[#ff6b00] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">
                Your Email <span className="text-[#ff6b00]">*</span>
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-sm focus:border-[#ff6b00] focus:outline-none transition"
              />
            </div>
          </div>

          {/* Listbox / Select Dropdown */}
          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1">
              Inquiry Type <span className="text-[#ff6b00]">*</span>
            </label>
            <select
              value={contactTopic}
              onChange={(e) => setContactTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-sm focus:border-[#ff6b00] focus:outline-none transition cursor-pointer"
            >
              <option value="general question">general question</option>
              <option value="bug report">bug report</option>
              <option value="feature request">feature request</option>
              <option value="partnership/business">partnership/business</option>
              <option value="privacy concern">privacy concern</option>
              <option value="other">other</option>
            </select>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-zinc-400">
                Your Message <span className="text-[#ff6b00]">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  contactMsg.length >= 1400 ? 'text-amber-400 font-bold' : 'text-zinc-500'
                }`}
              >
                {contactMsg.length} / 1500 characters
              </span>
            </div>
            <textarea
              rows={4}
              required
              maxLength={1500}
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              placeholder="describe your question or request as you wish..."
              className="w-full p-4 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-sm focus:border-[#ff6b00] focus:outline-none transition resize-y"
            />
          </div>

          <Magnetic strength={0.25} className="w-full block">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition active:scale-[0.99]"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </Magnetic>

          {contactSent && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs text-center font-medium">
              Thank you! Your message has been sent successfully. We reply within 24 hours on business days.
            </div>
          )}
        </form>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <img
              src="/ReckdLogo.png"
              alt="RECKD"
              className="h-7 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <p className="text-xs text-zinc-500 border-l border-zinc-800 pl-4">
              "Everything Useful. One Place."
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
            <button onClick={() => onNavigateToTools()} className="hover:text-[#ff6b00] transition">
              Dedicated Tools Directory
            </button>
            <button onClick={() => onNavigateToTools('finance')} className="hover:text-[#ff6b00] transition">
              Finance & Currency
            </button>
            <button onClick={() => onNavigateToTools('security')} className="hover:text-[#ff6b00] transition">
              Security & Crypto
            </button>
            <button onClick={() => onNavigateToTools('developer')} className="hover:text-[#ff6b00] transition">
              Developer Tools
            </button>
          </div>

          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Reckd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
