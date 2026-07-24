import fs from 'node:fs';
import path from 'node:path';

const slug = process.argv[2]?.trim();
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('請輸入英文小寫 slug，例如：npm run new:article -- starfall-reading-guide');
  process.exit(1);
}

const root = process.cwd();
const target = path.join(root, 'src/content/blog', `${slug}.md`);
const templatePath = path.join(root, 'ARTICLE_TEMPLATE.md');

if (fs.existsSync(target)) {
  console.error(`檔案已存在：${target}`);
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  console.error(`找不到文章範本：${templatePath}`);
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const template = fs
  .readFileSync(templatePath, 'utf8')
  .replaceAll('{{DATE}}', date)
  .replaceAll('{{SLUG}}', slug);

fs.writeFileSync(target, template, 'utf8');
console.log(`已建立：${target}`);
console.log('文章預設為 draft: true，完成並檢查後再改為 false。');
