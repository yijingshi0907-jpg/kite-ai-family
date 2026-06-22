import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  console.log("Seeding family content...");

  // Clear existing
  await prisma.familyWeeklyPost.deleteMany();
  await prisma.familyInterview.deleteMany();
  await prisma.familyNewsArticle.deleteMany();
  await prisma.familyPodcast.deleteMany();
  await prisma.familyRefLink.deleteMany();

  // ── Weekly posts ──────────────────────────────────────────────────────────

  const weeklyGroups = [
    {
      weekOf: "2026-06-15", weekLabel: "2026 年 6 月 15 日 当周",
      posts: [
        { date: "2026-06-15", textZh: "Kite 正在通过关于主权金融的全球对话、务实的生态合作伙伴关系以及社区驱动的建设，推动 agentic 商业的发展。以下是本周工作进展：① AI on Air 第 17 集正式上线，对话 @hashed_official Open Finance CEO @harryhojinkim，共同探讨韩国为何可能成为 AI agents、韩元 stablecoin 及机器原生支付的重要据点。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-16", textZh: "「The Agentic Economy: Payments, Commerce & AI-Native Platforms」在旧金山汇聚了 builders、investors 与 operators，共同讨论 Agentic Commerce 真正规模化之前，需要哪些底层基础设施。活动由 EntreConnect、Kite 与 AWS Builder Loft 主办。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-17", textZh: "自主 Agent 需要的不只是支付轨道，还需要内建于交易层的信任、合规与风险情报。我们很高兴分享：@CrystalPlatform 正通过 Crystal Expert，将区块链合规能力带入 Kite 的 Agent 经济，并集成进 Kite 的 agentic payment infrastructure。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-22", textZh: "过去两周，我们为 Kite Passport 交付了一层安全机制：把「验证、恢复、花费控制」包裹到 Agent 的每一个动作上。Agentic 支付里最危险的从来不是转账本身，而是转账发生前需要成立的一切前提。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-06-08", weekLabel: "2026 年 6 月 8 日 当周",
      posts: [
        { date: "2026-06-08", textZh: "我们非常高兴地宣布 Kite 生态成为 @billions_ntwk 协作式 AI Agent 电影发布的启动合作伙伴！500 多位 AI 构建者正将 Agent 转变为电影制作人，借助 human-proof x402 支付扩展。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-10", textZh: "AI on Air 第 17 集预告——主权代理金融：KRW 稳定币、合规与机器支付。怎样的金融 rails？KRW 稳定币、身份与合规应该如何在本地市场运作？欢迎收看 AI on Air 第 17 期。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-11", textZh: "Agent 经济不会从购物开始，而是从 API 开始。Chi 做客 BlockHash 播客第 742 集，分享 Kite 的市场判断在一年内完全逆转的故事：从面向消费者转向基础设施优先。", url: "https://www.youtube.com/watch?v=se1HXCqNC7E", mediaUrl: "https://img.youtube.com/vi/se1HXCqNC7E/maxresdefault.jpg" },
        { date: "2026-06-12", textZh: "当支付、身份与平台进入同一个房间，Agentic Commerce 就不再只是概念，而是基础设施问题。旧金山，6 月 15 日 17:00-20:00 PDT。我们的联合创始人兼 CEO @ChiZhangData 将参加「The Agentic Economy」活动。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-13", textZh: "AI on Air 第 17 集完整版正式上线，对话 Hashed Open Finance CEO @harryhojinkim，深入探讨韩国加密市场的机构分层趋势，以及为何韩国可能成为 AI agents 与机器原生支付的重要据点。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-06-01", weekLabel: "2026 年 6 月 1 日 当周",
      posts: [
        { date: "2026-06-03", textZh: "2026 欧冠决赛进入点球大战，PSG 击败阿森纳。真正的收益在于这次逆转——想象一下，如果有一个代理能够为你抓住这样的机会：当信号出现时立刻行动，但前提是这个代理只能在你的授权范围内动用你的资产。这正是 Kite Passport 解决的核心问题。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-04", textZh: "很高兴以官方合作伙伴和评委参与 @Bitget_AI 的 Hackathon S1！开发者无需代码基础，只需用自然语言描述你的交易点子，@Bitget_AI 就能帮你生成策略并实现上线。5 万 USDT 奖金池等你来挑战～", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-05", textZh: "被称为「Web3 达沃斯」的盛会，重返卢浮宫。Kite 很荣幸成为 @ProofofTalk 2026 的赞助商与合作伙伴。这是一场仅受邀的领导力峰会，举办地点在巴黎卢浮宫。▷ 限额 2,500 位与会者，其中 85% 为决策者。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-07", textZh: "当 AI Agent 为你购物，你最重要的客户可能根本不是人类。Chi 做客 @AiCuriousHQ 播客，与 @jeffwilser 探讨 agentic 商业已经走了多远——以及为什么它到来的速度比大多数人想象的还要快。", url: "https://www.youtube.com/watch?v=OMkE-eO4WX8", mediaUrl: "https://img.youtube.com/vi/OMkE-eO4WX8/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-05-25", weekLabel: "2026 年 5 月 25 日 当周",
      posts: [
        { date: "2026-05-28", textZh: "一位数据分析师手握 500GB 数据集，距离截止时间还有 6 小时，但她的笔记本根本撑不住工作量。她的 Agent 可以替她完成，但前提是：这个 Agent 能够在不获取她云账户凭证、信用卡或其他权限的情况下，代她花钱。这正是 Kite Passport 要解决的问题。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-05-29", textZh: "很高兴看到我们的 CMO @Cindyshi0907 受邀参加 @Edward__Park 主持的 Kite AI 主网 AMA！今晚 10 PM KST，她将在 CoinGachi Investment Twitter 与大家见面，分享 Mainnet 上线后的进展与展望。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-05-31", textZh: "被称为「Web3 达沃斯」的盛会，重返卢浮宫。Kite 很荣幸成为 @ProofofTalk 2026 的赞助商与合作伙伴，汇聚 2,500 位与会者（85% 为决策者），120+ 演讲嘉宾合计代表 $18T 管理资产。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-05-19", weekLabel: "2026 年 5 月 19 日 当周",
      posts: [
        { date: "2026-05-20", textZh: "Chi 接受 Y Talk 专访（中文）：代理支付——下一个万亿美元基础设施。为什么 AI 代理需要原生支付能力，Kite 如何成为核心构建者。", url: "https://www.youtube.com/watch?v=y1kDxjLH2-g", mediaUrl: "https://img.youtube.com/vi/y1kDxjLH2-g/maxresdefault.jpg" },
        { date: "2026-05-21", textZh: "很高兴 Kite 能够参加由 @SEABWofficial 主办的圆桌讨论，并感谢 @hashed_official 的邀请，携手共同推动机器与机器之间经济的发展。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-05-24", textZh: "Kite 正持续推进自主商业基础设施建设，通过强化信任、深化全球生态参与，以及探索 AI 驱动经济的未来。本周重要进展：我们已获得 SOC 2 Type II 合规认证，进一步强化企业级安全标准。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-05-12", weekLabel: "2026 年 5 月 12 日 当周",
      posts: [
        { date: "2026-05-14", textZh: "Chi 出席 Consensus 2026：万亿美元之问——代理支付的框架。Kite CEO 阐述代理支付将如何重塑全球经济格局。", url: "https://www.youtube.com/watch?v=reU6Byhx5og", mediaUrl: "https://img.youtube.com/vi/reU6Byhx5og/maxresdefault.jpg" },
        { date: "2026-05-16", textZh: "🚀 Kite 主网正式上线！代理经济的支付层正式诞生。Chain ID 2366，专为代理高频稳定币支付优化。立即体验 Kite Agent Passport：agentpassport.ai", url: "https://medium.com/@KiteAI/introducing-kite-mainnet-2959c89b7403", mediaUrl: null, likes: 2341 },
        { date: "2026-05-18", textZh: "代理支付的身份、委托与信任——下一个经济层必须为代理而建。深入解析 Kite 如何实现安全的自主支付。", url: "https://medium.com/@KiteAI/identity-delegation-trust-for-agentic-payments-f66463fd616a", mediaUrl: null, likes: 412 },
      ],
    },
    {
      weekOf: "2026-05-05", weekLabel: "2026 年 5 月 5 日 当周",
      posts: [
        { date: "2026-05-09", textZh: "Chi × Animoca Brands 总裁 Alan Lau 深度对话：AI 代理的稳定币支付与身份认证，Web3 游戏与 AI 代理如何在 Kite 上融合。", url: "https://www.youtube.com/watch?v=KIKpZ8qopdY", mediaUrl: "https://img.youtube.com/vi/KIKpZ8qopdY/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-04-27", weekLabel: "2026 年 4 月 27 日 当周",
      posts: [
        { date: "2026-04-28", textZh: "非常高兴我们的联合创始人兼 CEO @ChiZhangData 参加了 USC VanEck 南加州区块链大会的「AI 在区块链和加密货币中的应用」圆桌讨论！与 @solana、@AvaLabs、@LifeNetwork_AI 等项目的领导者们一起，就 AI Agent 的发展前景展开了深度探讨。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-04-30", textZh: "Kite Chain 与 Kite Agent Passport 正式上线！自主 AI 代理的支付与身份层正式到来。Chain ID 2366，立即体验：agentpassport.ai", url: "https://x.com/GoKiteAI", mediaUrl: null, likes: 1847 },
      ],
    },
    {
      weekOf: "2026-04-06", weekLabel: "2026 年 4 月 6 日 当周",
      posts: [
        { date: "2026-04-07", textZh: "AI on Air 第 15 集上线：自主商务的信任层——当 AI 代理拥有钱包。Chi 对话谷歌云 Web3 产品负责人 Nalin Mittal，探索代理如何在无需人工干预的情况下安全完成交易。", url: "https://www.youtube.com/watch?v=yOcPja2E5SU", mediaUrl: "https://img.youtube.com/vi/yOcPja2E5SU/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-03-23", weekLabel: "2026 年 3 月 23 日 当周",
      posts: [
        { date: "2026-03-29", textZh: "3月29日，OpenClaw 上海开发者交流会在上海西岸智塔成功举办！活动亮点：腾讯云 QClaw 主题分享、智能体漏洞检测 demo（自动扫描 GitHub PR 并生成漏洞报告）。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-03-09", weekLabel: "2026 年 3 月 9 日 当周",
      posts: [
        { date: "2026-03-15", textZh: "AI on Air 第 14 集上线：代理经济的信任基础设施。Chi 与 Crystal Intelligence CEO Navin Gupta 探讨声誉系统、合规机制与自主金融的重要性。", url: "https://www.youtube.com/watch?v=jS9Of4gn6p4", mediaUrl: "https://img.youtube.com/vi/jS9Of4gn6p4/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-02-16", weekLabel: "2026 年 2 月 16 日 当周",
      posts: [
        { date: "2026-02-11", textZh: "Proof of AI · Builder & Influencer Night 释放出一个清晰信号：智能新时代正在加速到来。在香港，我们与顶级 Builder、VC 及前沿思考者共同探讨 Agentic Internet 与 Open AI Economy。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-02-18", textZh: "Chi 出席 Consensus 香港 2026：代理经济的终局与路径。代理需要身份、支付与治理机制才能规模化运营。", url: "https://x.com/GoKiteAI", mediaUrl: null },
        { date: "2026-02-20", textZh: "AI on Air 第 13 集上线：代理金融——当 AI 幻觉造成数百万损失。Chi 与 Surf AI 联合创始人 Ryan Li 探讨代理金融的风险边界与结构化验证机制。", url: "https://www.youtube.com/watch?v=ozq2mhy9mE0", mediaUrl: "https://img.youtube.com/vi/ozq2mhy9mE0/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-01-26", weekLabel: "2026 年 1 月 26 日 当周",
      posts: [
        { date: "2026-01-27", textZh: "Kite 主网路线图：构建智能体原生的信任与支付技术栈。六大支柱：①智能体信任——可验证身份+可编程治理；②智能体结算——稳定币近零手续费；③智能体开发者基础设施；④智能体网络运营；⑤AgenticFi；⑥智能体生态增长引擎。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2025-11-24", weekLabel: "2025 年 11 月 24 日 当周",
      posts: [
        { date: "2025-11-26", textZh: "Chi 出席韩国区块链周 2025，接受 FIREANT 深度专访：探讨代理支付的万亿美元机遇与 Kite 的技术路线图。", url: "https://www.youtube.com/watch?v=7GoCutDVt6Y", mediaUrl: "https://img.youtube.com/vi/7GoCutDVt6Y/maxresdefault.jpg" },
        { date: "2025-11-26", textZh: "KBW 圆桌：AI 代理与 RWA——从算力基础设施到资本市场。Chi 与行业顶级建设者共同探讨 AI 与链上金融的融合前景。", url: "https://x.com/GoKiteAI", mediaUrl: null },
      ],
    },
    {
      weekOf: "2025-11-10", weekLabel: "2025 年 11 月 10 日 当周",
      posts: [
        { date: "2025-11-12", textZh: "Pieverse 将在 Kite 上启用跨链代理支付轨道，建立可互操作的多协议支付基础设施。", url: "https://medium.com/@KiteAI/pieverse-to-enable-cross-chain-agentic-payment-rails-on-kite-52ce827b0632", mediaUrl: null },
      ],
    },
    {
      weekOf: "2025-10-27", weekLabel: "2025 年 10 月 27 日 当周",
      posts: [
        { date: "2025-10-27", textZh: "激动宣布：Coinbase Ventures 投资 Kite，携手推进基于 x402 协议的代理支付标准！Kite 是最早原生实现 x402 兼容支付原语的 L1 之一。", url: "https://x.com/GoKiteAI", mediaUrl: null, likes: 1203 },
        { date: "2025-10-30", textZh: "代理如何规划任务——以及如何规划得更好。深入分析代理规划方法论及精度与效率优化策略。", url: "https://medium.com/@KiteAI/how-agents-plan-and-plan-better-90470e563e68", mediaUrl: null },
      ],
    },
    {
      weekOf: "2025-09-01", weekLabel: "2025 年 9 月 1 日 当周",
      posts: [
        { date: "2025-09-02", textZh: "重磅：Kite 完成由 PayPal Ventures 和 General Catalyst 领投的 1800 万美元融资，构建自主 AI 代理的身份与支付层！Fortune、CoinDesk、Cointelegraph 同步报道。", url: "https://x.com/GoKiteAI", mediaUrl: null, likes: 2847 },
      ],
    },
    {
      weekOf: "2025-06-16", weekLabel: "2025 年 6 月 16 日 当周",
      posts: [
        { date: "2025-06-17", textZh: "Kite 正在为代理原生互联网构建支付基础设施。自主 AI 代理需要属于自己的身份认证与支付轨道——而非将人类系统强行改造。", url: "https://x.com/GoKiteAI", mediaUrl: null, likes: 287 },
      ],
    },
  ];

  let postOrder = 0;
  for (const group of weeklyGroups) {
    for (const post of group.posts) {
      await prisma.familyWeeklyPost.create({
        data: {
          weekOf: group.weekOf,
          weekLabel: group.weekLabel,
          date: post.date,
          textZh: post.textZh,
          url: post.url,
          mediaUrl: post.mediaUrl ?? null,
          likes: (post as { likes?: number }).likes ?? null,
          sortOrder: postOrder++,
        },
      });
    }
  }
  console.log(`✓ Seeded ${postOrder} weekly posts`);

  // ── Interviews ────────────────────────────────────────────────────────────

  const interviews = [
    { date: "2026-06-11", titleZh: "Kite CEO Chi Zhang：代理互联网的底层基础 | BlockHash 播客第 742 集", bodyZh: "Chi 做客 BlockHash 播客，分享 Kite 的创业历程：为什么稳定币是 AI 代理的理想可编程货币、信用卡欺诈检测如何阻碍代理交易，以及 Kite Passport 如何通过身份与治理解决这一问题。", youtubeId: "se1HXCqNC7E", sourceUrl: "https://www.youtube.com/watch?v=se1HXCqNC7E" },
    { date: "2026-06-06", titleZh: "如何让 AI 代理帮你花钱？Chi Zhang 解密代理支付 | AI-Curious 播客", bodyZh: "Chi 接受 AI-Curious 播客专访，深入浅出地解释 AI 代理如何在用户授权范围内安全、可信地完成支付，以及 Kite 如何打造这套代理支付基础设施。", youtubeId: "OMkE-eO4WX8", sourceUrl: "https://www.youtube.com/watch?v=OMkE-eO4WX8" },
    { date: "2026-05-20", titleZh: "【中文专访】代理支付：下一个万亿美元基础设施 | Chi Zhang x Y Talk", bodyZh: "Chi 接受 Y Talk 专访，深度解析代理支付赛道的万亿美元机遇——为什么 AI 代理需要原生支付能力，Kite 如何成为这一基础设施的核心构建者。", youtubeId: "y1kDxjLH2-g", sourceUrl: "https://www.youtube.com/watch?v=y1kDxjLH2-g" },
    { date: "2026-05-18", titleZh: "【中文专访】Kite 如何开启 AI Agent 经济新纪元，打造智能时代的 Stripe？｜《知无不言》播客", bodyZh: "Chi 做客《知无不言》播客，分享 Kite 的创业故事：如何从 Databricks、Uber 的经历中找到 AI 代理支付这一赛道，以及为什么现在是构建这一基础设施的最佳时机。", youtubeId: "kOcotZZUdgY", sourceUrl: "https://www.youtube.com/watch?v=kOcotZZUdgY" },
    { date: "2026-05-09", titleZh: "Kite AI × Animoca Brands：AI 代理的稳定币支付与身份认证 | Chi Zhang × Alan Lau", bodyZh: "Chi 与 Animoca Brands 总裁 Alan Lau 深度对话，探讨 Web3 游戏与 AI 代理的融合机会，以及稳定币如何为代理经济提供无摩擦的价值流通。", youtubeId: "KIKpZ8qopdY", sourceUrl: "https://www.youtube.com/watch?v=KIKpZ8qopdY" },
    { date: "2026-04-07", titleZh: "AI on Air 第 15 集 | 自主商务的信任层：当 AI 代理拥有钱包", bodyZh: "Chi 主持 AI on Air 最新一集，与谷歌云 Web3 产品负责人 Nalin Mittal 深入探讨：AI 代理如何在没有人工干预的情况下安全完成交易，以及信任层在自主商务中扮演的关键角色。", youtubeId: "yOcPja2E5SU", sourceUrl: "https://www.youtube.com/watch?v=yOcPja2E5SU" },
    { date: "2026-03-15", titleZh: "AI on Air 第 14 集 | 代理经济的信任基础设施", bodyZh: "Chi 对话 Crystal Intelligence CEO Navin Gupta，探讨声誉系统、合规机制与自主金融在代理经济中的重要性。", youtubeId: "jS9Of4gn6p4", sourceUrl: "https://www.youtube.com/watch?v=jS9Of4gn6p4" },
    { date: "2026-02-20", titleZh: "AI on Air 第 13 集 | 代理金融：当 AI 幻觉造成数百万损失", bodyZh: "Chi 与 Surf AI 联合创始人 Ryan Li 探讨代理金融的风险边界——AI 幻觉如何引发真实的财务损失，以及如何通过结构化验证降低风险。", youtubeId: "ozq2mhy9mE0", sourceUrl: "https://www.youtube.com/watch?v=ozq2mhy9mE0" },
    { date: "2026-02-05", titleZh: "AI on Air 第 12 集 | 探索代理金融与 x402 协议", bodyZh: "Chi 与 pieverse 联合创始人 Colin Ho 深入探讨代理金融的核心协议——x402 如何让 AI 代理在链上完成无摩擦的微支付，以及多协议互操作的未来。", youtubeId: "0JzWEb6cQ34", sourceUrl: "https://youtu.be/0JzWEb6cQ34" },
    { date: "2026-01-22", titleZh: "AI on Air 第 11 集 | 以 x402 协议大规模驱动代理支付", bodyZh: "Chi 对话 Coinbase Ventures 投资人 Jonathan King，深入探讨 x402 协议如何成为代理支付的行业标准，以及 Coinbase 看好 Kite 生态的核心逻辑。", youtubeId: "ERUp4hVxH-I", sourceUrl: "https://www.youtube.com/watch?v=ERUp4hVxH-I" },
    { date: "2026-01-08", titleZh: "AI on Air 第 10 集 | 证明、支付与代理未来", bodyZh: "Chi 与 Brevis CEO Michael Dong 对话，探讨零知识证明如何为代理支付提供可验证的信任层，以及链上证明技术在代理经济中的关键作用。", youtubeId: "OPX2QC9R7CY", sourceUrl: "https://www.youtube.com/watch?v=OPX2QC9R7CY" },
    { date: "2025-12-10", titleZh: "AI on Air 第 9 集 | 与 PayPal 共建代理互联网的未来", bodyZh: "Chi 与 PayPal M12 Ventures 和 PayPal VP 深度对话，分享 Kite 与 PayPal 战略合作的幕后故事，以及支付巨头如何拥抱代理经济新范式。", youtubeId: "6oGpazMpEhQ", sourceUrl: "https://www.youtube.com/watch?v=6oGpazMpEhQ" },
    { date: "2025-11-26", titleZh: "KBW 2025 深度专访：Kite AI CEO Chi Zhang × FIREANT（韩语）", bodyZh: "韩国区块链周 2025 期间，Chi 接受韩国知名 KOL FIREANT 专访，深入探讨代理支付赛道的机遇与 Kite 的技术路线图。", youtubeId: "7GoCutDVt6Y", sourceUrl: "https://www.youtube.com/watch?v=7GoCutDVt6Y" },
    { date: "2025-11-26", titleZh: "Kite AI 如何构建 AI 代理的支付层？Chi Zhang × Wecryptotogether", bodyZh: "Chi 与韩国最大加密社区 Wecryptotogether 对话，阐述为什么现有支付基础设施无法满足自主 AI 代理的高频交易需求，以及稳定币结算如何改变这一格局。", youtubeId: "y9TKGidsjH0", sourceUrl: "https://www.youtube.com/watch?v=y9TKGidsjH0" },
    { date: "2025-11-12", titleZh: "独家专访：AI 代理如何在链上支付与谈判？Kite CEO Chi Zhang × TheStreet", bodyZh: "TheStreet 独家视频专访，Chi 揭示数字经济的下一个时代将由自主 AI 代理驱动，解析代理如何在链上自主完成支付与商业谈判。", youtubeId: "YmsxlSwvJBk", sourceUrl: "https://www.youtube.com/watch?v=YmsxlSwvJBk" },
    { date: "2025-11-08", titleZh: "Kite AI CEO 揭秘 PayPal 支持的 Web3 愿景 | BLOCKMEDIA 独家专访", bodyZh: "BLOCKMEDIA 独家专访，Chi 深度分享 Kite 获得 PayPal Ventures 投资背后的战略逻辑，以及如何将 AI 代理与区块链支付基础设施深度融合。", youtubeId: "CokbdUYuIV0", sourceUrl: "https://www.youtube.com/watch?v=CokbdUYuIV0" },
  ];

  for (let i = 0; i < interviews.length; i++) {
    await prisma.familyInterview.create({ data: { ...interviews[i], type: "interview", sortOrder: i } });
  }
  console.log(`✓ Seeded ${interviews.length} interviews`);

  // ── News articles ─────────────────────────────────────────────────────────

  const news = [
    { date: "2025-12-15", publisher: "Binance", titleEn: "The Invisible Infrastructure: How Kite AI is Building the Rails of the Agentic Economy", titleZh: "隐形基础设施：Kite AI 如何为代理经济铺设底层轨道", descZh: "Binance 深度报道，解析 Kite AI 如何在幕后构建支撑代理经济运转的关键支付与身份基础设施。", url: "https://www.binance.com/en/square/post/18083688931529" },
    { date: "2025-11-25", publisher: "PANews", titleEn: "Interview with Kite AI: How to build a unified framework for payment, identity, and governance for AI agents?", titleZh: "专访 Kite AI：如何为 AI 代理构建统一的支付、身份与治理框架？", descZh: "PANews 专访 Chi Zhang，深度探讨 Kite 为何将支付、身份认证与治理三大能力统一在同一框架下。", url: "https://www.panewslab.com/zh/articledetails/kite-ai-interview.html" },
    { date: "2025-11-12", publisher: "TheStreet Crypto", titleEn: "Kite CEO: 'Agents, identity and payments' will power the next phase of the AI economy", titleZh: "Kite CEO Chi Zhang：AI 代理、身份认证与支付将驱动 AI 经济下一阶段", descZh: "TheStreet Crypto 专访 Chi Zhang，她分享了自主 AI 代理时代的技术愿景。", url: "https://www.thestreet.com/crypto/innovation/kite-ceo-agents-identity-and-payments-will-power-the-next-phase-of-the-ai-economy" },
    { date: "2025-09-02", publisher: "Fortune", titleEn: "Exclusive: PayPal and General Catalyst lead $18 million investment in AI blockchain startup Kite", titleZh: "独家：PayPal 与 General Catalyst 领投 Kite AI 1800 万美元", descZh: "Fortune 杂志独家报道，PayPal 与 General Catalyst 联合领投 Kite AI 的 A 轮融资。Chi Zhang 亲述创业故事与技术愿景。", url: "https://fortune.com/crypto/2025/09/02/kite-ai-blockchain-paypal-general-catalyst-18-million/" },
    { date: "2025-09-02", publisher: "CoinDesk", titleEn: "Kite Raises $18M to Bridge Stablecoin Payments and Autonomous Agents", titleZh: "Kite 融资 1800 万美元，打通稳定币支付与自主 AI 代理", descZh: "CoinDesk 报道，Kite AI 完成 1800 万美元 A 轮融资，旨在为自主 AI 代理构建链上支付轨道。", url: "https://www.coindesk.com/business/2025/09/02/kite-raises-usd18m-to-bridge-stablecoin-payments-and-autonomous-agents" },
    { date: "2025-09-02", publisher: "IQ.wiki", titleEn: "Chi Zhang — People in Crypto | IQ.wiki", titleZh: "Chi Zhang 人物档案 | IQ.wiki 加密百科", descZh: "IQ.wiki 加密百科对 Chi Zhang 的详细人物档案：UC Berkeley 统计学博士、Forbes 30 Under 30 得主，以及创立 Kite AI 的完整故事。", url: "https://iq.wiki/wiki/chi-zhang" },
  ];

  for (let i = 0; i < news.length; i++) {
    await prisma.familyNewsArticle.create({ data: { ...news[i], sortOrder: i } });
  }
  console.log(`✓ Seeded ${news.length} news articles`);

  // ── Podcasts ──────────────────────────────────────────────────────────────

  const podcasts = [
    { episode: 15, titleZh: "AI on Air 第 15 集 | 自主商务的信任层：当 AI 代理拥有钱包", guestZh: "纳林·米塔尔", guestOrgZh: "谷歌云，Web3 产品负责人", youtubeUrl: "https://www.youtube.com/watch?v=yOcPja2E5SU" },
    { episode: 14, titleZh: "AI on Air 第 14 集 | 代理经济的信任基础设施", guestZh: "纳文·古普塔", guestOrgZh: "Crystal Intelligence，CEO", youtubeUrl: "https://www.youtube.com/watch?v=jS9Of4gn6p4" },
    { episode: 13, titleZh: "AI on Air 第 13 集 | 代理金融：当 AI 幻觉造成数百万损失", guestZh: "Ryan Li", guestOrgZh: "Surf AI，联合创始人兼 CEO", youtubeUrl: "https://www.youtube.com/watch?v=ozq2mhy9mE0" },
    { episode: 12, titleZh: "AI on Air 第 12 集 | 探索代理金融与 x402 协议", guestZh: "Colin Ho", guestOrgZh: "pieverse，联合创始人兼 CEO", youtubeUrl: "https://youtu.be/0JzWEb6cQ34" },
    { episode: 11, titleZh: "AI on Air 第 11 集 | 以 x402 协议大规模驱动代理支付", guestZh: "Jonathan King", guestOrgZh: "Coinbase Ventures，投资人", youtubeUrl: "https://www.youtube.com/watch?v=ERUp4hVxH-I" },
    { episode: 10, titleZh: "AI on Air 第 10 集 | 证明、支付与代理未来", guestZh: "Michael Dong", guestOrgZh: "Brevis，CEO", youtubeUrl: "https://www.youtube.com/watch?v=OPX2QC9R7CY" },
    { episode: 9, titleZh: "AI on Air 第 9 集 | 与 PayPal 共建代理互联网的未来", guestZh: "Alan Du & Jonathan Cordeau", guestOrgZh: "M12 Ventures / PayPal", youtubeUrl: "https://www.youtube.com/watch?v=6oGpazMpEhQ" },
    { episode: 8, titleZh: "AI on Air 第 8 集 | 基于 Kite 构建：Codatta 与 AI 数据新时代", guestZh: "张毅", guestOrgZh: "Codatta，CEO", youtubeUrl: "https://www.youtube.com/watch?v=kf4rk-fGSnI" },
    { episode: 7, titleZh: "AI on Air 第 7 集 | 硬件加速时代", guestZh: "Jason Li", guestOrgZh: "Solayer Labs，联合创始人", youtubeUrl: "https://www.youtube.com/watch?v=kUdhjKhPT2s" },
    { episode: 6, titleZh: "AI on Air 第 6 集 | 自主代理，自主支付", guestZh: "Sean Li", guestOrgZh: "Magic Labs，CEO", youtubeUrl: "https://www.youtube.com/watch?v=5Z8B17z9F10" },
    { episode: 5, titleZh: "AI on Air 第 5 集 | 代理互联网的崛起", guestZh: "王淼森", guestOrgZh: "DeepMind，研究工程师", youtubeUrl: "https://www.youtube.com/watch?v=j70-zAL2Ljc" },
    { episode: 4, titleZh: "AI on Air 第 4 集 | 与 Ava Labs 共建 AI 时代的金融轨道", guestZh: "John Nahas", guestOrgZh: "Ava Labs，首席商务官", youtubeUrl: "https://www.youtube.com/watch?v=XjcrjV-Ra9k" },
    { episode: 3, titleZh: "AI on Air 第 3 集 | AI、验证与信任的未来", guestZh: "Gregory Rosu 教授", guestOrgZh: "伊利诺伊大学香槟分校（UIUC）", youtubeUrl: "https://www.youtube.com/watch?v=SxsICD_RNas" },
    { episode: 2, titleZh: "AI on Air 第 2 集 | 从 Netflix 到 Meta：AI 革命亲历者视角", guestZh: "徐振中", guestOrgZh: "Meta，工程领导", youtubeUrl: "https://www.youtube.com/watch?v=jEUKT39obJk" },
    { episode: 1, titleZh: "AI on Air 第 1 集 | 解锁 AI 的真正价值：归因、区块链与创新未来", guestZh: "Shriram Vishwanath 教授", guestOrgZh: "德克萨斯大学奥斯汀分校", youtubeUrl: "https://www.youtube.com/watch?v=FtGeQJkH38w" },
  ];

  for (let i = 0; i < podcasts.length; i++) {
    await prisma.familyPodcast.create({ data: { ...podcasts[i], sortOrder: i } });
  }
  console.log(`✓ Seeded ${podcasts.length} podcasts`);

  // ── Ref links ─────────────────────────────────────────────────────────────

  const refLinks = [
    { icon: "🌐", titleZh: "Kite 官网", descZh: "公司官方主页与产品介绍", url: "https://gokite.ai" },
    { icon: "🎙️", titleZh: "Kite 播客 (AI on Air)", descZh: "全部播客节目，探索代理经济前沿", url: "https://gokite.ai/podcast" },
    { icon: "📰", titleZh: "媒体报道", descZh: "Fortune、CoinDesk 等主流媒体对 Kite 的报道汇总", url: "https://gokite.ai/media" },
    { icon: "✍️", titleZh: "Medium 博客", descZh: "Kite 团队深度技术与产品文章", url: "https://medium.com/@KiteAI" },
    { icon: "🐦", titleZh: "X / Twitter", descZh: "@GoKiteAI 官方账号，最新公司动态", url: "https://x.com/GoKiteAI" },
    { icon: "▶️", titleZh: "YouTube 频道", descZh: "Kite AI 官方 YouTube，AI on Air 播客视频版", url: "https://www.youtube.com/@kiteai_official" },
    { icon: "💼", titleZh: "领英主页", descZh: "Chi Zhang 和 Kite AI 的领英页面", url: "https://linkedin.com/company/kite-ai" },
    { icon: "🤖", titleZh: "Agent Passport", descZh: "Kite 代理护照产品主页", url: "https://agentpassport.ai" },
  ];

  for (let i = 0; i < refLinks.length; i++) {
    await prisma.familyRefLink.create({ data: { ...refLinks[i], sortOrder: i } });
  }
  console.log(`✓ Seeded ${refLinks.length} ref links`);

  console.log("✅ Family content seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
