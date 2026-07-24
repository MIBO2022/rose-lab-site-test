/**
 * Rose Lab 全站單一設定來源。
 *
 * 維護原則：
 * - 品牌、正式網址、社群與分析工具只在這裡修改。
 * - Header 導覽與首頁分類入口只在這裡修改。
 * - 分類說明與色彩只在這裡修改。
 */
export const SITE = {
  name: 'Rose Lab 自學研究所',
  shortName: 'Rose Lab',
  url: 'https://rose-lab.com',
  description: '記錄普通家庭的幼兒英文、自學資源、線上外師課與教育選擇。',
  author: 'Rose Lab',
  locale: 'zh_TW',
  language: 'zh-Hant-TW',
  email: 'roselab.service@gmail.com',
  threads: 'https://www.threads.com/@rose313_doremy',
  instagram: 'https://www.instagram.com/rose313_doremy',
  defaultImage: '/og-default.jpg',
  analyticsId: 'G-KC31VTH6WC',
  logo: {
    src: '/rose-lab-logo.png',
    width: 690,
    height: 240,
  },
  mark: {
    src: '/rose-lab-mark.png',
    width: 205,
    height: 40,
  },
} as const;

export interface NavigationItem {
  href: string;
  label: string;
  english: string;
}

/** 桌機版 Header：順序與可見文字不可任意變更。 */
export const PRIMARY_NAV: readonly NavigationItem[] = [
  { href: '/start/', label: '我們怎麼開始', english: 'Start Here' },
  { href: '/tag/幼兒英文/', label: '幼兒英文', english: 'English for Kids' },
  { href: '/category/線上外師課/', label: '線上外師課', english: 'Online Classes' },
  { href: '/resources/', label: '免費資源', english: 'Free Resources' },
  { href: '/category/親子共學/', label: '親子共學', english: 'Family Learning' },
  { href: '/about/', label: '關於 Rose Lab', english: 'About Rose Lab' },
] as const;

/** 手機抽屜選單：集中管理，避免與桌機導覽各自維護。 */
export const MOBILE_NAV: readonly NavigationItem[] = [
  { href: '/start/', label: '我們怎麼開始', english: 'Start Here' },
  { href: '/blog/', label: '全部文章', english: 'All Articles' },
  { href: '/tag/幼兒英文/', label: '幼兒英文', english: 'English for Kids' },
  { href: '/category/線上外師課/', label: '線上外師課', english: 'Online Classes' },
  { href: '/resources/', label: '免費資源', english: 'Free Resources' },
  { href: '/category/親子共學/', label: '親子共學', english: 'Family Learning' },
  { href: '/trial-guide/', label: '試聽前必看', english: 'Trial Guide' },
  { href: '/about/', label: '關於 Rose Lab', english: 'About Rose Lab' },
] as const;

export type HomeCategory = readonly [
  title: string,
  description: string,
  url: string,
  color: string,
];

/** 首頁四個分類入口：保留原文字與配色，只修正為可索引的靜態網址。 */
export const HOME_CATEGORIES: readonly HomeCategory[] = [
  ['幼兒英文', '零基礎、慢熟與第一次接觸英文的真實紀錄。', '/tag/幼兒英文/', '#fcecef'],
  ['線上外師課', '試聽、選老師、陪課與孩子沉默時怎麼判斷。', '/category/線上外師課/', '#edf5e9'],
  ['免費資源', 'Starfall、Khan Academy Kids 與家庭實際用法。', '/resources/', '#f6f0fb'],
  ['親子共學', '忙碌家庭也能執行的短時間英文安排。', '/category/親子共學/', '#fff3dc'],
] as const;

export const CATEGORY_META: Record<string, { description: string; color: string }> = {
  '免費英文資源': {
    description: '實際使用過的英文網站、App 與家庭用法。',
    color: '#f6f0fb',
  },
  '線上外師課': {
    description: '試聽、選老師、陪課與孩子沉默時怎麼判斷。',
    color: '#edf5e9',
  },
  '親子共學': {
    description: '忙碌家庭也能執行的英文安排與工具搭配。',
    color: '#fff3dc',
  },
  '學習規劃': {
    description: '從預算、孩子特質與家庭節奏做教育選擇。',
    color: '#fcecef',
  },
  '幼兒園費用': {
    description: '公立、非營利、準公共與私立費用整理。',
    color: '#eef5fb',
  },
};

export function getCategoryMeta(category: string, count = 0) {
  return CATEGORY_META[category] ?? {
    description: `目前收錄 ${count} 篇真實經驗文章。`,
    color: '#f7f3ef',
  };
}
