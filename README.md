# How to Get French Freelance Day Rates (TJM) by Skill and City

> **Run it now, no code: [french-freelance-day-rates on the Apify Store](https://apify.com/bibian/french-freelance-day-rates)** &nbsp;|&nbsp; $0.05 per result row &nbsp;|&nbsp; no browser, no proxy

Free-Work is the main French board for IT jobs and freelance missions (around 10,000 live postings), but it has no public export and no official API for third parties, and reading thousands of postings yourself to compute a median day rate is slow. This Actor does that computation for you: give it a list of skills (and optionally cities), it reads the current Free-Work freelance missions for each one and returns the median, quartiles, remote share and top hiring companies, recomputed on every run.

Searches this page answers: french freelance day rate, TJM freelance France, IT freelance rate by city, free-work TJM scraper.

## What you get

- One row per skill x city (plus a France-wide row per skill), with the median, 25th and 75th percentile, min, max and average day rate in EUR.
- The share of matching missions that are remote (full or partial) and the average mission length.
- `topCompanies`: up to 5 companies and ESN/staffing firms posting the most missions for that skill x city — companies only, never a person's name.
- Optional sample mission URLs behind the numbers, so you can check them against real postings.

Export the dataset as JSON, CSV or Excel, or read it through the Apify API. A real sample (five rows) is in [`sample-output.json`](sample-output.json). This Actor only ever outputs aggregates (medians, quartiles, company names) — no individual's name is read or stored anywhere.

## Input

| Field | What it does |
|---|---|
| `skills` | One Free-Work search per skill, for example `python` or `data engineer`. Required. |
| `cities` | One row per skill x city, matched on the posting's location label or postal code. Leave empty to get only a France-wide row per skill (a France-wide row is always included either way). |
| `publishedWithinDays` | Only analyze missions published in the last N days. Default 30. |
| `maxPostingsPerSkill` | Cost guard: caps how many Free-Work missions are read to compute each skill's rates. Default 300. |
| `includeSamples` | Add up to 5 source mission URLs to each row. Default true. |
| `maxItems` | The run stops once this many skill x city rows are saved. Default 200. |

Example input:

```json
{
  "skills": [
    "python",
    "react"
  ],
  "cities": [
    "Paris",
    "Lyon"
  ],
  "publishedWithinDays": 30,
  "maxPostingsPerSkill": 300,
  "includeSamples": true,
  "maxItems": 50
}
```

## Output fields

One row per skill x city (plus one France-wide row per skill), computed from the freelance missions found for that skill:

| Field | What it is |
|---|---|
| `skill`, `city`, `periodDays` | What this row covers: the searched skill, the city (`"France"` for the whole country) and the lookback window in days |
| `postingsAnalyzed`, `postingsWithRate` | How many missions matched this skill x city, and how many of those actually publish a day rate |
| `tjmMin`, `tjmP25`, `tjmMedian`, `tjmP75`, `tjmMax`, `tjmAvg` | Day rate statistics in EUR/day, `null` when no missions in this row publish one |
| `remoteShare` | Share (0 to 1) of matching missions that are full or partial remote |
| `avgDurationMonths` | Average mission length in months, `null` when unknown |
| `topCompanies` | Up to 5 companies (including ESN/staffing firms) posting the most missions for this row — companies only, never an individual's name |
| `sampleUrls` | Up to 5 Free-Work mission URLs behind this row's numbers (only when `includeSamples` is on) |
| `computedAt` | When this row was computed, ISO 8601 |

Three real rows from the same run:

| Skill | City | Postings w/ rate | Median | P25 | P75 | Remote share |
|---|---|---|---|---|---|---|
| python | Paris | 69 of 108 | €500/day | €450/day | €550/day | 70% |
| python | Lyon | 4 of 7 | €423/day | €415/day | €431/day | 86% |
| python | France | 204 of 300 | €475/day | €425/day | €530/day | 78% |

## Why this one

- **A ready answer, not a pile of postings.** The leading alternative on the Store sells the same underlying Free-Work data at $100 per 1,000 rows; this one computes the medians and quartiles directly, at $0.05 per result row.
- **Recomputed every run.** There is no stale snapshot: each run reads the current Free-Work freelance missions for your skills before aggregating, so the numbers track the market as it moves.
- **Still want the raw postings?** [Free-Work Jobs & Freelance Missions Scraper](https://apify.com/bibian/free-work-jobs-scraper) returns every individual mission this actor aggregates over.

## Use cases

- **Price a freelance contract.** Compare your day rate to the live median, 25th and 75th percentile for your skill and city before a negotiation.
- **Benchmark a city.** Paris vs. Lyon vs. the rest of France for the same skill, side by side.
- **Watch a market move.** Schedule it weekly and track how a skill's median TJM shifts over time.
- **Spot who is hiring freelancers.** `topCompanies` names the firms and ESN posting the most missions for a skill, without opening a single job page.

## Quickstart

### 1. Apify console, no code

1. Open [the Actor page](https://apify.com/bibian/french-freelance-day-rates) and click **Try for free** (a free Apify account is enough).
2. Fill in the input form (skills, cities and the maximum number of rows) and click **Start**.
3. When the run finishes, open the **Output** tab, check the table, then **Export** as CSV, Excel or JSON.
4. For a weekly watch, open **Schedules**, create a schedule for the Actor and, optionally, add an integration that sends the rows to Slack, e-mail or Google Sheets.

### 2. Apify API with JavaScript

```bash
npm install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
node examples/run.js
```

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('bibian/french-freelance-day-rates').call({
    "skills": [
        "python"
    ],
    "cities": [
        "Paris",
        "Lyon"
    ],
    "publishedWithinDays": 30,
    "maxPostingsPerSkill": 300,
    "includeSamples": true,
    "maxItems": 50
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const item of items) {
    console.log(`${item.skill} | ${item.city} | median ${item.tjmMedian ?? '-'} EUR/day | remote ${item.remoteShare ?? '-'}`);
}
```

The complete file is [`examples/run.js`](examples/run.js) (ES module, Node 18 or later). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

### 3. Apify API with Python

```bash
pip install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
python examples/run.py
```

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("bibian/french-freelance-day-rates").call(run_input={
    "skills": ["python"],
    "cities": ["Paris", "Lyon"],
    "publishedWithinDays": 30,
    "maxPostingsPerSkill": 300,
    "includeSamples": True,
    "maxItems": 50,
})

for item in client.dataset(run.default_dataset_id).iterate_items():
    print(f"{item['skill']} | {item['city']} | median {item.get('tjmMedian')} EUR/day | remote {item.get('remoteShare')}")
```

The complete file is [`examples/run.py`](examples/run.py). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

### 4. Plain REST call (no SDK)

```bash
curl -X POST "https://api.apify.com/v2/acts/bibian~french-freelance-day-rates/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "content-type: application/json" \
  -d '{"skills": ["python"], "cities": ["Paris", "Lyon"], "publishedWithinDays": 30, "maxItems": 50}'
```

The response is the JSON array of rows, with the same fields as above. `$APIFY_TOKEN` is read from the shell environment, never written in the command itself.

## Pricing

Pay per result: **$0.05 per result row** ("Day-rate row" event), plus any small platform start fee shown on the Store page. You pay only for the rows saved to the dataset. Apify's free plan includes monthly credits, enough to try it on a handful of skill x city combinations. Prices are those shown on the [Store page](https://apify.com/bibian/french-freelance-day-rates) when this guide was written; the Store page is the reference.

## Limits and honest notes

- Only what Free-Work publishes is used. Many freelance missions do not show a daily rate, so a row's rate fields reflect only the missions that do (`postingsWithRate` out of `postingsAnalyzed`).
- A row is still returned for a skill x city with zero matching missions (`postingsAnalyzed: 0`, rate fields `null`): you see the combination has no current data instead of a missing row.
- `topCompanies` only ever lists companies (including staffing firms and ESN): no recruiter or candidate name is read or stored anywhere in this actor.
- Only freelance missions count toward the rates: permanent (CDI), fixed-term and other contract types are excluded before any rate is computed.
- This is an unofficial tool, not affiliated with Free-Work. Check the site terms and the data protection rules that apply to your use.

## FAQ

**Does it need a browser or a proxy?**
No. The Actor reads the data directly, so runs are fast and cheap.

**Can I track a skill's TJM over time?**
Yes. Schedule the Actor weekly and compare `tjmMedian` across runs for the same skill and city.

**Can I get the data in Excel or Google Sheets?**
Yes. Export the dataset as CSV, Excel or JSON from the Apify console, or connect the Apify Google Sheets integration.

**Does the output contain any personal data?**
No. Every row is an aggregate (counts, medians, quartiles, company names); no individual's name is read or stored.

## Try it

**[Open french-freelance-day-rates on the Apify Store](https://apify.com/bibian/french-freelance-day-rates)**

The code in `examples/` is released under the MIT license (see [LICENSE](LICENSE)). The data belongs to its original publishers.
