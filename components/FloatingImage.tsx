"use client"
import { motion } from "framer-motion"
import { useRef } from "react"

// 별 스티커 SVG
const STARS = [
  // 홀로그램 핑크-퍼플
  <svg key="s1" width="52" height="52" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="h1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff9de2"/>
        <stop offset="50%" stopColor="#c8b6ff"/>
        <stop offset="100%" stopColor="#96efff"/>
      </linearGradient>
    </defs>
    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="url(#h1)" stroke="#ccc" strokeWidth="1.5"/>
  </svg>,
  // 노란 별
  <svg key="s2" width="40" height="40" viewBox="0 0 100 100">
    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#ffd700" stroke="#111" strokeWidth="3"/>
  </svg>,
  // 빨간 별
  <svg key="s3" width="44" height="44" viewBox="0 0 100 100">
    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#ff3333" stroke="#111" strokeWidth="3"/>
  </svg>,
  // 파란 별
  <svg key="s4" width="36" height="36" viewBox="0 0 100 100">
    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#4488ff" stroke="#111" strokeWidth="3"/>
  </svg>,
  // 홀로그램 골드
  <svg key="s5" width="48" height="48" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="h2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffd700"/>
        <stop offset="50%" stopColor="#ff9de2"/>
        <stop offset="100%" stopColor="#c8b6ff"/>
      </linearGradient>
    </defs>
    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="url(#h2)" stroke="#ccc" strokeWidth="1.5"/>
  </svg>,
]

// 고정 위치 & 회전값 — Math.random() 쓰면 매 렌더마다 위치가 바뀌어서 깜빡임 생김
const POSITIONS = [
  { top: "6%",  left: "4%",   rot: 2.5  },
  { top: "5%",  left: "36%",  rot: -2.0 },
  { top: "4%",  right: "4%",  rot: 1.5  },
  { top: "44%", left: "2%",   rot: -1.8 },
  { top: "46%", right: "2%",  rot: 1.0  },
  { top: "44%", left: "34%",  rot: -0.8 },
  { bottom: "14%", left: "18%", rot: 2.2 },
  { bottom: "10%", right: "24%", rot: -1.5 },
]

const STAR_POSITIONS = [
  { top: "8%",  left: "48%"  },
  { top: "36%", left: "30%"  },
  { bottom: "18%", left: "6%" },
  { bottom: "10%", right: "12%" },
  { top: "18%", right: "8%"  },
]

const FALLBACKS = [
  { bg: "#cce8f0", emoji: "🌊" },
  { bg: "#ffd6ec", emoji: "🌸" },
  { bg: "#d4f7c5", emoji: "🌿" },
  { bg: "#fffacc", emoji: "✦"  },
  { bg: "#ffd6b0", emoji: "✨" },
  { bg: "#e0d4ff", emoji: "🔮" },
  { bg: "#c8f0d4", emoji: "🍃" },
  { bg: "#f9dcc4", emoji: "☁️" },
]

export default function FloatingImage({
  post,
  index,
  onClick,
}: {
  post: any
  index: number
  onClick: (post: any) => void
}) {
  const pos = POSITIONS[index % POSITIONS.length]
  const fb  = FALLBACKS[index % FALLBACKS.length]

  const floatY      = index % 2 === 0 ? [0, -14, 0] : [0, -10, 2, 0]
  const floatRot    = [pos.rot, pos.rot + 1.5, pos.rot - 1, pos.rot]
  const duration    = 4 + (index % 3) * 1.2

  return (
    <motion.div
      onClick={() => onClick(post)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: floatY,
        rotate: floatRot,
      }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.08 },
        scale:   { duration: 0.5, delay: index * 0.08 },
        y:       { duration, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 },
        rotate:  { duration: duration * 1.3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
      }}
      whileHover={{ scale: 1.06, zIndex: 50 }}
      style={{
        position: "absolute",
        cursor: "pointer",
        zIndex: 2,
        ...pos,
      }}
    >
      {/* INDEX LABEL */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "10px",
        letterSpacing: "1px",
        color: "#111",
        marginBottom: "5px",
      }}>
        [{String(index + 1).padStart(2, "0")}]
      </div>

      {/* IMAGE BOX */}
      <div style={{
        border: "2px solid #111",
        overflow: "hidden",
        background: fb.bg,
        width: index % 3 === 0 ? "210px" : index % 3 === 1 ? "175px" : "195px",
        height: index % 3 === 0 ? "250px" : index % 3 === 1 ? "195px" : "225px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span style={{ fontSize: "52px" }}>{fb.emoji}</span>
        )}
      </div>

      {/* LABEL */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "9px",
        color: "#999",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginTop: "6px",
      }}>
        {post.tag || "essay"} · {post.readTime || "3 min"}
      </div>
      <div style={{
        fontFamily: "'Black Han Sans', sans-serif",
        fontSize: "13px",
        color: "#111",
        lineHeight: 1.35,
        maxWidth: "190px",
        marginTop: "2px",
      }}>
        {post.title}
      </div>
    </motion.div>
  )
}

// 별 스티커 — FloatingImage와 별개로 페이지에 고정 배치
export function StarStickers() {
  return (
    <>
      {STAR_POSITIONS.map((pos, i) => (
        <motion.div
          key={i}
          style={{ position: "absolute", pointerEvents: "none", zIndex: 10, ...pos }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20 + i * 4, repeat: Infinity, ease: "linear" }}
        >
          {STARS[i % STARS.length]}
        </motion.div>
      ))}
    </>
  )
}
