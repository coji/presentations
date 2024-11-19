---
theme: default
background: https://cover.sli.dev
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Video Ad Network
  Zero-cost implementation with Cloudflare x Hono x Remix
drawings:
  persist: false
title: Creating a Free Video Ad Network on the edge.
---

# Creating<br> a Free Video Ad Network<br> on the Edge

Cloudflare x Hono x Remix

Mizoguchi Coji

[@techtalkjp](https://x.com/techtalkjp)

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
Start <carbon:arrow-right class="inline"/>
  </span>
</div>

---

```yaml
layout: two-cols
```

# Motivation

<v-clicks>

- Solo media project: "Hyperlocal Tokyo"
  - https://tokyo.hyper-local.app/
  - Use it to find good places to go right now
  - Planning to continue for at least 10 years
  - Eventually want to create and sell ad slots myself
- But existing services...
  - Full of ugly ads
  - Only cater to large-scale media
  - Can't create custom formats
    - Even though I'm creating the media myself
- "Now, can I do it alone for free?"
  - It's almost a hobby. AI is available.
  - Let's create a video ad network from scratch
- Open source!

</v-clicks>

::right::

<img src="/images/hyperlocal-tokyo.png" alt="hyperlocal tokyo" />

---

```yaml
layout: default
```

# Architecture

<img src="/images/architecture.png" alt="architecture" >

---

```yaml
layout: default
```

# Features

<v-clicks>

- Zero cost
  - Up to 5 million impressions / month
  - Everything runs on the edge
- Everything is built with TypeScript
  - maintaining everything<br> alone
  - Start small and minimal
  - Rebuild if needed
- Multi-tenant support
  - Advertisers
  - Publishers

</v-clicks>

<img src="/images/architecture.png" alt="architecture"　className='absolute right-4 w-8/12 bottom-0'  >

---

```yaml
layout: two-cols
```

# Technologies Used

- Cloudflare
  - R2: Video storage
  - Workers: Ad server implementation (Hono)
    - VAST 4.1: Video ad standard
  - Workers: Management UI (Remix)
    - UI: shadcn/ui
    - Clerk: Authentication & multi-tenancy
- Turso: Edge distributed DB (distributed SQLite)

::right::

<div className='flex gap-4'>
  <img src="/images/logo_cloudflare.webp" className='bg-white p-4 rounded h-24' alt="cloudflare" />
  <img src="/images/logo_hono.webp" className='bg-white p-4 rounded h-24' alt="hono" />
</div>

<div className='flex gap-4'>
  <img src="/images/remix-glowing.png" className='h-32' alt="remix" />
  <img src="/images/logo-turso.png" className='h-16 mt-8' alt="turso" />
</div>

<div className='flex justify-between gap-4 items-center'>
  <div className='text-4xl'>Kysely</div>
  <div className='text-4xl'>shadcn/ui</div>
  <img src="/images/logo_clerk.jpeg" className='h-16' alt="clerk" />
</div>

---

```yaml
layout: two-cols
```

# Demo

1. [Ad server and JS SDK](https://ad-server.van.techtalk.jp/)
   - Video ad playback
   - Audio ad playback
   - Tracking
     - vast
     - impression
     - progress (0%, 25%, 50%, 75%, 100%)
     - click

2. [Management UI: For advertisers/publishers](https://ui.van.techtalk.jp/)
   - Multi-tenant authentication with Clerk
   - Delivery settings
   - Ad slot management
   - Check delivery performance

::right::

<img src="/images/demo_ui.png" alt="ui demo" className='-ml-8' >
<img src="/images/demo_ad.png" alt="ad demo" className="-mt-32 ml-8"/>

---

```yaml
layout: default
```

# Interesting Points of Implementation

Ad selection SQL that INNER JOINs vigorously 😂

```ts
 // Fetch ads matching category, media type, and companion banner sizes
 await db
  .selectFrom('ads')
  .innerJoin('companionBanners', 'companionBanners.adId', 'ads.id')
  .innerJoin('adGroups', 'adGroups.id', 'ads.adGroupId')
  .innerJoin('campaigns', 'campaigns.id', 'adGroups.campaignId')
  .innerJoin('advertisers', 'advertisers.id', 'campaigns.advertiserId')
  .where('campaigns.status', '==', 'ACTIVE')
  .where('ads.type', '==', mediaType)
  .where(
   'companionBanners.width',
   'in',
   companionSizes.map((s) => s.width),
  )
  .select([
   'ads.id',
   'ads.type',
   'ads.url',
   'ads.duration',
   'ads.width',
   'ads.height',
   'ads.mimeType',
   'ads.description',
   'adGroups.bidPriceCpm',
   'adGroups.frequencyCapImpressions',
   'adGroups.frequencyCapWindow',
   'adGroups.frequencyCapUnit',
   'advertisers.id as advertiserId',
   'campaigns.id as campaignId',
   'adGroups.id as adGroupId',
  ])
  .where('campaigns.status', '==', 'ACTIVE')
  .orderBy('adGroups.bidPriceCpm', 'desc')
  .execute()
```

---

```yaml
layout: default
```

# Future Plans

- Implement common features like "even distribution" and "front-loading" for campaign budget management.
- Properly create the UI for ad submission
  - It's a bit tedious, but I'll use comform.

- Need a dashboard and reports for the UI
  - Waiting for the merge of [DuckDB Wasm's OPFS support](https://github.com/duckdb/duckdb-wasm/pull/1856) by [@eiichi292929](https://x.com/eiichi292929). Please.

- Will maintain it steadily as OSS.
- It's MIT licensed, so feel free to use it.
  - If there's demand, adding paid features could be interesting.

Source code:
[github.com/coji/video-ad-network](https://github.com/coji/video-ad-network)

---

```yaml
layout: end
```

# Thank you

[@techtalkjp](https://x.com/techtalkjp)

<div className='flex justify-center'>
  <img src="/images/coji.jpg" className='rounded-full w-12' >
</div>

https://github.com/coji/video-ad-network
