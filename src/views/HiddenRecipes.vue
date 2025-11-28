<template>
    <el-container>
        <div v-if="!currentProfileGuid" style="padding: 20px; text-align: center;">
            <p>Valitse profiili nähdäksesi piilotetut reseptit</p>
        </div>
        <div v-else-if="loading" style="padding: 20px; text-align: center;">
            <el-icon class="is-loading"><Loading /></el-icon>
            <p>Ladataan piilotettuja reseptejä...</p>
        </div>
        <div v-else-if="hiddenRecipes.length === 0" style="padding: 20px; text-align: center;">
            <p>Ei piilotettuja reseptejä</p>
            <p style="color: #909399; font-size: 14px; margin-top: 10px;">
                Piilota reseptejä pitämällä suosikki-nappia pohjassa reseptienäkymässä
            </p>
        </div>
        <div v-else>
            <div style="padding: 15px; background-color: #f0f9ff; border-left: 4px solid #409EFF; margin-bottom: 15px; text-align: center;">
                <p style="margin: 0; color: #606266; font-size: 14px;">
                    Piilota reseptejä pitämällä suosikki-nappia pohjassa reseptienäkymässä. Palauta näkyviin klikkaamalla silmä-kuvaketta.
                </p>
            </div>
        </div>
        <el-card v-for="recipe in hiddenRecipes" :key="recipe.recipe_guid">
            <RecipeView 
                :recipe="recipe" 
                :recipe_title="recipe.title"
                :isFavorite="favoriteRecipeGuids.includes(recipe.recipe_guid)"
                :isInShoppingList="shoppingListRecipeGuids.includes(recipe.recipe_guid)"
                :isHidden="true"
                :currentProfileGuid="currentProfileGuid"
                @favorite-added="handleFavoriteAdded"
                @favorite-removed="handleFavoriteRemoved"
                @shopping-list-added="handleShoppingListAdded"
                @shopping-list-removed="handleShoppingListRemoved"
                @hidden-removed="handleHiddenRemoved"
            />
        </el-card>
    </el-container>
</template>

<script>
import RecipeView from './RecipeView.vue';
import { fetchHidden, fetchFavorites, fetchShoppingList } from '../utils/api.js';
import { Loading } from '@element-plus/icons-vue';
import { config } from '../config.js';

export default {
  name: 'HiddenRecipes',
  components: {
    RecipeView,
    Loading
  },
  props: {
    currentProfileGuid: String
  },
  data() {
    return {
      hiddenRecipes: [],
      favoriteRecipeGuids: [],
      shoppingListRecipeGuids: [],
      loading: false
    };
  },
  watch: {
    currentProfileGuid: {
      immediate: true,
      handler(newProfileGuid) {
        if (newProfileGuid) {
          this.loadHiddenRecipes();
          this.fetchFavoritesList();
          this.fetchShoppingListItems();
        } else {
          this.hiddenRecipes = [];
          this.favoriteRecipeGuids = [];
          this.shoppingListRecipeGuids = [];
        }
      }
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    async loadHiddenRecipes() {
      if (!this.currentProfileGuid) return;
      
      this.loading = true;
      try {
        // Fetch hidden recipes with full recipe details from API
        const hiddenData = await fetchHidden(this.currentProfileGuid);
        
        // The API now returns full recipe objects
        this.hiddenRecipes = (hiddenData.hidden || []).map(item => ({
          recipe_guid: item.recipe_guid,
          title: item.title,
          added_date: item.added_date,
          details: item.details,
          instructions: item.instructions
        }));
      } catch (err) {
        this.$message({ message: 'Piilotettujen reseptien lataus epäonnistui', type: 'error', duration: config.message.duration });
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
    handleHiddenRemoved(recipeGuid) {
      this.hiddenRecipes = this.hiddenRecipes.filter(recipe => recipe.recipe_guid !== recipeGuid);
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
  }
};
</script>

<style>
@import '../styles/styles.css';
</style>
