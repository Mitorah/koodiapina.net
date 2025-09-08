import subprocess
import sys
import os
import json

BEARER_TOKEN = os.environ.get("BEARER_TOKEN")
if not BEARER_TOKEN:
    print("Error: BEARER_TOKEN environment variable not set.")
    sys.exit(1)

API_URL = "https://api.ruokaboksi.fi/api/week-configurations/FIN?country=FI&language=fi&date={date}&includeIngredients=false"

def main():
    from datetime import date as dtdate
    date = dtdate.today().isoformat()
    url = API_URL.format(date=date)

    # Fetch data
    raw_file = f"week_config_raw_{date}.json"
    curl_cmd = [
        "curl", "-s", "-H", f"Authorization: Bearer {BEARER_TOKEN}", url, "-o", raw_file
    ]
    subprocess.run(curl_cmd, check=True)

    # Deduplicate recipes by title from JSON
    with open(raw_file, "r") as f:
        data = json.load(f)
    items = data.get("items", [])
    seen_titles = set()
    unique_recipes = []
    for recipe in items:
        title = recipe.get("title")
        if title and title not in seen_titles:
            unique_recipes.append(recipe)
            seen_titles.add(title)
    deduped_file = f"week_config_deduped_{date}.json"
    with open(deduped_file, "w") as f:
        json.dump({"items": unique_recipes}, f, ensure_ascii=False, indent=2)

    # Add line breaks before every '{'
    formatted_file = f"week_config_{date}.json"
    sed_cmd = ["sed", "s/{/\\n{/g", raw_file]
    with open(formatted_file, "w") as out:
        subprocess.run(sed_cmd, stdout=out, check=True)

    # Extract lines with 'title'
    titles_file = f"week_config_titles_{date}.txt"
    grep_title_cmd = ["grep", "title", formatted_file]
    with open(titles_file, "w") as out:
        subprocess.run(grep_title_cmd, stdout=out, check=True)

    # Extract lines with 'description'
    descriptions_file = f"week_config_descriptions_{date}.txt"
    grep_desc_cmd = ["grep", "description", formatted_file]
    with open(descriptions_file, "w") as out:
        subprocess.run(grep_desc_cmd, stdout=out, check=True)

    # Remove lines with 'sku' from descriptions
    nosku_file = f"week_config_descriptions_nosku_{date}.txt"
    grep_nosku_cmd = ["grep", "-v", "sku", descriptions_file]
    with open(nosku_file, "w") as out:
        subprocess.run(grep_nosku_cmd, stdout=out, check=True)

    print(f"Done! Files created:\n- {formatted_file}\n- {deduped_file}\n- {titles_file}\n- {descriptions_file}\n- {nosku_file}")

if __name__ == "__main__":
    main()
