export const SITE_NAME = '低延迟实验室';

export const SITE_DESCRIPTION =
  '面向在线游戏玩家的网络测量与故障定位知识站：解释 Ping、RTT、丢包和延迟波动，并给出可复现的排查路径。';

export function pathWithBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(
    /\/$/,
    '',
  );

  const normalized = path.startsWith('/')
    ? path
    : `/${path}`;

  return `${base}${normalized}`.replace(
    /\/+/g,
    '/',
  );
}

export const navItems = [
  {
    label: '认识指标',
    href: '/metrics/',
  },
  {
    label: '开始诊断',
    href: '/diagnose/',
  },
  {
    label: '诊断案例',
    href: '/cases/',
  },
  {
    label: '方法与证据',
    href: '/methodology/',
  },
  {
    label: '诊断分析器',
    href: '/tools/network-analyzer/',
  },
];
