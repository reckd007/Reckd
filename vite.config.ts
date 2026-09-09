import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { promises as dns } from 'dns';
import { defineConfig, Plugin } from 'vite';

function websiteDetectorPlugin(): Plugin {
  return {
    name: 'website-detector-api',
    configureServer(server) {
      server.middlewares.use('/api/detect-website', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            let targetUrl = (data.url || '').trim();
            if (!targetUrl) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'URL is required' }));
              return;
            }

            if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
              targetUrl = 'https://' + targetUrl;
            }

            const parsedUrl = new URL(targetUrl);
            const hostname = parsedUrl.hostname;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 9000);

            const [fetchResult, ipv6Result, txtResult, dmarcResult] = await Promise.allSettled([
              fetch(targetUrl, {
                signal: controller.signal,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 AI-Detector/1.0',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                  'Accept-Language': 'en-US,en;q=0.9',
                },
                redirect: 'follow',
              }),
              dns.resolve6(hostname).catch(() => [] as string[]),
              dns.resolveTxt(hostname).catch(() => [] as string[][]),
              dns.resolveTxt(`_dmarc.${hostname}`).catch(() => [] as string[][]),
            ]);
            clearTimeout(timeoutId);

            if (fetchResult.status !== 'fulfilled') {
              throw fetchResult.reason;
            }

            const response = fetchResult.value;
            const text = await response.text();
            const headersObj: Record<string, string> = {};
            response.headers.forEach((val, key) => {
              headersObj[key.toLowerCase()] = val;
            });

            // DNS facts
            const ipv6Addrs = ipv6Result.status === 'fulfilled' ? ipv6Result.value : [];
            const txtRecords = txtResult.status === 'fulfilled' ? txtResult.value.flat() : [];
            const dmarcRecords = dmarcResult.status === 'fulfilled' ? dmarcResult.value.flat() : [];

            const spfRecord = txtRecords.find((r) => typeof r === 'string' && r.toLowerCase().startsWith('v=spf1')) || null;
            const dmarcRecord = dmarcRecords.find((r) => typeof r === 'string' && r.toLowerCase().startsWith('v=dmarc1')) || null;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                status: response.status,
                finalUrl: response.url,
                headers: headersObj,
                dns: {
                  hasIpv6: Array.isArray(ipv6Addrs) && ipv6Addrs.length > 0,
                  ipv6Count: Array.isArray(ipv6Addrs) ? ipv6Addrs.length : 0,
                  hasSpf: !!spfRecord,
                  spf: spfRecord,
                  hasDmarc: !!dmarcRecord,
                  dmarc: dmarcRecord,
                },
                html: text.slice(0, 1500000),
              })
            );
          } catch (err: any) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: err.message || 'Failed to fetch target website',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), websiteDetectorPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
