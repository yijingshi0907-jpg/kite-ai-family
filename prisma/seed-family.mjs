import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding family content...");

  await prisma.familyWeeklyPost.deleteMany();
  await prisma.familyInterview.deleteMany();
  await prisma.familyNewsArticle.deleteMany();
  await prisma.familyPodcast.deleteMany();
  await prisma.familyRefLink.deleteMany();

  const weeklyGroups = [
    {
      weekOf: "2026-08-03", weekLabel: "2026 年 8 月 3 日 当周",
      posts: [
        { date: "2026-08-09", summaryZh: "AI on Air 精选切片：红杉资本频道节目中，英伟达创始人兼 CEO 黄仁勋将生成式 AI 描述为对计算机的重构——计算正从「取回已有内容」转向「按身份与语境实时生成答案」，互联网未来或从服务十亿人转向服务千亿级智能体。", textZh: "计算正从「取回已有内容」转向「实时生成答案」。\n\n这段 AI on Air 精选切片摘自红杉资本 @sequoia 频道近期的节目。英伟达 @nvidia 创始人兼 CEO 黄仁勋 @JensenHuang 将生成式 AI 描述为对计算机的重构：未来，人们看到、读到、听到的内容，会越来越多地依照各自的身份、语境和提问方式即时生成。\n\n▷ 过去 60 年，计算主要建立在检索之上。未来，每个字、每张图、每条视频都可能因人而异地生成，因此需要更多「生成器」，也就是 NVIDIA 所说用来生产智能的大型计算机。\n\n▷ 当 AI 具备 agentic 能力，智能体能够分工协作。黄仁勋称，NVIDIA 内部已有数十万个受 guardrail 和 sandbox 约束的智能体在运行；他进一步推测，互联网可能从服务约 10 亿人，转向主要由数十亿乃至一千亿智能体全天候使用。\n\n▷ 他把这一变化类比为三次基础设施扩张：300 年前的机器将燃料转化为电力，随后电网包裹地球，几十年前互联网连接世界。下一层可能是持续生成智能的计算层，将电子转化为可重组的 token，进而表达语言、蛋白质、物理和机器人等不同领域。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-09", summaryZh: "AI on Air 精选切片：黄仁勋反驳 AI 威胁论，指出真正会被取代的不是没用 AI 的人，而是不会用 AI 的人；呼吁每个人先确保自己在使用 AI，而非担心 AI 本身。", textZh: "真正会抢走你工作的，可能不是 AI，而是那个会用 AI 的人。在 AI on Air 精选切片中，@nvidia 创始人兼 CEO 黄仁勋 @JensenHuang 用常识反驳了 AI 威胁论，他的论证值得听完。\n\n▷ 「终结者」「奇点」「20% 概率终结人类」这类说法是无稽之谈：AI 就是计算机和软件，开发者必然知道它如何运作，否则不可能一年比一年把它做得更好。\n\n▷ 与其担心你不确定的事，不如专注你确定的事：你未必会被 AI 取代，但一定会输给会用 AI 的人，所以在担心 AI 之前，先确保自己在用 AI。\n\n▷ 技术界有责任把 AI 造得足够安全，幻觉如今已大幅减少，模型在回答前还会查证、验证并自我反思；而每个人的责任，是告诉家人、孩子和自己所在的公司，去拥抱这项「超能力」，因为你不参与，别人会参与。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-08", summaryZh: "AI on Air 精选切片：Google DeepMind 研究副总裁、Gemini 联合负责人 Oriol Vinyals 提出前瞻判断——多智能体脚手架本质是代码，极限情况下模型可自行按任务即时生成最优子代理组合，长远仍需模型权重直接在长上下文任务分布上训练。", textZh: "多智能体脚手架未必是长久工程：它本身可能就是一段终将被模型自己写出来的代码。AI on Air 精选切片本期内容来自 RedpointAI，@GoogleDeepMind 研究副总裁、@GeminiApp 联合负责人 @OriolVinyalsML 在其中谈到了 Agent 系统设计的一个前瞻性判断。\n\n▷ 如今围绕模型搭建的复杂系统，多智能体、子代理委派、长时间运行，本质上是一段代码。极限情况下，模型可以根据任务即时写出最省 token、质量最高的子代理组合，届时可能不再需要固定系统，只留下模型本身。\n\n▷ 推理模型的范式转移已在发生：重点不只是能推理多久，而是根据问题复杂度智能决定推理多长。为对的任务自动生成对的脚手架，很可能就是下一步。\n\n▷ 提升长程 Agent 的可靠性不能只靠脚手架和提示词诱导泛化，还要让模型权重直接在长上下文任务分布上训练，正如 1.5 代在长上下文上的突破，模型终会追赶上这些未来用法。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-07", summaryZh: "AI on Air 精选切片：River AI 联合创始人、前 xAI 联合创始人 Igor Babuschkin 分析闭源模型厂商正被训练收益递减与开源模型持续追赶两股力量同时挤压，出路不能只靠扩大规模，前沿实验室必须提出新的根本性思路。", textZh: "闭源模型厂商，正在被两股力量同时挤压。\n\n这支 AI on AIR 切片来自 Redpoint AI 的访谈。River AI 联合创始人、前 xAI 联合创始人 Igor Babuschkin 解释了为什么「模型越大」不再等于更稳固的护城河：\n\n▷ 模型训练正在遭遇收益递减。每一次能力提升，都需要更多 GPU、更多高质量数据和更高投入。\n▷ 前沿模型可能强到厂商不愿发布，甚至不被允许发布。\n▷ 开源模型仍在持续追赶，让闭源厂商越来越难守住领先优势。\n\n他的结论是：出路不能只靠扩大规模。OpenAI、Anthropic 和其他前沿实验室必须提出新的根本性思路，让模型更有用，进入新领域，并创造真实影响。\n\n能力提升或许正在放缓，但创新压力没有。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-07", summaryZh: "AI on Air 精选切片：Scale AI《Local Optima》节目中，产品负责人 Aman 讲解 AI 从试点走向生产真正要补上的系统工程——从墨菲定律列举风险点、加护栏与人在回路，到围绕非确定性 AI 建立确定性外围系统。", textZh: "AI 不是确定性系统，承载它的生产系统必须是确定的。\n\n本期 AI on AIR 切片选自 @scale_AI 的《Local Optima》。产品负责人 Aman 解释了 AI 从试点走向生产，真正需要补上的系统工程。\n\n▷ 从墨菲定律出发，先列出所有可能出错的环节，确保灾难性输出根本无法发生。\n\n▷ 加上护栏和人在回路。模型变好可以降低异常答案概率，但风险永远不会归零。\n\n▷ 在非确定性 AI 外围建立确定性系统。校验、制衡与谦逊，是政府等高风险场景可靠部署的基础。\n\n可靠的 AI 不只是更好的模型，更是围绕模型建立的整套系统。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-06", summaryZh: "Kite 长文详解 Agent 支付权限设计思路：真正的难点不是让 Agent 具备支付能力，而是针对具体任务授予有边界、可强制执行、对用户可见的权限；Kite Agent Passport 通过身份、spending session 与可撤销授权把这一思路落成产品能力。", textZh: "Kite 对 AI agent 支付权限的思考\n\nagent 不再只是给出答案，而是开始行动\n过去，AI agent 大多只负责提供建议：你提出问题，它给出答案，接下来怎么做仍由你决定。\n如今，这一局面正在改变。agent 已经开始预订服务、购买访问权限，并处理可能产生实际经济后果的任务。它承担的工作越重要，权限就越需要明确界定、严格管控。\n让 agent 具备支付能力，只解决了问题的一部分。真正困难的是，如何针对具体任务授予恰如其分的权限：既有明确边界，又能由系统强制执行，并且始终对用户可见。\nKite 正在为 agent 构建支付基础设施。其中，Kite Agent Passport 提供身份、授权和控制机制，负责管理 agent 可以怎样使用资金。\n\n关键不在能否付款，而在权限是否可控\n大多数支付系统的设计前提是付款时有人在场操作：输入银行卡信息、点击确认按钮，并在交易执行前完成审核。\n一旦改由 agent 独立执行，这套模式就难以成立。如果每次付款都要停下来等待批准，agent 就无法自主完成任务；但如果让它长期持有银行卡、账户或钱包凭证，它得到的权限又会远远超出单个任务所需。\n问题的关键不是再提供一种付款方式，而是补上一套受控的支付权限。\n这类权限需要对应明确的用途和预算，并设置有效期；授权者还应能够随时撤销。agent 应有足够的自主性来完成任务，但不能越过任务的边界。\n更重要的是，这些边界不能只写进给 agent 的指令里。prompt 中写明预算，并不等于系统已经设置支出上限；如果授权范围只能靠 agent 自觉遵守，也不能算作可强制执行的权限。\n只有当系统能在操作发生时验证并强制执行这些规则，护栏才真正成为基础设施的一部分。\n\nKite Agent Passport：把这套思路变成产品能力\nKite Agent Passport 已将这种设计思路转化为 agent 当前即可使用的产品能力。\n通过 Kite Agent Passport，agent 可以拥有独立身份和支付钱包，并按照用户设定的规则使用资金。系统会记录它在这些规则下执行的操作，相关记录可供验证。用户可在 Kite Agent Passport 仪表盘中管理这些设置，还可将 Kite Agent Passport 接入受支持的编程 agent 和集成。\n用户为钱包充值后，agent 只能在获批权限范围内动用其中的资金。\n身份只是起点。系统不仅需要确认谁发起了请求，还需要知道这个 agent 获准做什么、代表谁行事。\nagent 有自己的身份，但权限来自作出委托的用户。身份回答「谁在行动」，委托权限则划定「它能做什么」。\n当 agent 的任务涉及支付时，它会先请求一个 session。用户通过 passkey 批准这个 session，同时设定预算、授权范围和有效时限。session 获批后，agent 可以在这些边界内自主行动，无需每一笔付款都重新请求批准。\n这份权限只属于特定的 session 和任务，不会永久绑定在 agent 身上。请求一旦超出批准的预算或授权范围，或在 session 过期后发起，系统就会拦截，除非用户重新授予权限。系统是否执行规则，不取决于 agent 是否值得信任，也不取决于它是否遵守 prompt。\n系统会记录所有支付和 session 活动，形成清晰的审计记录：用户授予了哪些权限，agent 又在这些权限下做了什么。用户可以随时撤销访问权限。由此，权限在行动前有边界，行动中可强制执行，行动后可查证。\n\n例如，用户要完成一份报告，需要 agent 从付费研究 API 获取数据。agent 找到兼容的服务后，申请一个预算较小、时限较短的 session；获得批准后，它为所需数据付款并完成任务，全程无需用户逐次批准每次调用。\n这正是 Kite Agent Passport 目前支持的工作方式。agent 可以从 Kite Agent Passport 的服务目录或兼容的付费服务集成中发现并选择服务，而不是自行访问任意网站或商户。找到服务后，它可以申请一个授权范围明确的 session，并直接完成付款。\n通过 Kite Agent Passport 完成的每一项付费操作，都会关联到一个已批准的 session。用户可以据此查明：发生了什么、依据哪项权限、出于什么目的。\n用户无需让 agent 无限制地访问银行卡、账户或钱包凭证。只需针对具体任务设定一次边界，agent 便能在边界内独立工作。\n\nKite 的长远愿景\n未来，agent 将更频繁地代表个人和组织采取行动。这些行动会涉及真实资金、外部服务，以及需要兑现的承诺，不能像普通文本输出那样对待。agent 承担的行动后果越重大，就越需要明确授权，并确保它遵守既定边界。\nKite 认为，权限、支出上限、撤销机制和活动记录都应直接内置于 agent 所依赖的基础设施，而不是停留在 prompt 层面的意图上。即使 agent 出错、工具行为异常或工作流程发生变化，这些控制措施也应持续生效。\nKite 的目标，是让明确的权限委托、可强制执行的边界、可撤销的访问权限和可验证的活动记录，成为 agent 处理资金时的标准机制。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-06", summaryZh: "Kite 披露一起针对 KITE 代币的安全攻击：安全监控发现以太坊主网异常转移行为，团队第一时间暂停相关合约转账并冻结涉事代币，未造成任何代币损失，风险已完全控制在以太坊主网范围内。", textZh: "我们检测到一起针对 Kite (KITE) 代币的安全攻击，目前该攻击已被我们第一时间发现并成功拦截，未造成任何代币损失。\n\n为保持透明，向社区同步事件经过：\n\n• 我们的安全监控发现以太坊主网上出现针对 KITE 代币的异常转移行为。\n• 团队立即启动应急响应并暂停了 KITE 代币在以太坊主网上的合约转账（包括跨链桥接）。涉事代币已被全部冻结，无法再转移，也不会流入二级市场。\n• 目前风险已完全控制在以太坊主网范围内，相关代币自拦截后未再发生任何移动。\n\n目前调查仍在进行中。为进一步保障链上及资金安全，我们将采取一系列后续措施，具体方案确定后会第一时间向大家同步。\n\n感谢社区的理解与支持。我们会持续更新进展。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-03", summaryZh: "Kite Weekly（8 月 3 日刊）回顾：资金安全三项更新叠加 28 分钟出块暂停、Marathon 上线 Kimi K3、两条 Vishwa Hubble 播客切片、AI Agents Pulse 双周刊、伯克利 Agentic AI Summit 赞助与 After Hours、Henry Lee 出席 AI-VOLUTION 与马来西亚区块链周圆桌。", textZh: "Kite 上周在资金安全、Agent 身份与采用议题，以及从伯克利到曼谷再到吉隆坡的社区联动上都有进展。以下是上周交付成果：\n\n我们围绕同一个原则发布了三项更新：在 Kite 上，资金不该轻易丢失。Wallet Receive 现在会明确标示每条网络实际接受哪些资产；Kite Agent Passport Skills 内置了与你读到的同一套存款指引；另有一个内部工具已从公网移出，以缩小攻击面。\n\n最后这项变更一度影响了节点之间的连通性，Kite Mainnet 随即停止出块约 28 分钟，而不是继续基于无法完全验证的状态出块。全部区域 RPC 端点的服务已于太平洋时间 11:21 完全恢复。\n\n由 Kite 孵化的 @MarathonBuild 上线了长上下文旗舰 Kimi K3，四个窗口全部可用；同时把注册赠金留给真正在跑任务的开发者，并在 dashboard 中提供一键回收。\n\n我们发布了两条 Hubble 播客切片，均出自与 @Vishwa_lab 的对谈：联合创始人兼 CEO @ChiZhangData 讲身份是 Agentic workflow 的最开端、支付是最末端，真正决定采用的是中间那段；联合创始人兼 CTO @scottshics 拆解了 Agent 交易前必须钉住的四个 ID，用户 ID、模型 ID、Agent harness ID 和运行时 ID。\n\n我们发布了最新一期 AI Agents Pulse，这期双周回顾从破纪录的开源发布讲到不断升级的政策审查，Agentic AI 正迅速走向生产落地。\n\n我们是 @UCBerkeley RDI Agentic AI Summit 的赞助商，全程在现场与 builders 交流；首日议程结束后，我们与 @HaasBlockchain、Haas Fintech Club 及 Agents' Last Exam 共同举办了 Agentic AI Summit After Hours。\n\n我们的区块链产品与基础设施负责人 @Henryleemr 参加了 @SCB10X_OFFICIAL 主办的 AI-VOLUTION The Series 2026，探讨面向 Agent 的可信支付。\n\n在马来西亚区块链周上，@Henryleemr 主持了圆桌「AI 时代，数据如何成为战略资产」，嘉宾包括 @AsianCryptoBoy、@Aileentech 和 @Roy0x1。\n\nAgentic 互联网的信任层，正在一块一块搭建成型。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-07-27", weekLabel: "2026 年 7 月 27 日 当周",
      posts: [
        { date: "2026-08-02", summaryZh: "Kite 区块链产品与基础设施负责人 Henry Lee 参加泰国 SCBX 集团风投部门 SCB 10X 主办的 AI-VOLUTION The Series 2026，探讨支撑 Agent 自主支付所需的可验证身份、授权支付、消费限额与即时结算等金融基础设施。", textZh: "Agent 已经能规划行程、填满购物车、起草订单，但支付这一步，还不能放心交给它。\n\n我们的区块链产品与基础设施负责人 @Henryleemr 参加了 @SCB10X_OFFICIAL 主办的 AI-VOLUTION The Series 2026。@SCB10X_OFFICIAL 是泰国 SCBX 集团（围绕 Siam Commercial Bank 构建的金融科技集团）旗下的风投部门。这期节目剖析了填补这一缺口的技术层：可验证的 Agent 身份、授权支付、消费限额和即时结算。\n\n当一家银行集团开始关注 Agent 如何交易，缺的并不是更聪明的模型，而是支撑它们的金融基础设施。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-02", summaryZh: "Kite 披露 7 月 29 日的一次内部安全加固变更：为缩小攻击面下线一个内部工具时影响了节点连通性，Mainnet 出块暂停约 28 分钟，用户资金与链上数据全程安全，非安全事件。", textZh: "安全加固，以及 28 分钟的暂停\n\n7 月 29 日，我们把一个内部工具从公网移出，以缩小攻击面。这一层级的变更会横跨多个区域与若干依赖，本次变更影响了节点之间的连通性。\n\n当可确认的验证者数量不足时，Kite Mainnet 停止推进，而不是继续基于无法完全验证的状态出块。出块暂停约 28 分钟，从太平洋时间 10:02:56 至 10:30:39。全部区域 RPC 端点的服务于太平洋时间 11:21 完全恢复。\n\nKite Mainnet 结算的是 Agent 在无人监督的情况下发起的支付。在这种场景下，停机是正确的结果。安全机制的表现符合预期。\n\n用户资金全程安全，无链数据丢失，无余额受到影响。这不是一次安全事件。链从停止处恢复运行。\n\n完整的 post-mortem 将随后发布。在下一次基础设施加固变更上线之前，我们正在更新变更流程，并为这一层级的变更增加防护。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-08-01", summaryZh: "8 月 1-2 日 UC Berkeley 举办 Agentic AI Summit 期间，Kite 联合 Haas Blockchain Club、Haas Fintech Club 与 Agents' Last Exam 在 Berkeley 市中心举办 After Hours 交流活动，探讨 Agent 身份、可编程支出控制与 x402 结算。", textZh: "8 月 1 日至 2 日，Agentic AI Summit 将在 @UCBerkeley 汇集数千名开发者、研究者与投资人。第一天议程结束后，Kite 将举办 After Hours。\n\n活动联合 Haas Blockchain Club、Haas Fintech Club 与 Agents' Last Exam 共同举办，地点为 Berkeley 市中心的 Cornerstone，距校园步行可达。\n\n▷ 不设议程，不做演讲。现场提供酒水与餐食，留出充分时间进行深入交流。\n\n▷ 到场者均刚结束当天峰会日程，无需从背景介绍开始，可直接进入具体问题的讨论。\n\n▷ Kite 团队全程在场，可就 Agent 身份、可编程支出控制与 x402 结算等议题交流。\n\n8 月 1 日（周六）7:00 - 10:00 PM PDT\nCornerstone，Berkeley 市中心\n\n报名已开启，期待与你交流。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-31", summaryZh: "最新一期 AI Agents Pulse 梳理近两周 Agentic AI 行业动态：Anthropic 传或于 10 月启动 IPO、Moonshot AI 发布 2.8 万亿参数的 Kimi K3、多家 AI 实验室员工联署呼吁政府关注自动化 AI 研究节奏等。", textZh: "从破纪录的开源发布，到不断升级的政策审查，过去两周证明 Agentic AI 正迅速走向生产落地。\n以下是最新一期 AI Agents Pulse，为你梳理这两周该领域发生的一切：\n\n据报道，Anthropic 最早可能于 10 月启动首次公开募股（IPO），银行家们已开始安排高管与潜在投资者会面。\n\n总部位于北京的 Moonshot AI 发布了 Kimi K3，参数量达 2.8 万亿，号称全球最大的开源 AI 模型，可与 OpenAI 和 Anthropic 的顶尖闭源系统一较高下。\n\n来自 OpenAI、Anthropic、Google 和 Meta 等主要 AI 实验室的员工签署声明，敦促美国政府支持国际社会把握自动化 AI 研究的发展节奏。\n\n据报道，Nvidia 正讨论为 OpenAI 在俄亥俄州一座 10 吉瓦数据中心园区提供 2500 亿美元兜底资金，引发对 AI 行业循环融资的担忧。\n\n投资者因担忧 AI 建设成本高企而转向基础设施与内存芯片，Apple 超越 Nvidia，成为全球市值最高的公司。\n\n据报道，OpenAI 曾将 GPT-5 标记为高风险，认为该模型可能帮助用户制造生物危害物，但该公司随后下调了这一风险评级。\n\n美国财政部长 Scott Bessent 表示，如果发现中国 AI 模型是从美国专有技术中「蒸馏」而来，美国政府可能会实施制裁。\n\n由前 OpenAI 员工创立的 Thinking Machines Lab 发布了开放权重模型 Inkling，参数量达 9750 亿，具备高级推理和多模态输入处理能力。\n\nGoogle DeepMind 发布了具身推理模型 Gemini Robotics ER 2，可让机器人理解物理世界、规划多步任务，并把动作执行交给底层的视觉-语言-动作模型。\n\n行业领袖共同组建了 Open Secure AI Alliance，将在 Linux 基金会 Akrites 计划与 OpenSSF 社区工作的基础上，运用开放技术修复并披露漏洞。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-30", summaryZh: "在 Vishwa Hubble 播客 EP4 中，Vishwa 联合创始人追问「知道 Agent 是谁之后，身份就够了吗」，Kite 联合创始人兼 CEO Chi Zhang 回答：远远不够——真正决定采用与否的是身份与支付之间那段容易被忽视的中间地带。", textZh: "身份是 agentic 工作流的起点，支付是终点。如果中间这段跑不顺，两端都谈不上真正落地。\n\n在 @Vishwa_lab 的 Hubble 播客上，Vishwa 联合创始人 @nathan_sj_stem 抛出一个直接的问题：既然已经知道一个 Agent 是谁，身份本身就够了吗？Kite 联合创始人兼 CEO @ChiZhangData 的回答是：远远不够。本条切片要点：\n\n▷ 过去六个月有过几次清醒时刻。我们对方向的初始判断是对的，但只靠方向解决不了客户的问题。这一点在身份上成立，在支付上同样成立。\n\n▷ 消费场景里，真正的难点全在细节。一旦开始帮客户做购物或订票，你会发现他们甚至走不到支付这一步——他们连想要的商品都找不到。\n\n▷ 开发者场景是当下的切入点。像 Claude Code 这样的编码 Agent 已经很好地解决了开发问题，但谁来主导部署、谁来管理凭证、谁来处理按 API 调用付费，这些角色仍然空缺。\n\n▷ 这个缺口同样适用于 Kite 自己。要让开发者真正采用 Kite Passport，我们必须先填上这段中间地带。\n\n决定采用与否的不是两端，而是中间。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-29", summaryZh: "Kite 联合创始人兼 CTO Scott Shi 在 Vishwa Hubble 播客 EP4 中拆解 Agent 交易前必须钉住的四层身份——user ID、model ID、agent harness ID、runtime ID，并指出商家一侧同样需要被验证（KYB），而非只验证 Agent（KYA）。", textZh: "一个 Agent 的身份，不是一个账号。\n\n在 @Vishwa_lab 的 Hubble 播客上，Kite 联合创始人兼 CTO @scottshics 与 Vishwa 联合创始人 @nathan_sj_stem 一起，拆解了 Agent 发起交易之前，有哪些东西必须被钉住。本条切片要点：\n\n▷ 四层 ID，不是一个。user ID（这个 Agent 背后是谁、过往行为如何）、model ID、agent harness ID、runtime ID。四层全部钉在一起，才谈得上判定 Agent 的行为。\n\n▷ 为什么模型版本要钉住。一年前有模型建议用户把交易打给 Solana 上的一个垃圾账户，原因是训练数据被污染。没有 model ID，你查不出是哪个版本干的。\n\n▷ 为什么 harness 要钉住。Claude Code 和 Codex 的行为差别很大，实现哲学不同，逻辑也不同。把这一层组合进去，它们就是不同的 Agent。\n\n▷ 商家一侧同样要被验证。你把信用卡或 PII 交给 Agent，恶意商家几秒钟就能把它套出来。Scott 的说法是：Agent 就像一个四岁的小孩。所以这不只是 KYA，还是 KYB。\n\n先把身份钉住，后面的行为与支付才有依据。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-29", summaryZh: "Kite 孵化的推理基础设施 Marathon 上线 Kimi K3 长上下文旗舰模型，四档延迟窗口全部可用，让 Agent 可以为自己的耐心标价，把延迟容忍变成 Agent 自主决定的参数。", textZh: "Agent 做的事情，大部分并不紧急。它规划、重试、连读几个小时的资料、收拾自己留下的首尾。这些工作几乎都不需要下一秒就给出答案。\n\n由 Kite 孵化的 @MarathonBuild，让 Agent 可以为自己的耐心标一个价。Kimi K3 现已上线，长上下文旗舰，四个窗口全部可用。\n\n延迟容忍，正在变成 Agent 自己决定的一个参数。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-29", summaryZh: "Kite 生态产品负责人 Henry Lee 在 Malaysia Blockchain Week 主持「数据如何成为 AI 时代战略资产」panel，与 Atlas Oracle、SuperNet、EMERGE Group 嘉宾探讨数据资产的权属与授权边界如何转化为真正的业务价值。", textZh: "数据不会因为你手里量大，就自动成为战略资产。\n\n在 Malaysia Blockchain Week，Kite 生态产品负责人 @Henryleemr 主持了 panel「How Data Becomes a Strategic Asset in the AI Era」，同台的是 @AsianCryptoBoy（Atlas Oracle）、@Aileentech（SuperNet）、@Roy0x1（EMERGE Group）：一家机构的数据到底值多少、是否真的属于自己，以及这些数据要变成业务价值，前面必须先有什么。\n\n如果竞争对手明天就能拿同一批信息去训练，真正构成资产的从来不是数据本身，而是你能说清谁被允许使用它、边界在哪里。\n\n这份「说得清」，正是 Agent 替你行动之前需要的东西。感谢 @MalaysiaBCW 的邀请。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-28", summaryZh: "Kite Weekly（7 月 28 日刊）回顾：孵化推理基础设施 Marathon 并上线 Kimi K3；开源 14 个 Agent Passport Skills；在 Sherlock 上线漏洞赏金；Agent Trading Campaign S2 开赛；成为 RoboPay launch partner；CEO Chi Zhang 回顾 Kite 首个 Uber Eats demo 卡在登录页的故事；回顾首尔 Proof of AI 活动。", textZh: "Kite 孵化了一款新产品，将其代码开源供外部审查，加固了 Agent 的支付与身份层，并把 Agent 经济向物理世界推进了一步。以下是上周的交付重点：\n\n我们发布了由 Kite 孵化的 @MarathonBuild：一套自适应推理基础设施，长时运行的 Agent 可按需选择完成窗口，最深档位可节省约 65% 成本，注册赠金最高可兑 4560 万 tokens。\n\n我们开源了 Kite Agent Passport Skills：14 个 MIT 协议下的 skill，教会 Agent 完成身份认证、申请 spending session、发起 x402 付费请求，可直接用于 Claude Code、Cursor 等 40 多种环境。\n\n我们在 @sherlockdefi 上线了漏洞赏金计划，覆盖 Kite Mainnet 首批部署的智能合约与 Kite Agent Passport 平台。\n\nAgent Trading Campaign S2 已开赛，由 Kite 与 @CreaoAI、@Debot_Official 联合主办：以 0.1 ETH 在 Robinhood Chain 起步，将 Debot 监控 webhook 接入你克隆的 CREAO Agent，角逐 $10,000 奖池，50 个获奖名额，参与上限 1,000 人。\n\nKite Passport 现已为 Robinhood Chain 提供端到端支持，可持有与发送 USDG，转账由 Gas 费覆盖，并按需自动将 USDC 路由为 USDG；同时新增多报价 402 协商（类似 Anthropic 的方案），付费获取的音频、图片与视频可直接落盘。\n\n我们成为 @FabricFND 旗下 RoboPay 的 launch partner。Kite Agent Passport 为 Agent 提供可验证身份与有边界的支出权限，RoboPay 则在机器人行动前完成支付验证。\n\n在 @gracegongGG 的 Venture with Grace 播客中，我们的联合创始人兼 CEO @ChiZhangData 回顾了 Kite 最初的 demo：让 ChatGPT 在 Uber Eats 下单，结果卡在登录页的验证码上，以及为什么可验证身份层才是长期解法。\n\n我们回顾了首尔 Proof of AI: Korea Special Edition：Cindy Shi 以 keynote 开场，讲清 Kite Passport 在 Agent 支付中的定位；随后的 panel 邀请 @soohoio、@avax、@hashed_official、@FabricFND、@tiger_research_ 深入探讨授权设计与韩国市场的首发场景。\n\nAgentic 互联网的信任层，正在一块一块搭建成型。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-27", summaryZh: "Kite Agent Passport Skills 正式开源：14 个 MIT 协议的 skill，教 AI Agent 完成用户认证、申请 spending session、通过 x402 发起付费请求，可用于 Claude Code、Cursor 等 40 多种环境。", textZh: "如果一个 Agent 可以花你的钱，你就应该能读到它所遵循的指令。\n\nKite Agent Passport Skills 现已开源：14 个采用 MIT 协议的 skill，教会 AI Agent 如何完成用户认证、申请 spending session，以及通过 x402 发起付费 API 请求。源码位于 gokite-ai/passport-skills 仓库，并通过 skills.sh 发布。\n\n每个 skill 都是一个 SKILL.md，在安装时注入 Agent 的上下文。Agent 读取后，即掌握该流程所需的确切 CLI 命令、参数格式、JSON 输出结构与错误处理。这些指令现在可以逐行查阅、fork，并提交 pull request。\n\n开源让这些指令变得可审查；而支出上限依然由你用 passkey 批准的 delegation 决定：单笔上限、总预算、有效期与可用资产。\n\n这些 skill 可以在你现有的工作环境中使用：Claude Code、Cursor、Cline，以及 40 多种其他 Agent。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-07-20", weekLabel: "2026 年 7 月 20 日 当周",
      posts: [
        { date: "2026-07-20", summaryZh: "Kite Weekly（7 月 20 日刊）回顾本周进展：在 GTLC 2026 推出面向开发者的新产品 Kite Control Plane；CEO Chi Zhang 做客 Venture with Grace 播客；参加旧金山 AGI Summit 与首尔 Proof of AI；CTO Scott Shi 在 AI³ Growth Hackathon 上分享下一款开发者产品的构想；欢迎 Team1 Vietnam 加入生态；KITE 现货交易大赛已在 Binance 上线。", textZh: "Kite 正在搭建的这层基础设施，让自主 Agent 从对话走向商业。本周我们交付了新的开发者产品，在更多全球活动现场亮相，社区也在持续扩大。以下是本周交付成果：\n\n我们在 GTLC 2026 湾区华人科技领袖峰会上推出了 Kite Control Plane，这是一款面向开发者的新产品，用来解决自主 Agent 的行动瓶颈。\n\n在 @gracegongGG 的 Venture with Grace 播客中，我们的联合创始人兼 CEO @ChiZhangData 拆解了 Agent-to-Agent 商业的三个阶段，以及走到最后一阶段还缺哪些基础设施。\n\n我们参加了旧金山的 @agisummitai，开发者与我们一起探讨自主 AI 走进专业场景所需的信任与规模化条件。\n\n我们在首尔举办了 Proof of AI: Korea Special Edition，让 builders、钱包团队与安全专家聚在一起，共同定义 Agentic 经济所需的身份层与结算层。\n\n在 @OpenBuildxyz 和 @hack_weekly 主办的 AI³ Growth Hackathon 上，我们的联合创始人兼 CTO @scottshics 讲清了下一款开发者产品为什么必须存在：GenAI 让智能变得极其便宜，每月账单却没有跟着降下来。\n\n我们欢迎 @Team1VN 作为 Cohort 1 成员加入 Kite 生态，进一步壮大这个链上、Agent 优先、由社区驱动的全球 builders 网络。\n\nKITE 现货交易大赛已在 @binance 上线，最高 500 万 KITE 代币券等你来赢。KITE 驱动的这条 L1，让 Agent 获得可验证的身份与可编程的支出控制。\n\nAgentic 互联网的信任层，正在一块一块搭建成型。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-20", summaryZh: "Kite 联合创始人兼 CEO Chi Zhang 做客 Venture with Grace 播客，拆解 agent-to-agent 商业的三个发展阶段——从 agent 对网站，到同一主体下多 agent 协作，再到跨实体的真正 A2A 交易——并指出可验证身份与原生支付正是解锁第三阶段的关键。", textZh: "从 agent 到真正的 agent-to-agent 商业，中间有三个阶段。今天我们大概停在第二阶段。\n\n在 @gracegongGG 的 Venture with Grace 上，Kite 联合创始人兼 CEO @ChiZhangData 拆解了 agentic payments 真实走到了哪一步，以及最后一阶段解锁前还缺什么。本条切片要点：\n\n▷ 第一阶段：agent 对网站。你的 ChatGPT 去 Amazon 搜商品，另一端没有 agent，只有一份商品目录。\n\n▷ 第二阶段：同一主体下的多 agent。一人公司配 10 个 agent 分别做 CTO、CEO、运营，它们同处一个可信环境，无需互相证明身份，也无需彼此结算支付。\n\n▷ 第三阶段：真正的 A2A。我的 agent 与你的 agent 跨实体对话，交易达成、支付完成，而双方背后的人可能素未谋面。\n\nChi 眼中的终局：agent 真正作为经济行为体参与其中，就像人类一样，我们每个人都是这个大经济社会里的参与者。\n\n走到第三阶段，正是 Kite 在建的东西：可验证身份、可委托权限、原生支付，让任何一个 agent 都能成为完整的经济行为体。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-21", summaryZh: "Kite 在 Sherlock 上线漏洞赏金计划，将 Mainnet 首批部署的智能合约与 Agent Passport 平台纳入范围，邀请安全研究者检验这条服务自主 Agent 支付层的安全底线。", textZh: "安全不是上线前打的一个勾。对一条给 Agent 用的支付层来说，它是底下所有东西的地基。\n\nAgent 交易时，没有人在旁边盯着。所以这一层必须按我们能做到的最高标准来做，并且交给以攻破系统为职业的人来检验。\n\nKite 的漏洞赏金计划已在 @sherlockdefi 上线。Kite Mainnet 上首批部署的智能合约，以及 Kite Agent Passport 平台，都在范围内。\n\n欢迎来找我们漏掉的东西。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-21", summaryZh: "Kite 成为 Fabric Foundation 旗下 RoboPay 的 launch partner，让机器人在行动前完成支付验证，与 Agent Passport 的可验证身份和用户授权支出权限相结合，把 Agent 支付从数字世界延伸到物理世界。", textZh: "软件里的支付还能退款。机器人一旦动了，没有撤销这回事。物理世界的自主行动，需要另一种支付保障。\n\n我们成为 @FabricFND 旗下 RoboPay 的 launch partner。RoboPay 负责在机器人行动前验证支付，Agent Passport 负责另一半：给 Agent 一个可验证身份，以及一份由主人授权并划定边界的支出权限。\n\n两半拼起来，能做到这些：\n\n▷ 人只批准一次。用 passkey 签下额度和有效期，Agent 在这两条边界内自主行动。不交出卡号，也不交出钱包密钥。\n\n▷ 买东西和送东西，是两笔支付。货款付给商家，另有一笔 x402 支付付给机器人，作为取货服务费。\n\n▷ 四个步骤全部发生在机器人动身之前。请求、验证、封存、派单，支付没通过，机器人就不动。\n\nAgent 支付从这里开始不再只发生在数字世界。额度由 Kite 划定，支付由 RoboPay 验证，交付发生在真实世界。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-21", summaryZh: "Kite 孵化的推理基础设施 Marathon 正式发布，面向长时运行 Agent 提供自适应推理服务：可按请求选择完成窗口（now/soon/later/anytime），最省档位可节省约 65% 成本，同一 API 支持多款主流开源模型。", textZh: "我们正式发布 @MarathonBuild，由 @GoKiteAI 孵化：面向长时运行 Agent 的自适应推理基础设施。\n\n智能越来越便宜，账单却没有跟着降下来。Agent 就活在这道落差里：它们跑长任务、反复推演、逐步规划，而这些工作的大部分，并不需要下一秒就给出答案。\n\n▷ 按请求选择完成窗口：now、soon、later、anytime。任务能等得越久，调度器腾挪的空间就越大，最深档位可节省约 65% 成本。\n\n▷ 同一模型，同一 API。上线即支持五款主流开源权重模型，Claude Code 与 Codex 一条命令即可接入。\n\n▷ 统一定价规则覆盖所有模型，无需逐一议价。\n\nKite 先前给了 Agent 可验证身份与自主支付的权利。Marathon 把这一步延伸到算力本身：一个能自主发起调用、自主完成结算的 Agent，同样需要把这次调用的成本变成可编程的。\n\n闭环由此完成：Agent 自主调用，自主支付。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-22", summaryZh: "Kite CMO Cindy Shi 在首尔 Proof of AI: Korea Special Edition 以 keynote 开场，分享 Kite Passport 在 Agent 支付栈中的定位；随后的圆桌邀请 SOOHO IO、Avalanche Team1、Hashed、Fabric Foundation、Tiger Research 探讨韩国 Agent 经济的授权设计与首发场景。", textZh: "Agent 要参与经济，先要回答信任问题：谁授权了它，额度是多少？\n\n周一晚在首尔，这个问题聚起了一屋子人。感谢每一位来到 Proof of AI: Korea Special Edition 现场的朋友，也感谢与我们共同促成这场活动的伙伴 @soohoio、@avax、@hashed_official、@FabricFND、@tiger_research_。\n\nKite 的 Cindy Shi 以 keynote 开场，分享了 Kite Passport 与 Agent 支付的最新进展：Kite Passport 在支付栈中的定位、为什么身份、权限与信任要先于规模，以及 Agent 今天已经能跑起来的现场 demo。\n\n随后的 panel 聚焦韩国的 Agent 经济，由 @yumi_mika_（SOOHO IO）主持，@eugene_avax（Avalanche Team1）、@junkim（Hashed）、@degenapeo（Fabric Foundation）、@ekko_924（Tiger Research）同台讨论：\n\n▷ Agent 从工具进化为经济参与者，需要怎样的基础设施\n▷ 授权应该怎么设计：预算上限、权限控制与安全验证\n▷ 哪些 Agent 用例最可能率先在韩国市场落地\n\n首尔对 Agent 经济是认真的。感谢，下次见。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-24", summaryZh: "Kite 与 Fabric Foundation 联合发布 RoboPay 实机演示视频：Agent Passport 签发可验证身份与支出权限，RoboPay 在请求背后核验支付后驱动机器人执行配送，全流程留痕，机器人行动前核验先行。", textZh: "机器经济的起点，不是机器人变得更聪明，而是一台机器可以因执行任务获得报酬，并且所有相关方都能证明这一过程。\n\n与 @FabricFND 联合出品。两套系统在此交汇：Agent Passport 为 Agent 签发可验证的身份，以及一份由所有者定义边界的支出权限；RoboPay 则在请求背后的支付通过核验后，驱动机器人执行。\n\n机器人行动之前，发生了这些事：\n\n▷ 权限一次授予，且带有边界。人类用 passkey 签署一个 spending session：总预算、单笔上限、允许的资产、有效期。Agent 不持有卡号，也不持有钱包密钥，它持有的是一份无法越界的委托。\n\n▷ 两笔支付，因为这是两种不同的义务。一笔与商户结算商品货款；另一笔独立的 x402 支付，向机器人支付搬运这项劳动的报酬。购买物品与雇用机器搬运并非同一笔交易，回执上分开记录。\n\n▷ 核验先于行动。请求携带 x402 payment header 抵达，facilitator 核对网络、价格、收款钱包与签名负载。核验通过后，交易明细才会封存进机器人的行动事件，指令随之下发。在此之前，机器人保持静止。\n\n▷ 每一步都留下回执。身份、额度、批准、两笔支付、核验、派发。当需要追溯一台机器为何采取某个行动时，答案是一份记录，而非一次猜测。（本次运行在演示环境中完成。）\n\nAgent 为软件付费已非新鲜事。为实体劳动付费则困难得多，因为一次配送无法撤回。保障必须前置，而非事后补救。授权先于支付，支付先于行动，正是这一顺序，使自主系统得以安全地在现实世界中支出。这也是机器经济必须率先夯实的一层。\n\n额度由 Kite 划定，支付由 RoboPay 核验，交付发生在现实世界。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-24", summaryZh: "Marathon 推出新用户注册赠金活动：免费赠金最多可兑 4560 万 tokens，选择 ANYTIME 延迟档位可换得最多 tokens。", textZh: "新用户注册 Marathon，免费赠金最多可兑 45,600,000 tokens\n\n同一笔赠金，窗口选得越松，换到的 tokens 越多：选 ANYTIME 档，按闲置容量调度，将节省最高比例 tokens\n\n注册即领：marathon.build\n\n注：按 Qwen3.6-35B-A3B、ANYTIME 档、上线费率与 3:1 输入输出比估算，实际数量随实时价格与用量结构浮动。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-25", summaryZh: "Kite 联合创始人兼 CEO Chi Zhang 在 Venture with Grace 播客中回顾公司最初的 demo：让 ChatGPT 在 Uber Eats 下单，却卡在登录页的验证码上，由此揭示可验证身份才是 Agent 走向自主支付的长期解法。", textZh: "Kite 最初的 demo，是让 ChatGPT 帮你在 Uber Eats 下单。结果它连下单界面都没进去，卡在了登录页——Uber 的验证码是给人设计的，Agent 过不去。\n\n在 @gracegongGG 的 Venture with Grace 播客中，Kite 联合创始人兼 CEO @ChiZhangData 讲述了这一刻如何塑造了 Kite 的设计方向。本条切片要点：\n\n▷ Demo 死在登录环节，而非下单或支付环节；卡点是「这个 Agent 到底有没有资格出现在这里」。当然你可以做一个浏览器插件替它点掉验证码，但那只是 Agent 与互联网协作方式的过渡形态。\n\n▷ 长期解法是身份。每个 Agent 都必须能证明自己是谁、来自哪里，并携带：它背后的人类或组织主体是谁、此行目的是什么，以及本次会话或请求被授予的确切权限范围。一个无缘无故出现的 Agent，要么在产生幻觉，要么在攻击你。\n\n▷ 方向已经清晰：一个 API 优先的 agentic 互联网，headless Agent 无需人类登录凭证即可完成身份验证。x402 与 MCP 都在朝这个方向演进。\n\nKite Agent Passport 正是这层身份基础设施：可验证身份、可委托权限，以及按会话限定的授权范围。从现在起，不必再「证明你是人类」。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-26", summaryZh: "Agent Trading Campaign S2 开赛，由 Kite 与 CreaoAI、Debot 联合主办：以 0.1 ETH 在 Robinhood Chain 起步，接入 Debot 监控 webhook 驱动 Agent 自主交易，角逐 $10,000 奖池。", textZh: "一个替你交易的 Agent，需要的不只是一套好策略。它需要自己的身份、自己的钱包，以及在无人盯着时依然生效的支出边界。\n\nAgent Trading Campaign S2 已开赛，由 Kite、@CreaoAI 与 @Debot_Official 联合主办。以恰好 0.1 ETH 在 Robinhood Chain 起步，把 Debot 监控 webhook 接到你克隆的 CREAO Agent 上，事件触发时，Agent 读取信号并操作你的 Debot 钱包交易。\n\n$10,000 奖池，50 位获奖者，头奖 $2,000。参与人数上限 1,000。\n\n活动中可用 Kite Agent Passport Skills 完成 Kite 侧任务：给你的 Agent 一个属于自己的钱包并让它真实发起链上交易，即可获得排行榜加分与免费 CREAO credits。\n\n报名已开启，截至 7 月 29 日 02:00（UTC+0）\n实盘 7 月 29 日至 8 月 3 日，结果 8 月 5 日公布。\n\n一群 Agent 正在用真金白银交易，这正是追问那个更难问题的时机：当你的 Agent 开始交易，它是谁，又被允许将资金支配到哪里？", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-07-13", weekLabel: "2026 年 7 月 13 日 当周",
      posts: [
        { date: "2026-07-15", summaryZh: "Kite 联合创始人兼 CEO Chi Zhang 将出席 TGO 硅谷主办的 GTLC 2026 湾区华人科技领袖峰会 Tech Track，与 Yuandong Tian、Yangqing Jia 等多位 AI 领域创始人及学者同台，探讨自主系统时代的信任基础设施。", textZh: "「自主系统时代」不是预测，而是正在发生：能行动、能交易、能替你办事的 Agent。而这一切的前提，是 Kite 正在构建的信任层。\n\n我们很高兴地宣布：Kite 联合创始人兼 CEO @ChiZhangData 将出席 TGO 硅谷主办的 GTLC 2026 Bay Area Chinese Tech Leaders Summit，在 Tech Track 登台。与她同台的明星创始人与研究者：\n\n▷ Yuandong Tian（@tydsh），Recursive Superintelligence 创始人（估值 $4.65B 的自我进化 AI 实验室）；曾任 Meta FAIR 研究总监，更早在 Google X 无人车团队（即后来的 Waymo）做自动驾驶视觉感知。\n▷ Yangqing Jia（@jiayq），Caffe 之父，Lepton AI 联合创始人兼 CEO（已被 NVIDIA 收购）；曾任 NVIDIA VP、阿里巴巴集团副总裁、Facebook AI 工程总监。\n▷ Junchen Jiang（@JunchenJiang），Tensormesh 联合创始人兼 CEO、UChicago 教授，开源项目 LMCache 共同作者。\n▷ Bo Li，Virtue AI 联合创始人兼 CEO、UIUC 教授；AI 安全与可信机器学习领域顶尖学者（IJCAI Computers and Thought 奖、斯隆研究奖）。\n▷ Ryan Hanrui Wang，Nebius Applied AI SVP；前 Eigen AI 联合创始人兼 CEO（被 Nebius 以 $643M 收购），出自 MIT HAN Lab。\n▷ Ding Zhao，CMU 教授、CMU Safe AI Lab 主任，专注可信与安全 AI。\n▷ Weiyan Shi（@shi_weiyan），Northeastern 教授、AI2050 Early Career Fellow；打造了 Meta CICERO 背后的谈判对话 Agent。\n\n2026 年 7 月 17 日 · Tech Track 14:00\nQ Bay Center，圣何塞（硅谷）\n\n在湾区的朋友，欢迎现场来找我们。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-16", summaryZh: "Kite 联合创始人兼 CTO Scott Shi 在 OpenBuild 与 Hack Weekly 主办的 AI³ Growth Hackathon 上分享：GenAI 让智能变得极其便宜，但开发者账单不降反涨，凸显了按用户/按 Agent 精细化成本管控这一下一代开发者产品的必要性。", textZh: "GenAI 把 intelligence 变成了极便宜的商品。但你每月的账单没变便宜。\n\n在 @OpenBuildxyz 和 @hack_weekly 主办的 AI³ Growth Hackathon 上，Kite 联合创始人兼 CTO @scottshics 讲清了下一款 developer 产品为什么必须存在。\n\n本期切片看点：\n\n▷ GenAI 是 70 年来计算机第一次不再只是「大号计算器」。几分钱的 token，就能写出一份好过麦肯锡的投研报告。\n\n▷ 最顶尖的 AI lab 和 developer，月账单一夜之间从 20 美元涨到 2 到 3 万美元。所有认真做产品的 developer，都变成了 token maximum。\n\n▷ 想用 AI serve 用户又不亏钱，就必须有成本管控：逐用户支出透明，按 agent / user / IP 拆分，以及在单个用户烧掉你利润前设置的硬性上限。\n\n这就是我们下一款 developer 产品存在的意义，敬请期待。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-19", summaryZh: "Kite 在首尔举办 Proof of AI: Korea Special Edition 线下聚会，联合 Sooho、Avalanche、Hashed、Fabric Foundation、Tiger Research 等合作伙伴，邀请 builder、钱包与支付团队、安全专家共同探讨 Agent 经济下一阶段所需的身份与结算基础设施。", textZh: "Agent 正在走出聊天框和生产力工具。下一个问题是：在它们能行动、交易、真正参与经济之前，还需要哪些基础设施？\n\n明晚在首尔，Kite 将举办 Proof of AI: Korea Special Edition。这是一场小而精的线下聚会：builder、生态负责人、钱包与支付团队、安全专家齐聚一室，围绕 Agent 经济的下一阶段展开深度对话。\n\n合作伙伴：@soohoio、@avax、@hashed_official、@FabricFND、@tiger_research_\n\n2026 年 7 月 20 日（周一）\n19:00 - 21:30（GMT+9）\nSooho Lounge，首尔江南区 Teheran-ro 126 B1", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-07-06", weekLabel: "2026 年 7 月 6 日 当周",
      posts: [
        { date: "2026-07-08", summaryZh: "Kite 加入 Avalanche Payments Collective，作为贡献合作伙伴与 Paxos、Anchorage 等创始成员并肩，为覆盖 150+ 国家和 96 种货币的支付轨道带来 Agent 层可验证身份与可编程消费限额。", textZh: "全球资金流动的轨道正在整合。即将在这些轨道上运行的 Agent 仍须回答一个问题：谁授权了这笔交易，限额是多少？我们很自豪以贡献合作伙伴身份加入 Avalanche Payments Collective，与创始成员 @FTDA_US、@vaneck_us、@WisdomTreeFunds、@Paxos、@Anchorage 和 @krakenfx 并肩，成为覆盖 150+ 国家和 96 种货币的行业最广泛支付生态之一。Collective 建设的内容：跨境结算、stablecoin、资金库、外汇和全球支付的连接轨道，让资金在金融体系中更高效流动。Kite 带来的是：Agent 层。Kite Agent Passport 为每个 Agent 提供可验证身份、用户自定义的消费限额，以及始终由人类掌控的紧急停止开关，让 Agent 能在这些轨道上交易，且绝不接触你的凭证。为什么重要：支付移动价值，身份决定谁有权移动。在 Agent 大规模交易之前，这两层必须交汇。Agent 经济是团队运动。很高兴与 @avax 共建。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-08", summaryZh: "Kite 加入 Aethir Claw 第二批生态合作伙伴，与 OKX、SurfAI、ChainGPT 等同台，为运行在 Aethir Claw 上的 Agent 带来可验证身份与原生稳定币结算。", textZh: "Ready-to-work 只是入场券，Ready-to-transact 才是真正的解锁。Kite 为 Aethir Claw 上的 Agent 赋予可验证身份和原生 stablecoin 结算，让它们自主行动、自主收款：自主经济行动者的基础层。对 Kite 生态与 @AethirCloud 正在共同构建的一切感到兴奋。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-08", summaryZh: "感谢 ChainPatrol 协助拦截 381 条针对 Kite 社区的钓鱼与仿冒链接（其中 155 条在 X 上），从源头保护社区安全。", textZh: "Agent 经济建立在信任之上，而信任始于守护我们的社区。感谢 @ChainPatrol 从源头检测并清除针对 Kite 社区的钓鱼和仿冒攻击。移除 381 条恶意链接，意味着为用户拆除了 381 个陷阱。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-09", summaryZh: "Kite 联合创始人兼 CTO Scott Shi 在旧金山 Sapient/Okta 主办的 Agent Experience Demo Night 上，演示了新的开发者产品：面向用户的实时支出数据、按限额自动降级/停止的成本管控，以及基于用量的定价。", textZh: "一个能真正干活的 Agent，需要一整套新基建：身份、搜索、文档、代码，还有支付能力。昨晚在旧金山，这些能力刚好聚在了一个房间里。感谢 Sapient 在 Okta 主办了 Agent Experience Demo Night，Kite 和 @auth0、@DocuSign、@Box、@nebiusai、@coderabbitai 和 @tavilyai 等知名企业同台展示。我们的联合创始人兼 CTO @scottshics 首次展示了本月稍晚上线的一款开发者产品。他在 Kite 上部署了一个实时 Agent，演示了单个开发者如何把 AI Agent 作为产品交付，同时避免成本失控：▷ 逐用户可见的支出数据，月底看账单，再也不心慌 ▷ 成本管控机制，可自动降级或停止达到设定限额的 Agent ▷ 基于用量的定价，每个用户只为实际消耗买单。更多这样的对话还在继续。完整视频：youtube.com/watch?v=w7q-DxDX6uY", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-12", summaryZh: "Groq 创始人兼 CEO Jonathan Ross 在 David Senra 播客上谈到 Agent 支付即将爆发式增长，Kite 借题重申 Agent Passport 正是为可验证身份、可编程预算与高频稳定币结算而生的基础设施。", textZh: "Jonathan Ross 想给他的一批 Agent 分配几个电话号码，好让它们和他一样用 Signal 和 WhatsApp，结果 Twilio 一直要求他证明「我是人类」。他的理想方案：给 AI 分配一笔预算，让它自己花。在 @davidsenra 的播客上，@GroqInc 创始人兼 CEO @JonathanRoss321 清楚解释了为什么 Agent 支付即将爆发。要点：▷ AI 特别擅长使用 AI——这正是 agentic 的本质：一个 Agent 把研究任务委托给另一个 Agent，用量呈指数增长 ▷ 当 Agent 开始付款，交易数量将飙升，今天的瓶颈是「支付系统还没准备好」，微支付将改变这一切 ▷ 他心目中的理想状态：给 AI 一笔预算，让它在预算内自主消费，无需操心。这个理想状态正是 @GoKiteAI 正在打造的：Kite Agent Passport 为每个 Agent 提供可验证身份和用户自定义、可执行的消费限额；Agent 产生的高频海量微支付，随后通过链上稳定币在 Kite 自己的 Layer 1 上结算。再也不用「证明你是人类」。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-12", summaryZh: "Kite 本周产品更新：上线跨链 x402 支付路由（Base、Tempo、Solana），仪表盘新增路由时间线，并支持在 Base 上直接结算，取代原有的 treasury relay 路径。", textZh: "你的 Agent 可以在 Base、Tempo 和 Solana 上支付，即便它的资金存放在其他支持的链上。无需先移动资产。本次更新上线了跨链 x402 支付、仪表盘中的路由时间线，以及一个重要的更新：① 跨链支付路由。x402 支付现在可以在与资金所在链不同的链上结算，Kite Passport 自动跨 Base、Tempo、Solana 之间自动桥接和路由。② 仪表盘中的路由时间线。每条路由支付都跨链，因此仪表盘现在显示的是旅程而不仅仅是结果：链图标、桥接金额、浏览器链接以及 USDC 和 PYUSD 的代币图标，同时附带会话详情视图。交易历史现在显示路由分析，CLI 显示每笔交易在哪个链上结算。③ 支持 Base 结算。Kite Passport 现已支持在 Base 上结算。direct-pay 和跨链路由现在直接处理结算，取代了原来的 treasury relay 路径。作为启用 Base 支持的一部分，主网 agent 钱包持有的 USDC 已按 1:1 桥接到各自对应的 Base 地址。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-13", summaryZh: "Kite 生态支持 River 与 Axis Robotics 在东京联合举办的「Sessions x AI」机器人见面会（7 月 13 日），与 0G Labs、weroamxyz、ChainbaseHQ 同台，探索 Physical AI 与机器人智能的交汇，Kite CMO Cindy Shi 出席。", textZh: "Physical AI 是 Agent 经济最激动人心的前沿之一，能感知、结算和行动的机器，需要底层真正的链上基础设施。Kite 生态很荣幸支持 @RiverdotInc 在东京举办的 Sessions x AI，由 @axisrobotics 联合主办，@0G_labs、@weroamxyz 和 @ChainbaseHQ 也将加入。这是一个强大的阵容，共同探索 AI、机器人技术与加密的交汇点。7 月 13 日 13:00 JST，东京港区，日本的建设者们，别错过。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-06-29", weekLabel: "2026 年 6 月 29 日 当周",
      posts: [
        { date: "2026-06-30", summaryZh: "Kite 与 OKX OnchainOS 达成合作，为运行在其上的自主 Agent 带来可验证身份与可编程花费控制——让「谁授权、限额多少」成为每笔交易的前提。", textZh: "一个能交易的 Agent，必须先回答一个问题：是谁授权了它，花费上限是多少？Kite 正与 @okx 合作，为运行在 OKX OnchainOS 上的自主 Agent 带来可验证身份与可编程花费控制。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-01", summaryZh: "Kite 联合创始人兼 CEO Chi Zhang 将出席旧金山 AGI Summit SF 2026（7 月 18-19 日），与业界领袖同台探讨 Agent 经济的身份、支付与规模化。", textZh: "AI 的下一阶段由「执行」定义：Agent 将代表用户行动、交易、完成真实任务。而在这一转变规模化之前，每个 Agent 都必须获得可验证的授权、受可执行的消费限额约束，并始终处于人的控制之下。我们很高兴地宣布：Kite 联合创始人兼 CEO @ChiZhangData 将出席 AGI Summit SF 2026（7 月 18-19 日，旧金山）。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-01", summaryZh: "Chi 做客 Vishwa Hubble Space「Agent Passports：身份遇见控制」，与 VishwaLab 联合创始人及 Kite CTO 同台，解析 Agent 护照如何在授权与控制之间取得平衡。", textZh: "Chi 参与 Vishwa Hubble Space 直播「Agent Passports: Identity Meets Control」，与 @VishwaLab 联合创始人 Nathan Liang、Kite 联合创始人兼 CTO Scott 同台，深入探讨 Agent 身份认证与花费控制的设计。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-02", summaryZh: "Kite 成为 Imperial Blockchain & Fintech 主办的 UK AI Agent Hackathon EP5 社区合作伙伴，为探索 Agent 未来形态的开发者提供底层基础设施支持。", textZh: "每一个真正有用的 Agent，都始于一次实验：一个能行动、能交易、并始终运行在拥有者设定边界内的东西。正因如此，我们很高兴成为 @iclblockchain UK AI Agent Hackathon EP5 的社区合作伙伴。对每一位在探索 Agent 未来形态的 builder，我们正在打造支撑一切的基础设施。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-03", summaryZh: "本周 Kite Passport release 以 spending sessions 为中心重构了 dashboard，并为 Agent 新增云部署技能：实时查看会话与交易、浏览器内一键创建 session、通过 kpass cloud 一条命令将项目端到端部署到 Google Cloud。", textZh: "你的 Agent 会花钱了，现在每一分都看得见，而且是实时的。本周 Kite Passport 的 release 围绕 spending sessions 重建了 dashboard，还为 Agent 新增了云部署技能：① 以 session 为中心的 dashboard，一屏实时可见活跃会话、交易历史与单个 session 的活动明细；② 浏览器里一键创建并附加 spending session，还内置沙盒测试环境；③ kpass cloud 让 Agent 把本地项目端到端配置并部署到 Google Cloud，一条命令链走完。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-03", summaryZh: "Kite 推出双周「AI Agent Pulse」行业观察，为读者梳理 agentic AI 领域最新的产品、协议与生态动态。", textZh: "AI Agent Pulse——Kite 的双周 agentic AI 行业观察正式上线，为你梳理代理式 AI 领域最新的产品、协议与生态趋势。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-07-03", summaryZh: "Kite 成为 Unibase Memory Chrome 扩展的启动合作伙伴，并同步推出 GoKiteAI Memory Card——在 AI 围绕 Kite 做研究、开发或创作前，为其提供所需的正确上下文。", textZh: "Kite 正式成为 Unibase Memory Chrome 扩展的启动合作伙伴，并同步推出 @GoKiteAI Memory Card：在 AI 围绕 Kite 进行研究、开发或创作之前，提供其所需的正确上下文。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-06-22", weekLabel: "2026 年 6 月 22 日 当周",
      posts: [
        { date: "2026-06-23", summaryZh: "在巴黎卢浮宫举办的 ProofOfTalk 峰会上，Chi 登台参与「到底是什么定义了一个 Agent」主题讨论，与 Billions Network、Parity、Suremark 等多位领袖同台。", textZh: "到底是什么定义了一个 agent？越往深处想，这条界线越模糊。在法国巴黎卢浮宫举办的 @proofoftalk 峰会上，我们的联合创始人兼 CEO @ChiZhangData 登台，与来自 @billions_ntwk、@paritytech、@SuremarkDigital 的多位领袖同台讨论。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-26", summaryZh: "PayPal 稳定币 PYUSD 经 LayerZero 跨链、Stargate 桥接后在 Kite 上线，为 Kite 上的 Agent 提供受监管、以美元背书的结算资产。", textZh: "PYUSD 现已在 Kite 上线。PayPal USD 经 @LayerZero_Core 跨链、并通过 @StargateFinance 桥接，现已可供 Kite 上的 Agent 使用。它是一种受监管、以美元背书的稳定币，在 Agent 真正发生交易的地方完成结算。稳定币是 Agent 经济的结算层，而它们只有在不被锁死于单一链时，才能发挥最大价值。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-28", summaryZh: "AI on Air 第 17 集完整上线，Chi 对话 Hashed Open Finance CEO Harry Ho Jin Kim，拆解「Agent 为何至今无法完成交易」这一核心症结，并探讨韩国成为机器原生支付重要据点的可能。", textZh: "凌晨四点，你的 agent 找到一张 250 美元的东京机票，却付不了款——这道缺口，正是 agent 支付的症结所在。在 AI on Air 第 17 期里，@harryhojinkim（@hashed_official Open Finance CEO）与我们的联合创始人兼 CEO @ChiZhangData 同台，拆解了一个核心问题：agent 为什么至今还无法完成交易。", url: "https://www.youtube.com/watch?v=PLU5Jumn1kc", mediaUrl: "https://img.youtube.com/vi/PLU5Jumn1kc/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-06-15", weekLabel: "2026 年 6 月 15 日 当周",
      posts: [
        { date: "2026-06-15", summaryZh: "本周 Kite 持续推进主权金融对话与生态合作，AI on Air 第 17 集上线，探讨韩国成为 AI 代理与机器支付重要据点的可能性。", textZh: "Kite 正在通过关于主权金融的全球对话、务实的生态合作伙伴关系以及社区驱动的建设，推动 agentic 商业的发展。以下是本周工作进展：① AI on Air 第 17 集正式上线，对话 @hashed_official Open Finance CEO @harryhojinkim，共同探讨韩国为何可能成为 AI agents、韩元 stablecoin 及机器原生支付的重要据点。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-16", summaryZh: "Kite 联合 EntreConnect 与 AWS 在旧金山举办「代理经济」圆桌，聚焦 Agentic Commerce 规模化所需的底层支付与身份基础设施。", textZh: "「The Agentic Economy: Payments, Commerce & AI-Native Platforms」在旧金山汇聚了 builders、investors 与 operators，共同讨论 Agentic Commerce 真正规模化之前，需要哪些底层基础设施。活动由 EntreConnect、Kite 与 AWS Builder Loft 主办。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-17", summaryZh: "Kite 宣布与 CrystalPlatform 合作，将区块链合规能力集成进代理支付基础设施，为自主 Agent 的每笔交易提供信任与风控保障。", textZh: "自主 Agent 需要的不只是支付轨道，还需要内建于交易层的信任、合规与风险情报。我们很高兴分享：@CrystalPlatform 正通过 Crystal Expert，将区块链合规能力带入 Kite 的 Agent 经济，并集成进 Kite 的 agentic payment infrastructure。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-22", summaryZh: "Kite Passport 新增验证、恢复与花费控制安全层，确保代理在执行每个动作前满足必要的信任前提，而非仅在转账时才设防。", textZh: "过去两周，我们为 Kite Passport 交付了一层安全机制：把「验证、恢复、花费控制」包裹到 Agent 的每一个动作上。Agentic 支付里最危险的从来不是转账本身，而是转账发生前需要成立的一切前提。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-06-08", weekLabel: "2026 年 6 月 8 日 当周",
      posts: [
        { date: "2026-06-08", summaryZh: "Kite 成为 Billions Network 协作式 AI Agent 电影项目的启动合作伙伴，500+ 构建者通过 x402 支付将 Agent 变为电影制作人。", textZh: "我们非常高兴地宣布 Kite 生态成为 @billions_ntwk 协作式 AI Agent 电影发布的启动合作伙伴！500 多位 AI 构建者正将 Agent 转变为电影制作人，借助 human-proof x402 支付扩展。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-10", summaryZh: "AI on Air 第 17 集即将上线，主题聚焦韩元稳定币、合规机制与机器原生支付，探讨主权代理金融的未来图景。", textZh: "AI on Air 第 17 集预告——主权代理金融：KRW 稳定币、合规与机器支付。怎样的金融 rails？KRW 稳定币、身份与合规应该如何在本地市场运作？欢迎收看 AI on Air 第 17 期。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-11", summaryZh: "Chi 做客 BlockHash 播客第 742 集，讲述 Kite 如何在一年内从面向消费者转向基础设施优先，以及为何 Agent 经济从 API 而非购物开始。", textZh: "Agent 经济不会从购物开始，而是从 API 开始。Chi 做客 BlockHash 播客第 742 集，分享 Kite 的市场判断在一年内完全逆转的故事：从面向消费者转向基础设施优先。", url: "https://www.youtube.com/watch?v=se1HXCqNC7E", mediaUrl: "https://img.youtube.com/vi/se1HXCqNC7E/maxresdefault.jpg" },
        { date: "2026-06-12", summaryZh: "Chi 将出席旧金山「代理经济」活动，与支付、身份与平台领域领导者共同探讨 Agentic Commerce 的基础设施挑战。", textZh: "当支付、身份与平台进入同一个房间，Agentic Commerce 就不再只是概念，而是基础设施问题。旧金山，6 月 15 日 17:00-20:00 PDT。我们的联合创始人兼 CEO @ChiZhangData 将参加「The Agentic Economy」活动。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-13", summaryZh: "AI on Air 第 17 集完整版上线，对话 Hashed Open Finance CEO，深度解析韩国加密市场机构化趋势与机器支付的本地落地路径。", textZh: "AI on Air 第 17 集完整版正式上线，对话 Hashed Open Finance CEO @harryhojinkim，深入探讨韩国加密市场的机构分层趋势，以及为何韩国可能成为 AI agents 与机器原生支付的重要据点。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-06-01", weekLabel: "2026 年 6 月 1 日 当周",
      posts: [
        { date: "2026-06-03", summaryZh: "以 PSG 欧冠逆转为例，Kite 阐释 Passport 的核心价值：AI 代理能在你授权范围内抓住每一个市场机会，无需你亲自盯盘。", textZh: "2026 欧冠决赛进入点球大战，PSG 击败阿森纳。真正的收益在于这次逆转——想象一下，如果有一个代理能够为你抓住这样的机会：当信号出现时立刻行动，但前提是这个代理只能在你的授权范围内动用你的资产。这正是 Kite Passport 解决的核心问题。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-04", summaryZh: "Kite 担任 Bitget AI Hackathon S1 官方合作伙伴与评委，开发者可用自然语言生成交易策略，5 万 USDT 奖金池开放挑战。", textZh: "很高兴以官方合作伙伴和评委参与 @Bitget_AI 的 Hackathon S1！开发者无需代码基础，只需用自然语言描述你的交易点子，@Bitget_AI 就能帮你生成策略并实现上线。5 万 USDT 奖金池等你来挑战～", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-05", summaryZh: "Kite 成为巴黎卢浮宫「Web3 达沃斯」ProofofTalk 2026 赞助商，这是一场汇聚 2500 位决策者的顶级领导力峰会。", textZh: "被称为「Web3 达沃斯」的盛会，重返卢浮宫。Kite 很荣幸成为 @ProofofTalk 2026 的赞助商与合作伙伴。这是一场仅受邀的领导力峰会，举办地点在巴黎卢浮宫。▷ 限额 2,500 位与会者，其中 85% 为决策者。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-06-07", summaryZh: "Chi 做客 AI-Curious 播客，探讨 AI 代理商业化进展——当 Agent 成为你最重要的客户，agentic 经济的到来比多数人预想的更快。", textZh: "当 AI Agent 为你购物，你最重要的客户可能根本不是人类。Chi 做客 @AiCuriousHQ 播客，与 @jeffwilser 探讨 agentic 商业已经走了多远——以及为什么它到来的速度比大多数人想象的还要快。", url: "https://www.youtube.com/watch?v=OMkE-eO4WX8", mediaUrl: "https://img.youtube.com/vi/OMkE-eO4WX8/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-05-25", weekLabel: "2026 年 5 月 25 日 当周",
      posts: [
        { date: "2026-05-28", summaryZh: "Kite Passport 让 AI 代理无需获取用户账户凭证或信用卡，就能代用户完成高强度数据任务的支付，解决「Agent 代人花钱」的信任问题。", textZh: "一位数据分析师手握 500GB 数据集，距离截止时间还有 6 小时，但她的笔记本根本撑不住工作量。她的 Agent 可以替她完成，但前提是：这个 Agent 能够在不获取她云账户凭证、信用卡或其他权限的情况下，代她花钱。这正是 Kite Passport 要解决的问题。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-05-29", summaryZh: "Kite CMO @Cindyshi0907 受邀参加主网 AMA，在 CoinGachi Investment Twitter 直播分享主网上线后的进展与展望。", textZh: "很高兴看到我们的 CMO @Cindyshi0907 受邀参加 @Edward__Park 主持的 Kite AI 主网 AMA！今晚 10 PM KST，她将在 CoinGachi Investment Twitter 与大家见面，分享 Mainnet 上线后的进展与展望。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-05-31", summaryZh: "Kite 成为卢浮宫「Web3 达沃斯」ProofofTalk 2026 赞助商，与 2500 位决策者及代表 18 万亿美元管理资产的演讲嘉宾同台。", textZh: "被称为「Web3 达沃斯」的盛会，重返卢浮宫。Kite 很荣幸成为 @ProofofTalk 2026 的赞助商与合作伙伴，汇聚 2,500 位与会者（85% 为决策者），120+ 演讲嘉宾合计代表 $18T 管理资产。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-05-19", weekLabel: "2026 年 5 月 19 日 当周",
      posts: [
        { date: "2026-05-20", summaryZh: "Chi 接受 Y Talk 中文专访，深度解析代理支付为何是下一个万亿美元基础设施，以及 Kite 如何成为这一赛道的核心构建者。", textZh: "Chi 接受 Y Talk 专访（中文）：代理支付——下一个万亿美元基础设施。为什么 AI 代理需要原生支付能力，Kite 如何成为核心构建者。", url: "https://www.youtube.com/watch?v=y1kDxjLH2-g", mediaUrl: "https://img.youtube.com/vi/y1kDxjLH2-g/maxresdefault.jpg" },
        { date: "2026-05-21", summaryZh: "Kite 参加 SEABW 主办、Hashed 邀请的圆桌讨论，与行业伙伴共同探讨推动机器与机器之间经济发展的路径。", textZh: "很高兴 Kite 能够参加由 @SEABWofficial 主办的圆桌讨论，并感谢 @hashed_official 的邀请，携手共同推动机器与机器之间经济的发展。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-05-24", summaryZh: "Kite 本周获得 SOC 2 Type II 企业级安全认证，同步推进全球生态合作，持续夯实自主商业基础设施的信任基础。", textZh: "Kite 正持续推进自主商业基础设施建设，通过强化信任、深化全球生态参与，以及探索 AI 驱动经济的未来。本周重要进展：我们已获得 SOC 2 Type II 合规认证，进一步强化企业级安全标准。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-05-12", weekLabel: "2026 年 5 月 12 日 当周",
      posts: [
        { date: "2026-05-14", summaryZh: "Chi 出席 Consensus 2026，从万亿美元视角阐述代理支付的经济框架，解析 Kite 为何将成为这一变革的核心基础设施。", textZh: "Chi 出席 Consensus 2026：万亿美元之问——代理支付的框架。Kite CEO 阐述代理支付将如何重塑全球经济格局。", url: "https://www.youtube.com/watch?v=reU6Byhx5og", mediaUrl: "https://img.youtube.com/vi/reU6Byhx5og/maxresdefault.jpg" },
        { date: "2026-05-16", summaryZh: "Kite 主网正式上线！Chain ID 2366，代理经济的原生支付层诞生，专为 AI 代理高频稳定币支付优化，Kite Agent Passport 同步开放体验。", textZh: "🚀 Kite 主网正式上线！代理经济的支付层正式诞生。Chain ID 2366，专为代理高频稳定币支付优化。立即体验 Kite Agent Passport：agentpassport.ai", url: "https://medium.com/@KiteAI/introducing-kite-mainnet-2959c89b7403", mediaUrl: null, likes: 2341 },
        { date: "2026-05-18", summaryZh: "Kite 博客深度解析代理支付的身份、委托与信任机制——下一个经济层必须原生为 Agent 而建，而非改造人类系统。", textZh: "代理支付的身份、委托与信任——下一个经济层必须为代理而建。深入解析 Kite 如何实现安全的自主支付。", url: "https://medium.com/@KiteAI/identity-delegation-trust-for-agentic-payments-f66463fd616a", mediaUrl: null, likes: 412 },
      ],
    },
    {
      weekOf: "2026-05-05", weekLabel: "2026 年 5 月 5 日 当周",
      posts: [
        { date: "2026-05-09", summaryZh: "Chi 与 Animoca Brands 总裁 Alan Lau 深度对话，共探 AI 代理稳定币支付与身份认证，以及 Web3 游戏与 AI 代理如何在 Kite 上深度融合。", textZh: "Chi × Animoca Brands 总裁 Alan Lau 深度对话：AI 代理的稳定币支付与身份认证，Web3 游戏与 AI 代理如何在 Kite 上融合。", url: "https://www.youtube.com/watch?v=KIKpZ8qopdY", mediaUrl: "https://img.youtube.com/vi/KIKpZ8qopdY/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-04-27", weekLabel: "2026 年 4 月 27 日 当周",
      posts: [
        { date: "2026-04-28", summaryZh: "Chi 出席 USC VanEck 南加州区块链大会，参与「AI 在区块链和加密货币中的应用」圆桌，分享 Kite 在代理支付基础设施上的实践。", textZh: "非常高兴我们的联合创始人兼 CEO @ChiZhangData 参加了 USC VanEck 南加州区块链大会的「AI 在区块链和加密货币中的应用」圆桌讨论！", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-04-30", summaryZh: "Kite Chain 与 Kite Agent Passport 正式上线，自主 AI 代理的支付与身份层诞生，Chain ID 2366，agentpassport.ai 开放体验。", textZh: "Kite Chain 与 Kite Agent Passport 正式上线！自主 AI 代理的支付与身份层正式到来。Chain ID 2366，立即体验：agentpassport.ai", url: "https://x.com/GoKiteAI", mediaUrl: null, likes: 1847 },
      ],
    },
    {
      weekOf: "2026-04-06", weekLabel: "2026 年 4 月 6 日 当周",
      posts: [
        { date: "2026-04-07", summaryZh: "AI on Air 第 15 集上线，Chi 与谷歌云 Web3 产品负责人 Nalin Mittal 探讨当 AI 代理拥有钱包后，如何无需人工干预就能安全完成交易。", textZh: "AI on Air 第 15 集上线：自主商务的信任层——当 AI 代理拥有钱包。Chi 对话谷歌云 Web3 产品负责人 Nalin Mittal，探索代理如何在无需人工干预的情况下安全完成交易。", url: "https://www.youtube.com/watch?v=yOcPja2E5SU", mediaUrl: "https://img.youtube.com/vi/yOcPja2E5SU/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-03-23", weekLabel: "2026 年 3 月 23 日 当周",
      posts: [
        { date: "2026-03-29", summaryZh: "OpenClaw 上海开发者交流会在西岸智塔举办，腾讯云 QClaw 分享与智能体漏洞检测 demo 成为活动亮点，推动国内 AI 安全生态发展。", textZh: "3月29日，OpenClaw 上海开发者交流会在上海西岸智塔成功举办！活动亮点：腾讯云 QClaw 主题分享、智能体漏洞检测 demo。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2026-03-09", weekLabel: "2026 年 3 月 9 日 当周",
      posts: [
        { date: "2026-03-15", summaryZh: "AI on Air 第 14 集上线，Chi 与 Crystal Intelligence CEO Navin Gupta 深入探讨代理经济的声誉系统与合规机制，解析自主金融信任基础设施的必要性。", textZh: "AI on Air 第 14 集上线：代理经济的信任基础设施。Chi 与 Crystal Intelligence CEO Navin Gupta 探讨声誉系统、合规机制与自主金融的重要性。", url: "https://www.youtube.com/watch?v=jS9Of4gn6p4", mediaUrl: "https://img.youtube.com/vi/jS9Of4gn6p4/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-02-16", weekLabel: "2026 年 2 月 16 日 当周",
      posts: [
        { date: "2026-02-11", summaryZh: "Kite 在香港举办 Proof of AI Builder & Influencer Night，与顶级 Builder、VC 共同探讨 Agentic Internet 与 Open AI Economy，智能新时代加速到来的信号清晰。", textZh: "Proof of AI · Builder & Influencer Night 释放出一个清晰信号：智能新时代正在加速到来。在香港，我们与顶级 Builder、VC 及前沿思考者共同探讨 Agentic Internet 与 Open AI Economy。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
        { date: "2026-02-18", summaryZh: "Chi 出席 Consensus 香港 2026，阐述代理经济规模化所需的身份、支付与治理机制，勾勒代理经济的终局图景与实现路径。", textZh: "Chi 出席 Consensus 香港 2026：代理经济的终局与路径。代理需要身份、支付与治理机制才能规模化运营。", url: "https://x.com/GoKiteAI", mediaUrl: null },
        { date: "2026-02-20", summaryZh: "AI on Air 第 13 集上线，Chi 与 Surf AI 联合创始人 Ryan Li 探讨当 AI 幻觉造成数百万损失时，代理金融如何通过结构化验证划定风险边界。", textZh: "AI on Air 第 13 集上线：代理金融——当 AI 幻觉造成数百万损失。Chi 与 Surf AI 联合创始人 Ryan Li 探讨代理金融的风险边界与结构化验证机制。", url: "https://www.youtube.com/watch?v=ozq2mhy9mE0", mediaUrl: "https://img.youtube.com/vi/ozq2mhy9mE0/maxresdefault.jpg" },
      ],
    },
    {
      weekOf: "2026-01-26", weekLabel: "2026 年 1 月 26 日 当周",
      posts: [
        { date: "2026-01-27", summaryZh: "Kite 发布主网路线图，围绕「智能体信任、结算、开发者基础设施、网络运营、AgenticFi、生态增长」六大支柱，构建智能体原生的信任与支付技术栈。", textZh: "Kite 主网路线图：构建智能体原生的信任与支付技术栈。六大支柱：①智能体信任；②智能体结算；③智能体开发者基础设施；④智能体网络运营；⑤AgenticFi；⑥智能体生态增长引擎。", url: "https://x.com/KiteAIChinese", mediaUrl: null },
      ],
    },
    {
      weekOf: "2025-11-24", weekLabel: "2025 年 11 月 24 日 当周",
      posts: [
        { date: "2025-11-26", summaryZh: "Chi 出席韩国区块链周 2025，接受 FIREANT 深度专访，解析代理支付的万亿美元机遇与 Kite 实现 agentic 经济的技术路线图。", textZh: "Chi 出席韩国区块链周 2025，接受 FIREANT 深度专访：探讨代理支付的万亿美元机遇与 Kite 的技术路线图。", url: "https://www.youtube.com/watch?v=7GoCutDVt6Y", mediaUrl: "https://img.youtube.com/vi/7GoCutDVt6Y/maxresdefault.jpg" },
        { date: "2025-11-26", summaryZh: "KBW 圆桌上，Chi 与行业顶级建设者共同探讨 AI 代理与 RWA 的融合——从算力基础设施到资本市场，链上金融的新格局正在成形。", textZh: "KBW 圆桌：AI 代理与 RWA——从算力基础设施到资本市场。Chi 与行业顶级建设者共同探讨 AI 与链上金融的融合前景。", url: "https://x.com/GoKiteAI", mediaUrl: null },
      ],
    },
    {
      weekOf: "2025-11-10", weekLabel: "2025 年 11 月 10 日 当周",
      posts: [
        { date: "2025-11-12", summaryZh: "Pieverse 宣布将在 Kite 上启用跨链代理支付轨道，建立可互操作的多协议支付基础设施，进一步扩展 Kite 生态的覆盖范围。", textZh: "Pieverse 将在 Kite 上启用跨链代理支付轨道，建立可互操作的多协议支付基础设施。", url: "https://medium.com/@KiteAI/pieverse-to-enable-cross-chain-agentic-payment-rails-on-kite-52ce827b0632", mediaUrl: null },
      ],
    },
    {
      weekOf: "2025-10-27", weekLabel: "2025 年 10 月 27 日 当周",
      posts: [
        { date: "2025-10-27", summaryZh: "Coinbase Ventures 宣布投资 Kite！Kite 是最早原生实现 x402 兼容支付原语的 L1 之一，双方将携手推进代理支付标准的行业落地。", textZh: "激动宣布：Coinbase Ventures 投资 Kite，携手推进基于 x402 协议的代理支付标准！Kite 是最早原生实现 x402 兼容支付原语的 L1 之一。", url: "https://x.com/GoKiteAI", mediaUrl: null, likes: 1203 },
        { date: "2025-10-30", summaryZh: "Kite 博客深度解析 AI 代理的任务规划方法论，探讨如何在精度与效率之间取得平衡，让代理规划得更好、执行得更准。", textZh: "代理如何规划任务——以及如何规划得更好。深入分析代理规划方法论及精度与效率优化策略。", url: "https://medium.com/@KiteAI/how-agents-plan-and-plan-better-90470e563e68", mediaUrl: null },
      ],
    },
    {
      weekOf: "2025-09-01", weekLabel: "2025 年 9 月 1 日 当周",
      posts: [
        { date: "2025-09-02", summaryZh: "Kite 完成 1800 万美元融资，由 PayPal Ventures 和 General Catalyst 领投，专注构建自主 AI 代理的身份与支付层，Fortune、CoinDesk、Cointelegraph 全球同步报道。", textZh: "重磅：Kite 完成由 PayPal Ventures 和 General Catalyst 领投的 1800 万美元融资，构建自主 AI 代理的身份与支付层！Fortune、CoinDesk、Cointelegraph 同步报道。", url: "https://x.com/GoKiteAI", mediaUrl: null, likes: 2847 },
      ],
    },
    {
      weekOf: "2025-06-16", weekLabel: "2025 年 6 月 16 日 当周",
      posts: [
        { date: "2025-06-17", summaryZh: "Kite 宣布将为代理原生互联网构建专属支付基础设施——自主 AI 代理需要原生的身份认证与支付轨道，而非人类系统的简单改造。", textZh: "Kite 正在为代理原生互联网构建支付基础设施。自主 AI 代理需要属于自己的身份认证与支付轨道——而非将人类系统强行改造。", url: "https://x.com/GoKiteAI", mediaUrl: null, likes: 287 },
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
          summaryZh: post.summaryZh ?? null,
          url: post.url,
          mediaUrl: post.mediaUrl ?? null,
          likes: post.likes ?? null,
          sortOrder: postOrder++,
        },
      });
    }
  }
  console.log(`✓ Seeded ${postOrder} weekly posts`);

  const interviews = [
    { date: "2026-07-28", titleZh: "Vishwa Hubble 播客第 4 集 | AI Agent 为何既需要身份，也需要支付：Kite 联合创始人对谈", bodyZh: "Kite 联合创始人兼 CEO Chi Zhang 与联合创始人兼 CTO Scott Shi 做客 Vishwa Hubble 播客第 4 集，与 Vishwa 联合创始人 Nathan 深入拆解：知道一个 Agent 是谁之后，身份本身是否足够？Scott 从 user ID、model ID、agent harness ID、runtime ID 四层身份拆解 Agent 交易前必须钉住的要素；Chi 则指出，真正决定 Kite Passport 能否被开发者采用的，是身份与支付之间那段容易被忽视的中间地带。", youtubeId: "1mkRePj0WFU", sourceUrl: "https://www.youtube.com/watch?v=1mkRePj0WFU" },
    { date: "2026-07-15", titleZh: "打造 Agentic 互联网：Kite 联合创始人兼 CEO Chi Zhang | Venture with Grace 播客", bodyZh: "Chi 做客 Grace Gong 主持的 Venture with Grace 播客，拆解 agent-to-agent 商业的三个发展阶段——从 agent 对网站，到同一主体下多 agent 协作，再到跨实体的真正 A2A 交易——并分享 Kite 如何用可验证身份与原生支付为最后一阶段搭建基础设施。", youtubeId: "JHqrBWIlVVI", sourceUrl: "https://www.youtube.com/watch?v=JHqrBWIlVVI" },
    { date: "2026-06-28", titleZh: "AI on Air 第 17 集 | 主权代理金融：韩元稳定币、合规与机器支付", bodyZh: "Chi 对话 Hashed Open Finance CEO Harry Ho Jin Kim（@harryhojinkim），探讨韩国为何可能成为 AI 代理、韩元稳定币与机器原生支付的重要据点，并拆解「Agent 至今为何难以完成交易」这一核心症结。", youtubeId: "PLU5Jumn1kc", sourceUrl: "https://www.youtube.com/watch?v=PLU5Jumn1kc" },
    { date: "2026-06-22", titleZh: "ProofOfTalk 2026（巴黎卢浮宫）| 代理时代的身份、溯源与验证", bodyZh: "在巴黎卢浮宫举办的 ProofOfTalk 2026 峰会上，Chi 登台参与「Personhood, Provenance, and Verification in the Agentic Age」圆桌，与多位行业领袖共同探讨：在 AI 代理时代，如何验证身份、溯源与真实性。", youtubeId: "MKcpzhme0_E", sourceUrl: "https://www.youtube.com/watch?v=MKcpzhme0_E" },
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
    { date: "2025-10-31", titleZh: "【中文专访】「她」故事 E46：AI Agentic × x402——Kite AI 如何驱动支付的未来 | Chi Zhang", bodyZh: "Chi 做客 Bill Qian 主持的《「她」故事》播客第 46 集，用中文深入分享 AI Agentic 与 x402 协议如何重塑支付，以及 Kite AI 在代理经济中的愿景与实践。", youtubeId: "CT9gobQ0Sbw", sourceUrl: "https://www.youtube.com/watch?v=CT9gobQ0Sbw" },
  ];

  for (let i = 0; i < interviews.length; i++) {
    await prisma.familyInterview.create({ data: { ...interviews[i], type: "interview", sortOrder: i } });
  }
  console.log(`✓ Seeded ${interviews.length} interviews`);

  const news = [
    { date: "2026-07-09", publisher: "CoinGabbar", titleEn: "GoKiteAI Joins Avalanche Payments Collective", titleZh: "GoKiteAI 加入 Avalanche Payments Collective", descZh: "CoinGabbar 报道，Kite 成为 Avalanche Payments Collective（覆盖 Paxos、Franklin Templeton、Anchorage 等 28 家机构的支付联盟）首个专注 AI Agent 的成员，贡献 Kite Agent Passport 为 Agent 提供可验证身份、用户自定义消费限额与人工控制的紧急停止开关。", url: "https://www.coingabbar.com/en/crypto-currency-news/avalanche-news-today-avax-price-dex-gokiteai-payment-launch" },
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

  const podcasts = [
    { episode: 17, titleZh: "AI on Air 第 17 集 | 主权代理金融：韩元稳定币、合规与机器支付", guestZh: "Harry Ho Jin Kim", guestOrgZh: "Hashed Open Finance, CEO", youtubeUrl: "https://www.youtube.com/watch?v=PLU5Jumn1kc" },
    { episode: 15, titleZh: "AI on Air 第 15 集 | 自主商务的信任层：当 AI 代理拥有钱包", guestZh: "Nalin Mittal", guestOrgZh: "Google Cloud, Head of Web3 Products", youtubeUrl: "https://www.youtube.com/watch?v=yOcPja2E5SU" },
    { episode: 14, titleZh: "AI on Air 第 14 集 | 代理经济的信任基础设施", guestZh: "Navin Gupta", guestOrgZh: "Crystal Intelligence, CEO", youtubeUrl: "https://www.youtube.com/watch?v=jS9Of4gn6p4" },
    { episode: 13, titleZh: "AI on Air 第 13 集 | 代理金融：当 AI 幻觉造成数百万损失", guestZh: "Ryan Li", guestOrgZh: "Surf AI, Co-founder & CEO", youtubeUrl: "https://www.youtube.com/watch?v=ozq2mhy9mE0" },
    { episode: 12, titleZh: "AI on Air 第 12 集 | 探索代理金融与 x402 协议", guestZh: "Colin Ho", guestOrgZh: "pieverse, Co-founder & CEO", youtubeUrl: "https://youtu.be/0JzWEb6cQ34" },
    { episode: 11, titleZh: "AI on Air 第 11 集 | 以 x402 协议大规模驱动代理支付", guestZh: "Jonathan King", guestOrgZh: "Coinbase Ventures, Investor", youtubeUrl: "https://www.youtube.com/watch?v=ERUp4hVxH-I" },
    { episode: 10, titleZh: "AI on Air 第 10 集 | 证明、支付与代理未来", guestZh: "Michael Dong", guestOrgZh: "Brevis, CEO", youtubeUrl: "https://www.youtube.com/watch?v=OPX2QC9R7CY" },
    { episode: 9, titleZh: "AI on Air 第 9 集 | 与 PayPal 共建代理互联网的未来", guestZh: "Alan Du & Jonathan Cordeau", guestOrgZh: "M12 Ventures / PayPal", youtubeUrl: "https://www.youtube.com/watch?v=6oGpazMpEhQ" },
    { episode: 8, titleZh: "AI on Air 第 8 集 | 基于 Kite 构建：Codatta 与 AI 数据新时代", guestZh: "张毅", guestOrgZh: "Codatta, CEO", youtubeUrl: "https://www.youtube.com/watch?v=kf4rk-fGSnI" },
    { episode: 7, titleZh: "AI on Air 第 7 集 | 硬件加速时代", guestZh: "Jason Li", guestOrgZh: "Solayer Labs, Co-founder", youtubeUrl: "https://www.youtube.com/watch?v=kUdhjKhPT2s" },
    { episode: 6, titleZh: "AI on Air 第 6 集 | 自主代理，自主支付", guestZh: "Sean Li", guestOrgZh: "Magic Labs, CEO", youtubeUrl: "https://www.youtube.com/watch?v=5Z8B17z9F10" },
    { episode: 5, titleZh: "AI on Air 第 5 集 | 代理互联网的崛起", guestZh: "王淼森", guestOrgZh: "DeepMind, Research Engineer", youtubeUrl: "https://www.youtube.com/watch?v=j70-zAL2Ljc" },
    { episode: 4, titleZh: "AI on Air 第 4 集 | 与 Ava Labs 共建 AI 时代的金融轨道", guestZh: "John Nahas", guestOrgZh: "Ava Labs, Chief Business Officer", youtubeUrl: "https://www.youtube.com/watch?v=XjcrjV-Ra9k" },
    { episode: 3, titleZh: "AI on Air 第 3 集 | AI、验证与信任的未来", guestZh: "Prof. Gregory Rosu", guestOrgZh: "UIUC", youtubeUrl: "https://www.youtube.com/watch?v=SxsICD_RNas" },
    { episode: 2, titleZh: "AI on Air 第 2 集 | 从 Netflix 到 Meta：AI 革命亲历者视角", guestZh: "徐振中", guestOrgZh: "Meta, Engineering Lead", youtubeUrl: "https://www.youtube.com/watch?v=jEUKT39obJk" },
    { episode: 1, titleZh: "AI on Air 第 1 集 | 解锁 AI 的真正价值：归因、区块链与创新未来", guestZh: "Prof. Shriram Vishwanath", guestOrgZh: "UT Austin", youtubeUrl: "https://www.youtube.com/watch?v=FtGeQJkH38w" },
  ];

  for (let i = 0; i < podcasts.length; i++) {
    await prisma.familyPodcast.create({ data: { ...podcasts[i], sortOrder: i } });
  }
  console.log(`✓ Seeded ${podcasts.length} podcasts`);

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
