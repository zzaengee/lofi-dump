"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

export default function Modal({ post, index, onClose }: { post: any; index: number; onClose: () => void }) {
  useEffect(() => {
    if (post) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [post])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [onClose])

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          key="modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(240,237,230,0.96)",
            backdropFilter: "blur(16px)",
            overflowY: "auto",
            display: "flex", justifyContent: "center",
            padding: "40px 20px 100px",
          }}
        >
          <motion.div
            key="modal-inner"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "660px", width: "100%" }}
          >
            {/* 상단 바 */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              paddingBottom: "16px", marginBottom: "44px",
            }}>
              <button onClick={onClose} style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: "12px", fontWeight: 400,
                letterSpacing: "1px", textTransform: "uppercase",
                background: "none", border: "none", cursor: "pointer", color: "#111", padding: 0,
              }}>← back</button>
              <span style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: "11px", color: "#aaa", letterSpacing: "0.5px",
              }}>
                {post.date} · {post.readTime || "3 min"} read
              </span>
            </div>

            {/* 커버 */}
            {post.cover && (
              <div style={{
                width: "100%", height: "320px", overflow: "hidden",
                marginBottom: "36px",
              }}>
                <img src={post.cover} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {/* 태그 */}
            <div style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "11px", fontWeight: 500,
              letterSpacing: "2px", textTransform: "uppercase",
              color: "#aaa", marginBottom: "12px",
            }}>
              {post.tag || "essay"}
            </div>

            {/* 제목 */}
            <h1 style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "clamp(26px, 5vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              color: "#111",
              marginBottom: "8px",
            }}>
              {post.title}
            </h1>

            {/* 메타 */}
            <div style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "12px", color: "#bbb",
              marginBottom: "44px", paddingBottom: "32px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}>
              [{String(index + 1).padStart(2, "0")}] — {post.date}
            </div>

            {/* 본문 */}
            <div
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: "17px", lineHeight: 2.0,
                color: "#222", fontWeight: 400,
              }}
              dangerouslySetInnerHTML={{ __html: post.body || `<p>${post.excerpt || ""}</p>` }}
            />

            {post.notionUrl && (
              <div style={{
                marginTop: "52px", borderTop: "1px solid rgba(0,0,0,0.08)",
                paddingTop: "18px",
                fontFamily: "'Pretendard', sans-serif",
                fontSize: "11px", color: "#ccc",
              }}>
                ↗ <a href={post.notionUrl} target="_blank" rel="noreferrer" style={{ color: "#bbb" }}>Read on Notion</a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
