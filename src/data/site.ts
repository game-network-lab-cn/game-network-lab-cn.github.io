export const SITE_NAME = '低延迟实验室';

export const SITE_DESCRIPTION =
  '游戏卡顿、Ping 忽高忽低怎么办？查看 Wi-Fi、延迟、丢包排查指南，分析 Ping 日志，找到下一步该检查什么。';

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
