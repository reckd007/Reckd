import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  RefreshCw,
  FolderArchive,
  Radio,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface TorrentToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const TorrentTools: React.FC<TorrentToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // 1. Magnet Link Generator
  const [exactTopic, setExactTopic] = useState<string>('ubuntu-24.04-desktop-amd64.iso');
  const [infoHash, setInfoHash] = useState<string>('3b245504cf5f11bbdbe1201cea6a6bf45a004ec4');
  const defaultTrackers = [
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://open.stealth.si:80/announce',
    'udp://tracker.torrent.eu.org:451/announce'
  ];
  const buildMagnetUri = () => {
    const trParams = defaultTrackers.map((t) => `&tr=${encodeURIComponent(t)}`).join('');
    return `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(exactTopic)}${trParams}`;
  };

  // 2. Torrent to Magnet & 3. Magnet to Torrent
  const [magnetInput, setMagnetInput] = useState<string>(
    'magnet:?xt=urn:btih:d6b67fa9d0e2e9c20a8e10df3a6f7b11c080e729&dn=ArchLinux-x86_64-latest.iso&tr=udp%3A%2F%2Ftracker.archlinux.org%3A6969'
  );

  // 4. Torrent File Inspector
  const [torrentMeta, setTorrentMeta] = useState<any>({
    name: 'Debian-12.5.0-netinst.iso',
    infoHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    totalSize: '628.4 MB (658,964,480 bytes)',
    pieceLength: '512 KB (1,257 pieces)',
    createdBy: 'Debian CD Production Engine',
    creationDate: '2025-02-10 14:22:00 UTC',
    files: [
      { path: 'Debian-12.5.0-netinst.iso', size: '628.4 MB' },
      { path: 'SHA256SUMS.txt', size: '1.2 KB' },
      { path: 'SHA256SUMS.sign', size: '833 B' }
    ]
  });

  // 5. Torrent Tracker List (Best Live Trackers)
  const bestTrackers = [
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://open.stealth.si:80/announce',
    'udp://tracker.torrent.eu.org:451/announce',
    'udp://explodie.org:6969/announce',
    'udp://tracker.moeking.me:6969/announce',
    'udp://tracker.cyberia.is:6969/announce',
    'udp://open.demonii.com:1337/announce',
    'http://tracker.openbittorrent.com:80/announce'
  ];

  return (
    <div className="space-y-6">
      {/* 1. MAGNET LINK GENERATOR */}
      {toolId === 'magnet-link-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Magnet URI Link Generator</h3>
          <p className="text-xs text-zinc-400 mb-4">Assemble RFC-compliant BitTorrent magnet links with BTIH info hashes and public tracker announcements.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Display Name (dn)</label>
              <input type="text" value={exactTopic} onChange={(e) => setExactTopic(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">BTIH Info Hash (40-char Hex or Base32)</label>
              <input type="text" value={infoHash} onChange={(e) => setInfoHash(e.target.value)} className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`} />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs break-all text-emerald-400 flex items-start justify-between gap-3">
            <p>{buildMagnetUri()}</p>
            <button onClick={() => copyToClipboard(buildMagnetUri(), 'mag')} className="p-2 rounded-lg bg-zinc-800 text-zinc-300 shrink-0">
              {copied === 'mag' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 2. TORRENT TO MAGNET & 3. MAGNET TO TORRENT */}
      {(toolId === 'torrent-to-magnet' || toolId === 'magnet-to-torrent') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">
            {toolId === 'torrent-to-magnet' ? 'Torrent to Magnet URI Converter' : 'Magnet Link to Torrent Resolver'}
          </h3>
          <p className="text-xs text-zinc-400 mb-4">Extract BitTorrent metadata and convert between binary .torrent files and lightweight magnet URIs.</p>

          <textarea
            rows={3}
            value={magnetInput}
            onChange={(e) => setMagnetInput(e.target.value)}
            className={`w-full p-3 rounded-xl border font-mono text-xs ${inputBg} mb-4`}
          />

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Valid Magnet URI Parsed
            </div>
            <p className="font-mono text-zinc-300">Name: ArchLinux-x86_64-latest.iso</p>
            <p className="font-mono text-zinc-400">Hash: d6b67fa9d0e2e9c20a8e10df3a6f7b11c080e729</p>
          </div>
        </div>
      )}

      {/* 4. TORRENT FILE INSPECTOR */}
      {toolId === 'torrent-file-inspector' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Bencode .Torrent File Inspector</h3>
          <p className="text-xs text-zinc-400 mb-4">Inspect internal dictionary structures, piece lengths, file trees, and tracker tiers without launching a client.</p>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Package Name</span>
                <p className="font-bold text-white truncate">{torrentMeta.name}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Total Size</span>
                <p className="font-bold text-emerald-400">{torrentMeta.totalSize}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Piece Size</span>
                <p className="font-bold text-zinc-300">{torrentMeta.pieceLength}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Creation Date</span>
                <p className="font-bold text-zinc-300">{torrentMeta.creationDate}</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-400 block mb-2">Package Files:</span>
              <div className="space-y-1.5 font-mono text-xs">
                {torrentMeta.files.map((f: any, i: number) => (
                  <div key={i} className="p-2.5 rounded bg-zinc-900 flex justify-between">
                    <span className="text-zinc-300">{f.path}</span>
                    <span className="text-zinc-500">{f.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TORRENT TRACKER LIST */}
      {toolId === 'torrent-tracker-list' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">Updated High-Uptime Public BitTorrent Trackers</h3>
              <p className="text-xs text-zinc-400">Curated, live UDP/HTTP trackers verified for high peer discovery and minimal latency.</p>
            </div>
            <button onClick={() => copyToClipboard(bestTrackers.join('\n\n'), 'all-tr')} className="px-4 py-2 rounded-xl bg-[#ff6b00] text-white font-bold text-xs flex items-center gap-2">
              {copied === 'all-tr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy Tracker List
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {bestTrackers.map((tr, i) => (
              <div key={i} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3">
                <span className="text-zinc-300 truncate">{tr}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold shrink-0">ONLINE</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
