<div align="center">
  <img src="./readme/images/logo.png" alt="screenshot" width="100" />
  <h1>CYC</h1>
  <strong><p>创建你的个人骑行主页</strong></p>

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/camlife">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/camlife?style=flat">
  <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/sun0225SUN/camlife?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/camlife">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/camlife">
  <img alt="Page views" src="https://komarev.com/ghpvc/?username=camlife&label=Views&color=orange&style=flat"/>

  [English](/README.md) | 简体中文

  <!-- <img src="./readme/images/preview.png" alt="screenshot" /> -->
</div>

## ✨ 功能特性

- [x] 🌓 支持深色/浅色主题

## 🎬 示例网站

- https://cyc.earth

> 欢迎将您的网站添加到列表中 https://github.com/sun0225SUN/cyc-earth/issues/1

## 🔨 技术栈

- ⚡ 框架 - [Next.js](https://nextjs.org)
- 🧩 语言 - [TypeScript](https://www.typescriptlang.org)
- 🌬️ 样式 - [Tailwind CSS](https://tailwindcss.com)
- 🎛️ UI 库 - [shadcn/ui](https://ui.shadcn.com)
- 🐻 状态管理 - [Zustand](https://zustand-demo.pmnd.rs)
- 🐘 数据库 - [truso](https://turso.tech)
- 🌧️ ORM - [Drizzle](https://orm.drizzle.team)
- 🗺️ 地图 - [mapbox](https://mapbox.com)
- 🌐 多语言 - [next-intl](https://next-intl.dev)
- 🔗 API 层 - [tRPC](https://trpc.io)
- 🧹 格式化器和代码检查 - [Biome](https://biomejs.dev)
- 🪝 Git 钩子 - [Lefthook](https://lefthook.dev)
- 📊 流量分析 - [Umami](https://umami.is) &  [@vercel/analytics](https://vercel.com/docs/analytics/quickstart?package-manager=bun)


## 👥 贡献者

<!-- readme: collaborators,contributors -start -->

<!-- readme: collaborators,contributors -end -->

## 🍭 社区

- [Discord](https://discord.com/invite/fxARGMmg)
- [Telegram](https://t.me/sunguoqi)

## 💡 灵感来源

- [running_page](https://github.com/yihong0618/running_page)

## 🚀 快速开始

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sun0225SUN/camlife)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sun0225SUN/camlife)

### Docker

1. 在根目录创建 `.env` 文件

2. 使用 Docker Compose

```bash
docker-compose up -d
```

> [!warning]
> 请确保在运行项目之前正确配置所有必要的环境变量。

```bash
# Drizzle
DATABASE_PROVIDER="sqlite" # sqlite | turso
DATABASE_URL="file:./db.sqlite"
TURSO_DATABASE_URL=""
TURSO_DATABASE_TOKEN=""

# Strava
STRAVA_CLIENT_ID="119**6"
STRAVA_CLIENT_SECRET="d69695808bd**************bb288"
STRAVA_REFRESH_TOKEN="fdcc5f5fb27********0a103886e39"

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.eyJ1Ijoic3VuZ3V***********************dxVfugnrCSRT2kw"

# Umami
NEXT_PUBLIC_UMAMI_ANALYTICS_ID="****-1d30-4876-8de6-****"
NEXT_PUBLIC_UMAMI_ANALYTICS_JS="https://umami.guoqi.dev/script.js"
```

> [!note]
> 标有 `*` 的变量仅在 `STORAGE_PROVIDER` 设置为 `cloudflare-r2` 时需要。对于其他存储提供商（AWS S3、Vercel Blob），将需要不同的环境变量。

<details>
<summary><strong>Strava</strong></summary>

https://stravalib.readthedocs.io/en/latest/get-started/authenticate-with-strava.html

</details>


## 💻  本地开发

1. 克隆仓库

```bash
git clone https://github.com/sun0225SUN/cyc-earth.git

cd camlife
```

2. 在根目录创建 `.env` 文件，并按照 [🚀 快速开始](#-快速开始) 部分的说明配置环境变量。

3. 安装依赖

```bash
bun install
```

4. 设置数据库

```bash
bun db:push
```

5. 启动开发服务器

```bash
bun run dev
```

打开 `http://localhost:3000` 查看你的应用。

## 📝 许可协议

本项目采用 [GNU General Public License v3.0](LICENSE) 许可证。

## 🤝 贡献

欢迎贡献！随时可以提交 issue 和 pull request。

## 💖 赞助

如果你觉得这个项目有帮助，请在 GitHub 上给它一个 ⭐️！

<table>
	<tbody>
		<tr>
      <td align="center">
         <img src="https://files.guoqi.dev/wxpay.png" width="250px"  alt="wxpay" style="border-radius:10px;" />
      </td>
      <td align="center">
        <img src="https://files.guoqi.dev/alipay.jpg" width="250px"  alt="alipay" style="border-radius:10px;" />
      </td>
		</tr>
	<tbody>
</table>

## 📊 仓库状态

![Alt](https://repobeats.axiom.co/api/embed/df4c48ad1ab928ba118d1e7a2a5083e3c9ffd665.svg "Repobeats analytics image")

## ⭐ Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=sun0225SUN/cyc-earth&type=Date)](https://github.com/sun0225SUN/cyc-earth)