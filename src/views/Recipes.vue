<template>
    <el-container>
        <el-card v-for="recipe in recipes" :key="recipe.recipe_guid">
            <RecipeView 
                :recipe="recipe" 
                :recipe_title="recipe.title"
                :isFavorite="favoriteRecipeGuids.includes(recipe.recipe_guid)"
                :isInShoppingList="shoppingListRecipeGuids.includes(recipe.recipe_guid)"
                :isHidden="false"
                :currentProfileGuid="currentProfileGuid"
                @favorite-added="handleFavoriteAdded"
                @favorite-removed="handleFavoriteRemoved"
                @shopping-list-added="handleShoppingListAdded"
                @shopping-list-removed="handleShoppingListRemoved"
                @hidden-added="handleHiddenAdded"
            />
        </el-card>
        <el-footer>
            <el-pagination
                :current-page="page"
                :page-size="limit"
                :total="total"
                @current-change="handlePageChange"
                layout="prev, pager, next"
            />
        </el-footer>
    </el-container>
</template>

<script>
import RecipeView from './RecipeView.vue';
import { fetchRecipes as fetchRecipesApi, fetchFavorites, fetchShoppingList } from '../utils/api.js';

export default {
  name: 'Recipes',
  components: {
    RecipeView
  },
  props: {
    currentProfileGuid: String,
    searchQuery: String
  },
  data() {
    return {
      recipes: [],
      page: 1,
      limit: 20,
      total: 0,
      loading: false,
      favoriteRecipeGuids: [],
      shoppingListRecipeGuids: [],
      activeSearchQuery: ''
    };
  },
  computed: {
    title() {
      return 'Recipes';
    }
  },
  watch: {
    currentProfileGuid: {
      immediate: true,
      handler(newProfileGuid) {
        if (newProfileGuid) {
          this.fetchFavoritesList();
          this.fetchShoppingListItems();
          this.fetchRecipes(this.page);
        }
      }
    },
    searchQuery(newQuery) {
      if (newQuery && newQuery.trim()) {
        this.activeSearchQuery = newQuery.trim();
        this.page = 1;
        this.fetchRecipes(1);
      } else if (this.activeSearchQuery && !newQuery) {
        this.activeSearchQuery = '';
        this.page = 1;
        this.fetchRecipes(1);
      }
    }
  },
  methods: {
    async fetchRecipes(page = 1) {
      this.loading = true;
      try {
        const data = await fetchRecipesApi(page, this.limit, this.activeSearchQuery, this.currentProfileGuid);
        this.recipes = data.recipes || [];
        this.page = data.page;
        this.limit = data.limit;
        this.total = data.total;
      } catch (err) {
        // Failed to fetch recipes
      } finally {
        this.loading = false;
      }
    },
    async fetchFavoritesList() {
      if (!this.currentProfileGuid) return;
      
      try {
        const data = await fetchFavorites(this.currentProfileGuid);
        this.favoriteRecipeGuids = (data.favorites || []).map(f => f.recipe_guid);
      } catch (err) {
        // Failed to fetch favorites
      }
    },
    async fetchShoppingListItems() {
      if (!this.currentProfileGuid) return;
      
      try {
        const data = await fetchShoppingList(this.currentProfileGuid);
        this.shoppingListRecipeGuids = (data.shopping_list || []).map(item => item.recipe_guid);
      } catch (err) {
        // Failed to fetch shopping list
      }
    },
    handlePageChange(newPage) {
      this.fetchRecipes(newPage);
    },
    handleFavoriteAdded(recipeGuid) {
      if (!this.favoriteRecipeGuids.includes(recipeGuid)) {
        this.favoriteRecipeGuids.push(recipeGuid);
      }
    },
    handleFavoriteRemoved(recipeGuid) {
      this.favoriteRecipeGuids = this.favoriteRecipeGuids.filter(guid => guid !== recipeGuid);
    },
    handleShoppingListAdded(recipeGuid) {
      if (!this.shoppingListRecipeGuids.includes(recipeGuid)) {
        this.shoppingListRecipeGuids.push(recipeGuid);
      }
    },
    handleShoppingListRemoved(recipeGuid) {
      this.shoppingListRecipeGuids = this.shoppingListRecipeGuids.filter(guid => guid !== recipeGuid);
    },
    handleHiddenAdded(recipeGuid) {
      // Remove recipe from current view when hidden
      this.recipes = this.recipes.filter(recipe => recipe.recipe_guid !== recipeGuid);
      // Refetch to maintain page size
      this.fetchRecipes(this.page);
    }
  }
};
</script>

<style>
@import '../styles/styles.css';
</style>