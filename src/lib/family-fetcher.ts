import { unstable_cache } from "next/cache";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PressArticle = {
  id: string;
  titleZh: string;
  titleEn: string;
  publisher: string;
  descZh: string;
  url: string;
  imageUrl: string;
  date: string; // ISO yyyy-mm-dd
  tag: "company";
};

export type MediumArticle = {
  id: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  url: string;
  date: string;
  tag: "company";
};

export type PodcastEpisode = {
  id: string;
  episode: number;
  titleZh: string;
  titleEn: string;
  guestZh: string;
  guestEn: string;
  guestOrgZh: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  tag: "links" | "personal";
};

export type PersonalUpdate = {
  id: string;
  titleZh: string;
  bodyZh: string;
  date: string;
  imageUrl?: string;
  youtubeId?: string;   // if set, shows embedded YouTube thumbnail with play button
  sourceUrl?: string;
  tag: "personal";
  type?: "interview" | "update";
};

export type PersonalNewsArticle = {
  id: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  url: string;
  date: string;
  publisher: string;
  tag: "personal";
};

export type XPost = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  textZh: string;
  textEn: string;
  url: string;
  mediaUrl?: string;
  likes?: number;
};

export type WeeklyGroup = {
  weekOf: string; // ISO Monday of that week
  weekLabelZh: string;
  posts: XPost[];
};

export type RefLink = {
  id: string;
  titleZh: string;
  descZh: string;
  url: string;
  icon: string;
};

// Kite AI YouTube channel ID (for RSS auto-fetch)
const KITE_YT_CHANNEL_ID = "UCZ7OYTGcXA93faGcmnyjTzw";

// ---------------------------------------------------------------------------
// Written news articles about Chi — sorted newest first
// ---------------------------------------------------------------------------

export const chiNewsArticles: PersonalNewsArticle[] = [
  {
    id: "news-thestreet-chi",
    tag: "personal",
    publisher: "TheStreet Crypto",
    date: "2025-11-12",
    titleEn: "Kite CEO: 'Agents, identity and payments' will power the next phase of the AI economy",
    titleZh: "Kite CEO Chi Zhang：AI 代理、身份认证与支付将驱动 AI 经济下一阶段",
    descZh: "TheStreet Crypto 专访 Chi Zhang，她分享了自主 AI 代理时代的技术愿景：为什么代理需要专属的身份层与支付基础设施，以及 Kite 如何填补这一关键缺口。",
    url: "https://www.thestreet.com/crypto/innovation/kite-ceo-agents-identity-and-payments-will-power-the-next-phase-of-the-ai-economy",
  },
  {
    id: "news-iqwiki-chi",
    tag: "personal",
    publisher: "IQ.wiki",
    date: "2025-09-02",
    titleEn: "Chi Zhang — People in Crypto | IQ.wiki",
    titleZh: "Chi Zhang 人物档案 | IQ.wiki 加密百科",
    descZh: "IQ.wiki 加密百科对 Chi Zhang 的详细人物档案：UC Berkeley 统计学博士、Databricks 产品经理、Forbes 30 Under 30 得主，以及创立 Kite AI 的完整故事。",
    url: "https://iq.wiki/wiki/chi-zhang",
  },
];

// ---------------------------------------------------------------------------
// Company intro
// ---------------------------------------------------------------------------

export const companyIntro = {
  nameZh: "Kite AI",
  taglineZh: "代理互联网的支付基础设施",
  descZh:
    "Kite 正在构建代理原生时代的支付基础设施。平台提供一个基础层，让自主 AI 代理能够拥有可验证的身份、可编程的治理机制，以及原生的稳定币结算能力。Kite 的愿景是打造一个代理可以自主交易、协作与运营的互联网——身份、信任与责任内置于核心，人人可用，自主可控。公司由来自 Databricks、Uber、UC Berkeley 的资深人才创立，已获得 3500 万美元融资。",
  investors: ["PayPal Ventures", "General Catalyst", "Coinbase Ventures", "8VC", "Samsung Next", "Vertex Ventures", "Hashed", "Layer Zero"],
  productsZh: ["Agent Passport — AI 代理的身份与支付护照", "Kite Mainnet — 专为代理高频小额支付优化的 EVM 兼容 L1 链"],
  logoUrl: "https://gokite.ai/favicon.ico",
  siteUrl: "https://gokite.ai",
};

// ---------------------------------------------------------------------------
// Press articles — sorted newest first
// Using real images from gokite.ai/images/
// ---------------------------------------------------------------------------

export const pressArticles: PressArticle[] = [
  {
    id: "press-theblock",
    tag: "company",
    publisher: "The Block",
    date: "2026-05-16",
    titleEn: "Kite Launches Kite Chain and Kite Agent Passport, Enabling Autonomous AI Agent Payments",
    titleZh: "Kite 发布 Kite Chain 与 Kite Agent Passport，赋能自主 AI 代理支付",
    descZh: "The Block 报道，Kite 正式推出 Kite Chain 主链与 Agent Passport 产品，为自主 AI 代理提供完整的支付与身份基础设施，标志着代理支付时代的正式开启。",
    url: "https://www.theblock.co/press-releases/399534/kite-launches-kite-chain-and-kite-agent-passport-enabling-autonomous-ai-agent-payments",
    imageUrl: "https://gokite.ai/images/kite-media-01.png",
  },
  {
    id: "press-coinbase",
    tag: "company",
    publisher: "BeInCrypto",
    date: "2025-10-27",
    titleEn: "Kite Announces Investment From Coinbase Ventures to Advance Agentic Payments with the x402 Protocol",
    titleZh: "Kite 宣布获得 Coinbase Ventures 投资，以 x402 协议推进代理支付",
    descZh: "Coinbase Ventures 宣布战略投资 Kite，共同推进基于 x402 协议的代理支付标准，为 AI 代理自主完成链上交易铺设基础。",
    url: "https://beincrypto.com/kite-investment-from-coinbase-ventures/",
    imageUrl: "https://gokite.ai/images/kite-media-08.webp",
  },
  {
    id: "press-general-catalyst",
    tag: "company",
    publisher: "General Catalyst",
    date: "2025-09-15",
    titleEn: "Our Investment in Kite — Infrastructure for the Agentic Internet",
    titleZh: "我们对 Kite 的投资——代理互联网的基础设施",
    descZh: "General Catalyst 分享投资 Kite 背后的逻辑：AI 代理需要专属的身份认证与支付层，Kite 正在构建这一关键基础设施。",
    url: "https://www.generalcatalyst.com/stories/our-investment-in-kite",
    imageUrl: "https://gokite.ai/images/kite-media-07.png",
  },
  {
    id: "press-samsung",
    tag: "company",
    publisher: "Samsung Next",
    date: "2025-09-10",
    titleEn: "Why we invested in Kite, building the foundational infrastructure for the agentic economy",
    titleZh: "为什么我们投资 Kite——构建代理经济的基础设施",
    descZh: "Samsung Next 详述投资决策：Kite 所构建的代理护照与支付轨道，将成为代理经济的核心基础。",
    url: "https://www.samsungnext.com/blog/why-we-invested-in-kite",
    imageUrl: "https://gokite.ai/images/kite-media-06.png",
  },
  {
    id: "press-dispersion",
    tag: "company",
    publisher: "Dispersion Capital",
    date: "2025-09-05",
    titleEn: "From Day Zero to Today: Why We Reinvested in Kite AI",
    titleZh: "从第一天到今天：我们为何再次投资 Kite AI",
    descZh: "Dispersion Capital 回顾从天使轮到 A 轮持续加注 Kite AI 的历程，深度解析 Kite 在代理金融赛道的核心竞争壁垒。",
    url: "https://dispersion.xyz/learn/568/from-day-zero-to-today-why-we-reinvested-in-kite-ai",
    imageUrl: "https://gokite.ai/images/kite-media-05.png",
  },
  {
    id: "press-paypal-ventures",
    tag: "company",
    publisher: "PayPal Ventures",
    date: "2025-09-03",
    titleEn: "Why we invested in Kite AI",
    titleZh: "我们为何投资 Kite AI",
    descZh: "PayPal Ventures 阐述投资逻辑：随着 AI 代理承担越来越多的金融决策，Kite 提供的信任与支付层将成为不可或缺的基础设施。",
    url: "https://paypal.vc/news/news-details/2025/The-state-of-agentic-commerce-and-why-we-invested-in-Kite-AI-2025-LroAXfplpA/default.aspx",
    imageUrl: "https://gokite.ai/images/kite-media-04.png",
  },
  {
    id: "press-cointelegraph",
    tag: "company",
    publisher: "Cointelegraph",
    date: "2025-09-02",
    titleEn: "PayPal Ventures backs Kite AI with $18M to power AI agents",
    titleZh: "PayPal Ventures 以 1800 万美元支持 Kite AI，赋能 AI 代理支付",
    descZh: "Cointelegraph 报道，PayPal Ventures 战略投资 Kite AI，携手布局代理经济时代的支付基础设施。",
    url: "https://cointelegraph.com/news/paypal-ventures-backs-kite-ai-with-18m-to-power-ai-agents",
    imageUrl: "https://gokite.ai/images/kite-media-03.png",
  },
  {
    id: "press-coindesk",
    tag: "company",
    publisher: "CoinDesk",
    date: "2025-09-02",
    titleEn: "Kite Raises $18M to Bridge Stablecoin Payments and Autonomous Agents",
    titleZh: "Kite 融资 1800 万美元，连接稳定币支付与自主 AI 代理",
    descZh: "CoinDesk 报道，Kite AI 完成 1800 万美元融资，旨在为自主 AI 代理构建链上支付轨道，实现稳定币与智能代理的无缝对接。",
    url: "https://www.coindesk.com/business/2025/09/02/kite-raises-usd18m-to-bridge-stablecoin-payments-and-autonomous-agents",
    imageUrl: "https://gokite.ai/images/kite-media-02.png",
  },
  {
    id: "press-fortune",
    tag: "company",
    publisher: "Fortune",
    date: "2025-09-02",
    titleEn: "Exclusive: PayPal and General Catalyst lead $18 million investment in AI blockchain startup Kite",
    titleZh: "独家：PayPal 与 General Catalyst 领投 Kite 这一 AI 区块链初创公司 1800 万美元",
    descZh: "Fortune 杂志独家报道，PayPal 与 General Catalyst 联合领投 Kite AI 的 1800 万美元融资轮，推动 AI 代理与区块链支付的深度融合。",
    url: "https://fortune.com/crypto/2025/09/02/kite-ai-blockchain-paypal-general-catalyst-18-million/",
    imageUrl: "https://gokite.ai/images/kite-media-01.png",
  },
];

// ---------------------------------------------------------------------------
// Medium blog articles — sorted newest first
// ---------------------------------------------------------------------------

export const mediumArticles: MediumArticle[] = [
  {
    id: "medium-omnichain",
    tag: "company",
    date: "2026-06-21",
    titleEn: "Building Omnichain Apps on Kite: Agent-Native Cross-Chain Execution",
    titleZh: "在 Kite 上构建全链应用：代理原生的跨链执行",
    descZh: "Kite 技术团队正在构建面向代理经济和 Web3 的前沿全链基础设施，即将正式发布。",
    url: "https://medium.com/@KiteAI/building-omnichain-apps-on-kite-agent-native-cross-chain-execution-2d0b1afb73c6",
  },
  {
    id: "medium-inside-kite",
    tag: "company",
    date: "2026-06-21",
    titleEn: "Inside Kite: Architecture and Use Cases",
    titleZh: "深入 Kite：系统架构与应用场景",
    descZh: "全面介绍 Kite 的技术架构设计理念，以及当前已支持的核心应用场景。",
    url: "https://medium.com/@KiteAI/inside-kite-architecture-and-use-cases-92244727a7c3",
  },
  {
    id: "medium-japan",
    tag: "company",
    date: "2026-06-19",
    titleEn: "Kite and the JV of SMBC Nikko and Hatapro Demonstrate Agentic Payments for Travel",
    titleZh: "Kite 与 SMBC Nikko & Hatapro 合资项目展示旅行代理支付",
    descZh: "首个此类合作：AI 代理自主发现、预约并支付日本当地体验服务，在用户预设预算内完成全流程。",
    url: "https://medium.com/@KiteAI/kite-and-the-jv-of-smbc-nikko-and-hatapro-proof-of-japan-demonstrate-agentic-payments-for-travel-6cfc4bc4ee13",
  },
  {
    id: "medium-hackathon",
    tag: "company",
    date: "2026-05-18",
    titleEn: "Kite 1st Global Hackathon Kicked Off at ETH Denver",
    titleZh: "Kite 首届全球黑客松在 ETH Denver 正式启动",
    descZh: "汇聚 Web3 与 AI 顶尖建设者的系列黑客松正式拉开帷幕，共同开拓代理经济新边界。",
    url: "https://medium.com/@KiteAI/kite-1st-global-hackathon-kicked-off-at-eth-denver-pioneering-the-agentic-economy-fac773e42f51",
  },
  {
    id: "medium-identity",
    tag: "company",
    date: "2026-05-18",
    titleEn: "Identity, Delegation & Trust for Agentic Payments",
    titleZh: "代理支付的身份、委托与信任",
    descZh: "下一个经济层必须为代理而建。深入解析 Kite 如何通过身份认证、委托机制与信任框架，赋能自主代理安全完成支付。",
    url: "https://medium.com/@KiteAI/identity-delegation-trust-for-agentic-payments-f66463fd616a",
  },
  {
    id: "medium-mainnet",
    tag: "company",
    date: "2026-05-16",
    titleEn: "Introducing Kite Mainnet: The Payments Layer for the Agent Economy",
    titleZh: "Kite 主网正式上线：代理经济的支付层",
    descZh: "Kite 推出 EVM 兼容主链（Chain ID 2366），专为自主代理高频小额稳定币支付优化，同步发布 Kite Agent Passport 公测版。",
    url: "https://medium.com/@KiteAI/introducing-kite-mainnet-2959c89b7403",
  },
  {
    id: "medium-passport",
    tag: "company",
    date: "2026-05-16",
    titleEn: "Introducing Kite Agent Passport",
    titleZh: "Kite Agent Passport 正式发布",
    descZh: "AI 代理正从回答问题迈向完成实际工作。Agent Passport 为代理提供四大原语：身份、委托、支付结算与行为日志。",
    url: "https://medium.com/@KiteAI/introducing-kite-agent-passport-0b4fc499746a",
  },
  {
    id: "medium-pieverse",
    tag: "company",
    date: "2025-11-12",
    titleEn: "Pieverse to Enable Cross-Chain Agentic Payment Rails on Kite",
    titleZh: "Pieverse 将在 Kite 上启用跨链代理支付轨道",
    descZh: "Pieverse 与 Kite 达成合作，建立可互操作的多协议支付基础设施，推动跨链代理支付的规模化落地。",
    url: "https://medium.com/@KiteAI/pieverse-to-enable-cross-chain-agentic-payment-rails-on-kite-52ce827b0632",
  },
  {
    id: "medium-agents-plan",
    tag: "company",
    date: "2025-10-30",
    titleEn: "How Agents Plan — And Plan Better",
    titleZh: "代理如何规划任务——以及如何规划得更好",
    descZh: "深度分析 AI 代理的任务规划方法论，以及如何优化规划效率与准确性。",
    url: "https://medium.com/@KiteAI/how-agents-plan-and-plan-better-90470e563e68",
  },
  {
    id: "medium-coinbase-medium",
    tag: "company",
    date: "2025-10-27",
    titleEn: "Kite Announces Investment from Coinbase Ventures",
    titleZh: "Kite 宣布获得 Coinbase Ventures 投资",
    descZh: "A 轮融资的延伸：Coinbase Ventures 的战略投资将加速 x402 协议的代理支付标准推广。",
    url: "https://medium.com/@KiteAI/kite-announces-investment-from-coinbase-ventures-to-advance-agentic-payments-with-the-x402-protocol-cd9e3639329f",
  },
];

// ---------------------------------------------------------------------------
// Podcast episodes — sorted newest first, real YouTube URLs & thumbnails
// ---------------------------------------------------------------------------

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "ep-15", episode: 15, tag: "personal",
    titleEn: "AI on Air Ep 15 | The Trust Layer for Autonomous Commerce: When AI Agents Get a Wallet",
    titleZh: "AI on Air 第 15 集 | 自主商务的信任层：当 AI 代理拥有钱包",
    guestEn: "Nalin Mittal", guestZh: "纳林·米塔尔",
    guestOrgZh: "谷歌云，Web3 产品负责人",
    youtubeUrl: "https://www.youtube.com/watch?v=yOcPja2E5SU",
    thumbnailUrl: "https://img.youtube.com/vi/yOcPja2E5SU/maxresdefault.jpg",
  },
  {
    id: "ep-14", episode: 14, tag: "personal",
    titleEn: "AI on Air Ep 14 | The Trust Infrastructure for the Agentic Economy",
    titleZh: "AI on Air 第 14 集 | 代理经济的信任基础设施：声誉、合规与自主金融",
    guestEn: "Navin Gupta", guestZh: "纳文·古普塔",
    guestOrgZh: "Crystal Intelligence，CEO",
    youtubeUrl: "https://www.youtube.com/watch?v=jS9Of4gn6p4",
    thumbnailUrl: "https://img.youtube.com/vi/jS9Of4gn6p4/maxresdefault.jpg",
  },
  {
    id: "ep-13", episode: 13, tag: "personal",
    titleEn: "AI on Air Ep 13 | Agentic Finance: When AI Hallucinations Cost Millions",
    titleZh: "AI on Air 第 13 集 | 代理金融：当 AI 幻觉造成数百万损失",
    guestEn: "Ryan Li", guestZh: "Ryan Li",
    guestOrgZh: "Surf AI，联合创始人兼 CEO",
    youtubeUrl: "https://www.youtube.com/watch?v=ozq2mhy9mE0",
    thumbnailUrl: "https://img.youtube.com/vi/ozq2mhy9mE0/maxresdefault.jpg",
  },
  {
    id: "ep-12", episode: 12, tag: "personal",
    titleEn: "AI on Air Ep 12 | Exploring Agentic Finance and x402",
    titleZh: "AI on Air 第 12 集 | 探索代理金融与 x402 协议",
    guestEn: "Colin Ho", guestZh: "Colin Ho",
    guestOrgZh: "pieverse，联合创始人兼 CEO",
    youtubeUrl: "https://youtu.be/0JzWEb6cQ34",
    thumbnailUrl: "https://img.youtube.com/vi/0JzWEb6cQ34/maxresdefault.jpg",
  },
  {
    id: "ep-11", episode: 11, tag: "personal",
    titleEn: "AI on Air Ep 11 | Powering Agentic Payments at Scale with x402 Protocol",
    titleZh: "AI on Air 第 11 集 | 以 x402 协议大规模驱动代理支付",
    guestEn: "Jonathan King", guestZh: "Jonathan King",
    guestOrgZh: "Coinbase Ventures，投资人",
    youtubeUrl: "https://www.youtube.com/watch?v=ERUp4hVxH-I",
    thumbnailUrl: "https://img.youtube.com/vi/ERUp4hVxH-I/maxresdefault.jpg",
  },
  {
    id: "ep-10", episode: 10, tag: "personal",
    titleEn: "AI on Air Ep 10 | Proofs, Payments and the Agentic Future",
    titleZh: "AI on Air 第 10 集 | 证明、支付与代理未来",
    guestEn: "Michael Dong", guestZh: "Michael Dong",
    guestOrgZh: "Brevis，CEO",
    youtubeUrl: "https://www.youtube.com/watch?v=OPX2QC9R7CY",
    thumbnailUrl: "https://img.youtube.com/vi/OPX2QC9R7CY/maxresdefault.jpg",
  },
  {
    id: "ep-9", episode: 9, tag: "personal",
    titleEn: "AI on Air Ep 9 | Co-building the Future of the Agentic Internet with PayPal",
    titleZh: "AI on Air 第 9 集 | 与 PayPal 共建代理互联网的未来",
    guestEn: "Alan Du & Jonathan Cordeau", guestZh: "Alan Du & Jonathan Cordeau",
    guestOrgZh: "M12 Ventures / PayPal",
    youtubeUrl: "https://www.youtube.com/watch?v=6oGpazMpEhQ",
    thumbnailUrl: "https://img.youtube.com/vi/6oGpazMpEhQ/maxresdefault.jpg",
  },
  {
    id: "ep-8", episode: 8, tag: "personal",
    titleEn: "AI on Air Ep 8 | Build on Kite: Codatta and the Next Era of AI Data",
    titleZh: "AI on Air 第 8 集 | 基于 Kite 构建：Codatta 与 AI 数据新时代",
    guestEn: "Yi Zhang", guestZh: "张毅",
    guestOrgZh: "Codatta，CEO",
    youtubeUrl: "https://www.youtube.com/watch?v=kf4rk-fGSnI",
    thumbnailUrl: "https://img.youtube.com/vi/kf4rk-fGSnI/maxresdefault.jpg",
  },
  {
    id: "ep-7", episode: 7, tag: "personal",
    titleEn: "AI on Air Ep 7 | The Hardware Acceleration Era",
    titleZh: "AI on Air 第 7 集 | 硬件加速时代",
    guestEn: "Jason Li", guestZh: "Jason Li",
    guestOrgZh: "Solayer Labs，联合创始人",
    youtubeUrl: "https://www.youtube.com/watch?v=kUdhjKhPT2s",
    thumbnailUrl: "https://img.youtube.com/vi/kUdhjKhPT2s/maxresdefault.jpg",
  },
  {
    id: "ep-6", episode: 6, tag: "personal",
    titleEn: "AI on Air Ep 6 | Autonomous Agents, Autonomous Payments",
    titleZh: "AI on Air 第 6 集 | 自主代理，自主支付",
    guestEn: "Sean Li", guestZh: "Sean Li",
    guestOrgZh: "Magic Labs，CEO",
    youtubeUrl: "https://www.youtube.com/watch?v=5Z8B17z9F10",
    thumbnailUrl: "https://img.youtube.com/vi/5Z8B17z9F10/maxresdefault.jpg",
  },
  {
    id: "ep-5", episode: 5, tag: "personal",
    titleEn: "AI on Air Ep 5 | Rise of the Agentic Internet",
    titleZh: "AI on Air 第 5 集 | 代理互联网的崛起",
    guestEn: "Miaosen Wang", guestZh: "王淼森",
    guestOrgZh: "DeepMind，研究工程师",
    youtubeUrl: "https://www.youtube.com/watch?v=j70-zAL2Ljc",
    thumbnailUrl: "https://img.youtube.com/vi/j70-zAL2Ljc/maxresdefault.jpg",
  },
  {
    id: "ep-4", episode: 4, tag: "personal",
    titleEn: "AI on Air Ep 4 | Building the Financial Rails for an AI-Powered World with Ava Labs",
    titleZh: "AI on Air 第 4 集 | 与 Ava Labs 共建 AI 时代的金融轨道",
    guestEn: "John Nahas", guestZh: "John Nahas",
    guestOrgZh: "Ava Labs，首席商务官",
    youtubeUrl: "https://www.youtube.com/watch?v=XjcrjV-Ra9k",
    thumbnailUrl: "https://img.youtube.com/vi/XjcrjV-Ra9k/maxresdefault.jpg",
  },
  {
    id: "ep-3", episode: 3, tag: "personal",
    titleEn: "AI on Air Ep 3 | AI, Verification, and the Future of Trust",
    titleZh: "AI on Air 第 3 集 | AI、验证与信任的未来",
    guestEn: "Prof. Gregory Rosu", guestZh: "Gregory Rosu 教授",
    guestOrgZh: "伊利诺伊大学香槟分校（UIUC）",
    youtubeUrl: "https://www.youtube.com/watch?v=SxsICD_RNas",
    thumbnailUrl: "https://img.youtube.com/vi/SxsICD_RNas/maxresdefault.jpg",
  },
  {
    id: "ep-2", episode: 2, tag: "personal",
    titleEn: "AI on Air Ep 2 | From Netflix to Meta: An Insider's View on the AI Revolution",
    titleZh: "AI on Air 第 2 集 | 从 Netflix 到 Meta：AI 革命亲历者视角",
    guestEn: "Zhenzhong Xu", guestZh: "徐振中",
    guestOrgZh: "Meta，工程领导",
    youtubeUrl: "https://www.youtube.com/watch?v=jEUKT39obJk",
    thumbnailUrl: "https://img.youtube.com/vi/jEUKT39obJk/maxresdefault.jpg",
  },
  {
    id: "ep-1", episode: 1, tag: "personal",
    titleEn: "AI on Air Ep 1 | Unlocking AI's True Value: Attribution, Blockchain, and the Future of Innovation",
    titleZh: "AI on Air 第 1 集 | 解锁 AI 的真正价值：归因、区块链与创新未来",
    guestEn: "Prof. Shriram Vishwanath", guestZh: "Shriram Vishwanath 教授",
    guestOrgZh: "德克萨斯大学奥斯汀分校",
    youtubeUrl: "https://www.youtube.com/watch?v=FtGeQJkH38w",
    thumbnailUrl: "https://img.youtube.com/vi/FtGeQJkH38w/maxresdefault.jpg",
  },
];

// ---------------------------------------------------------------------------
// Chi's interviews & personal appearances — sorted newest first
// Focused on HER videos, interviews, and public appearances only
// ---------------------------------------------------------------------------

export const personalUpdates: PersonalUpdate[] = [
  {
    id: "chi-blockhash-742",
    tag: "personal",
    type: "interview",
    date: "2026-06-11",
    titleZh: "Kite CEO Chi Zhang：代理互联网的底层基础 | BlockHash 播客第 742 集",
    bodyZh:
      "Chi 做客 BlockHash 播客，分享 Kite 的创业历程：为什么稳定币是 AI 代理的理想可编程货币、信用卡欺诈检测如何阻碍代理交易，以及 Kite Passport 如何通过身份与治理解决这一问题。",
    youtubeId: "se1HXCqNC7E",
    sourceUrl: "https://www.youtube.com/watch?v=se1HXCqNC7E",
  },
  {
    id: "chi-aicurious",
    tag: "personal",
    type: "interview",
    date: "2026-06-06",
    titleZh: "如何让 AI 代理帮你花钱？Chi Zhang 解密代理支付 | AI-Curious 播客",
    bodyZh:
      "Chi 接受 AI-Curious 播客专访，深入浅出地解释 AI 代理如何在用户授权范围内安全、可信地完成支付，以及 Kite 如何打造这套代理支付基础设施。",
    youtubeId: "OMkE-eO4WX8",
    sourceUrl: "https://www.youtube.com/watch?v=OMkE-eO4WX8",
  },
  {
    id: "chi-interview-ytalk",
    tag: "personal",
    type: "interview",
    date: "2026-05-20",
    titleZh: "【中文专访】代理支付：下一个万亿美元基础设施 | Chi Zhang x Y Talk",
    bodyZh:
      "Chi 接受 Y Talk 专访，深度解析代理支付赛道的万亿美元机遇——为什么 AI 代理需要原生支付能力，Kite 如何成为这一基础设施的核心构建者。",
    youtubeId: "y1kDxjLH2-g",
    sourceUrl: "https://www.youtube.com/watch?v=y1kDxjLH2-g",
  },
  {
    id: "chi-interview-zhiwubuyan",
    tag: "personal",
    type: "interview",
    date: "2026-05-18",
    titleZh: "【中文专访】Kite 如何开启 AI Agent 经济新纪元，打造智能时代的 Stripe？｜《知无不言》播客",
    bodyZh:
      "Chi 做客《知无不言》播客，分享 Kite 的创业故事：如何从 Databricks、Uber 的经历中找到 AI 代理支付这一赛道，以及为什么现在是构建这一基础设施的最佳时机。",
    youtubeId: "kOcotZZUdgY",
    sourceUrl: "https://www.youtube.com/watch?v=kOcotZZUdgY",
  },
  {
    id: "chi-animoca",
    tag: "personal",
    type: "interview",
    date: "2026-05-09",
    titleZh: "Kite AI × Animoca Brands：AI 代理的稳定币支付与身份认证 | Chi Zhang × Alan Lau",
    bodyZh:
      "Chi 与 Animoca Brands 总裁 Alan Lau 深度对话，探讨 Web3 游戏与 AI 代理的融合机会，以及稳定币如何为代理经济提供无摩擦的价值流通。",
    youtubeId: "KIKpZ8qopdY",
    sourceUrl: "https://www.youtube.com/watch?v=KIKpZ8qopdY",
  },
  {
    id: "chi-aionair-15",
    tag: "personal",
    type: "interview",
    date: "2026-04-07",
    titleZh: "AI on Air 第 15 集 | 自主商务的信任层：当 AI 代理拥有钱包",
    bodyZh:
      "Chi 主持 AI on Air 最新一集，与谷歌云 Web3 产品负责人 Nalin Mittal 深入探讨：AI 代理如何在没有人工干预的情况下安全完成交易，以及信任层在自主商务中扮演的关键角色。",
    youtubeId: "yOcPja2E5SU",
    sourceUrl: "https://www.youtube.com/watch?v=yOcPja2E5SU",
  },
  {
    id: "chi-aionair-14",
    tag: "personal",
    type: "interview",
    date: "2026-03-15",
    titleZh: "AI on Air 第 14 集 | 代理经济的信任基础设施",
    bodyZh:
      "Chi 对话 Crystal Intelligence CEO Navin Gupta，探讨声誉系统、合规机制与自主金融在代理经济中的重要性。",
    youtubeId: "jS9Of4gn6p4",
    sourceUrl: "https://www.youtube.com/watch?v=jS9Of4gn6p4",
  },
  {
    id: "chi-aionair-13",
    tag: "personal",
    type: "interview",
    date: "2026-02-20",
    titleZh: "AI on Air 第 13 集 | 代理金融：当 AI 幻觉造成数百万损失",
    bodyZh:
      "Chi 与 Surf AI 联合创始人 Ryan Li 探讨代理金融的风险边界——AI 幻觉如何引发真实的财务损失，以及如何通过结构化验证降低风险。",
    youtubeId: "ozq2mhy9mE0",
    sourceUrl: "https://www.youtube.com/watch?v=ozq2mhy9mE0",
  },
  {
    id: "chi-aionair-9",
    tag: "personal",
    type: "interview",
    date: "2025-12-10",
    titleZh: "AI on Air 第 9 集 | 与 PayPal 共建代理互联网的未来",
    bodyZh:
      "Chi 与 PayPal M12 Ventures 和 PayPal VP 深度对话，分享 Kite 与 PayPal 战略合作的幕后故事，以及支付巨头如何拥抱代理经济新范式。",
    youtubeId: "6oGpazMpEhQ",
    sourceUrl: "https://www.youtube.com/watch?v=6oGpazMpEhQ",
  },
  {
    id: "chi-fireant-kbw",
    tag: "personal",
    type: "interview",
    date: "2025-11-26",
    titleZh: "KBW 2025 深度专访：Kite AI CEO Chi Zhang × FIREANT（韩语）",
    bodyZh:
      "韩国区块链周 2025 期间，Chi 接受韩国知名 KOL FIREANT 专访，全程 17 分钟，深入探讨代理支付赛道的机遇与 Kite 的技术路线图。",
    youtubeId: "7GoCutDVt6Y",
    sourceUrl: "https://www.youtube.com/watch?v=7GoCutDVt6Y",
  },
  {
    id: "chi-wecryptotogether",
    tag: "personal",
    type: "interview",
    date: "2025-11-26",
    titleZh: "Kite AI 如何构建 AI 代理的支付层？Chi Zhang × Wecryptotogether",
    bodyZh:
      "Chi 与韩国最大加密社区 Wecryptotogether 对话，阐述为什么现有支付基础设施无法满足自主 AI 代理的高频交易需求，以及稳定币结算如何改变这一格局。",
    youtubeId: "y9TKGidsjH0",
    sourceUrl: "https://www.youtube.com/watch?v=y9TKGidsjH0",
  },
  {
    id: "chi-thestreet-yt",
    tag: "personal",
    type: "interview",
    date: "2025-11-12",
    titleZh: "独家专访：AI 代理如何在链上支付与谈判？Kite CEO Chi Zhang × TheStreet",
    bodyZh:
      "TheStreet 独家视频专访，Chi 揭示数字经济的下一个时代将由自主 AI 代理驱动，解析代理如何在链上自主完成支付与商业谈判。",
    youtubeId: "YmsxlSwvJBk",
    sourceUrl: "https://www.youtube.com/watch?v=YmsxlSwvJBk",
  },
  {
    id: "chi-blockmedia",
    tag: "personal",
    type: "interview",
    date: "2025-11-08",
    titleZh: "Kite AI CEO 揭秘 PayPal 支持的 Web3 愿景 | BLOCKMEDIA 独家专访",
    bodyZh:
      "BLOCKMEDIA 独家专访，Chi 深度分享 Kite 获得 PayPal Ventures 投资背后的战略逻辑，以及如何将 AI 代理与区块链支付基础设施深度融合。",
    youtubeId: "CokbdUYuIV0",
    sourceUrl: "https://www.youtube.com/watch?v=CokbdUYuIV0",
  },
];

// ---------------------------------------------------------------------------
// Weekly X/Twitter posts — grouped by week starting 2025-06-15
// Note: Live tweets require Twitter API. Content below is based on known
// public announcements from @GoKiteAI.
// ---------------------------------------------------------------------------

export const weeklyUpdates: WeeklyGroup[] = [
  {
    weekOf: "2026-06-09",
    weekLabelZh: "2026 年 6 月 9 日 当周",
    posts: [
      {
        id: "x-2026-0611-1",
        date: "2026-06-11",
        textEn: "Chi Zhang on BlockHash Podcast Ep. 742: Why stablecoins are the ideal programmable money for autonomous agents and how Kite Passport solves identity and governance.",
        textZh: "Chi 做客 BlockHash 播客第 742 集：为什么稳定币是 AI 代理的理想可编程货币，以及 Kite Passport 如何解决身份认证与治理问题。",
        url: "https://www.youtube.com/watch?v=se1HXCqNC7E",
      },
      {
        id: "x-2026-0612-1",
        date: "2026-06-12",
        textEn: "Kite x SMBC Nikko and Hatapro: Demonstrating Agentic Payments for Travel in Japan. AI agents discover, reserve, and pay for local Japanese experiences autonomously within a preset budget.",
        textZh: "Kite 与 SMBC Nikko & Hatapro 合资项目：AI 代理在日本旅行场景中自主发现、预约并完成支付——在用户预设预算内全流程完成。",
        url: "https://medium.com/@KiteAI/kite-and-the-jv-of-smbc-nikko-and-hatapro-proof-of-japan-demonstrate-agentic-payments-for-travel-6cfc4bc4ee13",
      },
    ],
  },
  {
    weekOf: "2026-05-26",
    weekLabelZh: "2026 年 5 月 26 日 当周",
    posts: [
      {
        id: "x-2026-0527-1",
        date: "2026-05-27",
        textEn: "Building Omnichain Apps on Kite: Agent-Native Cross-Chain Execution — our tech team's latest deep dive into the future of agentic infrastructure.",
        textZh: "在 Kite 上构建全链应用：代理原生的跨链执行——技术团队最新深度解析，探索代理基础设施的未来。",
        url: "https://medium.com/@KiteAI/building-omnichain-apps-on-kite-agent-native-cross-chain-execution-2d0b1afb73c6",
      },
    ],
  },
  {
    weekOf: "2026-05-12",
    weekLabelZh: "2026 年 5 月 12 日 当周",
    posts: [
      {
        id: "x-2026-0514-1",
        date: "2026-05-14",
        textEn: "Chi Zhang at Consensus 2026: The Trillion Dollar Question — Framework for Agentic Payments. Kite CEO outlines how agentic payments will reshape the global economy.",
        textZh: "Chi 出席 Consensus 2026：万亿美元之问——代理支付的框架。Kite CEO 阐述代理支付将如何重塑全球经济格局。",
        url: "https://www.youtube.com/watch?v=reU6Byhx5og",
      },
      {
        id: "x-2026-0518-1",
        date: "2026-05-18",
        textEn: "Identity, Delegation & Trust for Agentic Payments — the next economic layer must be built for agents. A deep dive into how Kite enables secure autonomous payments.",
        textZh: "代理支付的身份、委托与信任——下一个经济层必须为代理而建。深入解析 Kite 如何实现安全的自主支付。",
        url: "https://medium.com/@KiteAI/identity-delegation-trust-for-agentic-payments-f66463fd616a",
        likes: 412,
      },
    ],
  },
  {
    weekOf: "2026-04-27",
    weekLabelZh: "2026 年 4 月 27 日 当周",
    posts: [
      {
        id: "x-2026-0430-1",
        date: "2026-04-30",
        textEn: "Kite Chain and Kite Agent Passport are LIVE. The payments and identity layer for autonomous AI agents is officially here. Chain ID 2366. Try it at agentpassport.ai",
        textZh: "Kite Chain 与 Kite Agent Passport 正式上线！自主 AI 代理的支付与身份层正式到来。Chain ID 2366，立即体验：agentpassport.ai",
        url: "https://x.com/GoKiteAI/status/2049522891403006029",
        likes: 1847,
      },
      {
        id: "x-2026-0430-2",
        date: "2026-04-30",
        textEn: "Kite Agent Passport gives every AI agent: verifiable identity, programmable spending limits, native stablecoin payments, and full activity logging. Agents can now act — and be accountable.",
        textZh: "Kite Agent Passport 赋予每个 AI 代理：可验证身份、可编程消费限额、原生稳定币支付，以及完整的行为日志记录。代理现在可以行动——也可以被追责。",
        url: "https://x.com/GoKiteAI/status/2049522891403006029",
        likes: 923,
      },
    ],
  },
  {
    weekOf: "2026-02-16",
    weekLabelZh: "2026 年 2 月 16 日 当周",
    posts: [
      {
        id: "x-2026-0218-1",
        date: "2026-02-18",
        textEn: "Chi Zhang at Consensus Hong Kong 2026: 'The Agentic Economy — The Endgame and How We Get There.' Agents need identity, payments, and governance to operate at scale.",
        textZh: "Chi 出席 Consensus 香港 2026：代理经济的终局与路径。代理需要身份、支付与治理机制才能规模化运营。",
        url: "https://x.com/GoKiteAI",
      },
    ],
  },
  {
    weekOf: "2025-11-24",
    weekLabelZh: "2025 年 11 月 24 日 当周",
    posts: [
      {
        id: "x-2025-1126-1",
        date: "2025-11-26",
        textEn: "Chi Zhang at Korea Blockchain Week 2025: Full interview with FIREANT — discussing the trillion-dollar opportunity in agentic payments and Kite's technical roadmap.",
        textZh: "Chi 出席韩国区块链周 2025，接受 FIREANT 深度专访：探讨代理支付的万亿美元机遇与 Kite 的技术路线图。",
        url: "https://www.youtube.com/watch?v=7GoCutDVt6Y",
      },
      {
        id: "x-2025-1126-2",
        date: "2025-11-26",
        textEn: "KBW panel 'AI Agents and RWAs: From Compute Infrastructure to Capital Markets' — Chi joins top builders to discuss the convergence of AI and on-chain finance.",
        textZh: "KBW 圆桌：AI 代理与 RWA——从算力基础设施到资本市场。Chi 与行业顶级建设者共同探讨 AI 与链上金融的融合前景。",
        url: "https://x.com/GoKiteAI/status/1970843037098991624",
      },
    ],
  },
  {
    weekOf: "2025-11-10",
    weekLabelZh: "2025 年 11 月 10 日 当周",
    posts: [
      {
        id: "x-2025-1112-1",
        date: "2025-11-12",
        textEn: "Pieverse to Enable Cross-Chain Agentic Payment Rails on Kite. Establishing interoperable multi-protocol payment infrastructure for the agentic economy.",
        textZh: "Pieverse 将在 Kite 上启用跨链代理支付轨道，建立可互操作的多协议支付基础设施。",
        url: "https://medium.com/@KiteAI/pieverse-to-enable-cross-chain-agentic-payment-rails-on-kite-52ce827b0632",
      },
    ],
  },
  {
    weekOf: "2025-10-27",
    weekLabelZh: "2025 年 10 月 27 日 当周",
    posts: [
      {
        id: "x-2025-1027-1",
        date: "2025-10-27",
        textEn: "We are thrilled to announce Coinbase Ventures has invested in Kite to advance agentic payments with the x402 Protocol! As one of the first L1s to natively implement x402-compatible payment primitives.",
        textZh: "激动宣布：Coinbase Ventures 投资 Kite，携手推进基于 x402 协议的代理支付标准！Kite 是最早原生实现 x402 兼容支付原语的 L1 之一。",
        url: "https://x.com/GoKiteAI/status/1982799448364535995",
        likes: 1203,
      },
      {
        id: "x-2025-1030-1",
        date: "2025-10-30",
        textEn: "How Agents Plan — And Plan Better. A deep dive into agent planning methodologies and optimization strategies for accuracy and efficiency.",
        textZh: "代理如何规划任务——以及如何规划得更好。深入分析代理规划方法论及精度与效率优化策略。",
        url: "https://medium.com/@KiteAI/how-agents-plan-and-plan-better-90470e563e68",
      },
    ],
  },
  {
    weekOf: "2025-09-01",
    weekLabelZh: "2025 年 9 月 1 日 当周",
    posts: [
      {
        id: "x-2025-0902-1",
        date: "2025-09-02",
        textEn: "BIG NEWS: Kite raises $18M led by PayPal Ventures and General Catalyst to build the identity and payment layer for autonomous AI agents. Covered by Fortune, CoinDesk, Cointelegraph.",
        textZh: "重磅：Kite 完成由 PayPal Ventures 和 General Catalyst 领投的 1800 万美元融资，构建自主 AI 代理的身份与支付层！Fortune、CoinDesk、Cointelegraph 同步报道。",
        url: "https://x.com/GoKiteAI",
        likes: 2847,
      },
    ],
  },
  {
    weekOf: "2025-06-16",
    weekLabelZh: "2025 年 6 月 16 日 当周",
    posts: [
      {
        id: "x-2025-0617-1",
        date: "2025-06-17",
        textEn: "Kite is building payment infrastructure for the agent-native web. Autonomous AI agents deserve their own identity and payment rails — not retrofitted human systems.",
        textZh: "Kite 正在为代理原生互联网构建支付基础设施。自主 AI 代理需要属于自己的身份认证与支付轨道——而非将人类系统强行改造。",
        url: "https://x.com/GoKiteAI",
        likes: 287,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Reference links
// ---------------------------------------------------------------------------

export const refLinks: RefLink[] = [
  { id: "r1", icon: "🌐", titleZh: "Kite 官网", descZh: "公司官方主页与产品介绍", url: "https://gokite.ai" },
  { id: "r2", icon: "🎙️", titleZh: "Kite 播客 (AI on Air)", descZh: "全部 15 集播客节目，探索代理经济前沿", url: "https://gokite.ai/podcast" },
  { id: "r3", icon: "📰", titleZh: "媒体报道", descZh: "Fortune、CoinDesk 等主流媒体对 Kite 的报道汇总", url: "https://gokite.ai/media" },
  { id: "r4", icon: "✍️", titleZh: "Medium 博客", descZh: "Kite 团队深度技术与产品文章", url: "https://medium.com/@KiteAI" },
  { id: "r5", icon: "🐦", titleZh: "X / Twitter", descZh: "@GoKiteAI 官方账号，最新公司动态", url: "https://x.com/GoKiteAI" },
  { id: "r6", icon: "▶️", titleZh: "YouTube 频道", descZh: "Kite AI 官方 YouTube，AI on Air 播客视频版", url: "https://www.youtube.com/@kiteai_official" },
  { id: "r7", icon: "💼", titleZh: "领英主页", descZh: "Chi Zhang 和 Kite AI 的领英页面", url: "https://linkedin.com/company/kite-ai" },
  { id: "r8", icon: "🤖", titleZh: "Agent Passport", descZh: "Kite 代理护照产品主页", url: "https://agentpassport.ai" },
];

// ---------------------------------------------------------------------------
// Cached server fetchers
// ---------------------------------------------------------------------------

export const getCachedPressArticles = unstable_cache(
  async () => pressArticles,
  ["family-press"],
  { revalidate: 604800, tags: ["family-content"] }
);

export const getCachedMediumArticles = unstable_cache(
  async () => mediumArticles,
  ["family-medium"],
  { revalidate: 604800, tags: ["family-content"] }
);

export const getCachedPodcasts = unstable_cache(
  async () => podcastEpisodes,
  ["family-podcasts"],
  { revalidate: 604800, tags: ["family-content"] }
);

export const getCachedPersonalUpdates = unstable_cache(
  async () => personalUpdates,
  ["family-personal"],
  { revalidate: 604800, tags: ["family-content"] }
);

export const getCachedWeeklyUpdates = unstable_cache(
  async () => weeklyUpdates,
  ["family-weekly-v2"],
  { revalidate: 604800, tags: ["family-content"] }
);

export const getCachedChiNewsArticles = unstable_cache(
  async () => chiNewsArticles,
  ["family-chi-news-static"],
  { revalidate: 604800, tags: ["family-content"] }
);

// ---------------------------------------------------------------------------
// Live fetchers — auto-discover new Chi interviews from YouTube RSS
// and written news from Google News RSS
// ---------------------------------------------------------------------------

async function fetchLiveChiYouTubeInterviews(): Promise<PersonalUpdate[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${KITE_YT_CHANNEL_ID}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    const results: PersonalUpdate[] = [];
    for (const m of entries) {
      const entry = m[1];
      const rawTitle = entry.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
      const title = rawTitle
        .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
      const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1]?.slice(0, 10) ?? "";
      // Include videos where Chi Zhang is the featured interviewee (name in title)
      // Exclude AI on Air hosting episodes (covered separately in podcasts)
      if (!title.includes("Chi Zhang") || /^AI on Air/i.test(title) || !videoId) continue;
      results.push({
        id: `yt-live-${videoId}`,
        tag: "personal",
        type: "interview",
        date: published,
        titleZh: title,
        bodyZh: "（自动获取）点击观看完整访谈",
        youtubeId: videoId,
        sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
    return results;
  } catch {
    return [];
  }
}

async function fetchLiveChiGoogleNews(): Promise<PersonalNewsArticle[]> {
  try {
    const res = await fetch(
      `https://news.google.com/rss/search?q=%22Chi+Zhang%22+%22Kite%22&hl=en-US&gl=US&ceid=US:en`,
      { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0 (compatible; FamilyBot/1.0)" } }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    return items.slice(0, 8).map((m, i) => {
      const item = m[1];
      const rawTitle = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
      const title = rawTitle.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1");
      const rawLink = item.match(/<link\s*\/?>([^<]*)<\/link>/)?.[1]
        ?? item.match(/<guid[^>]*>([^<]*)<\/guid>/)?.[1] ?? "#";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
      const source = item.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? "News";
      const date = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "";
      return {
        id: `gnews-${i}-${date}`,
        tag: "personal" as const,
        publisher: source,
        date,
        titleEn: title,
        titleZh: title,
        descZh: "（自动获取）点击阅读原文",
        url: rawLink,
      };
    });
  } catch {
    return [];
  }
}

export const getCachedLiveChiInterviews = unstable_cache(
  fetchLiveChiYouTubeInterviews,
  ["family-chi-yt-live"],
  { revalidate: 604800, tags: ["family-content"] }
);

export const getCachedLiveChiNews = unstable_cache(
  fetchLiveChiGoogleNews,
  ["family-chi-gnews"],
  { revalidate: 604800, tags: ["family-content"] }
);
