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
  takeaways?: string[];
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
          'RFC 3393 描述的 IP packet delay variation 基于选定两个数据包的单向时延之差，不能与普通 ping 命令测到的往返时延（RTT）变化画等号。日常工具可能将相邻 RTT 差、标准差或其他统计量标为 jitter；比较前先确认算法、测量方向和采样窗口。',
        ],
      },
      {
        heading: '一个简单判断例子',
        paragraphs: [
          '假设 A 组 RTT 为 24、25、26、25、25 毫秒，B 组为 10、10、10、10、65 毫秒：两组平均都是 25 毫秒，但 B 组出现一次 65 毫秒的尖峰。这个例子只演示平均数会掩盖波动，不代表真实测试，也不能凭一次尖峰断定游戏卡顿原因。记录完整采样时间，才有机会与游戏中的异常时刻对齐。',
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
          '假设每隔 100 毫秒发送一次探测，1000 个样本中丢 10 个：它们可能分散出现，也可能连续丢失。连续十次无回应跨越约一秒的发送间隔，但不等于已经证明游戏业务流量中断一秒。若探测频率不同，实际覆盖的时间也会变化。仅凭 ICMP 探测还不能确认游戏 UDP 数据包有相同丢失分布。',
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
    readTime: '7 分钟',
    publishedDate: '2026-08-21',
    updatedDate: '2026-08-21',
    answer:
      '排查游戏卡顿时，先确认是帧率问题还是网络问题；如果是网络，再按“本机与家庭网关 → Wi-Fi/有线 → 空闲/负载 → 外部路径 → 游戏服务器”逐层做对照。每次只改变一个条件，才能知道哪一步真正影响结果。',
    takeaways: [],
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
          'Windows 可按 Win+R，输入 cmd 打开命令提示符，先执行 ipconfig，找到当前适配器的“默认网关”；再运行 ping -n 100 网关地址，例如 ping -n 100 192.168.1.1（示例地址必须替换为实际网关）。macOS 可在“系统设置→网络”查看路由器地址，并在终端运行 ping -c 100 网关地址。记录开始时间、平均/最大 RTT 和无回应次数。若网关禁用或限制 ICMP，应先核实是否正常回应，不能单凭超时断定局域网故障。',
        ],
      },
      {
        heading: '第 2 步：做单变量对照',
        paragraphs: [
          '先在同一设备、同一网关和尽量相同的时段对照 Wi-Fi 与有线连接；再固定接入方式，对照空闲与存在后台上传时的结果。测试时记录同一个目标，避免同时更换设备、服务器区域和连接方式。如果只有 Wi-Fi 出现尖峰，优先检查干扰与信号；如果有线也仅在上传时恶化，检查上行占用和路由器队列。单次改善不代表因果已经确定，建议重复对照。',
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
          '确认家庭网关可以回应且近端结果相对稳定后，可对允许 ICMP 的外部目标进行连续 ping，对照异常时段和正常时段。Windows 的 tracert 目标地址可用于查看路由经过的节点，pathping 目标地址可补充统计（耗时可能较长）。中间节点显示星号或较高丢包，可能只是限速或不回应探测，并不等于转发游戏流量丢包；最终目标如果不响应 ICMP，也不能以此证明断线。不要据单张路由截图判定运营商责任。',
        ],
      },
      {
        heading: '第 4 步：整理可交付证据',
        paragraphs: [
          '若本机帧时间出现尖峰而网关与网络测量相对稳定，先检查游戏设置、驱动和设备负载；若只有 Wi-Fi 异常，优先检查无线环境；若近端稳定、外部目标在同一时段持续异常，则保留多次对照结果向运营商询问；若仅某个游戏房间异常，可记录服务器区域与发生时间联系游戏支持。把设备、连接方式、症状、测试目标、时间、样本数量及正常/异常两组结果写在同一份记录里。分享前遮盖公网 IP、账号及设备标识。',
        ],
      },
    ],
    related: [
      'low-ping-but-lag',
      'game-network-quality',
      'burst-packet-loss',
      'wifi-gaming-lag',
      'ping-spikes-while-gaming',
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
    takeaways: [],
    sections: [
      {
        heading: '原因一：平均值藏住了尖峰',
        paragraphs: [
          '先记录发生异常的准确时间，再检查游戏是否提供帧时间、丢包或网络图表；普通系统 ping 可作为辅助对照，但不等于游戏流量。连续测量时保留每个样本或至少最大值与时间戳。如果卡顿时恰好出现尖峰，属于需要复测的关联证据，不足以单独判定原因。',
        ],
      },
      {
        heading: '原因二：存在短促的连续丢包',
        paragraphs: [
          '网络可以在大多数采样里表现为低 RTT，同时偶尔连续无回应。记录总样本量、发送间隔、连续无回应次数和时间；将其与游戏回弹、语音断续发生时刻对照。部分设备或服务器会限制 ICMP，应避免把探测包无回应直接当成游戏包丢失。',
        ],
      },
      {
        heading: '原因三：画面或输入链路卡顿',
        paragraphs: [
          '打开游戏内帧时间图或系统性能监控，观察卡顿瞬间帧时间是否突然升高，同时查看 CPU、GPU 和内存压力。若画面整体停顿但其他玩家位置没有网络回弹，先试降低高负载画质选项并重复测试。输入设备或显示链路也会带来主观操作延迟，不应只凭游戏内 Ping 正常就排除。',
        ],
      },
      {
        heading: '原因四：测量目标不是游戏服务',
        paragraphs: [
          '先在游戏界面核对实际匹配区域。电脑 ping 公共 DNS 或测速网站时，目标、协议和路径可能与当前对局完全不同；即使公共目标稳定，也不能据此断言游戏服务器通信稳定。能查看游戏内网络统计时优先保留该数据，并标明数据来源。',
        ],
      },
      {
        heading: '原因五：服务器处理或会话状态',
        paragraphs: [
          '若使用不同家庭网络的多名玩家在同一对局同一时刻发生异常，而自己访问其他服务正常，服务端问题是一个值得调查的假设，但仍不能单凭现象定责。核对官方状态公告、记录服务器区域和异常时间，向游戏支持渠道反馈；不要公开包含他人信息的对局截图。',
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

  {
    slug: 'wifi-gaming-lag',
    section: 'diagnose',
    title: '玩游戏只有 Wi-Fi 卡、有线正常：这样做对照排查',
    description: '同一设备上 Wi-Fi 卡、有线较稳定时，如何控制测试变量，检查信号、干扰、负载与漫游，避免把一次对照当成定论。',
    eyebrow: '无线网络排查',
    readTime: '6 分钟',
    publishedDate: '2026-10-30',
    updatedDate: '2026-10-30',
    answer: '如果同一台电脑用 Wi-Fi 玩游戏经常回弹或延迟跳高，改用有线后明显改善，应优先调查无线链路；但一次对照还不能证明路由器损坏。先固定设备、游戏区域、测试目标与时段，重复测量，再看信号、信道拥挤、漫游和家中负载。',
    takeaways: [],
    sections: [
      {
        heading: '先确认是网络回弹还是画面掉帧',
        paragraphs: [
          '如果画面整体短暂停住，而延迟统计未同步异常，应同时记录帧时间和 CPU/GPU 负载。只有角色突然回弹或对局数据延迟，并不能单凭体感锁定 Wi-Fi；先记下出现问题的时间。',
        ],
      },
      {
        heading: '用同一台设备做两轮可比较的测试',
        paragraphs: [
          '在相近时段、同一位置、同一游戏区域和同一测量目标下，先用 Wi-Fi 记录一组连续 RTT，再关闭无线网络并接入网线测第二组。两轮都记录时间、测试目标、样本数、最大 RTT、P95 和超时情况；最好交换先后顺序再测一次，以减少时段波动带来的误判。',
          'Windows 可在命令提示符运行 ipconfig 查默认网关，再用 ping -n 100 实际网关地址测试近端；macOS 或 Linux 可运行 ping -c 100 实际网关地址。网关如果不回答 ICMP，不能直接把 100 次超时理解为真实游戏丢包。',
        ],
        bullets: [
          '只改变连接方式；不要同时换设备、服务器、路由器或游戏画质。',
          '先比较到家庭网关的表现，再比较允许 ICMP 的外部目标。',
          '把原始样本导入网络诊断分析器，查看尖峰是否由少数极值造成。',
        ],
      },
      {
        heading: 'Wi-Fi 独有异常时先查哪些条件',
        paragraphs: [
          '如果异常主要出现在无线接入，检查设备与路由器之间的距离、墙体遮挡、同频设备干扰、无线网卡驱动以及设备是否在多个接入点之间漫游。可以在靠近路由器的位置复测；不要把切换 2.4 GHz 和 5 GHz 之后的一次改善视为普遍规律，不同环境的覆盖和拥挤程度不同。',
          '还要比较家里有人上传、云盘同步或直播时与网络空闲时的结果。若有线和 Wi-Fi 都在上传时出现波动，问题可能更接近上行负载或排队延迟，不应只怪无线信号。',
        ],
      },
      {
        heading: '什么时候可以下结论，什么时候该停止',
        paragraphs: [
          '多轮相近条件下，无线测试持续出现尖峰而有线没有，足以支持“优先排查无线链路”的行动判断，但不足以确定某台设备损坏。若两种连接均异常，应回到通用卡顿诊断树。若网络采样稳定而画面仍卡，转向帧时间和游戏内性能指标。',
          '如要发帖求助，提供匿名化的两组测试时间、目标和统计数据；不要公开公网 IP、设备序列号或游戏账号信息。',
        ],
      },
    ],
    related: ['game-lag-diagnostic-tree', 'low-ping-but-lag', 'packet-delay-variation'],
    sources: [ietf3393, msPathping],
  },
  {
    slug: 'ping-spikes-while-gaming',
    section: 'diagnose',
    title: '玩游戏 Ping 突然升高：抓住尖峰出现的时刻排查',
    description: '游戏中 Ping 偶尔突然升高时，如何记录时间戳、对照网关与外部目标、检查后台上传并避免误判运营商或服务器。',
    eyebrow: '突发高延迟',
    readTime: '6 分钟',
    publishedDate: '2026-10-30',
    updatedDate: '2026-10-30',
    answer: 'Ping 偶尔突然升高，首先要确认尖峰发生的时间、持续次数及测量目标，再与游戏中的实际卡顿对应。优先排查本机负载、Wi-Fi 和家庭网关；近端稳定、外部异常时再进一步测试外部路径，不宜凭一次波动判断运营商故障。',
    takeaways: [],
    sections: [
      {
        heading: '先记录尖峰，不要只截一张最大值',
        paragraphs: [
          '记下游戏开始卡顿的具体时间，保存连续响应数据，至少保留测试目标、开始时间、采样次数、平均 RTT、P95、最大 RTT 和无回应次数。峰值本身不说明频率；同样的最大值，出现一次与频繁出现，对实际体验的含义不同。',
          '可以将逐条 RTT 导入本站分析器查看时间序列。不过分析器中的 P95 是当前成功响应样本的统计值；超时和目标不响应需要另行解释，不能把它当成游戏服务质量评分。',
        ],
      },
      {
        heading: '同时测试网关和允许 ICMP 的外部目标',
        paragraphs: [
          '先使用 ipconfig（Windows）或系统网络设置找到真实默认网关，再连续测试；随后对允许 ICMP 的外部目标做相近时间的测试。若网关也在同一时间出现尖峰，优先调查无线连接、本机或局域网负载。若网关稳定而外部目标波动，才继续调查更远的路径。',
          '两组测试若不是同一时间完成，不能仅凭结果差异判定故障位置；某些目标限制 ICMP，应先排除测量方式造成的无回应。',
        ],
      },
      {
        heading: '检查异常是否伴随上传或设备负载',
        paragraphs: [
          '记录云盘同步、系统更新、直播、视频会议或其他设备大量上传的时段。可以在网络空闲时重复同样目标的测试，再单独改变后台负载观察结果。只有一次改善说明值得继续验证，不证明某个程序必然是原因。',
        ],
        bullets: [
          'Wi-Fi 与有线分别复测，尽量保持同一测试目标和相近时段。',
          '对照游戏内指标和本机帧时间，避免把掉帧看成高 Ping。',
          '保留原始样本，标出尖峰发生的时间而非只保存平均值。',
        ],
      },
      {
        heading: '需要向谁求助',
        paragraphs: [
          '如果仅某个游戏或区服异常，先查其官方服务状态并保存服务器区域和异常时间；若多个外部目标持续异常且局域网对照稳定，可把多轮、匿名化的结果提交给宽带服务商询问。中间路由跳数的 ICMP 超时不能单独作为链路丢包证据。',
        ],
      },
    ],
    related: ['packet-delay-variation', 'game-lag-diagnostic-tree', 'wifi-gaming-lag'],
    sources: [ietf3393, msPathping],
  },
];

export const articleBySlug = new Map(
  articles.map((article) => [article.slug, article]),
);
