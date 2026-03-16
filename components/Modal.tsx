"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

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

export default function Modal({
  post,
  index,
  onClose,
}: {
  post: any
  index: number
  onClose: () => void
}) {
  const fb = FALLBACKS[index % FALLBACKS.length]

  useEffect(() => {
    if (post) document.body.style.overflow = "hidden"
    else       document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [post])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          key="modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(245,242,235,0.97)",
            zIndex: 500,
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            padding: "40px 20px 100px",
          }}
        >
          <motion.div
            key="modal-inner"
            initial={{ y: 20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "680px", width: "100%" }}
          >
            {/* TOP BAR */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px solid #111",
              paddingBottom: "14px",
              marginBottom: "44px",
            }}>
              <button
                onClick={onClose}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#111",
                  padding: 0,
                }}
              >
                ← back to index
              </button>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: "#aaa",
                letterSpacing: "1px",
              }}>
                {post.date} · {post.readTime || "3 min"} read
              </span>
            </div>

            {/* COVER */}
            <div style={{
              width: "100%",
              height: "300px",
              border: "2px solid #111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: post.cover ? "#e8e4dc" : fb.bg,
              marginBottom: "36px",
              overflow: "hidden",
            }}>
              {post.cover
                ? <img src={post.cover} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: "96px" }}>{fb.emoji}</span>
              }
            </div>

            {/* TAG */}
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              border: "1.5px solid #111",
              display: "inline-block",
              padding: "3px 10px",
              marginBottom: "16px",
            }}>
              {post.tag || "essay"}
            </div>

            {/* TITLE */}
            <h1 style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              lineHeight: 1.1,
              color: "#111",
              marginBottom: "8px",
            }}>
              {post.title}
            </h1>

            {/* META */}
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              color: "#aaa",
              letterSpacing: "1.5px",
              marginBottom: "40px",
              paddingBottom: "28px",
              borderBottom: "1px dashed #ddd",
            }}>
              [{String(index + 1).padStart(2, "0")}] — {post.tag || "essay"} — {post.date}
            </div>

            {/* BODY */}
            <div
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: post.body || `<p>${post.excerpt || ""}</p>` }}
            />

            {/* NOTION LINK */}
            {post.notionUrl && (
              <div style={{
                marginTop: "52px",
                borderTop: "1px solid #ddd",
                paddingTop: "18px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: "#bbb",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}>
                ↗{" "}
                <a href={post.notionUrl} target="_blank" rel="noreferrer" style={{ color: "#bbb" }}>
                  Read full post on Notion
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
