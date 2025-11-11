# API Documentation

This document describes the REST API provided by the Cloudflare Worker at `workers/recipes_api/worker.js`.

## Base URLs

- **Production**: `https://koodiapina-net.leinonen-op.workers.dev`
- **Local Development**: `http://localhost:8787`

## Authentication

Currently, no authentication is required for most endpoints. Profile creation requires admin privileges (checked via `is_admin` flag in the database).

---

## Endpoints

### Recipes

#### List Recipes
```
GET /
```

Returns a paginated list of recipes.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Number of recipes per page

**Response:**
```json
{
  "recipes": [
    {
      "recipe_guid": "abc123...",
      "title": "Britakakku",
      "ingredientLists": [...],
      "steps": [...],
      "nutritionInfo": {...},
      "pantryItems": [...],
      "tips": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### Get Single Recipe
```
GET /{recipe_guid}
```

Returns a single recipe by its GUID.

**Parameters:**
- `recipe_guid` - The unique identifier for the recipe

**Response:**
```json
{
  "recipe_guid": "abc123...",
  "title": "Britakakku",
  "ingredientLists": [...],
  "steps": [...],
  "nutritionInfo": {...},
  "pantryItems": [...],
  "tips": [...]
}
```

**Error Response (404):**
```json
{
  "error": "Recipe not found"
}
```

---

### Profiles

#### List Profiles
```
GET /profiles
```

Returns a list of all user profiles.

**Response:**
```json
{
  "profiles": [
    {
      "profile_guid": "def456...",
      "username": "user1",
      "email": "user1@example.com",
      "display_name": "User One",
      "is_admin": 1,
      "is_active": 1,
      "created_at": "2025-01-01T12:00:00Z"
    }
  ]
}
```

#### Create Profile
```
POST /profiles
```

Creates a new user profile. Requires admin privileges.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "display_name": "New User",
  "is_admin": 0
}
```

**Response (201):**
```json
{
  "profile_guid": "xyz789...",
  "username": "newuser",
  "email": "newuser@example.com",
  "display_name": "New User",
  "is_admin": 0,
  "is_active": 1,
  "created_at": "2025-01-01T12:00:00Z"
}
```

**Error Response (403):**
```json
{
  "error": "Admin privileges required"
}
```

---

### Favorites

#### Get User Favorites
```
GET /favorites/{profile_guid}
```

Returns all favorite recipes for a specific user profile.

**Parameters:**
- `profile_guid` - The user's profile GUID

**Response:**
```json
{
  "favorites": [
    {
      "recipe_guid": "abc123...",
      "title": "Britakakku",
      "ingredientLists": [...],
      "steps": [...],
      "nutritionInfo": {...},
      "pantryItems": [...],
      "tips": [...],
      "added_at": "2025-01-01T12:00:00Z"
    }
  ]
}
```

#### Add to Favorites
```
POST /favorites
```

Adds a recipe to a user's favorites.

**Request Body:**
```json
{
  "profile_guid": "def456...",
  "recipe_guid": "abc123..."
}
```

**Response (201):**
```json
{
  "message": "Recipe added to favorites",
  "profile_guid": "def456...",
  "recipe_guid": "abc123..."
}
```

**Error Response (400):**
```json
{
  "error": "Recipe is already in favorites"
}
```

#### Remove from Favorites
```
DELETE /favorites/{profile_guid}/{recipe_guid}
```

Removes a recipe from a user's favorites.

**Parameters:**
- `profile_guid` - The user's profile GUID
- `recipe_guid` - The recipe GUID to remove

**Response (200):**
```json
{
  "message": "Recipe removed from favorites"
}
```

---

### Shopping List

#### Get Shopping List
```
GET /shopping-list/{profile_guid}
```

Returns all recipes in a user's shopping list.

**Parameters:**
- `profile_guid` - The user's profile GUID

**Response:**
```json
{
  "shopping_list": [
    {
      "recipe_guid": "abc123...",
      "title": "Britakakku",
      "ingredientLists": [...],
      "steps": [...],
      "nutritionInfo": {...},
      "pantryItems": [...],
      "tips": [...],
      "added_at": "2025-01-01T12:00:00Z"
    }
  ]
}
```

#### Add to Shopping List
```
POST /shopping-list
```

Adds a recipe to a user's shopping list.

**Request Body:**
```json
{
  "profile_guid": "def456...",
  "recipe_guid": "abc123..."
}
```

**Response (201):**
```json
{
  "message": "Recipe added to shopping list",
  "profile_guid": "def456...",
  "recipe_guid": "abc123..."
}
```

**Error Response (400):**
```json
{
  "error": "Recipe is already in shopping list"
}
```

#### Remove from Shopping List
```
DELETE /shopping-list/{profile_guid}/{recipe_guid}
```

Removes a recipe from a user's shopping list.

**Parameters:**
- `profile_guid` - The user's profile GUID
- `recipe_guid` - The recipe GUID to remove

**Response (200):**
```json
{
  "message": "Recipe removed from shopping list"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Description of what went wrong"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Error message"
}
```

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS):
- **Production**: Allows requests from `https://ruoka.koodiapina.net`
- **Local Development**: Allows requests from `http://localhost:5173` and `http://127.0.0.1:5173`

All successful responses include appropriate CORS headers.

---

## Data Models

### Recipe Object
```json
{
  "recipe_guid": "string",
  "title": "string",
  "ingredientLists": [
    {
      "title": "string",
      "ingredients": [
        {
          "amount": "string|null",
          "title": "string",
          "isDeliverable": "boolean",
          "productInformation": "object|null"
        }
      ]
    }
  ],
  "steps": [
    {
      "_type": "block",
      "children": [
        {
          "text": "string"
        }
      ]
    }
  ],
  "nutritionInfo": {
    "kcalTotal": "number",
    "kcalPer100g": "number",
    "proteinTotal": "number",
    "proteinPer100g": "number",
    "carbohydratesTotal": "number",
    "carbohydratesPer100g": "number",
    "fatTotal": "number",
    "fatPer100g": "number"
  },
  "pantryItems": [
    {
      "title": "string"
    }
  ],
  "tips": ["array"]
}
```

### Profile Object
```json
{
  "profile_guid": "string",
  "username": "string",
  "email": "string",
  "display_name": "string",
  "is_admin": "number (0 or 1)",
  "is_active": "number (0 or 1)",
  "created_at": "ISO 8601 datetime string"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. This may change in future versions.

---

## Versioning

This API is currently unversioned. Breaking changes will be documented in release notes.
