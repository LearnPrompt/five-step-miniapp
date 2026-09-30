# 五步小程序开发法

版本 **1.0.0** · **MIT**。从 [Releases](https://github.com/LearnPrompt/five-step-miniapp/releases) 下载 `five-step-miniapp.zip`。

适合已有网页源码，想把核心功能做成微信小程序的人。五阶段是“初版 → UI → 数据 → AI → 测试发布”，允许反复修正，也能从当前进度续作；没有 AI 需求就跳过。

## 安装

解压 `five-step-miniapp.zip`，得到 `five-step-miniapp/`，其中直接包含 `SKILL.md`。放入所用代码 Agent 支持的技能目录，或使用该工具的导入功能。Codex 可放在 `~/.codex/skills/five-step-miniapp/`；WorkBuddy 和其他工具请使用当前版本实际支持的入口，不保证每个客户端都能导入同一种 ZIP。

若当前工具不支持 Skill，可以把 `SKILL.md` 当任务说明，并在开始当前阶段时附上 `references/stage-briefs.md` 的对应一段。本包不安装软件，也不修改全局配置。

## 第一次使用

```text
用 $five-step-miniapp 把当前网页项目改成微信小程序。
源码：<本机项目目录>
最想保留的路径：<例如浏览列表、打开详情、收藏>
现有条件：<是否有小程序账号、AppID、后端；没有也如实说明>
先做出最小初版；可逆细节沿用现有项目方案，逐步实现和验证。
```

续作只需说：`用 $five-step-miniapp 阅读 miniapp-progress.md，继续尚未通过的阶段。`

## 结果文档示例

以下是记录格式示例，**不是已经完成的项目**。实际使用时在自己的项目中生成 `miniapp-progress.md`，证据换成真实文件或运行结果。

```markdown
# 小程序进度
目标路径：课程列表 → 课程详情 → 收藏
源码：项目原有 web/ 目录
当前阶段：1. 做初版
状态：进行中（静态检查通过，尚未在开发工具预览）
修改：miniprogram/app.json；pages/list/；pages/detail/
运行入口：使用微信开发者工具打开 miniprogram/
检查：页面注册与跳转路径检查通过；数据来自明确标注的演示样例
证据：checks/stage-1.txt（实际运行后保存）
待办：确认账号与预览方式；真机验证导航与触控
后续：阶段 3 接真实课程数据；阶段 4 是否需要 AI 由目标决定
```

## 能得到什么

Agent 会在你的项目中实际改代码，并留下运行方法、各阶段验证结果与待办。前提是它有对应文件、命令和工具权限；源码、账号、真机、后端不足会明确记录。它不会因为生成了代码就宣称已发布，也不会默认替你公开源码或付费。

这份分发包是开发方法，未附带私人项目或成功演示。结构检查与场景自查不代表任何真实项目已完成开发；安装后仍要使用实际项目与设备验证。

## 分发包结构

```text
five-step-miniapp/
├── SKILL.md
├── LICENSE
├── agents/openai.yaml
└── references/stage-briefs.md
```

本包结构和 ZIP 完整性已验证。一次隔离的 Agent 试跑已将示例网页改为小程序代码，5 项 Node 页面逻辑测试通过；未在微信开发者工具编译或真机运行，未上传、审核或发布应用，也未验证每一款 Agent 的导入界面。详见 [验证范围](docs/validation.md)。

## 可用来试跑的小项目

[每日书单示例](examples/booklist/README.md) 包含原网页、本地数据和试跑产出的小程序初版。使用自己的源码也可以；这个示例不需要调用付费 API。

```text
用 $five-step-miniapp 读取 examples/booklist/，继续它的小程序初版。
先检查现有代码和进度，只推进当前可验证的部分。
```

示例需要 Node.js 运行本地测试，微信开发者工具用于实际预览。Node 通过不代表微信编译或真机已经通过。
