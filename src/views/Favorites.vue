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
        <el-card v-else v-for="recipe in favoriteRecipes" :key="recipe.recipe_guid">
            <RecipeView 
                :recipe="recipe" 
                :recipe_title="recipe.title"
                :isFavorite="true"
                :currentProfileGuid="currentProfileGuid"
                @favorite-removed="handleFavoriteRemoved"
            />
        </el-card>
    </el-container>
</template>

<script>
import RecipeView from './RecipeView.vue';
import { fetchFavorites, fetchRecipes } from '../utils/api.js';
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
      loading: false
    };
  },
  watch: {
    currentProfileGuid: {
      immediate: true,
      handler(newProfileGuid) {
        if (newProfileGuid) {
          this.loadFavorites();
        } else {
          this.favoriteRecipes = [];
        }
      }
    }
  },
  methods: {
    async loadFavorites() {
      if (!this.currentProfileGuid) return;
      
      this.loading = true;
      try {
        // Fetch favorite recipe GUIDs
        const favoritesData = await fetchFavorites(this.currentProfileGuid);
        const favoriteGuids = (favoritesData.favorites || []).map(f => f.recipe_guid);
        
        if (favoriteGuids.length === 0) {
          this.favoriteRecipes = [];
          return;
        }

        // Fetch all recipes and filter favorites
        // Note: This is a simple approach. For better performance, you might want
        // to add an API endpoint that returns favorite recipes directly
        const recipesData = await fetchRecipes(1, 1000); // Fetch a large number to get all
        this.favoriteRecipes = recipesData.recipes.filter(recipe => 
          favoriteGuids.includes(recipe.recipe_guid)
        );
      } catch (err) {
        console.error('Failed to load favorites:', err);
        this.$message.error('Suosikkien lataus epäonnistui');
      } finally {
        this.loading = false;
      }
    },
    handleFavoriteRemoved(recipeGuid) {
      this.favoriteRecipes = this.favoriteRecipes.filter(recipe => recipe.recipe_guid !== recipeGuid);
    }
  }
};
</script>

<style>
@import '../styles/styles.css';
</style>
