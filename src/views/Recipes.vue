<template>
    <el-container>
        <el-card v-for="recipe in recipes" :key="recipe.recipe_guid">
            <RecipeView 
                :recipe="recipe" 
                :recipe_title="recipe.title"
                :isFavorite="favoriteRecipeGuids.includes(recipe.recipe_guid)"
                :isInShoppingList="shoppingListRecipeGuids.includes(recipe.recipe_guid)"
                :currentProfileGuid="currentProfileGuid"
                @favorite-added="handleFavoriteAdded"
                @favorite-removed="handleFavoriteRemoved"
                @shopping-list-added="handleShoppingListAdded"
                @shopping-list-removed="handleShoppingListRemoved"
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
    currentProfileGuid: String
  },
  data() {
    return {
      recipes: [],
      page: 1,
      limit: 20,
      total: 0,
      loading: false,
      favoriteRecipeGuids: [],
      shoppingListRecipeGuids: []
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
        }
      }
    }
  },
  methods: {
    async fetchRecipes(page = 1) {
      this.loading = true;
      try {
        const data = await fetchRecipesApi(page, this.limit);
        this.recipes = data.recipes || [];
        this.page = data.page;
        this.limit = data.limit;
        this.total = data.total;
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
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
        console.error('Failed to fetch favorites:', err);
      }
    },
    async fetchShoppingListItems() {
      if (!this.currentProfileGuid) return;
      
      try {
        const data = await fetchShoppingList(this.currentProfileGuid);
        this.shoppingListRecipeGuids = (data.shopping_list || []).map(item => item.recipe_guid);
      } catch (err) {
        console.error('Failed to fetch shopping list:', err);
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
    }
  },
  mounted() {
    this.fetchRecipes(this.page);
  }
};
</script>

<style>
@import '../styles/styles.css';
</style>