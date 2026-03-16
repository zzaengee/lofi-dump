"use client"
import { useState, useEffect } from "react"
import FloatingImage, { StarStickers } from "../components/FloatingImage"
import Modal from "../components/Modal"

export default function Page() {
  const [posts, setPosts]       = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [selIndex, setSelIndex] = useState<number>(0)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || data || [])
        setLoading(false)
      })
      .catch(() => {
        setPosts(DEMO_POSTS)
        setLoading(false)
      })
  }, [])

  function openPost(post: any, index: number) {
    setSelected(post)
    setSelIndex(index)
  }

  return (
    <>
      {/* FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Architects+Daughter&family=Space+Mono:wght@400;700&family=Black+Han+Sans&family=Noto+Serif+KR:wght@400;700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #f5f2eb;
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
          cursor: crosshair;
        }

        .modal-body {
          font-family: 'Noto Serif KR', serif;
          font-size: 16px;
          line-height: 2.1;
          color: #222;
        }
        .modal-body p  { margin-bottom: 26px; }
        .modal-body h2 {
          font-family: 'Black Han Sans', sans-serif;
          font-size: 22px;
          margin: 36px 0 16px;
          color: #111;
        }
        .modal-body img {
          width: 100%;
          border: 2px solid #111;
          margin: 24px 0;
          display: block;
        }
        .modal-body blockquote {
          border-left: 3px solid #111;
          padding-left: 20px;
          font-style: italic;
          color: #555;
          margin: 28px 0;
        }
        .modal-body ul, .modal-body ol {
          padding-left: 24px;
          margin-bottom: 16px;
        }
        .modal-body li { margin-bottom: 6px; }
      `}</style>

      {/* NAV */}
      <nav style={{
        borderBottom: "2px solid #111",
        padding: "13px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        background: "#f5f2eb",
        position: "sticky",
        top: 0,
        zIndex: 300,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px", letterSpacing: "4px" }}>LOFI</span>
          <span style={{ fontFamily: "'Architects Daughter', cursive", fontSize: "18px" }}>dump.</span>
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          {["index", "about", "tags"].map((l) => (
            <a key={l} href="#" style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              textDecoration: "none",
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HEADER */}
      <header style={{
        padding: "44px 36px 28px",
        borderBottom: "1px solid #ddd",
        position: "relative",
        overflow: "hidden",
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(80px, 16vw, 156px)",
          lineHeight: 0.86,
          letterSpacing: "-3px",
          color: "#111",
          display: "block",
        }}>LOFI</span>
        <span style={{
          fontFamily: "'Architects Daughter', cursive",
          fontSize: "clamp(36px, 7vw, 68px)",
          color: "#111",
          display: "block",
          marginLeft: "4px",
          lineHeight: 1.1,
        }}>dump.</span>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          letterSpacing: "3px",
          color: "#999",
          textTransform: "uppercase",
          marginTop: "14px",
        }}>
          thoughts &amp; images — seoul, kr — ongoing
        </div>
        <div style={{
          position: "absolute",
          top: "36px",
          right: "36px",
          textAlign: "right",
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          color: "#ddd",
          letterSpacing: "1.5px",
          lineHeight: 2,
          textTransform: "uppercase",
        }}>
          <div>[ updated weekly ]</div>
          <div>since 2025</div>
        </div>
      </header>

      {/* SCATTER ZONE */}
      <div style={{ position: "relative", minHeight: "900px", padding: "16px 0 80px" }}>

        {/* CENTER DECO TEXT */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "240px",
          transform: "translateX(-50%)",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 1,
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "38px", fontWeight: 700, letterSpacing: "-2px", color: "#111", lineHeight: 0.9, display: "block" }}>lofi</span>
          <span style={{ fontFamily: "'Architects Daughter', cursive", fontSize: "44px", color: "#111", lineHeight: 0.95, display: "block" }}>dump.</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "#aaa", marginTop: "6px", display: "block" }}>— my personal archive</span>
        </div>

        {/* STARS */}
        <StarStickers />

        {/* LOADING */}
        {loading && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#aaa",
            textTransform: "uppercase",
          }}>
            loading posts...
          </div>
        )}

        {/* POST CARDS */}
        {posts.map((post, i) => (
          <FloatingImage
            key={post.id || i}
            post={post}
            index={i}
            onClick={(p) => openPost(p, i)}
          />
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: "2px solid #111",
        padding: "18px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#f5f2eb",
      }}>
        <span style={{ fontFamily: "'Architects Daughter', cursive", fontSize: "20px", color: "#111" }}>lofi dump.</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#aaa", letterSpacing: "2px", textTransform: "uppercase" }}>Seoul · 2025 · Notion-powered</span>
      </footer>

      {/* MODAL */}
      <Modal post={selected} index={selIndex} onClose={() => setSelected(null)} />
    </>
  )
}

// 데모 데이터 (API 연결 전)
const DEMO_POSTS = [
  { id: "1", title: "핀터레스트 알고리즘이 나를 만든다", tag: "essay", date: "2025.11.18", readTime: "4 min",
    body: "<p>내가 핀터레스트를 좋아하는지, 핀터레스트가 내가 좋아하는 것들로 나를 채워서 내가 그걸 좋아하게 된 건지 이제는 구분이 안 간다.</p><p>플랫폼이 취향을 학습하는 게 아니라, 취향 자체를 만들어내는 시대. 그게 무섭기도 하고 흥미롭기도 하다.</p>" },
  { id: "2", title: "AI로 만든 이미지가 내 감성을 대신할 수 있을까?", tag: "essay", date: "2025.12.01", readTime: "5 min",
    body: "<p>핀터레스트에서 몇 시간을 스크롤하다 보면 어느 순간 내가 원하는 게 뭔지 잊어버리게 된다.</p><p>그래서 AI 이미지 생성을 시도해봤다. 감성의 번역기 같은 느낌.</p>" },
  { id: "3", title: "콜라주는 왜 아직도 힙한가", tag: "visual", date: "2025.11.05", readTime: "3 min",
    body: "<p>디지털이 모든 걸 완벽하게 만들 수 있는 시대에, 오히려 잘린 종이 끝과 풀 자국이 매력적으로 보이는 이유.</p>" },
  { id: "4", title: "Y2K 감성이 다시 돌아온 이유", tag: "insight", date: "2025.10.29", readTime: "4 min",
    body: "<p>2000년대 초반을 직접 경험한 세대에겐 노스탤지어고, 경험하지 못한 세대에겐 판타지다.</p>" },
  { id: "5", title: "요즘 내가 모으는 것들", tag: "mood", date: "2025.10.14", readTime: "2 min",
    body: "<p>버튼. 옛날 잡지 클리핑. 특이한 패키지 디자인. 그리고 좋은 문장들.</p>" },
]
