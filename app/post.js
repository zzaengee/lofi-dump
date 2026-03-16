// api/posts.js
// Vercel Serverless Function — Notion API 연동
// 환경변수: NOTION_TOKEN, NOTION_DATABASE_ID

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const token = process.env.NOTION_TOKEN;
  const dbId  = process.env.NOTION_DATABASE_ID;

  if (!token || !dbId) {
    return res.status(500).json({ error: 'Missing NOTION_TOKEN or NOTION_DATABASE_ID env vars' });
  }

  try {
    // 1. Query the database (published posts only, sorted by date desc)
    const queryRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Published',
          checkbox: { equals: true }
        },
        sorts: [
          { property: 'Date', direction: 'descending' }
        ]
      })
    });

    if (!queryRes.ok) {
      const err = await queryRes.json();
      return res.status(502).json({ error: 'Notion query failed', detail: err });
    }

    const db = await queryRes.json();

    // 2. For each page, fetch block content (the actual post body)
    const posts = await Promise.all(
      db.results.map(async (page) => {
        const props = page.properties;

        // Extract properties
        const title     = props.Name?.title?.[0]?.plain_text || 'Untitled';
        const tag       = props.Tag?.select?.name || 'essay';
        const dateRaw   = props.Date?.date?.start || '';
        const date      = dateRaw ? dateRaw.replace(/-/g, '.') : '';
        const readTime  = props.ReadTime?.rich_text?.[0]?.plain_text || '3 min';
        const excerpt   = props.Excerpt?.rich_text?.[0]?.plain_text || '';
        const notionUrl = page.url || '';

        // Cover image (from page cover or Cover property)
        let cover = null;
        if (page.cover?.type === 'external') cover = page.cover.external.url;
        if (page.cover?.type === 'file')     cover = page.cover.file.url;

        // Fetch page blocks for body content
        const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children?page_size=50`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': '2022-06-28',
          }
        });

        let body = excerpt ? `<p>${excerpt}</p>` : '';

        if (blocksRes.ok) {
          const blocksData = await blocksRes.json();
          body = blocksToHtml(blocksData.results);
        }

        return { title, tag, date, readTime, excerpt, cover, body, notionUrl };
      })
    );

    // Cache for 5 minutes on Vercel edge
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ posts });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// ── Convert Notion blocks → HTML ──
function blocksToHtml(blocks) {
  let html = '';
  let inList = false;

  for (const block of blocks) {
    const type = block.type;
    const content = block[type];

    // Close any open list
    if (type !== 'bulleted_list_item' && type !== 'numbered_list_item' && inList) {
      html += inList === 'ul' ? '</ul>' : '</ol>';
      inList = false;
    }

    switch (type) {
      case 'paragraph':
        const pText = richTextToHtml(content.rich_text);
        if (pText.trim()) html += `<p>${pText}</p>`;
        break;

      case 'heading_1':
        html += `<h2>${richTextToHtml(content.rich_text)}</h2>`;
        break;

      case 'heading_2':
        html += `<h2>${richTextToHtml(content.rich_text)}</h2>`;
        break;

      case 'heading_3':
        html += `<h2 style="font-size:18px;">${richTextToHtml(content.rich_text)}</h2>`;
        break;

      case 'bulleted_list_item':
        if (inList !== 'ul') { html += '<ul style="padding-left:24px;margin-bottom:16px;">'; inList = 'ul'; }
        html += `<li style="margin-bottom:6px;">${richTextToHtml(content.rich_text)}</li>`;
        break;

      case 'numbered_list_item':
        if (inList !== 'ol') { html += '<ol style="padding-left:24px;margin-bottom:16px;">'; inList = 'ol'; }
        html += `<li style="margin-bottom:6px;">${richTextToHtml(content.rich_text)}</li>`;
        break;

      case 'quote':
        html += `<blockquote>${richTextToHtml(content.rich_text)}</blockquote>`;
        break;

      case 'image':
        const imgUrl = content.type === 'external' ? content.external.url : content.file?.url;
        const caption = content.caption?.[0]?.plain_text || '';
        if (imgUrl) html += `<img src="${imgUrl}" alt="${caption}" loading="lazy">`;
        break;

      case 'divider':
        html += `<hr style="border:none;border-top:1px dashed #ddd;margin:32px 0;">`;
        break;

      case 'callout':
        const icon = content.icon?.emoji || '💡';
        html += `<div style="background:#f5f2eb;border:1.5px solid #111;padding:16px 20px;margin:24px 0;display:flex;gap:12px;">
          <span>${icon}</span>
          <div>${richTextToHtml(content.rich_text)}</div>
        </div>`;
        break;

      default:
        break;
    }
  }

  if (inList) html += inList === 'ul' ? '</ul>' : '</ol>';

  return html || '<p>—</p>';
}

function richTextToHtml(richTexts) {
  if (!richTexts || richTexts.length === 0) return '';
  return richTexts.map(rt => {
    let text = rt.plain_text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (rt.annotations?.bold)          text = `<strong>${text}</strong>`;
    if (rt.annotations?.italic)        text = `<em>${text}</em>`;
    if (rt.annotations?.strikethrough) text = `<s>${text}</s>`;
    if (rt.annotations?.underline)     text = `<u>${text}</u>`;
    if (rt.annotations?.code)          text = `<code style="background:#eee;padding:2px 6px;font-family:monospace;font-size:13px;">${text}</code>`;
    if (rt.href)                        text = `<a href="${rt.href}" target="_blank" style="color:#111;text-decoration:underline;">${text}</a>`;

    return text;
  }).join('');
}
