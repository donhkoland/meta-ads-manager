# Meta Ads Manager

[Download the latest release](https://github.com/donhkoland/meta-ads-manager/releases/latest)

**From an existing post to a campaign you can review.**

An experimental local interface for choosing Facebook posts and preparing campaign settings in one place.

The server, interface, and creation flow are tested with mocked responses. Real access needs your own Meta app, permissions, and ad account. No credentials, account access, or Meta approval are included.

## Set up

Node.js 24 or later is recommended. From this folder:

```sh
npm install
```

Copy `.env.example` to `.env`. Add your `META_APP_ID` and `META_APP_SECRET` from [Meta Developers](https://developers.facebook.com/apps/) and generate your own `SESSION_SECRET`. Keep `.env` private; Git excludes it.

The configured local callback is:

```text
http://localhost:3000/auth/callback
```

It must match the login configuration Meta allows for your app. If your use case needs Facebook Login for Business or another login setup, adapt the OAuth flow before using it.

```sh
npm start
```

Open `http://localhost:3000`. On Windows, `Start.cmd` also starts the app after configuration.

## Prepare a campaign

Connect Facebook, select a Page and ad account, then choose an existing post. Set the objective, placements, budget, and schedule. Review the summary and save a paused campaign first so you can check it in Meta Ads Manager.

When you choose to publish, the components are created paused and activated at the end. A failed step can leave paused components in your account; inspect them before retrying. Activating a campaign can spend real money. Existing-post ads keep the original post's text, link, and call to action.

## Before using it for real

Meta's permissions, API versions, metrics, and publishing requirements can change. Some requested Page, advertising, or Instagram permissions may be unavailable to your app. Verify the integration with your account before committing a budget.

Tokens stay in the backend. Sessions are held in memory and are lost on restart. Fonts come from Google Fonts; animations are served from the locally installed GSAP package. There's no added Tools telemetry. This is a local app, not a public multiuser service.

## Checks

```sh
npm test
```

Meta responses are mocked. Tests don't use a real account or create ads.

---

Part of [Tools](https://github.com/donhkoland/Tools). If it saves you a step, **give @donhkoland a shout**. It's optional.
