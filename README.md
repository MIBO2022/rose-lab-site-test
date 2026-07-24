# Rose Lab 靜態網站｜維護與部署總指南

這是 Rose Lab 的正式 Astro 靜態網站專案。此次整理以三個原則為準：

1. **不修改既有文章文字。** `src/content/blog/` 內 5 篇文章維持原檔。
2. **不改變既有網站外觀。** 保留原有 HTML class、CSS 規則與載入順序；只把樣式分層、限定作用範圍並補上註解。
3. **同一份資料只維護一次。** 品牌資料、導覽、分類資料、文章查詢、文章範本與技術說明均已集中。

---

## 1. 第一次在電腦開啟

需要 Node.js 20 或 22。

```bash
npm ci
npm run dev
```

終端機會顯示本機預覽網址，通常是 `http://localhost:4321/`。

### 上線前完整檢查

```bash
npm run validate
npm run build
```

- `npm run validate`：檢查文章欄位與 Astro／TypeScript。
- `npm run build`：再次檢查文章，並輸出靜態網站到 `dist/`。

---

## 2. 最常修改的檔案

| 需求 | 只需要修改 |
|---|---|
| 網站名稱、網址、Email、社群、GA、Logo | `src/config/site.ts` |
| 桌機／手機導覽 | `src/config/site.ts` |
| 首頁四個分類入口 | `src/config/site.ts` |
| 分類說明與分類底色 | `src/config/site.ts` |
| 新增或更新文章 | `src/content/blog/*.md` |
| 新文章預設結構 | `ARTICLE_TEMPLATE.md` |
| 全站 CSS 載入順序 | `src/styles/global.css` |
| 單一頁面的外觀 | `src/styles/pages/` |
| Header／Footer 外觀 | `src/styles/layouts/header-footer.css` |

### 不要重複建立設定檔

以下資料都以 `src/config/site.ts` 為唯一來源：

- `SITE`：品牌、正式網址、語系、Email、社群、GA、Logo。
- `PRIMARY_NAV`：桌機導覽。
- `MOBILE_NAV`：手機導覽。
- `HOME_CATEGORIES`：首頁四個入口。
- `CATEGORY_META`：分類說明和顏色。

新增相同资料的第二份設定檔，之後容易出現桌機、手機、首頁互相不一致的情況。

---

## 3. 專案結構

```text
rose-lab-site/
├─ public/                       # 可直接公開的圖片、favicon、robots、manifest
├─ scripts/
│  ├─ check-content.mjs          # 文章資料檢查
│  └─ new-article.mjs            # 讀取唯一文章範本並建立新文章
├─ src/
│  ├─ components/
│  │  ├─ content/                # 文章卡片
│  │  ├─ home/                   # 首頁各區塊
│  │  └─ seo/                    # JSON-LD 輸出
│  ├─ config/
│  │  └─ site.ts                 # 全站唯一設定來源
│  ├─ content/
│  │  ├─ blog/                   # 文章 Markdown
│  │  └─ config.ts               # Frontmatter 欄位規則
│  ├─ layouts/                   # 全站與文章版型
│  ├─ pages/                     # Astro 路由頁面
│  ├─ styles/                    # 分層 CSS
│  └─ utils/
│     └─ content.ts              # 共用文章查詢、排序、網址與日期工具
├─ ARTICLE_TEMPLATE.md           # 唯一新文章範本
├─ astro.config.mjs              # Astro、正式網域、Sitemap、Redirect
├─ package.json
└─ README.md                     # 唯一技術與維護說明
```

---

## 4. 新增文章

### 方法 A：使用指令（建議）

```bash
npm run new:article -- starfall-reading-guide
```

指令會：

1. 讀取 `ARTICLE_TEMPLATE.md`。
2. 自動填入今天日期。
3. 自動把封面路徑改為 `/images/blog/starfall-reading-guide-cover.webp`。
4. 建立 `src/content/blog/starfall-reading-guide.md`。
5. 保持 `draft: true`，避免未完成内容被发布。

### 方法 B：手動複製

複製 `ARTICLE_TEMPLATE.md` 到 `src/content/blog/`，將檔名改為英文小寫 slug，例如：

```text
starfall-reading-guide.md
```

並把範本內的 `{{DATE}}`、`{{SLUG}}` 換成實際資料。

### 發布文章

完成後把：

```yaml
draft: true
```

改為：

```yaml
draft: false
```

---

## 5. 文章 Frontmatter

```yaml
---
title: "頁面主標題"
seoTitle: "可選：Google 搜尋結果標題"
description: "50～160 字的具體摘要"
draft: true
pubDate: 2026-07-23
updatedDate: 2026-07-23
author: "Rose Lab"
category: "線上外師課"
tags:
  - "幼兒英文"
  - "線上外師"
featured: false
popularRank: 1
series: "系列名稱"
seriesOrder: 1
cover: "/images/blog/example-cover.webp"
coverAlt: "具體描述圖片內容"
noindex: false
---
```

### 維護原則

- `title`：直接回答家長會搜尋的問題。
- `description`：不要只重複標題，要說明對象、問題與能得到的答案。
- `pubDate`：首次發布日期。
- `updatedDate`：內容實際更新時才更改。
- `category`：每篇一個主要分類。
- `tags`：補充品牌、工具、年齡或具體問題。
- `featured`／`popularRank`：控制首頁熱門文章排序。
- `coverAlt`：描述畫面，不要只寫「文章封面」。
- `noindex`：只有不希望搜尋引擎收錄時才設為 `true`。

執行 `npm run check:content` 可檢查日期、摘要、圖片路徑與必要欄位。

---

## 6. 圖片與檔案

文章封面放在：

```text
public/images/blog/
```

文章內引用方式：

```md
![具體圖片說明](/images/blog/example.webp)
```

### 建議規格

- 封面：1200 × 630 px 或相同比例。
- 格式：优先 WebP。
- 檔名：英文小寫、連字號分隔。
- 不要在檔名使用空格、中文、括號或版本號。
- 上傳前先壓縮，但不要犧牲文字可讀性。

---

## 7. 內部連結與分類網址

共用網址函式位於 `src/utils/content.ts`：

- `postPath(post)`
- `categoryPath(category)`
- `tagPath(tag)`
- `seriesPath(series)`

在 Astro 元件中應使用这些函数，避免各頁自行拼接網址。

Markdown 文章仍可使用一般站內連結：

```md
[延伸閱讀](/blog/article-slug/)
```

發布前確認目標頁存在，不要把標籤寫成分類網址。例如：

- 幼兒英文：`/tag/幼兒英文/`
- 免費英文資源：`/category/免費英文資源/`

舊網址的相容轉址集中在 `astro.config.mjs` 的 `redirects`。

---

## 8. CSS 分層與修改規則

所有 CSS 由 `src/styles/global.css` 依固定順序載入：

```text
01 evergreen-article.css          長文內文特殊模組
02 base/foundation.css            色彩變數、reset、基本元素
03 layouts/header-footer.css      Header、手機選單、Footer
04 pages/article.css              文章頁版型與文章元件
05 base/layout-flow.css           共用容器、卡片、列表版面
06 pages/home.css                 首頁
07 pages/start.css                我們怎麼開始
08 pages/about.css                關於頁
09 components/threads-embed.css   Threads 嵌入
10 pages/trial-guide.css          試聽指南
```

### 修改 CSS 前先判斷範圍

- 全站色彩、字體、按鈕基礎：`base/foundation.css`
- Header／Footer：`layouts/header-footer.css`
- 只影響文章頁：`pages/article.css`
- 只影響某一頁：對應的 `pages/*.css`
- 可在多頁重用的獨立功能：`components/*.css`

### 防止外觀互相干擾

- 單頁樣式必須以頁面根 class 開頭，例如 `.trial-page`、`.start-guide-page`。
- 不要在單頁 CSS 直接寫 `body`、`h2`、`.card` 等全域選擇器。
- 新增規則時，在檔案內加入清楚的區段註解。
- 不要任意調換 `global.css` 的 `@import` 順序；CSS cascade 改變可能造成外觀差異。
- 不要再把大型 `<style>` 放回 `.astro` 頁面；應放入對應的分層 CSS。

`trial-guide.astro` 原本的大型內嵌 CSS 已移到 `pages/trial-guide.css`，並全部限定在 `.trial-page` 或 `.trial-guide-body` 範圍。`start-accessibility.css` 已合併到 `pages/start.css`，避免同一頁维护两份样式。

---

## 9. SEO 架構

### 全站统一处理

`src/layouts/BaseLayout.astro` 集中輸出：

- canonical URL
- robots／Googlebot
- Open Graph／Twitter Card
- hreflang
- RSS 與 Sitemap 連結
- Organization、WebSite、WebPage、ImageObject JSON-LD
- 有提供路徑時的 BreadcrumbList JSON-LD

### 文章頁额外处理

`src/layouts/ArticleLayout.astro` 集中輸出：

- BlogPosting JSON-LD
- 發布與更新日期
- 作者／發布者
- 主圖、文章分類、標籤、字數與預估閱讀時間
- 可見麵包屑與結構化麵包屑
- 上一篇、下一篇、相關文章、最新文章與熱門文章

### 收錄控制

- 草稿文章不會建立頁面。
- `noindex: true` 的頁面輸出 `noindex,follow`。
- `/search/` 與 `/404/` 不放進 Sitemap。
- canonical 不包含搜尋參數，避免同一內容出現多個網址版本。
- 舊分類和舊文章網址在 `astro.config.mjs` 做 301 相容轉址。

### 內容品質原則

技術 SEO 只能協助搜尋引擎理解與抓取，無法保證排名。文章仍應：

- 直接回答具體搜尋問題。
- 使用第一手陪學經驗、實際觀察與可核對資料。
- 清楚標示資料日期、課程活動變動與推薦連結。
- 定期更新價格、方案、功能與政策。
- 避免為關鍵字堆砌重複段落。

---

## 10. 搜尋、RSS 與 Sitemap

- 站內搜尋資料：`/search-index.json`
- 搜尋頁：`/search/`（不收錄，但允许跟随文章链接）
- RSS：`/rss.xml`
- Sitemap index：`/sitemap-index.xml`

文章、分類、標籤與系列頁都使用 `src/utils/content.ts` 的同一套「排除草稿／noindex、依日期排序」逻辑，避免各页面结果不一致。

---

## 11. Cloudflare Pages 部署

建議設定：

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Node.js version: 22
Root directory: /
```

正式網域同時在以下位置確認：

- `astro.config.mjs` 的 `site`
- `src/config/site.ts` 的 `SITE.url`
- Cloudflare Pages 的 Custom domains

修改網域後重新部署，再檢查 canonical、Sitemap、robots.txt 與 Google Search Console。

### Wrangler 指令

專案也保留：

```bash
npm run deploy
```

此指令會先 build，再依 `wrangler.jsonc` 部署。

---

## 12. 每次发布前检查

```bash
npm ci
npm run validate
npm run build
```

再人工确认：

- 首頁、文章頁、分類頁、標籤頁、搜尋頁都能開啟。
- 手機選單、搜尋、熱門／最新切換與文章目錄正常。
- 新文章封面和文章內圖片没有 404。
- 文章标题、描述、日期、分类和标签正确。
- 推荐链接 UTM 与揭露说明正确。
- `sitemap-index.xml` 与 `rss.xml` 可读取。
- 桌机、平板、手机外观没有变化。

---

## 13. 隐私与内容安全

不要公開孩子姓名、學校、住址、固定行程、可辨識制服、證件或其他可追蹤個資。分享課程經驗時，保留孩子感受與家庭決策所需的資訊即可。
