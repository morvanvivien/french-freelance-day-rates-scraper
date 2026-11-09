// Minimal example: run the french-freelance-day-rates Actor and print the results.
// Usage: APIFY_TOKEN=... node run.js   (Node 18 or later, npm install apify-client)
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first.');
    process.exit(1);
}

const client = new ApifyClient({ token });

const input = {
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
};

const run = await client.actor('bibian/french-freelance-day-rates').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} results`);
for (const item of items) {
    console.log(`${item.skill} | ${item.city} | median ${item.tjmMedian ?? '-'} EUR/day | P25 ${item.tjmP25 ?? '-'} | P75 ${item.tjmP75 ?? '-'} | remote ${item.remoteShare ?? '-'}`);
}
