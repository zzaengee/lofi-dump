"use client"
import { useState, useEffect, useRef } from "react"
import Modal from "../components/Modal"

export default function Page() {
  const [posts, setPosts]       = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [selIndex, setSelIndex] = useState<number>(0)
  const [loading, setLoading]   = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/posts")
      .then(r => r.json())
      .then(d => { setPosts(d.posts || d || []); setLoading(false) })
      .catch(() => { setPosts(DEMO_POSTS); setLoading(false) })
  }, [])

  function openPost(post: any, i: number) {
    setSelected(post)
    setSelIndex(i)
  }

  // 드래그 스크롤
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let isDown = false, startX = 0, scrollLeft = 0
    const onDown = (e: MouseEvent) => {
      isDown = true
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
      el.style.cursor = "grabbing"
    }
    const onUp = () => { isDown = false; el.style.cursor = "grab" }
    const onMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      el.scrollLeft = scrollLeft - (x - startX) * 1.2
    }
    el.addEventListener("mousedown", onDown)
    el.addEventListener("mouseleave", onUp)
    el.addEventListener("mouseup", onUp)
    el.addEventListener("mousemove", onMove)
    return () => {
      el.removeEventListener("mousedown", onDown)
      el.removeEventListener("mouseleave", onUp)
      el.removeEventListener("mouseup", onUp)
      el.removeEventListener("mousemove", onMove)
    }
  }, [posts])

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Pretendard', -apple-system, sans-serif;
          /* ── 배경 이미지 넣는 곳 ──
             background-image: url('/your-image.jpg');
             background-size: cover;
             background-position: center;
             background-attachment: fixed;
          */
          background: #f0ede6;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .track::-webkit-scrollbar { display: none; }
        .track { -ms-overflow-style: none; scrollbar-width: none; }

        .card {
          flex-shrink: 0;
          position: relative;
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.34,1.3,0.64,1);
          transform-origin: bottom center;
        }
        .card:hover { transform: scale(1.04) translateY(-6px); }
        .card:hover .card-title-bar { opacity: 1; transform: translateY(0); }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          user-select: none;
          pointer-events: none;
        }

        .card-title-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%);
          padding: 40px 16px 16px;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.25s, transform 0.25s;
        }
        .card-title-text {
          font-family: 'Pretendard', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          line-height: 1.4;
          letter-spacing: -0.3px;
        }
        .card-tag-text {
          font-family: 'Pretendard', sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .nav-btn {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: none;
          border-radius: 50%;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          transition: background 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .nav-btn:hover { background: #fff; transform: scale(1.08); }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
        padding: "0 32px",
        height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(240,237,230,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}>
        <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.5px" }}>
          lofi dump<span style={{ fontWeight: 300 }}>.</span>
        </span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["index", "about"].map(l => (
            <a key={l} href="#" style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "13px", fontWeight: 400,
              color: "#666", textDecoration: "none", letterSpacing: "0.3px",
            }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO TEXT ── */}
      <div style={{ paddingTop: "56px" }}>
        <div style={{ padding: "52px 36px 32px" }}>
          <div style={{
            fontFamily: "'Pretendard', sans-serif",
            fontSize: "clamp(44px, 9vw, 96px)",
            fontWeight: 800,
            letterSpacing: "-3px",
            lineHeight: 0.92,
            color: "#111",
          }}>
            lofi<br />
            <span style={{ fontWeight: 300, fontStyle: "italic", letterSpacing: "-2px" }}>dump.</span>
          </div>
          <div style={{
            fontFamily: "'Pretendard', sans-serif",
            fontSize: "12px", fontWeight: 400,
            color: "#aaa", letterSpacing: "2px",
            textTransform: "uppercase",
            marginTop: "16px",
          }}>
            thoughts &amp; images — seoul, kr
          </div>
        </div>

        {/* ── SLIDER ── */}
        {loading ? (
          <div style={{
            height: "420px", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Pretendard', sans-serif", fontSize: "12px", color: "#bbb",
            letterSpacing: "2px", textTransform: "uppercase",
          }}>
            loading...
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            {/* 좌우 화살표 */}
            <div style={{
              position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)",
              zIndex: 20,
            }}>
              <button className="nav-btn" onClick={() => {
                if (trackRef.current) trackRef.current.scrollBy({ left: -320, behavior: "smooth" })
              }}>←</button>
            </div>
            <div style={{
              position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)",
              zIndex: 20,
            }}>
              <button className="nav-btn" onClick={() => {
                if (trackRef.current) trackRef.current.scrollBy({ left: 320, behavior: "smooth" })
              }}>→</button>
            </div>

            {/* 트랙 */}
            <div
              ref={trackRef}
              className="track"
              style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                padding: "24px 72px 40px",
                cursor: "grab",
                alignItems: "flex-end",
              }}
            >
              {posts.map((post, i) => (
                <div
                  key={post.id || i}
                  className="card"
                  style={{ width: "280px", height: "380px" }}
                  onClick={() => openPost(post, i)}
                >
                  {/* 이미지 or 빈 플레이스홀더 */}
                  <div style={{
                    width: "100%", height: "100%",
                    background: post.cover ? "#e0ddd8" : PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length],
                    position: "relative", overflow: "hidden",
                  }}>
                    {post.cover && (
                      <img className="card-img" src={post.cover} alt={post.title} />
                    )}
                    {/* 호버 타이틀 */}
                    <div className="card-title-bar">
                      <div className="card-tag-text">{post.tag || "essay"} · {post.readTime || "3 min"}</div>
                      <div className="card-title-text">{post.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "24px 36px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        marginTop: "20px",
      }}>
        <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "13px", color: "#aaa" }}>lofi dump.</span>
        <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "11px", color: "#ccc", letterSpacing: "1.5px", textTransform: "uppercase" }}>Seoul · 2025</span>
      </footer>

      {/* ── MODAL ── */}
      <Modal post={selected} index={selIndex} onClose={() => setSelected(null)} />
    </>
  )
}

const PLACEHOLDER_COLORS = ["#d8d4cc", "#ccd4d8", "#d4ccd8", "#d8d4c4", "#ccd8d4"]

const DEMO_POSTS = [
  { id:"1", title:"핀터레스트 알고리즘이 나를 만든다", tag:"essay", date:"2025.11.18", readTime:"4 min",
    body:"<p>내가 핀터레스트를 좋아하는지, 핀터레스트가 내가 좋아하는 것들로 나를 채워서 내가 그걸 좋아하게 된 건지 이제는 구분이 안 간다.</p>" },
  { id:"2", title:"AI로 만든 이미지가 내 감성을 대신할 수 있을까?", tag:"essay", date:"2025.12.01", readTime:"5 min",
    body:"<p>핀터레스트에서 몇 시간을 스크롤하다 보면 어느 순간 내가 원하는 게 뭔지 잊어버리게 된다.</p>" },
  { id:"3", title:"콜라주는 왜 아직도 힙한가", tag:"visual", date:"2025.11.05", readTime:"3 min",
    body:"<p>디지털이 모든 걸 완벽하게 만들 수 있는 시대에, 오히려 잘린 종이 끝과 풀 자국이 매력적으로 보이는 이유.</p>" },
  { id:"4", title:"Y2K 감성이 다시 돌아온 이유", tag:"insight", date:"2025.10.29", readTime:"4 min",
    body:"<p>2000년대 초반을 직접 경험한 세대에겐 노스탤지어고, 경험하지 못한 세대에겐 판타지다.</p>" },
  { id:"5", title:"요즘 내가 모으는 것들", tag:"mood", date:"2025.10.14", readTime:"2 min",
    body:"<p>버튼. 옛날 잡지 클리핑. 특이한 패키지 디자인. 그리고 좋은 문장들.</p>" },
  { id:"6", title:"이미지로 생각 정리하기", tag:"essay", date:"2025.10.02", readTime:"3 min",
    body:"<p>글보다 이미지가 먼저 올 때가 있다.</p>" },
]
