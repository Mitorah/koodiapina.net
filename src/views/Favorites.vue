<template>
    <el-container>
        <div v-if="!currentProfileGuid" style="padding: 20px; text-align: center;">
            <p>Valitse profiili nähdäksesi suosikit</p>
        </div>
        <div v-else-if="loading" style="padding: 20px; text-align: center;">
            <el-icon class="is-loading"><Loading /></el-icon>
            <p>Ladataan suosikkeja...</p>
        </div>
        <div v-else-if="favoriteRecipes.length === 0" style="padding: 20px; text-align: center;">
            <p>Ei suosikkeja vielä</p>
        </div>
        <el-card 
            v-else 
            v-for="recipe in favoriteRecipes" 
            :key="recipe.recipe_guid"
            @mousedown="startLongPress(recipe)"
            @mouseup="cancelLongPress"
            @mouseleave="cancelLongPress"
            @touchstart="startLongPress(recipe)"
            @touchend="cancelLongPress"
            @touchcancel="cancelLongPress"
        >
            <RecipeView 
                :recipe="recipe" 
                :recipe_title="recipe.title"
                :isFavorite="true"
                :isInShoppingList="shoppingListRecipeGuids.includes(recipe.recipe_guid)"
                :currentProfileGuid="currentProfileGuid"
                @favorite-removed="handleFavoriteRemoved"
                @shopping-list-added="handleShoppingListAdded"
                @shopping-list-removed="handleShoppingListRemoved"
            />
        </el-card>

        <!-- Cooking View Dialog -->
        <el-dialog 
            v-model="showCookingDialog" 
            width="90%"
            style="max-width: 800px;"
            top="2vh"
        >
            <template #header>
                <span style="font-weight: bold;">{{ selectedRecipe?.title }}</span>
            </template>
            <div
                @touchstart="startDialogLongPress"
                @touchend="cancelDialogLongPress"
                @touchcancel="cancelDialogLongPress"
                @contextmenu.prevent
            >
                <RecipeView 
                    v-if="selectedRecipe"
                    :recipe="selectedRecipe" 
                    :recipe_title="selectedRecipe.title"
                    :isFavorite="true"
                    :isInShoppingList="shoppingListRecipeGuids.includes(selectedRecipe.recipe_guid)"
                    :currentProfileGuid="currentProfileGuid"
                    :isExpanded="true"
                    @favorite-removed="handleFavoriteRemoved"
                    @shopping-list-added="handleShoppingListAdded"
                    @shopping-list-removed="handleShoppingListRemoved"
                />
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import RecipeView from './RecipeView.vue';
import { fetchFavorites, fetchShoppingList } from '../utils/api.js';
import { Loading } from '@element-plus/icons-vue';

export default {
  name: 'Favorites',
  components: {
    RecipeView,
    Loading
  },
  props: {
    currentProfileGuid: String
  },
  data() {
    return {
      favoriteRecipes: [],
      shoppingListRecipeGuids: [],
      loading: false,
      showCookingDialog: false,
      selectedRecipe: null,
      longPressTimer: null,
      dialogLongPressTimer: null
    }
  },
  watch: {
    currentProfileGuid: {
      immediate: true,
      handler(newProfileGuid) {
        if (newProfileGuid) {
          this.loadFavorites();
          this.fetchShoppingListItems();
        } else {
          this.favoriteRecipes = [];
          this.shoppingListRecipeGuids = [];
        }
      }
    }
  },
  methods: {
    async loadFavorites() {
      if (!this.currentProfileGuid) return;
      
      this.loading = true;
      try {
        // Fetch favorites with full recipe details from the API
        const favoritesData = await fetchFavorites(this.currentProfileGuid);
        
        // The API now returns full recipe objects, not just GUIDs
        this.favoriteRecipes = (favoritesData.favorites || []).map(fav => ({
          recipe_guid: fav.recipe_guid,
          title: fav.title,
          added_date: fav.added_date,
          details: fav.details,
          instructions: fav.instructions
        }));
      } catch (err) {
        this.$message.error('Suosikkien lataus epäonnistui');
      } finally {
        this.loading = false;
      }
    },
    handleFavoriteRemoved(recipeGuid) {
      this.favoriteRecipes = this.favoriteRecipes.filter(recipe => recipe.recipe_guid !== recipeGuid);
      this.showCookingDialog = false;
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
    handleShoppingListAdded(recipeGuid) {
      if (!this.shoppingListRecipeGuids.includes(recipeGuid)) {
        this.shoppingListRecipeGuids.push(recipeGuid);
      }
    },
    handleShoppingListRemoved(recipeGuid) {
      this.shoppingListRecipeGuids = this.shoppingListRecipeGuids.filter(guid => guid !== recipeGuid);
    },
    startLongPress(recipe) {
      this.longPressTimer = setTimeout(() => {
        this.selectedRecipe = recipe;
        this.showCookingDialog = true;
        this.$message.info('Vihje: Paina pitkään sulkeaksesi');
      }, 500); // 500ms long press
    },
    cancelLongPress() {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    },
    startDialogLongPress() {
      this.dialogLongPressTimer = setTimeout(() => {
        this.showCookingDialog = false;
      }, 500); // 500ms long press to close
    },
    cancelDialogLongPress() {
      if (this.dialogLongPressTimer) {
        clearTimeout(this.dialogLongPressTimer);
        this.dialogLongPressTimer = null;
      }
    }
  }
};
</script>

<style>
@import '../styles/styles.css';
</style>
