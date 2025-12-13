<div align="center">
  <img src="./readme/images/logo.png" alt="screenshot" width="100" />
  <h2>Create a personal cycling home page</h2>

  English | [简体中文](/README_zh.md)

  <img alt="GitHub License" src="https://img.shields.io/github/license/sun0225SUN/cyc-earth">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/sun0225SUN/cyc-earth?style=flat">
  <img alt="GitHub Repo forks" src="https://img.shields.io/github/forks/sun0225SUN/cyc-earth?style=flat">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/sun0225SUN/cyc-earth">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sun0225SUN/cyc-earth">
  <img alt="Page views" src="https://komarev.com/ghpvc/?username=cyc-earth&label=Views&color=orange&style=flat" />

  <!-- <img src="./readme/images/preview.png" alt="screenshot" /> -->
</div>

## ✨ Features

- [x] 🌓 Supports dark/light themes

## 🎬 Showcase

- https://cyc.earth

> Welcome to add your website to the list https://github.com/sun0225SUN/cyc-earth/issues/1

## 🔨 Tech Stack

- ⚡ Framework - [Next.js](https://nextjs.org)
- 🧩 Language - [TypeScript](https://www.typescriptlang.org)
- 🌬️ Styling - [Tailwind CSS](https://tailwindcss.com)
- 🎛️ UI Library - [shadcn/ui](https://ui.shadcn.com)
- 🐻 State Management - [Zustand](https://zustand-demo.pmnd.rs)
- 🐘 Database - [truso](https://turso.tech)
- 🌧️ ORM - [Drizzle](https://orm.drizzle.team)
- 🗺️ Maps - [mapbox](https://mapbox.com)
- 🌐 Multi-language - [next-intl](https://next-intl.dev)
- 🔗 API Layer - [tRPC](https://trpc.io)
- 🧹 Formatter and Linter - [Biome](https://biomejs.dev)
- 🪝 Git hooks - [Lefthook](https://lefthook.dev)
- 📊 Traffic Analysis - [Umami](https://umami.is) &  [@vercel/analytics](https://vercel.com/docs/analytics/quickstart?package-manager=bun)

## 👥 Contributors

<!-- readme: collaborators,contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/sun0225SUN">
                    <img src="https://avatars.githubusercontent.com/u/79169717?v=4" width="100;" alt="sun0225SUN"/>
                    <br />
                    <sub><b>Guoqi Sun</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->

## 🍭 Community

- [Telegram](https://t.me/guoqisun)

## 💡 Inspired Projects

- [running_page](https://github.com/yihong0618/running_page)

## 🚀 Getting Started

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sun0225SUN/camlife)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sun0225SUN/camlife)

> [!warning]
> Please ensure that all necessary environment variables are correctly configured before running the project.

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
> Variables marked with `*` are required only when `STORAGE_PROVIDER` is set to `cloudflare-r2`. For other storage providers (AWS S3, Vercel Blob), different environment variables will be required.

<details>
<summary><strong>Strava</strong></summary>

https://stravalib.readthedocs.io/en/latest/get-started/authenticate-with-strava.html

</details>


## 💻  Local development

1. Clone the repository

```bash
git clone https://github.com/sun0225SUN/cyc-earth.git

cd camlife
```

2. Create a .env file in the root directory, and configure the environment variables as described in the [🚀 Getting Started](#-getting-started) section.

3. Install dependencies

```bash
bun install
```

4. Set up the database

```bash
bun db:push
```

5. Start the development server

```bash
bun run dev
```

Open: `http://localhost:3000` to see your application.

## 📝 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## 💖 Sponsors

If you find this project helpful, please give it a ⭐️ on GitHub!

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

## 📊 Repository Status

![Alt](https://repobeats.axiom.co/api/embed/5bf76cc50e06bd4f528bff6e897c9aebf53bd931.svg "Repobeats analytics image")

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=sun0225SUN/cyc-earth&type=Date)](https://github.com/sun0225SUN/cyc-earth)