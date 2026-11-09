"""Minimal example: run the french-freelance-day-rates Actor and print the results.

Usage: APIFY_TOKEN=... python run.py   (pip install apify-client)
"""
import os
import sys

from apify_client import ApifyClient

token = os.environ.get("APIFY_TOKEN")
if not token:
    sys.exit("Set the APIFY_TOKEN environment variable first.")

client = ApifyClient(token)

run_input = {
    "skills": ["python"],
    "cities": ["Paris", "Lyon"],
    "publishedWithinDays": 30,
    "maxPostingsPerSkill": 300,
    "includeSamples": True,
    "maxItems": 50,
}

run = client.actor("bibian/french-freelance-day-rates").call(run_input=run_input)

count = 0
for item in client.dataset(run.default_dataset_id).iterate_items():
    count += 1
    print(f"{item['skill']} | {item['city']} | median {item.get('tjmMedian')} EUR/day | P25 {item.get('tjmP25')} | P75 {item.get('tjmP75')} | remote {item.get('remoteShare')}")
print(f"{count} results")
