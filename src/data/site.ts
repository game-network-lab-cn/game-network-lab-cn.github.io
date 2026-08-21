export const SITE_NAME = '低延迟实验室';
export const SITE_DESCRIPTION = '面向在线游戏玩家的网络测量与故障定位知识站：解释 Ping、RTT、丢包和延迟波动，并给出可复现的排查路径。';
export const UPDATED_DATE = '2026-08-21';

export function pathWithBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`.replace(/\/+/g, '/');
}

export const navItems = [
  { label: '认识指标', href: '/metrics/game-network-quality/' },
  { label: '开始诊断', href: '/diagnose/game-lag-diagnostic-tree/' },
  { label: '方法与证据', href: '/methodology/' },
  { label: '记录模板', href: '/tools/network-test-record/' },
];
