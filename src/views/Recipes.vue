<template>
    <el-container>
        <el-card 
            v-for="recipe in recipes" 
            :key="recipe.recipe_guid"
            @mousedown="startLongPress(recipe)"
            @mouseup="cancelLongPress"
            @mouseleave="cancelLongPress"
            @touchstart.passive="handleTouchStart(recipe, $event)"
            @touchmove.passive="handleTouchMove"
            @touchend.passive="cancelLongPress"
            @touchcancel.passive="cancelLongPress"
        >
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
                @touchstart.passive="handleDialogTouchStart"
                @touchmove.passive="handleDialogTouchMove"
                @touchend.passive="cancelDialogLongPress"
                @touchcancel.passive="cancelDialogLongPress"
                @contextmenu.prevent
                style="user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;"
            >
                <RecipeView 
                    v-if="selectedRecipe"
                    :recipe="selectedRecipe" 
                    :recipe_title="selectedRecipe.title"
                    :isFavorite="favoriteRecipeGuids.includes(selectedRecipe.recipe_guid)"
                    :isInShoppingList="shoppingListRecipeGuids.includes(selectedRecipe.recipe_guid)"
                    :isHidden="false"
                    :currentProfileGuid="currentProfileGuid"
                    :isExpanded="true"
                    @favorite-added="handleFavoriteAdded"
                    @favorite-removed="handleFavoriteRemoved"
                    @shopping-list-added="handleShoppingListAdded"
                    @shopping-list-removed="handleShoppingListRemoved"
                    @hidden-added="handleHiddenAdded"
                />
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import RecipeView from './RecipeView.vue';
import { fetchRecipes as fetchRecipesApi, fetchFavorites, fetchShoppingList } from '../utils/api.js';
import { config } from '../config.js';

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
      activeSearchQuery: '',
      showCookingDialog: false,
      selectedRecipe: null,
      longPressTimer: null,
      dialogLongPressTimer: null,
      touchStartX: 0,
      touchStartY: 0,
      dialogTouchStartX: 0,
      dialogTouchStartY: 0
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
        // Always fetch recipes, even without a profile
        this.fetchRecipes(this.page);
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
  mounted() {
    window.scrollTo(0, 0);
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
      window.scrollTo(0, 0);
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
      this.$emit('shopping-list-updated');
    },
    handleShoppingListRemoved(recipeGuid) {
      this.shoppingListRecipeGuids = this.shoppingListRecipeGuids.filter(guid => guid !== recipeGuid);
      this.$emit('shopping-list-updated');
    },
    handleHiddenAdded(recipeGuid) {
      // Close cooking dialog if the hidden recipe is currently shown
      if (this.selectedRecipe && this.selectedRecipe.recipe_guid === recipeGuid) {
        this.showCookingDialog = false;
        this.selectedRecipe = null;
      }
      // Remove recipe from current view when hidden
      this.recipes = this.recipes.filter(recipe => recipe.recipe_guid !== recipeGuid);
      // Refetch to maintain page size
      this.fetchRecipes(this.page);
    },
    handleTouchStart(recipe, event) {
      const touch = event.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.startLongPress(recipe);
    },
    handleTouchMove(event) {
      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStartX);
      const deltaY = Math.abs(touch.clientY - this.touchStartY);
      
      // Cancel long press if moved more than 10px
      if (deltaX > 10 || deltaY > 10) {
        this.cancelLongPress();
      }
    },
    startLongPress(recipe) {
      this.longPressTimer = setTimeout(() => {
        this.selectedRecipe = recipe;
        this.showCookingDialog = true;
        this.$message({ message: 'Vihje: Paina pitkään sulkeaksesi', type: 'info', duration: config.message.duration });
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
    handleDialogTouchStart(event) {
      const touch = event.touches[0];
      this.dialogTouchStartX = touch.clientX;
      this.dialogTouchStartY = touch.clientY;
      this.startDialogLongPress();
    },
    handleDialogTouchMove(event) {
      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - this.dialogTouchStartX);
      const deltaY = Math.abs(touch.clientY - this.dialogTouchStartY);
      
      // Cancel long press if moved more than 10px
      if (deltaX > 10 || deltaY > 10) {
        this.cancelDialogLongPress();
      }
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