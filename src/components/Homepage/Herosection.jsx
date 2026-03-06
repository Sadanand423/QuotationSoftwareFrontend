import React, { useEffect, useMemo, useState } from "react";

const HeroSection = ({onGetStarted}) => {
  const [stage, setStage] = useState("globe");

  // ===== TEXT → PARTICLE POINTS =====
  const getTextPoints = (text) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = "bold 180px Arial";

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight =
    metrics.actualBoundingBoxAscent +
    metrics.actualBoundingBoxDescent;

  canvas.width = Math.ceil(textWidth + 200);
  canvas.height = Math.ceil(textHeight + 200);

  ctx.font = "bold 180px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const points = [];
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const Y_OFFSET = -40;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 120) {
        points.push({
          x: x - canvas.width / 2,        // centered to screen
          y: y - canvas.height / 2 + Y_OFFSET,
        });
      }
    }
  }

  return points;
};


  const textPoints = useMemo(() => getTextPoints("Smart Matrix"), []);

  // ===== PARTICLES (OPTIMIZED COUNT) =====
  const particles = useMemo(() => {
    const count = 5000; // smoother
    const r = 220;

    return Array.from({ length: count }).map((_, i) => {
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = 2 * Math.PI * Math.random();

      const sx = r * Math.sin(phi) * Math.cos(theta);
      const sy = r * Math.sin(phi) * Math.sin(theta);
      const sz = r * Math.cos(phi);

      const cx = (Math.random() - 0.5) * window.innerWidth * 1.2;
      const cy = (Math.random() - 0.5) * window.innerHeight * 1.2;

      const bx = (Math.random() - 0.5) * 600;
      const by = (Math.random() - 0.5) * 60;

const tp = textPoints[Math.floor(Math.random() * textPoints.length)];
      return {
        id: i,
        sx,
        sy,
        sz,
        cx,
        cy,
        bx,
        by,
        tx: tp.x,
        ty: tp.y,
        size: Math.random() * 2 + 0.6,
      };
    });
  }, [textPoints]);

  // ===== STAGES =====
  useEffect(() => {
    const t1 = setTimeout(() => setStage("collapse"), 3500);
    const t2 = setTimeout(() => setStage("band"), 5500);
    const t3 = setTimeout(() => setStage("text"), 7500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section className="hero">
      {stage === "text" && (
  <div className="welcome">
    Welcome to
  </div>
)}
      <div className="scene">
        {particles.map((p) => (
          <div
            key={p.id}
            className="dot"
            style={{
              width: p.size,
              height: p.size,
              "--sx": `${p.sx}px`,
              "--sy": `${p.sy}px`,
              "--sz": `${p.sz}px`,
              "--cx": `${p.cx}px`,
              "--cy": `${p.cy}px`,
              "--bx": `${p.bx}px`,
              "--by": `${p.by}px`,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              animation:
                stage === "globe"
                  ? "sphereRotate 12s linear infinite"
                  : stage === "collapse"
                  ? "collapseFull 1.8s ease forwards"
                  : stage === "band"
                  ? "toBand 1.6s ease forwards"
                  : "toText 2s cubic-bezier(.25,.9,.3,1) forwards",
            }}
          />
        ))}
      </div>

      {stage === "text" && (
  <div className="cta">
    <div className="cta-inner">
      <button className="cta-primary" onClick={onGetStarted}>
        Get Started
      </button>
      <button className="cta-secondary">
        Watch Demo
      </button>
    </div>
  </div>
)}

      <style>{`
        .hero {
          position: relative;
          width: 100%;
          height: 92vh;
          background: #050816;
          overflow: hidden;
        }

        .scene {
          position: absolute;
          inset: 0;
          perspective: 900px;
        }

        .dot {
          position: absolute;
          top: 50%;
          left: 50%;
          background: #c084fc;
          border-radius: 50%;
          box-shadow: 0 0 6px #c084fc, 0 0 12px #a855f7;
          transform: translateZ(0);
          will-change: transform;
        }

        /* SPHERE */
        @keyframes sphereRotate {
          0% {
            transform: rotateX(0deg) rotateY(0deg)
              translate3d(var(--sx), var(--sy), var(--sz));
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg)
              translate3d(var(--sx), var(--sy), var(--sz));
          }
        }

        /* COLLAPSE */
        @keyframes collapseFull {
          0% {
            transform: translate3d(var(--sx), var(--sy), var(--sz));
          }
          100% {
            transform: translate(var(--cx), var(--cy));
          }
        }

        /* BAND */
        @keyframes toBand {
          0% {
            transform: translate(var(--cx), var(--cy));
          }
          100% {
            transform: translate(var(--bx), var(--by));
          }
        }

        /* TEXT */
        @keyframes toText {
          0% {
            transform: translate(var(--bx), var(--by));
          }
          100% {
            transform: translate(var(--tx), var(--ty));
          }
        }

        .welcome {
  position: absolute;
  top: calc(50% - 200px);
  left: 50%;
  transform: translateX(-50%);
  color: #60a5fa;
  font-weight: 700;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-size: 28px;
  opacity: 0;
  animation: fadeIn 1.2s ease forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.cta {
  position: absolute;
  top: calc(50% + 120px);
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  animation: fadeUp 1.2s ease forwards;
  animation-delay: 0.6s;
}

.cta-inner {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
}

.cta-primary {
  padding: 12px 40px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  border-radius: 9999px;
  letter-spacing: .15em;
  text-transform: uppercase;
  font-size: 13px;
  transition: all .3s ease;
  box-shadow: 0 0 0 rgba(37,99,235,0);
}

.cta-primary:hover {
  box-shadow: 0 0 30px rgba(37,99,235,.8);
}

.cta-secondary {
  padding: 12px 40px;
  border: 1px solid rgba(255,255,255,.2);
  color: #fff;
  font-weight: 700;
  border-radius: 9999px;
  letter-spacing: .15em;
  text-transform: uppercase;
  font-size: 13px;
  background: transparent;
  transition: all .3s ease;
}

.cta-secondary:hover {
  background: rgba(255,255,255,.05);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

      `}</style>
    </section>
  );
};

export default HeroSection;