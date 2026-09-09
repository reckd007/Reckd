import React, { useEffect, useRef } from 'react';

interface StarfieldCanvasProps {
  theme: 'dark' | 'light';
}

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  isOrange: boolean;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  side: 'left' | 'right';
  driftX: number;
  driftY: number;
  layer: number; // For parallax depth
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates relative to center
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Scroll tracking
    let scrollY = window.scrollY;
    let currentSplitProgress = 0;
    let currentVisibility = 1.0;
    let targetVisibility = 1.0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized from -1 to 1 relative to center
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Create stars
    let stars: Star[] = [];
    const STAR_COUNT = Math.min(1200, Math.floor((width * height) / 900));

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const isOrange = Math.random() < 0.22; // ~22% orange glowing stars
        const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
        const baseX = Math.random() * width;
        const baseY = Math.random() * height;
        const layer = Math.random() * 0.8 + 0.2; // 0.2 to 1.0 (depth)

        stars.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          size: isOrange ? Math.random() * 2.2 + 1.0 : Math.random() * 1.5 + 0.4,
          color: isOrange ? '#ff6b00' : '#ffffff',
          isOrange,
          alpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          side,
          driftX: (Math.random() - 0.5) * 0.15,
          driftY: (Math.random() - 0.5) * 0.15,
          layer,
        });
      }
    };

    initStars();

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Calculate visibility based on scroll position relative to Hero and Featured section:
      // In hero section: targetVisibility is 1.0 (stars active & sparkling).
      // As user scrolls through hero and enters the Featured section: targetVisibility drops smoothly to 0.0.
      // When scrolling back up to the hero section: targetVisibility returns to 1.0.
      const featuredElem = document.getElementById('featured');
      if (featuredElem) {
        const rect = featuredElem.getBoundingClientRect();
        // rect.top is viewport-relative distance to featured section top
        const startFade = height * 1.15; // Begins fading when scrolling through the lower half of hero
        const endFade = height * 0.35;   // Completely faded once the featured section has entered the viewport

        if (rect.top >= startFade) {
          targetVisibility = 1.0;
        } else if (rect.top <= endFade) {
          targetVisibility = 0.0;
        } else {
          const ratio = (rect.top - endFade) / (startFade - endFade);
          // Smooth Hermite interpolation curve
          targetVisibility = ratio * ratio * (3 - 2 * ratio);
        }
      } else {
        // Fallback using viewport-relative scroll position
        const startFadeScroll = height * 0.25;
        const endFadeScroll = height * 0.90;
        if (scrollY <= startFadeScroll) {
          targetVisibility = 1.0;
        } else if (scrollY >= endFadeScroll) {
          targetVisibility = 0.0;
        } else {
          const ratio = (endFadeScroll - scrollY) / (endFadeScroll - startFadeScroll);
          targetVisibility = ratio * ratio * (3 - 2 * ratio);
        }
      }

      // Smooth lerp for liquid, animating appearance and disappearance
      currentVisibility += (targetVisibility - currentVisibility) * 0.07;
      if (currentVisibility < 0.002) currentVisibility = 0;
      if (currentVisibility > 0.998) currentVisibility = 1;

      // Update canvas style opacity
      canvas.style.opacity = (currentVisibility * 0.95).toFixed(3);

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Target split progress based on scroll
      const targetSplit = Math.min(1, Math.max(0, scrollY / 550));
      currentSplitProgress += (targetSplit - currentSplitProgress) * 0.06;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // When stars are completely invisible (scrolled into featured or lower sections), skip heavy draws
      if (currentVisibility <= 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // In dark mode: deep space gradient scaled by visibility
      if (theme === 'dark') {
        const bgGrad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          50,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.85
        );
        bgGrad.addColorStop(0, `rgba(15, 12, 8, ${currentVisibility})`);
        bgGrad.addColorStop(0.5, `rgba(7, 7, 9, ${currentVisibility})`);
        bgGrad.addColorStop(1, `rgba(3, 3, 4, ${currentVisibility})`);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        const bgGrad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          50,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.85
        );
        bgGrad.addColorStop(0, `rgba(250, 247, 242, ${currentVisibility})`);
        bgGrad.addColorStop(0.5, `rgba(245, 243, 239, ${currentVisibility})`);
        bgGrad.addColorStop(1, `rgba(236, 234, 229, ${currentVisibility})`);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Parallax offsets
      const parallaxOffsetX = -currentMouseX * 38;
      const parallaxOffsetY = -currentMouseY * 38;

      const isDark = theme === 'dark';
      const disperseProgress = 1 - currentVisibility;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Continuous float
        star.baseX += star.driftX;
        star.baseY += star.driftY;

        // Wrap around bounds
        if (star.baseX < 0) star.baseX += width;
        if (star.baseX > width) star.baseX -= width;
        if (star.baseY < 0) star.baseY += height;
        if (star.baseY > height) star.baseY -= height;

        // Twinkle phase & combined alpha with scroll visibility
        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = 0.5 + 0.5 * Math.sin(star.twinklePhase);
        const currentAlpha = star.alpha * (0.4 + 0.6 * twinkleFactor) * currentVisibility;

        if (currentAlpha <= 0.005) continue;

        // Dynamic star scale: smoothly shrinks as it dissolves into space
        const currentSize = star.size * (0.25 + 0.75 * currentVisibility);

        // Scroll Parting / Splitting Calculation
        let splitShiftX = 0;
        if (currentSplitProgress > 0.01) {
          if (star.side === 'left') {
            const targetX = (star.baseX / width) * (width * 0.22);
            splitShiftX = (targetX - star.baseX) * currentSplitProgress;
          } else {
            const targetX = width - ((width - star.baseX) / width) * (width * 0.22);
            splitShiftX = (targetX - star.baseX) * currentSplitProgress;
          }
        }

        // Animating cosmic dispersal: gently scatters outward as it disappears
        const disperseX = (star.side === 'left' ? -width * 0.12 : width * 0.12) * disperseProgress * star.layer;
        const disperseY = Math.sin(star.twinklePhase) * 22 * disperseProgress * star.layer;

        // Final rendered position
        const drawX = star.baseX + splitShiftX + disperseX + parallaxOffsetX * star.layer;
        const drawY = star.baseY + disperseY + parallaxOffsetY * star.layer;

        // Render star
        ctx.beginPath();
        ctx.arc(drawX, drawY, currentSize, 0, Math.PI * 2);

        if (star.isOrange) {
          ctx.fillStyle = isDark
            ? `rgba(255, 107, 0, ${currentAlpha})`
            : `rgba(225, 90, 0, ${Math.min(1, currentAlpha * 1.3)})`;

          // Outer glow for orange stars
          ctx.shadowBlur = (isDark ? 10 : 4) * currentVisibility;
          ctx.shadowColor = `rgba(255, 107, 0, ${0.8 * currentVisibility})`;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else {
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${currentAlpha})`
            : `rgba(40, 40, 48, ${currentAlpha * 0.85})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      id="reckd-starfield"
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.95 }}
    />
  );
};
