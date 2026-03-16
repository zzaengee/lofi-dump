import { NextResponse } from "next/server"

export async function GET() {
  const token = process.env.NOTION_TOKEN
  const dbId  = process.env.NOTION_DATABASE_ID

  if (!token || !dbId) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 })
  }

  try {
    const queryRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "Published", checkbox: { equals: true } },
        sorts:  [{ property: "Date", direction: "descending" }],
      }),
      next: { revalidate: 300 }, // 5분 캐시
    })

    if (!queryRes.ok) {
      const err = await queryRes.json()
      return NextResponse.json({ error: "Notion query failed", detail: err }, { status: 502 })
    }

    const db = await queryRes.json()

    const posts = await Promise.all(
      db.results.map(async (page: any, i: number) => {
        const props = page.properties

        const title    = props.Name?.title?.[0]?.plain_text || "Untitled"
        const tag      = props.Tag?.select?.name || "essay"
        const dateRaw  = props.Date?.date?.start || ""
        const date     = dateRaw ? dateRaw.replace(/-/g, ".") : ""
        const readTime = props.ReadTime?.rich_text?.[0]?.plain_text || "3 min"
        const excerpt  = props.Excerpt?.rich_text?.[0]?.plain_text || ""
        const notionUrl = page.url || ""

        let cover: string | null = null
        if (page.cover?.type === "external") cover = page.cover.external.url
        if (page.cover?.type === "file")     cover = page.cover.file.url

        // 블록 내용 가져오기
        const blocksRes = await fetch(
          `https://api.notion.com/v1/blocks/${page.id}/children?page_size=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Notion-Version": "2022-06-28",
            },
          }
        )

        let body = excerpt ? `<p>${excerpt}</p>` : ""
        if (blocksRes.ok) {
          const blocksData = await blocksRes.json()
          body = blocksToHtml(blocksData.results)
        }

        return { id: page.id, title, tag, date, readTime, excerpt, cover, body, notionUrl }
      })
    )

    return NextResponse.json({ posts })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Notion blocks → HTML
function blocksToHtml(blocks: any[]): string {
  let html = ""
  let inList: false | "ul" | "ol" = false

  for (const block of blocks) {
    const type    = block.type
    const content = block[type]

    if (type !== "bulleted_list_item" && type !== "numbered_list_item" && inList) {
      html += inList === "ul" ? "</ul>" : "</ol>"
      inList = false
    }

    switch (type) {
      case "paragraph":
        const pText = richToHtml(content.rich_text)
        if (pText.trim()) html += `<p>${pText}</p>`
        break
      case "heading_1":
      case "heading_2":
        html += `<h2>${richToHtml(content.rich_text)}</h2>`
        break
      case "heading_3":
        html += `<h2 style="font-size:18px;">${richToHtml(content.rich_text)}</h2>`
        break
      case "bulleted_list_item":
        if (!inList) { html += '<ul>'; inList = "ul" }
        html += `<li>${richToHtml(content.rich_text)}</li>`
        break
      case "numbered_list_item":
        if (!inList) { html += '<ol>'; inList = "ol" }
        html += `<li>${richToHtml(content.rich_text)}</li>`
        break
      case "quote":
        html += `<blockquote>${richToHtml(content.rich_text)}</blockquote>`
        break
      case "image":
        const imgUrl = content.type === "external" ? content.external.url : content.file?.url
        const caption = content.caption?.[0]?.plain_text || ""
        if (imgUrl) html += `<img src="${imgUrl}" alt="${caption}" loading="lazy">`
        break
      case "divider":
        html += `<hr style="border:none;border-top:1px dashed #ddd;margin:32px 0;">`
        break
      case "callout":
        const icon = content.icon?.emoji || "💡"
        html += `<div style="background:#f5f2eb;border:1.5px solid #111;padding:16px 20px;margin:24px 0;display:flex;gap:12px;"><span>${icon}</span><div>${richToHtml(content.rich_text)}</div></div>`
        break
      default:
        break
    }
  }

  if (inList) html += inList === "ul" ? "</ul>" : "</ol>"
  return html || `<p>—</p>`
}

function richToHtml(richTexts: any[]): string {
  if (!richTexts?.length) return ""
  return richTexts.map((rt) => {
    let text = rt.plain_text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
    if (rt.annotations?.bold)          text = `<strong>${text}</strong>`
    if (rt.annotations?.italic)        text = `<em>${text}</em>`
    if (rt.annotations?.strikethrough) text = `<s>${text}</s>`
    if (rt.annotations?.code)          text = `<code style="background:#eee;padding:2px 6px;font-family:monospace;font-size:13px;">${text}</code>`
    if (rt.href)                        text = `<a href="${rt.href}" target="_blank" style="color:#111;text-decoration:underline;">${text}</a>`
    return text
  }).join("")
}
