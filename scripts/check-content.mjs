import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentDir = path.join(root, 'src/content/blog');
const publicDir = path.join(root, 'public');
const files = fs.readdirSync(contentDir).filter((name) => /\.mdx?$/.test(name));
const errors = [];
const warnings = [];
const slugs = new Set(files.map((name) => name.replace(/\.mdx?$/, '')));
const popularRanks = new Map();
const seriesOrders = new Map();

function parseFrontmatter(source, file) {
  if (!source.startsWith('---')) return errors.push(`${file}: 缺少 frontmatter。`), {};
  const end = source.indexOf('\n---', 3);
  if (end < 0) return errors.push(`${file}: frontmatter 未正確結束。`), {};
  const block = source.slice(4, end).split('\n');
  const data = {};
  let activeArray = null;
  for (const raw of block) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const item = line.match(/^[-]\s+["']?(.*?)["']?$/);
    if (item && activeArray) { data[activeArray].push(item[1]); continue; }
    const match = raw.match(/^([A-Za-z][\w]*):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.trim();
    if (!value) { data[key] = []; activeArray = key; continue; }
    activeArray = null;
    data[key] = value.replace(/^['"]|['"]$/g, '');
  }
  return data;
}

for (const file of files) {
  const fullPath = path.join(contentDir, file);
  const source = fs.readFileSync(fullPath, 'utf8');
  const data = parseFrontmatter(source, file);
  for (const key of ['title','description','pubDate','category']) if (!data[key]) errors.push(`${file}: 缺少 ${key}。`);
  if (data.title && data.title.length > 65) warnings.push(`${file}: title 超過 65 字，目前 ${data.title.length} 字；可另填 seoTitle。`);
  if (data.description && (data.description.length < 50 || data.description.length > 160)) warnings.push(`${file}: description 建議 50～160 字，目前 ${data.description.length} 字。`);
  const body = source.slice(source.indexOf('\n---', 3) + 4);
  if (/^#\s+/m.test(body)) errors.push(`${file}: 正文不可再使用 H1（#），文章標題由版型輸出。`);
  if (!/^##\s+/m.test(body)) warnings.push(`${file}: 建議至少加入一個 H2（##）方便閱讀與產生目錄。`);
  if (/^####\s+/m.test(body) && !/^###\s+/m.test(body)) warnings.push(`${file}: 出現 H4 但沒有 H3，請檢查標題層級。`);
  if (data.cover) {
    if (!data.cover.startsWith('/')) warnings.push(`${file}: cover 建議使用 / 開頭的網站絕對路徑。`);
    const asset = path.join(publicDir, data.cover.replace(/^\//,''));
    if (!fs.existsSync(asset)) errors.push(`${file}: 找不到封面檔案 ${data.cover}。`);
    if (!data.coverAlt) warnings.push(`${file}: 有 cover 但缺少 coverAlt。`);
  }
  if (data.popularRank) {
    const previous = popularRanks.get(data.popularRank);
    if (previous) warnings.push(`${file}: popularRank ${data.popularRank} 與 ${previous} 重複。`);
    else popularRanks.set(data.popularRank, file);
  }
  if (data.series && data.seriesOrder) {
    const key = `${data.series}::${data.seriesOrder}`;
    const previous = seriesOrders.get(key);
    if (previous) errors.push(`${file}: 系列「${data.series}」的 seriesOrder ${data.seriesOrder} 與 ${previous} 重複。`);
    else seriesOrders.set(key, file);
  }
  for (const match of source.matchAll(/\]\((\/blog\/([^/)#?]+)\/?)[#?)]/g)) {
    if (!slugs.has(match[2])) warnings.push(`${file}: 可能有失效文章連結 ${match[1]}。`);
  }
}

console.log(`已檢查 ${files.length} 篇文章。`);
for (const warning of warnings) console.warn(`⚠ ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`✖ ${error}`);
  process.exit(1);
}
console.log(`內容檢查通過${warnings.length ? `，另有 ${warnings.length} 項提醒` : ''}。`);
