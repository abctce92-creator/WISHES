import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
  isStarGlint: boolean;
}

export const SparkleDustCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(255, 223, 140, ', // Gold sparkle
      'rgba(250, 204, 120, ', // Warm gold
      'rgba(244, 208, 224, ', // Blush pink
      'rgba(233, 213, 255, ', // Warm lavender
      'rgba(220, 252, 231, ', // Sage green tint
      'rgba(255, 255, 255, ', // Pure diamond light
    ];

    const particleCount = Math.min(85, Math.floor((width * height) / 16000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.6 + 0.8,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.45 - 0.15, // Soft upward drift
        alpha: Math.random() * 0.7 + 0.2,
        maxAlpha: Math.random() * 0.6 + 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.035 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        isStarGlint: Math.random() < 0.25,
      });
    }

    // Interactive pointer sparkles
    const cursorParticles: Particle[] = [];
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (cursorParticles.length < 35) {
        cursorParticles.push({
          x: clientX + (Math.random() - 0.5) * 16,
          y: clientY + (Math.random() - 0.5) * 16,
          size: Math.random() * 2.8 + 1.2,
          speedX: (Math.random() - 0.5) * 1.2,
          speedY: (Math.random() - 0.5) * 1.2 - 0.4,
          alpha: 1,
          maxAlpha: 1,
          color: colors[Math.floor(Math.random() * 3)], // Gold & pink bias
          twinkleSpeed: 0.04,
          twinklePhase: 0,
          isStarGlint: Math.random() < 0.4,
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Render ambient drifting particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX + Math.sin(time + p.twinklePhase) * 0.2;
        p.y += p.speedY;

        // Wrap around edges seamlessly
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = Math.max(
          0.05,
          p.maxAlpha * (0.5 + 0.5 * Math.sin(time * 2 + p.twinklePhase))
        );

        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Delicate star glint for special particles
        if (p.isStarGlint && currentAlpha > 0.4) {
          ctx.strokeStyle = `rgba(255, 248, 220, ${currentAlpha * 0.85})`;
          ctx.lineWidth = 0.75;
          const arm = p.size * 2.8;

          ctx.beginPath();
          ctx.moveTo(p.x - arm, p.y);
          ctx.lineTo(p.x + arm, p.y);
          ctx.moveTo(p.x, p.y - arm);
          ctx.lineTo(p.x, p.y + arm);
          ctx.stroke();
        }
      }

      // Render interactive cursor sparkles
      for (let i = cursorParticles.length - 1; i >= 0; i--) {
        const cp = cursorParticles[i];
        cp.x += cp.speedX;
        cp.y += cp.speedY;
        cp.alpha -= 0.025;

        if (cp.alpha <= 0) {
          cursorParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${cp.color}${cp.alpha})`;
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, cp.size, 0, Math.PI * 2);
        ctx.fill();

        if (cp.isStarGlint && cp.alpha > 0.3) {
          ctx.strokeStyle = `rgba(255, 235, 170, ${cp.alpha})`;
          ctx.lineWidth = 0.8;
          const arm = cp.size * 2.4;
          ctx.beginPath();
          ctx.moveTo(cp.x - arm, cp.y);
          ctx.lineTo(cp.x + arm, cp.y);
          ctx.moveTo(cp.x, cp.y - arm);
          ctx.lineTo(cp.x, cp.y + arm);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
};
