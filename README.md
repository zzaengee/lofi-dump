# lofi dump — 배포 가이드

## 파일 구조
```
lofi-dump/
├── index.html        ← 블로그 프론트엔드
├── api/
│   └── posts.js      ← Notion API 백엔드 (Vercel serverless)
├── vercel.json       ← Vercel 설정
└── README.md
```

---

## Step 1 — Notion 데이터베이스 만들기

1. Notion에서 새 페이지 만들기
2. `/database` 입력 → **Table** 선택
3. 아래 컬럼 추가:

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| Name | Title | 글 제목 (기본값) |
| Published | Checkbox | 체크하면 블로그에 노출 |
| Date | Date | 발행일 |
| Tag | Select | essay / visual / insight / mood |
| ReadTime | Text | "5 min" 같은 형식으로 직접 입력 |
| Excerpt | Text | 글 요약 (선택) |

4. 각 row가 하나의 글. Row 안에 내용 입력하면 됨.
5. 커버 이미지: 각 페이지 열고 상단 **Add cover** 클릭

---

## Step 2 — Notion API 연결

1. https://www.notion.so/my-integrations 접속
2. **New integration** 클릭
3. 이름: `lofi-dump-blog` / 워크스페이스 선택 / Submit
4. **Internal Integration Token** 복사 (나중에 필요)
5. 아까 만든 데이터베이스로 돌아가서
   → 우상단 `...` → **Connections** → 방금 만든 integration 추가
6. 데이터베이스 URL에서 ID 복사:
   `notion.so/[workspace]/`**`여기가DATABASE_ID`**`?v=...`

---

## Step 3 — GitHub에 업로드

1. https://github.com 로그인
2. **New repository** → 이름: `lofi-dump` → Create
3. 이 폴더 전체를 드래그 업로드 (또는 git push)

---

## Step 4 — Vercel 배포

1. https://vercel.com 접속 → GitHub으로 로그인
2. **Add New Project** → `lofi-dump` repo 선택 → Import
3. **Environment Variables** 섹션에서 추가:
   - `NOTION_TOKEN` = Step 2에서 복사한 token
   - `NOTION_DATABASE_ID` = Step 2에서 복사한 database ID
4. **Deploy** 클릭
5. 완료! `lofi-dump.vercel.app` 같은 주소 생성됨

---

## 글 쓰는 법 (배포 후)

1. Notion 데이터베이스 열기
2. **+ New** 클릭 → 제목 입력
3. Row 클릭해서 열기 → 본문 작성
4. Published 체크박스 ON
5. 끝! 5분 내로 블로그에 자동 반영

---

## 커스터마이징

- `index.html` 안의 `SLOTS` 배열 수정 → 카드 위치/크기 변경
- `FALLBACKS` 배열 수정 → 이모지/배경색 변경
- `DEMO_POSTS` 수정 → API 연결 전 미리보기용 더미 데이터
