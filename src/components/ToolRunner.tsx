import React from 'react';
import { ToolItem } from '../types';
import { CATEGORY_EMOJIS } from '../data/toolsData';
import { FinanceTools } from './tools/FinanceTools';
import { CalculatorTools } from './tools/CalculatorTools';
import { ConversionTools } from './tools/ConversionTools';
import { SecurityTools } from './tools/SecurityTools';
import { TextTools } from './tools/TextTools';
import { DeveloperTools } from './tools/DeveloperTools';
import { MediaTools } from './tools/MediaTools';
import { LinkTools } from './tools/LinkTools';
import { PrivacyTools } from './tools/PrivacyTools';
import { WebmasterTools } from './tools/WebmasterTools';
import { GeneratorsTools } from './tools/GeneratorsTools';
import { AiTools } from './tools/AiTools';
import { TorrentTools } from './tools/TorrentTools';
import { NewSecurityTools } from './tools/NewSecurityTools';
import { NewDevTools } from './tools/NewDevTools';
import { Heart, X, ExternalLink } from 'lucide-react';

interface ToolRunnerProps {
  tool: ToolItem;
  theme: 'dark' | 'light';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose?: () => void;
}

export const ToolRunner: React.FC<ToolRunnerProps> = ({
  tool,
  theme,
  isFavorite,
  onToggleFavorite,
  onClose,
}) => {
  const isDark = theme === 'dark';
  const categoryId = tool.category || tool.categoryId;
  const categoryEmoji = tool.emoji || (categoryId ? CATEGORY_EMOJIS[categoryId] : null) || '⚡';

  const newSecurityToolIds = [
    'ssl-certificate-check', 'whois-lookup', 'port-scanner', 'http-status-checker',
    'http-headers', 'security-headers', 'cors-checker', 'password-leak-checker',
    'disposable-email', 'subdomain-finder', 'cidr-calculator', 'website-down-checker',
    'dns-record-checker', 'dns-lookup', 'bcrypt-generator', 'email-header-analyzer',
    'rsa-key-generator', 'gdpr-checker', 'robots-txt-checker', 'meta-tag-checker'
  ];

  const newDevToolIds = [
    'html-minifier', 'css-minifier', 'js-minifier', 'sql-formatter',
    'regex-tester', 'cron-expression', 'hex-converter', 'ascii-converter',
    'color-converter', 'svg-optimizer'
  ];

  const renderToolComponent = () => {
    switch (tool.category) {
      case 'links':
        return <LinkTools toolId={tool.id} theme={theme} />;
      case 'privacy':
        return <PrivacyTools toolId={tool.id} theme={theme} />;
      case 'webmaster':
        return <WebmasterTools toolId={tool.id} theme={theme} />;
      case 'generators':
        if ([
          'qr-code-generator',
          'password-generator',
          'barcode-generator',
          'uuid-generator',
          'random-number-generator',
          'random-string-generator',
          'hash-generator',
          'md5-generator',
          'sha256-generator',
          'jwt-encoder',
        ].includes(tool.id)) {
          return <SecurityTools toolId={tool.id} theme={theme} />;
        }
        if (['bcrypt-generator', 'rsa-key-generator'].includes(tool.id)) {
          return <NewSecurityTools toolId={tool.id} theme={theme} />;
        }
        return <GeneratorsTools toolId={tool.id} theme={theme} />;
      case 'ai':
        return <AiTools toolId={tool.id} theme={theme} />;
      case 'torrent':
        return <TorrentTools toolId={tool.id} theme={theme} />;
      case 'finance':
        return <FinanceTools toolId={tool.id} theme={theme} />;
      case 'calculators':
        return <CalculatorTools toolId={tool.id} theme={theme} />;
      case 'conversion':
        return <ConversionTools toolId={tool.id} theme={theme} />;
      case 'security':
        if (newSecurityToolIds.includes(tool.id)) {
          return <NewSecurityTools toolId={tool.id} theme={theme} />;
        }
        return <SecurityTools toolId={tool.id} theme={theme} />;
      case 'text':
        return <TextTools toolId={tool.id} theme={theme} />;
      case 'developer':
        if (newDevToolIds.includes(tool.id)) {
          return <NewDevTools toolId={tool.id} theme={theme} />;
        }
        return <DeveloperTools toolId={tool.id} theme={theme} />;
      case 'media':
        return <MediaTools toolId={tool.id} theme={theme} />;
      default:
        return (
          <div className="p-8 text-center text-zinc-400">
            Tool implementation initialized and running.
          </div>
        );
    }
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 shadow-2xl overflow-hidden ${
        isDark
          ? 'bg-[#0f0f11]/95 border-zinc-800 text-white shadow-black/80'
          : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-300/40'
      } backdrop-blur-xl`}
    >
      {/* Tool Header */}
      <div
        className={`px-6 py-5 border-b flex flex-wrap items-center justify-between gap-4 ${
          isDark ? 'border-zinc-800/80 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center font-bold text-2xl select-none shadow-sm">
            <span>{categoryEmoji}</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold font-display tracking-tight">{tool.name}</h2>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20 flex items-center gap-1.5 font-mono">
                <span>{categoryEmoji}</span>
                <span>{tool.category}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">{tool.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(tool.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2.5 rounded-xl border transition ${
              isFavorite
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                : isDark
                ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white'
                : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-black'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className={`p-2.5 rounded-xl border transition ${
                isDark
                  ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-white'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-black'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tool Interactive Body */}
      <div className="p-6">{renderToolComponent()}</div>
    </div>
  );
};
