import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: 'orange' | 'white' | 'black';
  alpha: number;
  decay: number;
  gravity: number;
  rotation: number;
  vRot: number;
}

export const CelestialOrbSystem: React.FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroOrbRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hasExplodedRef = useRef<boolean>(false);

  // Smooth lerp position for mini follower orb
  const followerPosRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  });
  const followerElemRef = useRef<HTMLDivElement | null>(null);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Physical explosion engine: ball shatters and disintegrates into mostly orange, white, and black particles
  const createExplosion = (originX: number, originY: number) => {
    const count = 220;
    const newParticles: Particle[] = [];
    const ballRadius = 85;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Spawn particles distributed across the ball's volume and circumference
      const dist = Math.sqrt(Math.random()) * ballRadius;
      const px = originX + Math.cos(angle) * dist;
      const py = originY + Math.sin(angle) * dist;

      // Blast vector propelling fragments outward from the center
      const speed = Math.random() * 15 + 4;
      const vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 2;
      const vy = Math.sin(angle) * speed + (Math.random() - 0.5) * 2;

      // Color distribution: strict space debris - mostly orange (~72%), white (~18%), black fragments (~10%)
      const rand = Math.random();
      let color = '#ff6b00';
      let type: 'orange' | 'white' | 'black' = 'orange';

      if (rand < 0.72) {
        type = 'orange';
        color = Math.random() > 0.4 ? '#ff6b00' : '#ff852e';
      } else if (rand < 0.90) {
        type = 'white';
        color = '#ffffff';
      } else {
        type = 'black';
        color = '#0a0a0a';
      }

      newParticles.push({
        x: px,
        y: py,
        vx,
        vy,
        size: type === 'black' ? Math.random() * 2.5 + 1.2 : Math.random() * 2.2 + 0.8,
        color,
        type,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.009,
        gravity: 0.035,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.18,
      });
    }

    particlesRef.current = newParticles;
  };

  // Trigger real explosion upon scrolling through the hero section (one-way only, does not re-arm)
  useEffect(() => {
    if (scrollY > 50 && !hasExplodedRef.current) {
      hasExplodedRef.current = true;
      setIsExploded(true);

      let originX = window.innerWidth / 2;
      let originY = window.innerHeight * 0.38;

      if (heroOrbRef.current) {
        const rect = heroOrbRef.current.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }

      // Convert the exploded big ball into the small ball by starting right at the explosion epicenter
      followerPosRef.current = { x: originX, y: originY };

      createExplosion(originX, originY);
    }
  }, [scrollY]);

  // Particle explosion rendering & follower physics loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleCanvasResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleCanvasResize();
    window.addEventListener('resize', handleCanvasResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render cosmic explosion particles
      if (particlesRef.current.length > 0) {
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.96; // drag
          p.vy *= 0.96;
          p.alpha -= p.decay;
          p.rotation += p.vRot;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (p.type === 'orange') {
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff6b00';
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'white') {
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Black particle (cosmic matter fragments)
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#0a0a0a';
            ctx.strokeStyle = '#262626';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      // Smooth follower position update: follows cursor slightly above (mouseY - 32px)
      if (followerElemRef.current) {
        const targetX = mousePos.x;
        const targetY = mousePos.y - 32;

        followerPosRef.current.x += (targetX - followerPosRef.current.x) * 0.18;
        followerPosRef.current.y += (targetY - followerPosRef.current.y) * 0.18;

        followerElemRef.current.style.transform = `translate3d(${followerPosRef.current.x}px, ${followerPosRef.current.y}px, 0px) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleCanvasResize);
    };
  }, [mousePos]);

  return (
    <>
      {/* Canvas for Particle Explosion Overlay */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-30"
      />

      {/* 1. COMPACT HERO CELESTIAL SPHERE: Centered directly behind RECKD text (Disappears completely once exploded) */}
      {!isExploded && (
        <div
          ref={heroOrbRef}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 flex items-center justify-center"
          style={{ perspective: 1000 }}
        >
          {/* Deep Nebula Glow Aura */}
          <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-tr from-[#ff6b00]/25 via-[#ff6b00]/10 to-transparent blur-[60px] animate-wave-pulse" />

          {/* Concentric Ethereal Wave Ripples */}
          <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[330px] md:h-[330px] rounded-full border border-[#ff6b00]/25 animate-wave-pulse" />
          <div
            className="absolute w-[260px] h-[260px] sm:w-[330px] sm:h-[330px] md:w-[390px] md:h-[390px] rounded-full border border-dashed border-[#ff6b00]/15 animate-wave-pulse"
            style={{ animationDelay: '1.2s' }}
          />

          {/* REVOLVING ORANGE WAVES (3D Orbital Rings, 20% faster) */}
          <div className="absolute w-[240px] h-[240px] sm:w-[310px] sm:h-[310px] md:w-[360px] md:h-[360px] rounded-full animate-wave-orbit-1 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-transparent border-t-[#ff6b00] border-r-[#ffae53]/80 border-b-[#ff6b00]/20 filter drop-shadow-[0_0_10px_rgba(255,107,0,0.85)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_16px_6px_rgba(255,107,0,0.9)]" />
          </div>

          <div className="absolute w-[210px] h-[210px] sm:w-[280px] sm:h-[280px] md:w-[330px] md:h-[330px] rounded-full animate-wave-orbit-2 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-[1.5px] border-dashed border-[#ff6b00]/70 filter drop-shadow-[0_0_12px_rgba(255,148,77,0.7)]" />
            <div className="absolute bottom-0 right-1/4 w-2.5 h-2.5 rounded-full bg-[#ffae53] shadow-[0_0_12px_4px_rgba(255,107,0,0.9)]" />
          </div>

          <div className="absolute w-[250px] h-[250px] sm:w-[330px] sm:h-[330px] md:w-[390px] md:h-[390px] rounded-full animate-wave-orbit-3 flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-t-[#ff944d] border-b-transparent border-l-[#ff6b00]/40 filter drop-shadow-[0_0_8px_rgba(255,107,0,0.6)]" />
          </div>

          {/* THE ORANGE BALL (Compact Celestial Sphere, 20% faster spin) */}
          <div className="relative w-[160px] h-[160px] sm:w-[210px] sm:h-[210px] md:w-[250px] md:h-[250px] rounded-full shadow-[0_0_70px_25px_rgba(255,107,0,0.4)] animate-solar-flare flex items-center justify-center">
            <div className="absolute inset-[-3px] rounded-full border border-[#ffae53]/50 blur-[1px]" />

            <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 32%, #ffffff 0%, #ffc078 14%, #ff8c21 30%, #ff6b00 52%, #c44000 76%, #451203 92%, #140400 100%)',
                }}
              />

              {/* Surface Plasma Bands - 20% faster */}
              <div className="absolute inset-0 rounded-full animate-celestial-spin opacity-85 mix-blend-screen">
                <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="solarFlareGradHeroCompact" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#ffae53" stopOpacity="0.6" />
                      <stop offset="80%" stopColor="#ff6b00" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ff6b00" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="#ffae53" strokeWidth="2.5" opacity="0.65" strokeDasharray="12 8" />
                  <ellipse cx="200" cy="200" rx="180" ry="110" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.4" strokeDasharray="20 14" />
                  <ellipse cx="200" cy="200" rx="180" ry="160" fill="none" stroke="#ff8c21" strokeWidth="2" opacity="0.55" strokeDasharray="16 10" />
                  <ellipse cx="200" cy="200" rx="80" ry="180" fill="none" stroke="#ffae53" strokeWidth="2" opacity="0.45" strokeDasharray="14 12" />
                  <ellipse cx="200" cy="200" rx="140" ry="180" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.35" strokeDasharray="22 16" />
                  <circle cx="120" cy="140" r="45" fill="url(#solarFlareGradHeroCompact)" />
                  <circle cx="270" cy="250" r="60" fill="url(#solarFlareGradHeroCompact)" />
                </svg>
              </div>

              {/* Reverse fine plasma mesh - 20% faster */}
              <div className="absolute inset-0 rounded-full animate-celestial-spin-reverse opacity-60 mix-blend-overlay">
                <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 50,200 Q 120,80 200,200 T 350,200"
                    fill="none"
                    stroke="#ffddaa"
                    strokeWidth="3"
                    opacity="0.7"
                    strokeDasharray="8 6"
                  />
                  <path
                    d="M 50,200 Q 120,320 200,200 T 350,200"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    opacity="0.6"
                    strokeDasharray="14 8"
                  />
                  <circle cx="280" cy="130" r="50" fill="#ffffff" opacity="0.25" filter="blur(10px)" />
                </svg>
              </div>

              {/* 3D Specular Curvature */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 45%, rgba(0, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0.88) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. CURSOR-FOLLOWER MINI ORB: CONVERTED FROM THE EXPLODED BALL (No big ball after explosion) */}
      {isExploded && (
        <div
          ref={followerElemRef}
          aria-hidden="true"
          className="fixed top-0 left-0 pointer-events-none select-none z-50 flex items-center justify-center transition-opacity duration-200"
          style={{
            transform: `translate3d(${followerPosRef.current.x}px, ${followerPosRef.current.y}px, 0px) translate(-50%, -50%)`,
            perspective: 400,
          }}
        >
          {/* Micro ambient orange glow */}
          <div className="absolute w-6 h-6 rounded-full bg-[#ff6b00]/30 blur-md" />

          {/* Micro Revolving Orbital Wave Ring 1 (20% faster: 4.8s) */}
          <div className="absolute w-[20px] h-[20px] rounded-full animate-follower-wave-orbit-1 flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-transparent border-t-[#ffae53] border-r-[#ff6b00] filter drop-shadow-[0_0_4px_rgba(255,107,0,0.9)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_2px_rgba(255,107,0,0.9)]" />
          </div>

          {/* Micro Revolving Orbital Wave Ring 2 (20% faster: 6.8s) */}
          <div className="absolute w-[16px] h-[16px] rounded-full animate-follower-wave-orbit-2 flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-dashed border-[#ff944d]/85 filter drop-shadow-[0_0_3px_rgba(255,148,77,0.8)]" />
            <div className="absolute bottom-0 right-1/4 w-[3px] h-[3px] rounded-full bg-[#ffae53] shadow-[0_0_4px_1.5px_rgba(255,107,0,0.9)]" />
          </div>

          {/* 90% SMALLER ORANGE BALL (Diameter 8px, 20% faster spin: 5.5s) */}
          <div className="relative w-2 h-2 rounded-full shadow-[0_0_10px_4px_rgba(255,107,0,0.7)] flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, #ffffff 0%, #ffc078 20%, #ff8c21 45%, #ff6b00 70%, #c44000 90%, #300c02 100%)',
                }}
              />

              {/* Fast micro spinning arcs */}
              <div className="absolute inset-0 rounded-full animate-follower-spin opacity-90 mix-blend-screen">
                <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="#ffffff" strokeWidth="4" strokeDasharray="10 8" />
                  <ellipse cx="50" cy="50" rx="45" ry="34" fill="none" stroke="#ffae53" strokeWidth="4" strokeDasharray="12 10" />
                  <circle cx="35" cy="35" r="12" fill="#ffffff" opacity="0.8" />
                </svg>
              </div>

              {/* Specular highlight */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 60%, rgba(0, 0, 0, 0.6) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
