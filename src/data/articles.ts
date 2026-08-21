export type Source = {
  title: string;
  url: string;
  publisher: string;
};

export type Article = {
  slug: string;
  section: 'metrics' | 'diagnose';
  title: string;
  description: string;
  eyebrow: string;
  readTime: string;
  publishedDate: string;
  updatedDate: string;
  answer: string;
  takeaways: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  related: string[];
  sources: Source[];
};

const ietf3393: Source = {
  title: 'RFC 3393: IP Packet Delay Variation Metric',
  url: 'https://www.rfc-editor.org/rfc/rfc3393',
  publisher: 'IETF / RFC Editor',
};

const ietf6673: Source = {
  title: 'RFC 6673: Round-Trip Packet Loss Metrics',
  url: 'https://www.rfc-editor.org/rfc/rfc6673',
  publisher: 'IETF / RFC Editor',
};

const msPathping: Source = {
  title: 'pathping command reference',
  url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/pathping',
  publisher: 'Microsoft Learn',
};

export const articles: Article[] = [
  {
    slug: 'game-network-quality',
    section: 'metrics',
    title: '游戏网络质量怎么看：Ping、丢包与延迟波动',
    description: '用四个指标判断游戏网络质量，并理解为什么“平均 Ping 不高”仍可能卡顿。',
    eyebrow: '指标总览',
    readTime: '4 分钟',
    publishedDate: '2026-08-21',
    updatedDate: '2026-08-21',
    answer:
      '游戏网络质量不能只看一个平均 Ping。至少同时观察往返时延（RTT）、丢包、延迟波动和连续性；其中任何一项异常，都可能表现为瞬移、操作延后或语音断续。',
    takeaways: [
      'RTT 说明一次往返要多久，但平均值会掩盖尖峰。',
      '丢包要看是否连续发生，突发丢包通常比均匀零星丢包更影响实时游戏。',
      '延迟波动描述稳定性，数值相同的平均 Ping 可能对应完全不同的体感。',
    ],
    sections: [
      {
        heading: '四个指标各自回答什么问题',
        paragraphs: [
          '把网络质量当成一段连续过程，而不是一张测速截图。RTT 回答“来回要多久”，丢包回答“信息有没有到”，延迟波动回答“每次到达是否稳定”，连续性则观察异常是否成片出现。',
        ],
        bullets: [
          'RTT：客户端发出数据后，收到响应所需的往返时间。',
          '丢包：发送的数据包没有在测量条件内成功完成往返。',
          '延迟波动：连续测量之间的时延变化。',
          '连续性：异常是否集中在一段时间或一组连续样本中。',
        ],
      },
      {
        heading: '为什么没有通用的“合格线”',
        paragraphs: [
          '游戏类型、服务器位置、匹配区域、接入方式和游戏自身补偿机制都不同。把某个固定毫秒数当成所有游戏的标准，会把环境差异误判为故障。更可靠的判断，是在同一设备、同一服务器和相近时段下做对照。',
        ],
      },
      {
        heading: '一份有用的最小测量',
        paragraphs: [
          '记录至少两组对照：问题发生时与相对正常时。每组保留开始时间、连接方式、目标、样本数量、平均值、最大值、丢包比例，以及是否出现连续尖峰。',
        ],
        bullets: [
          '不要只保留平均值。',
          '不要把网页测速节点当成游戏服务器本身。',
          '一次结果只描述当时路径，不代表长期状态。',
        ],
      },
    ],
    related: [
      'ping-vs-rtt',
      'packet-delay-variation',
      'burst-packet-loss',
    ],
    sources: [ietf3393, ietf6673],
  },
  {
    slug: 'ping-vs-rtt',
    section: 'metrics',
    title: 'Ping 和 RTT 是一回事吗？先分清工具与指标',
    description: '解释 Ping 命令、ICMP 与 RTT 的关系，以及为什么游戏内延迟和系统 Ping 结果可能不同。',
    eyebrow: '基础概念',
    readTime: '3 分钟',
    publishedDate: '2026-08-21',
    updatedDate: '2026-08-21',
    answer:
      'RTT 是往返时延这个指标；Ping 通常指用于发出 ICMP Echo 请求并测量往返时间的工具或操作。游戏内显示的“Ping”也常代表延迟，但它可能使用游戏协议、采样窗口和目标服务器，因此不一定等于系统 Ping 命令的结果。',
    takeaways: [
      'Ping 是测量动作或工具，RTT 是被测量的往返时间。',
      '不同协议、目标和采样频率会产生不同结果。',
      '对照测试必须保持目标和条件一致。',
    ],
    sections: [
      {
        heading: '同一个“Ping”为什么会有三个数字',
        paragraphs: [
          '路由器、公共测试目标和游戏服务器是三个不同目标；游戏客户端还可能采用平滑、截断或分段统计。因此，系统命令、测速工具和游戏内数字不同并不自动说明其中一个错误。',
        ],
      },
      {
        heading: '什么时候系统 Ping 仍然有价值',
        paragraphs: [
          '它适合做近端与远端的对照：先测家庭网关，再测稳定的外部目标。若近端就出现尖峰，优先检查 Wi-Fi、设备负载和家庭网络；近端稳定而远端异常，再继续查看路径和时段。',
        ],
      },
      {
        heading: '记录时写清三个条件',
        paragraphs: [
          '每个结果旁边注明目标、协议或工具和时间窗口。没有这三项，两个延迟数字通常不能直接比较。',
        ],
        bullets: [
          '目标：网关、公共目标、游戏服务或其他。',
          '工具：系统 ping、游戏内监控或路由诊断。',
          '窗口：样本数量、开始时间与持续时长。',
        ],
      },
    ],
    related: ['game-network-quality', 'packet-delay-variation'],
    sources: [
      {
        title: 'RFC 792: Internet Control Message Protocol',
        url: 'https://www.rfc-editor.org/rfc/rfc792',
        publisher: 'IETF / RFC Editor',
      },
    ],
  },
  {
    slug: 'packet-delay-variation',
    section: 'metrics',
    title: '延迟波动是什么：别只盯着平均 Ping',
    description: '理解 packet delay variation 与玩家常说的 jitter，并用时间序列识别不稳定网络。',
    eyebrow: '稳定性指标',
    readTime: '3 分钟',
    publishedDate: '2026-08-21',
    updatedDate: '2026-08-21',
    answer:
      '延迟波动描述数据包时延随时间的变化。两次测试即使平均 RTT 相同，只要其中一组频繁出现高低跳变，实时操作和语音就可能更不稳定。判断时应查看连续样本或时间序列，而不是只看平均值。',
    takeaways: [
      '延迟波动关注变化，不等于平均延迟。',
      '不同工具对“jitter”的计算方式可能不同。',
      '时间序列能看到平均值隐藏的尖峰与周期。',
    ],
    sections: [
      {
        heading: '标准里的定义与工具里的“jitter”',
        paragraphs: [
          'RFC 3393 定义的是数据包时延变化度量。日常工具可能把标准差、相邻样本差或其他统计量标成 jitter，所以跨工具比较前必须先看计算说明。',
        ],
      },
      {
        heading: '一个简单判断例子',
        paragraphs: [
          'A 组连续结果集中在相近范围；B 组大部分很低，但每隔数秒出现一次明显尖峰。两组平均值可能接近，B 组却更容易出现角色位置回弹或语音断句。',
        ],
      },
      {
        heading: '怎样缩小原因范围',
        paragraphs: [
          '做有线与 Wi-Fi 对照，再分别在空闲和有上传或下载负载时测量。如果异常只在 Wi-Fi 出现，优先检查信号、干扰和频段；若有线在负载时也波动，继续检查队列拥塞与上行占用。',
        ],
      },
    ],
    related: [
      'game-network-quality',
      'ping-vs-rtt',
      'burst-packet-loss',
    ],
    sources: [ietf3393],
  },
  {
    slug: 'burst-packet-loss',
    section: 'metrics',
    title: '突发丢包为什么比一个平均比例更值得看',
    description: '解释连续丢包、零星丢包和平均丢包率的差异，提供可复现的记录方式。',
    eyebrow: '丢包模式',
    readTime: '3 分钟',
    publishedDate: '2026-08-21',
    updatedDate: '2026-08-21',
    answer:
      '平均丢包率只说明总量，不说明丢失怎样分布。相同比例下，连续多个包丢失会造成更长的反馈空档，通常比零星分散的丢失更容易被玩家感知，因此需要同时记录最长连续丢包和发生时间。',
    takeaways: [
      '平均比例无法描述丢包分布。',
      '连续丢包要结合时间点和当时负载判断。',
      '中间节点不回应探测不等于它转发业务包时丢包。',
    ],
    sections: [
      {
        heading: '把 1% 拆开看',
        paragraphs: [
          '1000 个样本中丢 10 个，可以是每隔一段时间零星丢一个，也可以是在一秒内连续丢 10 个。两者平均值相同，但实时会话感受到的空档完全不同。',
        ],
      },
      {
        heading: '路由诊断里常见的误判',
        paragraphs: [
          '某个中间节点可能限制或忽略诊断报文，却继续正常转发后续流量。只有当异常从某一跳开始并持续到最终目标，且重复测试可复现时，才更值得把它当作路径线索。',
        ],
      },
      {
        heading: '最小记录字段',
        paragraphs: [
          '记录总样本、丢失样本、最长连续丢失、首次发生时间、连接方式与当时上下行活动。必要时用 pathping 等工具补充逐跳统计，但不要只凭一张图下结论。',
        ],
      },
    ],
    related: ['game-network-quality', 'packet-delay-variation'],
    sources: [ietf6673, msPathping],
  },
  {
    slug: 'game-lag-diagnostic-tree',
    section: 'diagnose',
    title: '游戏卡顿怎么排查：从症状到路径的诊断树',
    description: '一套不依赖特定游戏或品牌的排查顺序：先复现，再做近端、负载、接入与路径对照。',
    eyebrow: '诊断入口',
    readTime: '5 分钟',
    publishedDate: '2026-08-21',
    updatedDate: '2026-08-21',
    answer:
      '排查游戏卡顿时，先确认是帧率问题还是网络问题；如果是网络，再按“本机与家庭网关 → Wi-Fi/有线 → 空闲/负载 → 外部路径 → 游戏服务器”逐层做对照。每次只改变一个条件，才能知道哪一步真正影响结果。',
    takeaways: [
      '先区分画面掉帧与网络延迟。',
      '每次只改变一个变量。',
      '问题发生时和正常时都要留证据。',
    ],
    sections: [
      {
        heading: '第 0 步：判断是不是网络',
        paragraphs: [
          '画面持续不流畅、GPU 或 CPU 占用异常更像本机性能问题；角色回弹、操作晚到、语音断续或多人同时异常更像网络问题。两类问题也可能同时存在，先分别记录帧率与网络指标。',
        ],
      },
      {
        heading: '第 1 步：测家庭网关',
        paragraphs: [
          '先连续测本机到家庭网关。这里若出现尖峰或丢包，外部路由和游戏服务器还没有进入路径，优先排查 Wi-Fi 信号、网卡、路由器负载和局域网占用。',
        ],
      },
      {
        heading: '第 2 步：做单变量对照',
        paragraphs: [
          '把 Wi-Fi 换成有线，其他条件不变；把后台上传暂停，其他条件不变；换到相邻时段，其他条件不变。每次只改一项，记录结果是否稳定改善。',
        ],
        bullets: [
          '接入对照：Wi-Fi 与有线。',
          '负载对照：空闲与上传或下载进行中。',
          '时间对照：正常时段与问题时段。',
        ],
      },
      {
        heading: '第 3 步：再看外部路径',
        paragraphs: [
          '近端稳定后，再测稳定外部目标并使用路由诊断工具观察路径。路径结果是线索，不是单次定责证据；至少重复测试，并确认异常是否延续到最终目标。',
        ],
      },
      {
        heading: '第 4 步：整理可交付证据',
        paragraphs: [
          '把设备、连接方式、运营商、地区、游戏服务器区域、时间、症状和对照结果放在同一份记录里。提交前遮盖公网 IP、账户名、设备序列号和不必要的网络标识。',
        ],
      },
    ],
    related: [
      'low-ping-but-lag',
      'game-network-quality',
      'burst-packet-loss',
    ],
    sources: [msPathping, ietf3393, ietf6673],
  },
  {
    slug: 'low-ping-but-lag',
    section: 'diagnose',
    title: 'Ping 很低但游戏仍然卡：按这五类原因排查',
    description: '平均延迟正常但仍卡顿时，检查尖峰、突发丢包、本机帧率、服务器处理和输入链路。',
    eyebrow: '症状诊断',
    readTime: '4 分钟',
    publishedDate: '2026-08-21',
    updatedDate: '2026-08-21',
    answer:
      '低 Ping 只说明被展示的采样在统计窗口内较低，不代表没有短时尖峰、突发丢包或本机性能问题。应同时查看连续 RTT、丢包分布、帧率或帧时间，并确认游戏内数字的目标与采样方式。',
    takeaways: [
      '平均值正常不排除短时异常。',
      '网络卡与画面卡需要分开测。',
      '游戏服务器或游戏逻辑也可能造成类似体感。',
    ],
    sections: [
      {
        heading: '原因一：平均值藏住了尖峰',
        paragraphs: [
          '游戏界面可能显示平滑后的值，短暂的高延迟没有完整呈现。用连续样本记录最大值和发生时间，再与卡顿时刻对齐。',
        ],
      },
      {
        heading: '原因二：存在短促的连续丢包',
        paragraphs: [
          '低平均 RTT 与丢包可以同时存在。检查最长连续丢失，而不是只看一个总百分比。',
        ],
      },
      {
        heading: '原因三：画面或输入链路卡顿',
        paragraphs: [
          '同时记录帧率、帧时间、CPU 或 GPU 占用和输入设备状态。若网络曲线稳定而帧时间突增，优先处理本机性能。',
        ],
      },
      {
        heading: '原因四：测量目标不是游戏服务',
        paragraphs: [
          '系统 Ping 的目标与实际游戏会话可能走不同路径、协议或服务区域。先确认游戏服务器区域，再把外部测试当作对照，不要当作等价替代。',
        ],
      },
      {
        heading: '原因五：服务器处理或会话状态',
        paragraphs: [
          '多人同时出现相同异常、仅某个服务器或房间出现问题，可能更靠近服务端。保留发生时间、服务器区域和对局标识，便于与公告或支持渠道核对。',
        ],
      },
    ],
    related: [
      'game-lag-diagnostic-tree',
      'packet-delay-variation',
      'burst-packet-loss',
    ],
    sources: [ietf3393, ietf6673],
  },
];

export const articleBySlug = new Map(
  articles.map((article) => [article.slug, article]),
);
