import json

# Load the API response
with open('week_config_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract all recipes arrays from items

# Extract only 'id' and 'title' from each recipe

parsed_recipes = []
seen_titles = set()
for item in data.get('items', []):
    for recipe in item.get('recipes', []):
        title = recipe.get('title')
        if title and title not in seen_titles:
            parsed_recipes.append({
                'id': recipe.get('id'),
                'title': title
            })
            seen_titles.add(title)

# Save parsed recipes to a file
with open('all_recipes.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_recipes, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(parsed_recipes)} recipes to all_recipes.json")
