# 每日书单小程序初版

原网页仅有 `index.html` 和 `books.json`：浏览两本书、按小说/技术筛选、弹窗详情。本次用原生微信小程序实现列表页和详情页，未引入框架；原网页文件保留，方便对照网页与小程序实现。

## 本地检查

安装 Node.js 18 或更新版本后，在此项目目录执行（无第三方依赖，无须 npm install）：

```sh
npm run sync:data
npm test
```

`books.json` 是唯一可维护书单来源；同步脚本校验字段/重复 ID 后生成 `miniprogram/data/books.js`。编辑书单后需重新同步并重新编译。页面显示“本地书单”和“尚未接入每日更新”；没有来源日期，不能冒称今日更新。未增加网络、云数据库、登录、收藏或 AI。

## 微信开发者工具运行

1. 从[微信官方入口](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)安装微信开发者工具并完成其要求的登录。
2. 导入本项目根目录（包含 `project.config.json` 的目录），项目类型选“小程序”；代码目录由 `miniprogramRoot: miniprogram/` 指定。
3. 当前配置 `appid` 留空，不代表绑定账号。若当前工具提供“无 AppID”或测试号入口，使用该入口做本地调试，以工具实际界面为准；本次没有工具，未核实该入口或导入是否成功。如果工具要求有效 AppID，需提供自己的小程序/测试号 AppID 后再导入。本项目无需云账号。
4. 编译后应进入 `pages/books/index`，看到两本书；分类选择“小说”应仅剩《海边的书》，“技术”应仅剩《做一个小工具》，“全部”恢复两本。
5. 点击每本“看详情”，分别显示“关于一次旅行的故事”和“从一个具体任务开始”。点击“返回书单”应保留原分类。单独打开 `pages/detail/index?id=missing` 应显示未找到提示，返回按钮可回到列表。
6. 用约 375px 宽的模拟器查看中文换行、长内容滚动和按钮；完成模拟器后再验证真机触控。不要把 Node 测试当作微信预览结果。

## 已运行与待验证

- `npm test`：5/5 通过，执行真实页面 JavaScript，使用替代的 `Page`/`wx` 环境验证数据、分类、详情、返回、错误反馈和配置文件；不是微信运行时。
- `node --check`：所有项目 JS/CJS 文件通过语法检查。
- 隔离试跑保留原网页且核对基线一致；公开示例只收录可运行文件，不附本机环境清单。
- 未找到本机微信开发者工具，未做 WXML/WXSS 编译、模拟器预览、视觉检查或真机操作。未上传、生成体验版、提审或发布。
- 具体阶段状态与证据见 `miniapp-progress.md`。

## 官方依据与核实限制

配置键和 WXML 事件参考[微信官方示例项目配置](https://github.com/wechat-miniprogram/miniprogram-demo/blob/master/project.config.json)与[官方 WXML 示例](https://github.com/wechat-miniprogram/miniprogram-demo/blob/master/miniprogram/page/API/index.wxml)。本次官方文档的项目配置、测试号、导航页面访问失败，未声称已核实当前无 AppID 调试入口，也未复用官方示例中的 AppID。
