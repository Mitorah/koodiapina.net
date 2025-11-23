<template>
    <el-container>
        <div v-if="!currentProfileGuid" style="padding: 20px; text-align: center;">
            <p>Valitse profiili nähdäksesi ostoslistan</p>
        </div>
        <div v-else-if="loading" style="padding: 20px; text-align: center;">
            <el-icon class="is-loading"><Loading /></el-icon>
            <p>Ladataan ostoslistaa...</p>
        </div>
        <div v-else-if="shoppingListRecipes.length === 0" style="padding: 20px; text-align: center;">
            <p>Ostoslista on tyhjä</p>
        </div>
        <div v-else>
            <!-- My Recipes Section -->
            <el-card style="margin-bottom: 20px;" :body-style="recipesExpanded ? {} : { padding: '0' }">
                <template #header>
                    <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" @click="recipesExpanded = !recipesExpanded">
                        <span><strong>Reseptit ostoslistassa ({{ shoppingListRecipes.length }})</strong></span>
                        <el-icon :class="{ 'rotate-icon': recipesExpanded }">
                            <ArrowDown />
                        </el-icon>
                    </div>
                </template>
                
                <el-collapse-transition>
                    <div v-show="recipesExpanded">
                        <div 
                            v-for="recipe in shoppingListRecipes" 
                            :key="recipe.recipe_guid" 
                            class="recipe-link-item"
                        >
                            <span @click="openRecipeDialog(recipe)" style="flex: 1; cursor: pointer;">{{ recipe.title }}</span>
                            <el-button 
                                type="danger" 
                                size="small"
                                @click.stop="removeRecipe(recipe.recipe_guid)"
                                circle
                            >
                                <el-icon><Close /></el-icon>
                            </el-button>
                        </div>
                    </div>
                </el-collapse-transition>
            </el-card>

            <!-- Aggregated ingredients -->
            <el-card style="margin-bottom: 20px;">
                <template #header>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span><strong>Ainesosat</strong></span>
                    </div>
                </template>
                
                <div v-for="(ingredient, index) in sortedIngredients" :key="index" class="ingredient-item" :class="{ 'checked': ingredient.checked }" @click="toggleIngredient(ingredient)">
                    <div>
                        <span v-if="ingredient.totalAmount">
                            <strong>{{ ingredient.totalAmount }}</strong> {{ ingredient.title }}
                        </span>
                        <span v-else>
                            {{ ingredient.title }}
                            <span v-if="ingredient.recipes.length > 1" style="color: #909399; font-size: 13px;">
                                ({{ ingredient.recipes.length }} reseptissä)
                            </span>
                        </span>
                    </div>
                    <div v-if="ingredient.recipes.length > 1 || !ingredient.totalAmount" style="margin-left: 20px; margin-top: 3px; color: #909399; font-size: 13px;">
                        <div v-for="(source, idx) in ingredient.recipes" :key="idx">
                          → {{ source.recipeName }}<span v-if="source.amount">: {{ source.amount }}</span>
                        </div>
                    </div>
                </div>
            </el-card>

            <!-- Pantry items -->
            <el-card v-if="aggregatedPantryItems.length > 0" style="margin-bottom: 20px;">
                <template #header>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span><strong>Omat ainesosat</strong></span>
                    </div>
                </template>
                
                <div v-for="(item, index) in sortedPantryItems" :key="index" class="ingredient-item" :class="{ 'checked': item.checked }" @click="togglePantryItem(item)">
                    <div>
                        <span v-if="item.totalAmount">
                            <strong>{{ item.totalAmount }}</strong> {{ item.title }}
                        </span>
                        <span v-else>
                            {{ item.title }}
                            <span v-if="item.recipes.length > 1" style="color: #909399; font-size: 13px;">
                                ({{ item.recipes.length }} reseptissä)
                            </span>
                        </span>
                    </div>
                    <div v-if="item.recipes.length > 1 || !item.totalAmount" style="margin-left: 20px; margin-top: 3px; color: #909399; font-size: 13px;">
                        <div v-for="(source, idx) in item.recipes" :key="idx">
                          → {{ source.recipeName }}<span v-if="source.amount">: {{ source.amount }}</span>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- Cooking View Dialog -->
        <el-dialog 
            v-model="showRecipeDialog" 
            width="90%"
            style="max-width: 800px;"
            top="2vh"
        >
            <template #header>
                <span style="font-weight: bold;">{{ selectedRecipe?.title }}</span>
            </template>
            <div
                @touchstart.passive="startDialogLongPress"
                @touchend.passive="cancelDialogLongPress"
                @touchcancel.passive="cancelDialogLongPress"
                @contextmenu.prevent
            >
                <RecipeView 
                    v-if="selectedRecipe"
                    :recipe="selectedRecipe" 
                    :recipe_title="selectedRecipe.title"
                    :isFavorite="isFavorite(selectedRecipe.recipe_guid)"
                    :isInShoppingList="true"
                    :isHidden="false"
                    :currentProfileGuid="currentProfileGuid"
                    :isExpanded="true"
                    @favorite-added="handleFavoriteAdded"
                    @favorite-removed="handleFavoriteRemoved"
                    @shopping-list-removed="handleShoppingListRemoved"
                />
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import { fetchShoppingList, removeFromShoppingList, fetchRecipes, fetchFavorites } from '../utils/api.js';
import { parseAmountWithUnit, getUnitForm } from '../utils/units.js';
import { Loading, ArrowRight, ArrowDown, Close } from '@element-plus/icons-vue';
import RecipeView from './RecipeView.vue';

export default {
  name: 'ShoppingList',
  components: {
    Loading,
    ArrowRight,
    ArrowDown,
    Close,
    RecipeView
  },
  props: {
    currentProfileGuid: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      shoppingListRecipes: [],
      aggregatedIngredients: [],
      aggregatedPantryItems: [],
      loading: false,
      checkedIngredients: new Set(),
      checkedPantryItems: new Set(),
      recipesExpanded: false,
      showRecipeDialog: false,
      selectedRecipe: null,
      favoriteRecipeGuids: [],
      dialogLongPressTimer: null
    };
  },
  computed: {
    sortedIngredients() {
      // Sort: unchecked items first, then checked items
      return [...this.aggregatedIngredients].sort((a, b) => {
        if (a.checked === b.checked) return 0;
        return a.checked ? 1 : -1;
      });
    },
    sortedPantryItems() {
      // Sort: unchecked items first, then checked items
      return [...this.aggregatedPantryItems].sort((a, b) => {
        if (a.checked === b.checked) return 0;
        return a.checked ? 1 : -1;
      });
    },
    storageKey() {
      return `shoppingList_${this.currentProfileGuid}`;
    }
  },
  mounted() {
    this.loadCheckedState();
  },
  watch: {
    currentProfileGuid: {
      immediate: true,
      handler(newProfileGuid) {
        if (newProfileGuid) {
          this.loadCheckedState();
          this.loadShoppingList();
          this.loadFavorites();
        } else {
          this.shoppingListRecipes = [];
          this.aggregatedIngredients = [];
          this.aggregatedPantryItems = [];
          this.checkedIngredients = new Set();
          this.checkedPantryItems = new Set();
        }
      }
    }
  },
  methods: {
    async loadShoppingList() {
      if (!this.currentProfileGuid) return;
      
      this.loading = true;
      try {
        // Fetch shopping list recipe GUIDs
        const shoppingListData = await fetchShoppingList(this.currentProfileGuid);
        const recipeGuids = (shoppingListData.shopping_list || []).map(item => item.recipe_guid);
        
        if (recipeGuids.length === 0) {
          this.shoppingListRecipes = [];
          this.aggregatedIngredients = [];
          this.aggregatedPantryItems = [];
          return;
        }

        // Fetch all recipes
        const recipesData = await fetchRecipes(1, 1000);
        this.shoppingListRecipes = recipesData.recipes.filter(recipe => 
          recipeGuids.includes(recipe.recipe_guid)
        );

        // Aggregate pantry items first, then ingredients (excluding pantry items)
        this.aggregatePantryItems();
        this.aggregateIngredients();
        
        // Clean up checked items that are no longer in the shopping list
        this.cleanupCheckedState();
      } catch (err) {
        this.$message.error('Ostoslistan lataus epäonnistui');
      } finally {
        this.loading = false;
      }
    },
    
    aggregateIngredients() {
      const ingredientMap = new Map();
      
      // Get all pantry item names to exclude them from ingredients
      const pantryItemNames = new Set();
      this.shoppingListRecipes.forEach(recipe => {
        if (recipe.instructions && recipe.instructions.pantryItems) {
          recipe.instructions.pantryItems.forEach(item => {
            pantryItemNames.add(item.title.toLowerCase().trim());
          });
        }
      });

      this.shoppingListRecipes.forEach(recipe => {
        if (!recipe.instructions || !recipe.instructions.ingredientLists) return;

        recipe.instructions.ingredientLists.forEach(list => {
          list.ingredients.forEach(ingredient => {
            let title = ingredient.title.toLowerCase().trim();
            let amount = ingredient.amount?.trim() || '';
            
            // If amount is empty but title contains amount info, extract it
            if (!amount) {
              const parsed = parseAmountWithUnit(title);
              if (parsed && parsed.unit) {
                // Extract the ingredient name without the amount
                amount = `${parsed.value} ${parsed.unit}`;
                // Remove the amount from the title to get clean ingredient name
                title = title.replace(/^[\d,./-]+\s*[a-zåäö]*\s*/i, '').trim();
              }
            }
            
            // Skip if this is a pantry item
            if (pantryItemNames.has(title)) {
              return;
            }

            if (!ingredientMap.has(title)) {
              ingredientMap.set(title, {
                title: title.charAt(0).toUpperCase() + title.slice(1), // Capitalize first letter
                amounts: [],
                recipes: [],
                expanded: false
              });
            }

            const entry = ingredientMap.get(title);
            entry.amounts.push(amount);
            
            // Parse the amount to get just the quantity + unit for display
            const parsed = parseAmountWithUnit(amount);
            const displayAmount = parsed ? `${parsed.value} ${parsed.unit}` : (amount || '');
            
            entry.recipes.push({
              recipeName: recipe.title,
              amount: displayAmount
            });
          });
        });
      });

      // Process aggregated ingredients
      this.aggregatedIngredients = Array.from(ingredientMap.values()).map(item => {
        const combined = this.combineAmounts(item.amounts);
        return {
          title: item.title,
          totalAmount: combined,
          recipes: item.recipes,
          expanded: false,
          checked: this.checkedIngredients.has(item.title.toLowerCase())
        };
      });
    },

    aggregatePantryItems() {
      const pantryMap = new Map();

      this.shoppingListRecipes.forEach(recipe => {
        if (!recipe.instructions || !recipe.instructions.pantryItems) return;

        recipe.instructions.pantryItems.forEach(item => {
          const title = item.title.toLowerCase().trim();
          const amount = item.amount?.trim() || '';

          if (!pantryMap.has(title)) {
            pantryMap.set(title, {
              title: item.title,
              amounts: [],
              recipes: [],
              expanded: false
            });
          }

          const entry = pantryMap.get(title);
          entry.amounts.push(amount);
          
          // Parse the amount to get just the quantity + unit for display
          const parsed = parseAmountWithUnit(amount);
          const displayAmount = parsed ? `${parsed.value} ${parsed.unit}` : amount;
          
          entry.recipes.push({
            recipeName: recipe.title,
            amount: displayAmount
          });
        });
      });

      // Process aggregated pantry items
      this.aggregatedPantryItems = Array.from(pantryMap.values()).map(item => {
        const combined = this.combineAmounts(item.amounts);
        return {
          title: item.title,
          totalAmount: combined,
          recipes: item.recipes,
          expanded: false,
          checked: this.checkedPantryItems.has(item.title.toLowerCase())
        };
      });
    },

    combineAmounts(amounts) {
      const unitMap = new Map();
      
      // Check if any amounts are empty/null
      const hasEmptyAmounts = amounts.some(a => !a || a.trim() === '');
      if (hasEmptyAmounts) {
        return '';
      }
      
      amounts.forEach(amount => {
        if (!amount) return;
        
        // Use the unit parser to check if this has a recognized unit
        const parsed = parseAmountWithUnit(amount);
        
        if (parsed && parsed.unit) {
          // Successfully parsed - combine amounts with same unit
          const unit = parsed.unit.toLowerCase();
          
          if (!unitMap.has(unit)) {
            unitMap.set(unit, 0);
          }
          unitMap.set(unit, unitMap.get(unit) + parsed.value);
        } else {
          // No recognized unit - keep as separate entry
          if (!unitMap.has(amount)) {
            unitMap.set(amount, 1);
          } else {
            unitMap.set(amount, unitMap.get(amount) + 1);
          }
        }
      });

      // Format results
      const results = [];
      unitMap.forEach((value, key) => {
        // Check if key is a number - means it was parsed with a unit
        if (typeof value === 'number' && !isNaN(value) && !key.match(/^[\d,./-]/)) {
          // This is a combined unit amount (e.g., "300 g" from "100 g" + "200 g")
          // Get the appropriate form (singular/plural) based on the amount
          const correctForm = getUnitForm(key, value);
          results.push(`${value} ${correctForm}`);
        } else if (value > 1) {
          // Multiple occurrences of unparseable amount
          results.push(`${value}× ${key}`);
        } else {
          // Single occurrence
          results.push(key);
        }
      });

      // If we have multiple different amounts that couldn't be combined,
      // return empty string so the breakdown is shown instead
      if (results.length > 1) {
        return '';
      }
      
      return results[0] || '';
    },

    async removeRecipe(recipeGuid) {
      try {
        await removeFromShoppingList(this.currentProfileGuid, recipeGuid);
        this.$message.success('Resepti poistettu ostoslistalta');
        this.loadShoppingList();
      } catch (err) {
        this.$message.error('Poisto epäonnistui');
      }
    },

    toggleIngredient(ingredient) {
      ingredient.checked = !ingredient.checked;
      const key = ingredient.title.toLowerCase();
      
      if (ingredient.checked) {
        this.checkedIngredients.add(key);
      } else {
        this.checkedIngredients.delete(key);
      }
      
      this.saveCheckedState();
    },

    togglePantryItem(item) {
      item.checked = !item.checked;
      const key = item.title.toLowerCase();
      
      if (item.checked) {
        this.checkedPantryItems.add(key);
      } else {
        this.checkedPantryItems.delete(key);
      }
      
      this.saveCheckedState();
    },

    loadCheckedState() {
      if (!this.currentProfileGuid) return;
      
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const data = JSON.parse(stored);
          this.checkedIngredients = new Set(data.ingredients || []);
          this.checkedPantryItems = new Set(data.pantryItems || []);
        }
      } catch (err) {
        // Failed to load checked state from localStorage
      }
    },

    saveCheckedState() {
      if (!this.currentProfileGuid) return;
      
      try {
        const data = {
          ingredients: Array.from(this.checkedIngredients),
          pantryItems: Array.from(this.checkedPantryItems)
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (err) {
        // Failed to save checked state to localStorage
      }
    },

    cleanupCheckedState() {
      // Get current ingredient titles
      const currentIngredients = new Set(
        this.aggregatedIngredients.map(item => item.title.toLowerCase())
      );
      const currentPantryItems = new Set(
        this.aggregatedPantryItems.map(item => item.title.toLowerCase())
      );
      
      // Remove checked items that are no longer in the shopping list
      let changed = false;
      
      for (const key of this.checkedIngredients) {
        if (!currentIngredients.has(key)) {
          this.checkedIngredients.delete(key);
          changed = true;
        }
      }
      
      for (const key of this.checkedPantryItems) {
        if (!currentPantryItems.has(key)) {
          this.checkedPantryItems.delete(key);
          changed = true;
        }
      }
      
      // Save if anything was removed
      if (changed) {
        this.saveCheckedState();
      }
    },

    openRecipeDialog(recipe) {
      this.selectedRecipe = recipe;
      this.showRecipeDialog = true;
      this.$message.info('Vihje: Paina pitkään sulkeaksesi');
    },

    startDialogLongPress() {
      this.dialogLongPressTimer = setTimeout(() => {
        this.showRecipeDialog = false;
      }, 500); // 500ms long press to close
    },

    cancelDialogLongPress() {
      if (this.dialogLongPressTimer) {
        clearTimeout(this.dialogLongPressTimer);
        this.dialogLongPressTimer = null;
      }
    },

    async loadFavorites() {
      if (!this.currentProfileGuid) return;
      
      try {
        const data = await fetchFavorites(this.currentProfileGuid);
        this.favoriteRecipeGuids = (data.favorites || []).map(f => f.recipe_guid);
      } catch (err) {
        // Failed to fetch favorites
      }
    },

    isFavorite(recipeGuid) {
      return this.favoriteRecipeGuids.includes(recipeGuid);
    },

    handleFavoriteAdded(recipeGuid) {
      if (!this.favoriteRecipeGuids.includes(recipeGuid)) {
        this.favoriteRecipeGuids.push(recipeGuid);
      }
    },

    handleFavoriteRemoved(recipeGuid) {
      this.favoriteRecipeGuids = this.favoriteRecipeGuids.filter(guid => guid !== recipeGuid);
    },

    handleShoppingListRemoved(recipeGuid) {
      this.showRecipeDialog = false;
      this.selectedRecipe = null;
      this.loadShoppingList();
    },

    openRecipe(recipeGuid) {
      this.$emit('open-recipe', recipeGuid);
    }
  }
};
</script>

<style scoped>
.ingredient-item {
  padding: 6px 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.ingredient-item:hover {
  opacity: 0.7;
}

.ingredient-item.checked {
  text-decoration: line-through;
  opacity: 0.5;
}

.recipe-link-item {
  padding: 12px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
}

.recipe-link-item span:hover {
  opacity: 0.7;
}

.recipe-link-item:last-child {
  margin-bottom: 0;
}

.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
</style>
