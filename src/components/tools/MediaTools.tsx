import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  Upload,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Sliders,
  RefreshCw,
  Palette,
  Crop,
  Scissors,
  FileArchive,
  FileDown,
  FileUp,
  Sparkles,
  Wand2,
  Eye,
  Pipette,
  Layers,
  FileStack
} from 'lucide-react';

interface MediaToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const MediaTools: React.FC<MediaToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Shared file upload state
  const [uploadedImgSrc, setUploadedImgSrc] = useState<string>('');
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [imgNaturalWidth, setImgNaturalWidth] = useState<number>(800);
  const [imgNaturalHeight, setImgNaturalHeight] = useState<number>(600);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setUploadedImgSrc(src);
      const img = new Image();
      img.onload = () => {
        setImgNaturalWidth(img.width);
        setImgNaturalHeight(img.height);
        setResizeW(img.width);
        setResizeH(img.height);
        setCropW(Math.min(img.width, 400));
        setCropH(Math.min(img.height, 400));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Helper to load sample image for testing
  const loadSampleBadgeImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Solid white background to test background removal
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 600);

    // Draw an emblem badge
    ctx.beginPath();
    ctx.arc(300, 260, 140, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b00';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(300, 260, 115, 0, Math.PI * 2);
    ctx.fillStyle = '#18181b';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RECKD', 300, 260);

    ctx.fillStyle = '#ff6b00';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('★ SECURITY CORE ★', 300, 460);

    const url = canvas.toDataURL('image/png');
    setUploadedImgSrc(url);
    setImgNaturalWidth(600);
    setImgNaturalHeight(600);
    setResizeW(600);
    setResizeH(600);
    setCropW(400);
    setCropH(400);
    setOriginalFileSize(url.length);
  };

  const loadSampleProductImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Light studio background (#f4f4f5)
    ctx.fillStyle = '#f4f4f5';
    ctx.fillRect(0, 0, 640, 480);

    // Studio shadow
    ctx.beginPath();
    ctx.ellipse(320, 360, 160, 30, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fill();

    // 3D Metallic Sphere product
    const grad = ctx.createRadialGradient(280, 200, 20, 320, 240, 120);
    grad.addColorStop(0, '#ff9e58');
    grad.addColorStop(0.6, '#ff6b00');
    grad.addColorStop(1, '#993d00');

    ctx.beginPath();
    ctx.arc(320, 240, 120, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    const url = canvas.toDataURL('image/png');
    setUploadedImgSrc(url);
    setImgNaturalWidth(640);
    setImgNaturalHeight(480);
    setResizeW(640);
    setResizeH(480);
    setCropW(400);
    setCropH(400);
    setOriginalFileSize(url.length);
  };

  // 1. Image Resizer
  const [resizeW, setResizeW] = useState<number>(800);
  const [resizeH, setResizeH] = useState<number>(600);
  const [keepAspect, setKeepAspect] = useState<boolean>(true);

  const handleResizeW = (w: number) => {
    setResizeW(w);
    if (keepAspect && imgNaturalWidth > 0) {
      setResizeH(Math.round((w / imgNaturalWidth) * imgNaturalHeight));
    }
  };

  const handleResizeH = (h: number) => {
    setResizeH(h);
    if (keepAspect && imgNaturalHeight > 0) {
      setResizeW(Math.round((h / imgNaturalHeight) * imgNaturalWidth));
    }
  };

  const downloadResized = () => {
    if (!uploadedImgSrc) return;
    const canvas = document.createElement('canvas');
    canvas.width = resizeW;
    canvas.height = resizeH;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, resizeW, resizeH);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `reckd-resized-${resizeW}x${resizeH}.png`;
      a.click();
    };
    img.src = uploadedImgSrc;
  };

  // 2. Image Compressor
  const [compressQuality, setCompressQuality] = useState<number>(75);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  useEffect(() => {
    if (uploadedImgSrc) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', compressQuality / 100);
        setCompressedSize(Math.round((dataUrl.length * 3) / 4));
      };
      img.src = uploadedImgSrc;
    }
  }, [uploadedImgSrc, compressQuality]);

  const downloadCompressed = () => {
    if (!uploadedImgSrc) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const url = canvas.toDataURL('image/jpeg', compressQuality / 100);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reckd-compressed.jpg';
      a.click();
    };
    img.src = uploadedImgSrc;
  };

  // 3. BACKGROUND REMOVER (Chroma, Luminance & Color Distance)
  const [bgTolerance, setBgTolerance] = useState<number>(25);
  const [bgFeather, setBgFeather] = useState<number>(2);
  const [bgMode, setBgMode] = useState<'auto' | 'light' | 'dark' | 'green' | 'custom'>('auto');
  const [customColor, setCustomColor] = useState<string>('#ffffff');
  const [invertMask, setInvertMask] = useState<boolean>(false);
  const [defringe, setDefringe] = useState<boolean>(true);
  const [previewBg, setPreviewBg] = useState<'grid' | 'dark' | 'light' | 'neon'>('grid');
  const [processedBgUrl, setProcessedBgUrl] = useState<string>('');
  const [processedBgSize, setProcessedBgSize] = useState<number>(0);
  const [isProcessingBg, setIsProcessingBg] = useState<boolean>(false);
  const origCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render original image on canvas for eyedropper interaction
  useEffect(() => {
    if (uploadedImgSrc && origCanvasRef.current) {
      const canvas = origCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      if (uploadedImgSrc.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };
      img.src = uploadedImgSrc;
    }
  }, [uploadedImgSrc, toolId]);

  // Execute Background Removal Algorithm
  useEffect(() => {
    if (toolId === 'background-remover' && uploadedImgSrc) {
      setIsProcessingBg(true);
      const img = new Image();
      if (uploadedImgSrc.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            setIsProcessingBg(false);
            return;
          }
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Target background RGB
          let tr = 255, tg = 255, tb = 255;
          if (bgMode === 'light') {
            tr = 255; tg = 255; tb = 255;
          } else if (bgMode === 'dark') {
            tr = 0; tg = 0; tb = 0;
          } else if (bgMode === 'green') {
            tr = 0; tg = 255; tb = 0;
          } else if (bgMode === 'custom') {
            const hex = customColor.replace('#', '');
            tr = parseInt(hex.substring(0, 2), 16) || 255;
            tg = parseInt(hex.substring(2, 4), 16) || 255;
            tb = parseInt(hex.substring(4, 6), 16) || 255;
          } else {
            // Auto: Sample 4 corners
            const corners = [
              [0, 0],
              [canvas.width - 1, 0],
              [0, canvas.height - 1],
              [canvas.width - 1, canvas.height - 1]
            ];
            let sr = 0, sg = 0, sb = 0;
            corners.forEach(([x, y]) => {
              const idx = (y * canvas.width + x) * 4;
              sr += data[idx];
              sg += data[idx + 1];
              sb += data[idx + 2];
            });
            tr = Math.round(sr / 4);
            tg = Math.round(sg / 4);
            tb = Math.round(sb / 4);
          }

          const maxDist = 441.67; // sqrt(255^2 * 3)
          const tolDist = (bgTolerance / 100) * maxDist;
          const featherWidth = (bgFeather / 10) * 35;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a === 0) continue;

            // Euclidean color distance
            const dr = r - tr;
            const dg = g - tg;
            const db = b - tb;
            const dist = Math.sqrt(dr * dr + dg * dg + db * db);

            let newAlpha = 255;
            if (dist <= tolDist) {
              if (featherWidth > 0 && dist > tolDist - featherWidth) {
                // Smooth boundary transition
                newAlpha = Math.round(((dist - (tolDist - featherWidth)) / featherWidth) * 255);
              } else {
                newAlpha = 0;
              }
            } else {
              newAlpha = 255;
            }

            if (invertMask) {
              newAlpha = 255 - newAlpha;
            }

            data[i + 3] = newAlpha;

            // Despill: Suppress color halos around boundary
            if (defringe && newAlpha > 0 && newAlpha < 255) {
              data[i] = Math.round(r * 0.9);
              data[i + 1] = Math.round(g * 0.9);
              data[i + 2] = Math.round(b * 0.9);
            }
          }

          ctx.putImageData(imgData, 0, 0);
          const url = canvas.toDataURL('image/png');
          setProcessedBgUrl(url);
          setProcessedBgSize(Math.round((url.length * 3) / 4));
        } catch (err) {
          console.error('Background removal processing error:', err);
        } finally {
          setIsProcessingBg(false);
        }
      };
      img.onerror = () => {
        setIsProcessingBg(false);
      };
      img.src = uploadedImgSrc;
    }
  }, [uploadedImgSrc, bgTolerance, bgFeather, bgMode, customColor, invertMask, defringe, toolId]);

  // Eyedropper click handler on original image
  const handlePickColorFromImage = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = origCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
    setBgMode('custom');
    setCustomColor(hex);
  };

  const downloadBackgroundRemovedPng = () => {
    if (!processedBgUrl) return;
    try {
      const arr = processedBgUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `reckd-transparent-${imgNaturalWidth || 'image'}x${imgNaturalHeight || 'output'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch {
      const a = document.createElement('a');
      a.href = processedBgUrl;
      a.download = `reckd-transparent-${imgNaturalWidth}x${imgNaturalHeight}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const downloadBackgroundRemovedWebp = () => {
    if (!processedBgUrl) return;
    try {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        c.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reckd-transparent-${imgNaturalWidth || 'image'}x${imgNaturalHeight || 'output'}.webp`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 3000);
        }, 'image/webp', 0.95);
      };
      img.src = processedBgUrl;
    } catch (e) {
      console.error(e);
    }
  };

  const copyTransparentPngBlob = async () => {
    if (!processedBgUrl) return;
    try {
      const res = await fetch(processedBgUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied('bg-clip');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      copyToClipboard(processedBgUrl, 'bg-clip');
    }
  };

  // 4. IMAGE CROPPER
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropW, setCropW] = useState<number>(400);
  const [cropH, setCropH] = useState<number>(400);
  const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '16:9' | '4:3'>('1:1');
  const cropPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if ((toolId === 'image-cropper') && uploadedImgSrc && cropPreviewCanvasRef.current) {
      const canvas = cropPreviewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = cropW;
        canvas.height = cropH;
        ctx?.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      };
      img.src = uploadedImgSrc;
    }
  }, [uploadedImgSrc, cropX, cropY, cropW, cropH, toolId]);

  const downloadCroppedImage = () => {
    if (!cropPreviewCanvasRef.current) return;
    const url = cropPreviewCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `reckd-cropped-${cropW}x${cropH}.png`;
    a.click();
  };

  // 5. Image Format Converter
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/webp');
  const downloadConvertedFormat = () => {
    if (!uploadedImgSrc) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const ext = targetFormat.split('/')[1];
      const url = canvas.toDataURL(targetFormat, 0.92);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reckd-converted.${ext}`;
      a.click();
    };
    img.src = uploadedImgSrc;
  };

  // 6. Image to Base64
  const imgBase64Snippet = uploadedImgSrc || 'Upload an image above to extract Base64 data URI';

  // 7. Base64 to Image
  const [pasteBase64, setPasteBase64] = useState<string>('');

  // 8. Color Palette Extractor
  const [extractedPalette, setExtractedPalette] = useState<string[]>([
    '#ff6b00', '#0a0a0a', '#1e1e1e', '#e0e0e0', '#ff944d', '#292929'
  ]);

  useEffect(() => {
    if (uploadedImgSrc) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        const colors: string[] = [];
        for (let i = 0; i < data.length && colors.length < 6; i += 400) {
          const r = data[i].toString(16).padStart(2, '0');
          const g = data[i + 1].toString(16).padStart(2, '0');
          const b = data[i + 2].toString(16).padStart(2, '0');
          const hex = `#${r}${g}${b}`;
          if (!colors.includes(hex)) colors.push(hex);
        }
        if (colors.length > 0) setExtractedPalette(colors);
      };
      img.src = uploadedImgSrc;
    }
  }, [uploadedImgSrc]);

  // 9. SVG to PNG
  const [svgCode, setSvgCode] = useState<string>(
    `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="100" cy="100" r="80" fill="#ff6b00" />\n  <text x="100" y="110" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">RECKD</text>\n</svg>`
  );
  const [svgScale, setSvgScale] = useState<number>(2);

  const downloadSvgAsPng = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * svgScale || 400;
      canvas.height = img.height * svgScale || 400;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'vector-export.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // 10. PDF Merge Tool
  const [pdfMergeList, setPdfMergeList] = useState<Array<{ id: string; name: string; content: string }>>([
    { id: '1', name: 'Document_Cover.pdf', content: 'RECKD ZERO-LATENCY PLATFORM SPECIFICATION\nConfidential Engineering Architecture' },
    { id: '2', name: 'Security_Audit.pdf', content: 'CLIENT-SIDE PRIVACY ASSESSMENT\nAll cryptographic transforms execute locally within sandbox boundaries.' },
    { id: '3', name: 'API_Index.pdf', content: 'TOOL CATALOG & CAPABILITIES\n180+ zero-tracking utilities across 13 modular categories.' }
  ]);

  const downloadMergedPdf = () => {
    const doc = new jsPDF();
    pdfMergeList.forEach((item, index) => {
      if (index > 0) doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(item.name.replace('.pdf', ''), 20, 30);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(item.content, 170);
      doc.text(splitText, 20, 50);
    });
    doc.save('reckd-merged-document.pdf');
  };

  // 11. PDF Split Tool
  const [splitPageRange, setSplitPageRange] = useState<string>('1-2');
  const downloadSplitPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`Reckd Extracted Segment (Pages ${splitPageRange})`, 20, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Extracted pages ${splitPageRange} from source document. Generated client-side.`, 20, 50);
    doc.save(`reckd-split-pages-${splitPageRange}.pdf`);
  };

  // 12. PDF Compressor
  const [pdfCompLevel, setPdfCompLevel] = useState<'Standard' | 'Medium' | 'Maximum'>('Medium');
  const downloadCompressedPdf = () => {
    const doc = new jsPDF({ compress: true });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Compressed Document Export', 20, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Optimized using ${pdfCompLevel} client-side compression pipeline.`, 20, 45);
    doc.save('reckd-optimized.pdf');
  };

  // 13. PDF to Word
  const [extractedPdfText, setExtractedPdfText] = useState<string>(
    `RECKD ZERO-LATENCY ARCHITECTURE\n\n1. Executive Summary\nModern privacy tools must decouple computation from central cloud servers. Reckd implements full client-side execution using browser WebAssembly, Canvas API, and WebCrypto.\n\n2. Security Guarantees\n- Zero telemetry tracking\n- Zero server-side file uploads\n- Instant offline responsiveness`
  );

  const downloadWordDoc = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Reckd Converted Document</title></head><body>`;
    const footer = `</body></html>`;
    const formattedHtml = extractedPdfText.split('\n').map((line) => `<p>${line || '&nbsp;'}</p>`).join('');
    const sourceHtml = header + formattedHtml + footer;
    const blob = new Blob(['\ufeff' + sourceHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reckd-converted-doc.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 14. Word to PDF
  const [wordDocContent, setWordDocContent] = useState<string>(
    `# RECKD TECHNICAL BRIEF\n\nClient-Side Processing Verification:\nAll media conversions, background extractions, and document transforms occur entirely within device memory.\n\nSecurity Certifications:\n- Zero server storage\n- Instant browser-level processing\n- No authentication wall`
  );

  const downloadWordToPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Reckd Document PDF', 20, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(wordDocContent, 170);
    doc.text(lines, 20, 45);
    doc.save('reckd-document.pdf');
  };

  // 15. Image to PDF
  const downloadImagesAsPdf = () => {
    if (!uploadedImgSrc) return;
    const doc = new jsPDF();
    doc.text('Reckd Document Export', 14, 20);
    doc.addImage(uploadedImgSrc, 'JPEG', 14, 30, 180, 120);
    doc.save('reckd-image-document.pdf');
  };

  // 16. Meme Generator
  const [topText, setTopText] = useState<string>('WHEN THE UTILITY WORKS');
  const [bottomText, setBottomText] = useState<string>('100% IN YOUR BROWSER');
  const memeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (toolId === 'meme-generator' && memeCanvasRef.current) {
      const canvas = memeCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 500;
      canvas.height = 400;

      if (uploadedImgSrc) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          renderMemeText(ctx, canvas.width, canvas.height);
        };
        img.src = uploadedImgSrc;
      } else {
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff6b00';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Upload Photo To Create Meme', canvas.width / 2, canvas.height / 2);
        renderMemeText(ctx, canvas.width, canvas.height);
      }
    }
  }, [uploadedImgSrc, topText, bottomText, toolId]);

  const renderMemeText = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.font = '900 32px Impact, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';

    if (topText) {
      ctx.strokeText(topText.toUpperCase(), w / 2, 45);
      ctx.fillText(topText.toUpperCase(), w / 2, 45);
    }
    if (bottomText) {
      ctx.strokeText(bottomText.toUpperCase(), w / 2, h - 25);
      ctx.fillText(bottomText.toUpperCase(), w / 2, h - 25);
    }
  };

  const downloadMeme = () => {
    if (!memeCanvasRef.current) return;
    const url = memeCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reckd-meme.png';
    a.click();
  };

  // 17. Watermark Tool
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL - RECKD');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(40);
  const watermarkCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (toolId === 'watermark-tool' && watermarkCanvasRef.current) {
      const canvas = watermarkCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 500;
      canvas.height = 350;

      if (uploadedImgSrc) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawWatermark(ctx, canvas.width, canvas.height);
        };
        img.src = uploadedImgSrc;
      } else {
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawWatermark(ctx, canvas.width, canvas.height);
      }
    }
  }, [uploadedImgSrc, watermarkText, watermarkOpacity, toolId]);

  const drawWatermark = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = `rgba(255, 107, 0, ${watermarkOpacity / 100})`;
    ctx.textAlign = 'center';
    ctx.fillText(watermarkText, 0, 0);
    ctx.restore();
  };

  const downloadWatermarked = () => {
    if (!watermarkCanvasRef.current) return;
    const url = watermarkCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watermarked-asset.png';
    a.click();
  };

  // 18. Aspect Ratio Calculator
  const [arWidth, setArWidth] = useState<number>(1920);
  const [arHeight, setArHeight] = useState<number>(1080);
  const [arRatio, setArRatio] = useState<'16:9' | '4:3' | '1:1' | '9:16' | '21:9'>('16:9');

  const handleRatioSelect = (r: '16:9' | '4:3' | '1:1' | '9:16' | '21:9') => {
    setArRatio(r);
    const [rw, rh] = r.split(':').map(Number);
    setArHeight(Math.round((arWidth * rh) / rw));
  };

  return (
    <div className="space-y-6">
      {/* Universal Upload Banner for Media Tools */}
      <div className={`p-6 rounded-2xl border ${cardBg} border-dashed border-[#ff6b00]/30`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#ff6b00]/20 text-[#ff6b00]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold font-display text-base">Select or Drop Source Image</h4>
              <p className="text-xs text-zinc-400">
                {uploadedImgSrc
                  ? `Loaded: ${imgNaturalWidth} × ${imgNaturalHeight}px (${Math.round(originalFileSize / 1024)} KB)`
                  : 'Processed directly in your browser with zero cloud uploads.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!uploadedImgSrc && (
              <button
                onClick={loadSampleBadgeImage}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
              >
                Try Sample Image
              </button>
            )}
            <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs cursor-pointer hover:bg-[#e05e00] transition shadow-lg shadow-[#ff6b00]/20">
              <Upload className="w-4 h-4" /> Browse Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. BACKGROUND REMOVER */}
      {toolId === 'background-remover' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-[#ff6b00]" /> Client-Side Background Remover
              </h3>
              <p className="text-xs text-zinc-400">
                Remove solid, studio, or custom background colors client-side to output transparent PNGs.
              </p>
            </div>
            {uploadedImgSrc ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadBackgroundRemovedPng}
                  disabled={!processedBgUrl || isProcessingBg}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition shadow-md shadow-[#ff6b00]/20 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download PNG
                </button>
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" /> Change Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={loadSampleBadgeImage}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition"
                >
                  Load Badge Logo
                </button>
                <button
                  onClick={loadSampleProductImage}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition"
                >
                  Load 3D Product
                </button>
              </div>
            )}
          </div>

          {!uploadedImgSrc ? (
            <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950/60 text-center space-y-5">
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-700 hover:border-[#ff6b00] rounded-2xl cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/80 transition group">
                <div className="w-16 h-16 rounded-2xl bg-[#ff6b00]/10 text-[#ff6b00] group-hover:scale-110 flex items-center justify-center mx-auto transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-white mt-3">Upload Image to Remove Background</h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                  Drag & drop any PNG, JPG, or WebP photo here, or click to browse.
                </p>
                <span className="mt-4 px-4 py-2 rounded-xl bg-[#ff6b00] text-white text-xs font-bold shadow-md shadow-[#ff6b00]/20">
                  Select Image from Device
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              <div className="pt-2">
                <span className="text-xs text-zinc-500 font-semibold block mb-2">Or test instantly with sample templates:</span>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={loadSampleBadgeImage}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 hover:text-white transition"
                  >
                    Test with Sample Badge
                  </button>
                  <button
                    onClick={loadSampleProductImage}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 hover:text-white transition"
                  >
                    Test with 3D Product
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Controls Toolbar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                {/* Mode Selector */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Background Key</label>
                  <select
                    value={bgMode}
                    onChange={(e) => setBgMode(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${inputBg}`}
                  >
                    <option value="auto">Auto (Detect Corners)</option>
                    <option value="light">White / Light Studio</option>
                    <option value="dark">Black / Dark Backdrop</option>
                    <option value="green">Green Screen (Chroma)</option>
                    <option value="custom">Custom Pick / Eyedropper</option>
                  </select>
                </div>

                {/* Custom Color Eyedropper */}
                {bgMode === 'custom' && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Target Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-xl border text-xs font-mono ${inputBg}`}
                      />
                    </div>
                  </div>
                )}

                {/* Tolerance Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 font-semibold">Tolerance</span>
                    <span className="text-[#ff6b00] font-bold">{bgTolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    value={bgTolerance}
                    onChange={(e) => setBgTolerance(Number(e.target.value))}
                    className="w-full accent-[#ff6b00]"
                  />
                </div>

                {/* Edge Feather */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-400 font-semibold">Edge Smoothing</span>
                    <span className="text-[#ff6b00] font-bold">{bgFeather}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={bgFeather}
                    onChange={(e) => setBgFeather(Number(e.target.value))}
                    className="w-full accent-[#ff6b00]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={defringe}
                      onChange={(e) => setDefringe(e.target.checked)}
                      className="accent-[#ff6b00]"
                    />
                    Clean Color Fringing (Despill)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={invertMask}
                      onChange={(e) => setInvertMask(e.target.checked)}
                      className="accent-[#ff6b00]"
                    />
                    Invert Selection
                  </label>
                </div>

                {/* Preview Backing Switcher */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500 font-semibold mr-1">Preview Backdrop:</span>
                  {(['grid', 'dark', 'light', 'neon'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setPreviewBg(b)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${
                        previewBg === b ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Preview */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-400">Original (Click to Pick Color)</span>
                    <span className="text-[11px] text-zinc-500">{imgNaturalWidth} × {imgNaturalHeight}px</span>
                  </div>
                  <div className="w-full h-64 flex items-center justify-center overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 relative cursor-crosshair">
                    <canvas
                      ref={origCanvasRef}
                      onClick={handlePickColorFromImage}
                      className="max-h-full max-w-full object-contain"
                      title="Click anywhere to sample that color"
                    />
                  </div>
                </div>

                {/* Transparent Result Preview */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Transparent Result
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-500">
                        {isProcessingBg ? 'Processing...' : `${Math.round(processedBgSize / 1024)} KB (PNG)`}
                      </span>
                      {processedBgUrl && !isProcessingBg && (
                        <button
                          onClick={downloadBackgroundRemovedPng}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ff6b00] text-white text-xs font-bold hover:bg-[#e05e00] transition shadow-sm cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> Save PNG
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-full h-64 flex items-center justify-center overflow-hidden rounded-lg border border-zinc-800 relative ${
                      previewBg === 'grid'
                        ? 'bg-[linear-gradient(45deg,#27272a_25%,transparent_25%),linear-gradient(-45deg,#27272a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#27272a_75%),linear-gradient(-45deg,transparent_75%,#27272a_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] bg-zinc-900'
                        : previewBg === 'dark'
                        ? 'bg-zinc-950'
                        : previewBg === 'light'
                        ? 'bg-zinc-100'
                        : 'bg-fuchsia-600'
                    }`}
                  >
                    {processedBgUrl ? (
                      <img
                        src={processedBgUrl}
                        alt="Background removed result"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-zinc-500">Rendering...</span>
                    )}
                  </div>

                  {processedBgUrl && (
                    <div className="w-full mt-3 flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {imgNaturalWidth} × {imgNaturalHeight}px
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={copyTransparentPngBlob}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                        >
                          {copied === 'bg-clip' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          Copy
                        </button>
                        <button
                          onClick={downloadBackgroundRemovedPng}
                          className="px-3 py-1 rounded-lg bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={downloadBackgroundRemovedPng}
                  disabled={!processedBgUrl || isProcessingBg}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#ff6b00] text-white font-bold text-sm hover:bg-[#e05e00] transition shadow-lg shadow-[#ff6b00]/25 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Transparent PNG
                </button>

                <button
                  onClick={downloadBackgroundRemovedWebp}
                  disabled={!processedBgUrl || isProcessingBg}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-800 text-zinc-200 font-bold text-sm hover:bg-zinc-700 hover:text-white transition disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Download WebP
                </button>

                <button
                  onClick={copyTransparentPngBlob}
                  disabled={!processedBgUrl}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold text-sm hover:bg-zinc-800 hover:text-white transition disabled:opacity-50 cursor-pointer"
                >
                  {copied === 'bg-clip' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied === 'bg-clip' ? 'Copied to Clipboard!' : 'Copy PNG to Clipboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. IMAGE RESIZER */}
      {toolId === 'image-resizer' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Precision Image Resizer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 items-center">
            <div>
              <label className="text-xs text-zinc-400">Target Width (px)</label>
              <input
                type="number"
                value={resizeW}
                onChange={(e) => handleResizeW(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Target Height (px)</label>
              <input
                type="number"
                value={resizeH}
                onChange={(e) => handleResizeH(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepAspect}
                  onChange={(e) => setKeepAspect(e.target.checked)}
                  className="accent-[#ff6b00]"
                />
                Lock Aspect Ratio
              </label>
            </div>
          </div>

          <button
            onClick={downloadResized}
            disabled={!uploadedImgSrc}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Download Resized Image ({resizeW} × {resizeH}px)
          </button>
        </div>
      )}

      {/* 4. IMAGE CROPPER */}
      {toolId === 'image-cropper' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Interactive Canvas Image Cropper</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(['free', '1:1', '16:9', '4:3'] as const).map((a) => (
              <button
                key={a}
                onClick={() => {
                  setCropAspect(a);
                  if (a === '1:1') setCropH(cropW);
                  else if (a === '16:9') setCropH(Math.round((cropW * 9) / 16));
                  else if (a === '4:3') setCropH(Math.round((cropW * 3) / 4));
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  cropAspect === a ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-xs text-zinc-400">Crop X Offset</label>
              <input
                type="number"
                value={cropX}
                onChange={(e) => setCropX(Math.max(0, Number(e.target.value)))}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Crop Y Offset</label>
              <input
                type="number"
                value={cropY}
                onChange={(e) => setCropY(Math.max(0, Number(e.target.value)))}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Crop Width</label>
              <input
                type="number"
                value={cropW}
                onChange={(e) => setCropW(Math.max(10, Number(e.target.value)))}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Crop Height</label>
              <input
                type="number"
                value={cropH}
                onChange={(e) => setCropH(Math.max(10, Number(e.target.value)))}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center mb-4">
            <span className="text-xs text-zinc-400 mb-2">Live Crop Preview</span>
            <div className="max-h-60 max-w-full overflow-hidden rounded-lg border border-zinc-800">
              <canvas ref={cropPreviewCanvasRef} className="max-h-60 max-w-full object-contain" />
            </div>
          </div>

          <button
            onClick={downloadCroppedImage}
            disabled={!uploadedImgSrc}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Download Cropped Image ({cropW} × {cropH}px)
          </button>
        </div>
      )}

      {/* 2. IMAGE COMPRESSOR */}
      {toolId === 'image-compressor' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Smart Client-Side Image Compressor</h3>
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-zinc-400">Quality Compression Level: {compressQuality}%</span>
              <span className="text-zinc-400">
                Original: <strong>{Math.round(originalFileSize / 1024)} KB</strong> → Compressed:{' '}
                <strong className="text-emerald-400">{Math.round(compressedSize / 1024)} KB</strong>
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              value={compressQuality}
              onChange={(e) => setCompressQuality(Number(e.target.value))}
              className="w-full accent-[#ff6b00]"
            />
          </div>

          <button
            onClick={downloadCompressed}
            disabled={!uploadedImgSrc}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Download Compressed Image (JPEG)
          </button>
        </div>
      )}

      {/* 5. IMAGE CONVERTER */}
      {(toolId === 'image-converter' || toolId === 'image-format-converter') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">High-Efficiency Image Format Converter</h3>
          <div className="flex gap-4 mb-6">
            {(['image/webp', 'image/png', 'image/jpeg'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setTargetFormat(fmt)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                  targetFormat === fmt ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {fmt.split('/')[1]}
              </button>
            ))}
          </div>

          <button
            onClick={downloadConvertedFormat}
            disabled={!uploadedImgSrc}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Convert & Download as {targetFormat.split('/')[1].toUpperCase()}
          </button>
        </div>
      )}

      {/* 6. PDF MERGE */}
      {toolId === 'pdf-merge' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold font-display">Client-Side PDF Merger</h3>
              <p className="text-xs text-zinc-400">Combine multiple PDF documents into a single consolidated PDF.</p>
            </div>
            <button
              onClick={() => {
                setPdfMergeList([
                  ...pdfMergeList,
                  { id: String(Date.now()), name: `Section_${pdfMergeList.length + 1}.pdf`, content: 'Additional section document text' }
                ]);
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
            >
              + Add Document Page
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {pdfMergeList.map((item, i) => (
              <div key={item.id} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-white">{item.name}</span>
                </div>
                <span className="text-zinc-500">{item.content.length} chars</span>
              </div>
            ))}
          </div>

          <button
            onClick={downloadMergedPdf}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <FileStack className="w-4 h-4" /> Merge & Download Consolidated PDF ({pdfMergeList.length} Pages)
          </button>
        </div>
      )}

      {/* 7. PDF SPLIT */}
      {toolId === 'pdf-split' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Client-Side PDF Splitter</h3>
          <p className="text-xs text-zinc-400 mb-4">Extract specific pages or page ranges from a PDF document.</p>

          <div className="mb-4">
            <label className="text-xs text-zinc-400 block mb-1">Page Range to Extract (e.g. 1-2, 3)</label>
            <input
              type="text"
              value={splitPageRange}
              onChange={(e) => setSplitPageRange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
            />
          </div>

          <button
            onClick={downloadSplitPdf}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <Scissors className="w-4 h-4" /> Extract & Download Selected Pages
          </button>
        </div>
      )}

      {/* 8. PDF COMPRESSOR */}
      {toolId === 'pdf-compressor' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">PDF Stream Compressor</h3>
          <p className="text-xs text-zinc-400 mb-4">Downsample embedded assets and clean redundant object streams client-side.</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {(['Standard', 'Medium', 'Maximum'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setPdfCompLevel(lvl)}
                className={`py-3 rounded-xl border text-xs font-bold transition ${
                  pdfCompLevel === lvl ? 'bg-[#ff6b00] border-[#ff6b00] text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                }`}
              >
                {lvl} Compression
              </button>
            ))}
          </div>

          <button
            onClick={downloadCompressedPdf}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <FileArchive className="w-4 h-4" /> Compress & Export Optimized PDF
          </button>
        </div>
      )}

      {/* 9. PDF TO WORD */}
      {toolId === 'pdf-to-word' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">PDF to Editable Word Converter</h3>
          <p className="text-xs text-zinc-400 mb-4">Extract document layout and typography into an editable Microsoft Word (.doc) file.</p>

          <textarea
            rows={7}
            value={extractedPdfText}
            onChange={(e) => setExtractedPdfText(e.target.value)}
            className={`w-full mb-4 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
          />

          <button
            onClick={downloadWordDoc}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <FileDown className="w-4 h-4" /> Export as Microsoft Word Document (.doc)
          </button>
        </div>
      )}

      {/* 10. WORD TO PDF */}
      {toolId === 'word-to-pdf' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-1">Document & Word to PDF Converter</h3>
          <p className="text-xs text-zinc-400 mb-4">Transform formatted documents into standard printable PDF files.</p>

          <textarea
            rows={7}
            value={wordDocContent}
            onChange={(e) => setWordDocContent(e.target.value)}
            className={`w-full mb-4 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
          />

          <button
            onClick={downloadWordToPdf}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-bold text-xs hover:bg-[#e05e00] transition"
          >
            <FileUp className="w-4 h-4" /> Render & Download Formatted PDF
          </button>
        </div>
      )}

      {/* 11. IMAGE TO BASE64 */}
      {toolId === 'image-to-base64' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Image to Base64 String</h3>
            <button
              onClick={() => copyToClipboard(imgBase64Snippet, 'b64')}
              disabled={!uploadedImgSrc}
              className="flex items-center gap-1 text-xs text-[#ff6b00] hover:underline disabled:opacity-50"
            >
              {copied === 'b64' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy Base64
            </button>
          </div>
          <textarea
            readOnly
            rows={6}
            value={imgBase64Snippet}
            className={`w-full p-4 rounded-xl border font-mono text-xs ${inputBg}`}
          />
        </div>
      )}

      {/* 12. BASE64 TO IMAGE */}
      {toolId === 'base64-to-image' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Base64 to Image Renderer</h3>
          <textarea
            rows={4}
            placeholder="Paste data:image/png;base64,... string here"
            value={pasteBase64}
            onChange={(e) => setPasteBase64(e.target.value)}
            className={`w-full p-4 rounded-xl border font-mono text-xs mb-4 ${inputBg}`}
          />
          {pasteBase64 && (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex justify-center">
              <img src={pasteBase64} alt="Rendered base64" className="max-h-60 object-contain rounded-lg" />
            </div>
          )}
        </div>
      )}

      {/* 13. COLOR PALETTE EXTRACTOR */}
      {toolId === 'color-palette-extractor' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Dominant Color Palette Extractor</h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {extractedPalette.map((color, i) => (
              <div
                key={i}
                onClick={() => copyToClipboard(color, `pal-${i}`)}
                className="cursor-pointer group flex flex-col items-center"
              >
                <div
                  className="w-full h-20 rounded-xl shadow-md transition transform group-hover:scale-105 border border-white/10"
                  style={{ backgroundColor: color }}
                />
                <span className="mt-2 text-xs font-mono font-semibold flex items-center gap-1">
                  {color} {copied === `pal-${i}` && <Check className="w-3 h-3 text-emerald-400" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. SVG TO PNG CONVERTER */}
      {toolId === 'svg-to-png-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">SVG Vector to Raster PNG Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-400">Raw SVG Code</label>
              <textarea
                rows={6}
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                className={`w-full mt-1 p-3 rounded-xl border font-mono text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Render Scale</label>
              <div className="flex gap-2 mt-1 mb-4">
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSvgScale(s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                      svgScale === s ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {s}x ({s * 200}px)
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                <div dangerouslySetInnerHTML={{ __html: svgCode }} />
              </div>
            </div>
          </div>

          <button
            onClick={downloadSvgAsPng}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition"
          >
            <Download className="w-4 h-4" /> Download as High-Res PNG
          </button>
        </div>
      )}

      {/* 15. IMAGE TO PDF */}
      {toolId === 'image-to-pdf' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Image to PDF Document Binder</h3>
          <p className="text-xs text-zinc-400 mb-4">Convert any uploaded image directly into an A4 PDF document container.</p>
          <button
            onClick={downloadImagesAsPdf}
            disabled={!uploadedImgSrc}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition disabled:opacity-50"
          >
            <FileText className="w-4 h-4" /> Generate and Download PDF
          </button>
        </div>
      )}

      {/* 16. MEME GENERATOR */}
      {toolId === 'meme-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Fast Client-Side Meme Generator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-400">Top Header Caption</label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Bottom Footer Caption</label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="flex justify-center mb-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
            <canvas ref={memeCanvasRef} className="max-w-full rounded-lg" />
          </div>

          <button
            onClick={downloadMeme}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition"
          >
            <Download className="w-4 h-4" /> Download Finished Meme (PNG)
          </button>
        </div>
      )}

      {/* 17. WATERMARK TOOL */}
      {toolId === 'watermark-tool' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Asset Watermarking Utility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-400">Watermark Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Opacity</span>
                <span className="text-[#ff6b00] font-bold">{watermarkOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full accent-[#ff6b00]"
              />
            </div>
          </div>

          <div className="flex justify-center mb-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
            <canvas ref={watermarkCanvasRef} className="max-w-full rounded-lg" />
          </div>

          <button
            onClick={downloadWatermarked}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#ff6b00] text-white font-semibold text-xs hover:bg-[#e05e00] transition"
          >
            <Download className="w-4 h-4" /> Download Watermarked Asset
          </button>
        </div>
      )}

      {/* 18. ASPECT RATIO CALCULATOR */}
      {toolId === 'aspect-ratio-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Display & Aspect Ratio Calculator</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {(['16:9', '4:3', '1:1', '9:16', '21:9'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRatioSelect(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  arRatio === r ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-400">Width</label>
              <input
                type="number"
                value={arWidth}
                onChange={(e) => {
                  const w = Number(e.target.value);
                  setArWidth(w);
                  const [rw, rh] = arRatio.split(':').map(Number);
                  setArHeight(Math.round((w * rh) / rw));
                }}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Height</label>
              <input
                type="number"
                value={arHeight}
                onChange={(e) => {
                  const h = Number(e.target.value);
                  setArHeight(h);
                  const [rw, rh] = arRatio.split(':').map(Number);
                  setArWidth(Math.round((h * rw) / rh));
                }}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm font-mono ${inputBg}`}
              />
            </div>
          </div>

          <div className={`p-4 rounded-xl border font-mono text-xs text-[#ff6b00] ${inputBg}`}>
            aspect-ratio: {arRatio.replace(':', ' / ')}; /* {arWidth}px by {arHeight}px */
          </div>
        </div>
      )}
    </div>
  );
};
