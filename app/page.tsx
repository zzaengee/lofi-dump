"use client"
import { useState, useEffect } from "react"
import Modal from "../components/Modal"
import { motion } from "framer-motion"

export default function Page() {
  const [posts, setPosts]       = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [selIndex, setSelIndex] = useState<number>(0)
  const [loading, setLoading]   = useState(true)

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

  return (
    <>
      <style>{`
        body {
          background: #f1eee8;
          overflow: hidden;
        }

        .canvas {
          position: relative;
          width: 100vw;
          height: 100vh;
        }

        .floating-item {
          position: absolute;
          cursor: pointer;
        }

        .floating-img {
          width: 220px;
          height: auto;
          object-fit: cover;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .placeholder {
          width: 220px;
          height: 280px;
          background: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          font-size: 14px;
        }

        /* 테이프 느낌 */
        .floating-item::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 18px;
          background: rgba(255,255,255,0.6);
        }

        /* 노이즈 */
        body::after {
          content: "";
          position: fixed;
          inset: 0;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.2;
          pointer-events: none;
        }
      `}</style>

      {loading ? (
        <div style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          loading...
        </div>
      ) : (
        <div className="canvas">
          {posts.map((post, i) => {

            // 🔥 랜덤값 (렌더마다 고정되게)
            const x = Math.random() * 80
            const y = Math.random() * 80
            const rotate = Math.random() * 20 - 10
            const z = Math.floor(Math.random() * 10)

            return (
              <motion.div
                key={post.id || i}
                className="floating-item"
                onClick={() => openPost(post, i)}
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  rotate: `${rotate}deg`,
                  zIndex: z
                }}
                animate={{
                  y: [0, -15, 0],
                  rotate: [rotate, rotate + 2, rotate - 2, rotate]
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  scale: 1.1,
                  zIndex: 999
                }}
              >
                {post.cover ? (
                  <img src={post.cover} className="floating-img" />
                ) : (
                  <div className="placeholder">
                    {post.title}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal
        post={selected}
        index={selIndex}
        onClose={() => setSelected(null)}
      />
    </>
  )
}

const DEMO_POSTS = [
  { id:"1", title:"핀터레스트 알고리즘이 나를 만든다" },
  { id:"2", title:"AI 감성 대체 가능?" },
  { id:"3", title:"콜라주는 왜 힙한가" },
  { id:"4", title:"Y2K 돌아온 이유" },
  { id:"5", title:"요즘 모으는 것들" },
]