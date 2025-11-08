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
            <!-- Aggregated ingredients -->
            <el-card style="margin-bottom: 20px;">
                <template #header>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span><strong>Ainesosat</strong></span>
                    </div>
                </template>
                
                <div v-for="(ingredient, index) in aggregatedIngredients" :key="index" class="ingredient-item">
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
                
                <div v-for="(item, index) in aggregatedPantryItems" :key="index" class="ingredient-item">
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

            <!-- Recipe cards -->
            <div style="margin-top: 20px;">
                <h3>Reseptit ostoslistalla:</h3>
                <el-card v-for="recipe in shoppingListRecipes" :key="recipe.recipe_guid" style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>{{ recipe.title }}</span>
                        <el-button 
                            type="danger" 
                            size="small"
                            @click="removeRecipe(recipe.recipe_guid)"
                        >
                            Poista
                        </el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </el-container>
</template>

<script>
import { fetchShoppingList, removeFromShoppingList, fetchRecipes } from '../utils/api.js';
import { parseAmountWithUnit } from '../utils/units.js';
import { Loading } from '@element-plus/icons-vue';

export default {
  name: 'ShoppingList',
  components: {
    Loading
  },
  props: {
    currentProfileGuid: String
  },
  data() {
    return {
      shoppingListRecipes: [],
      aggregatedIngredients: [],
      aggregatedPantryItems: [],
      loading: false
    };
  },
  watch: {
    currentProfileGuid: {
      immediate: true,
      handler(newProfileGuid) {
        if (newProfileGuid) {
          this.loadShoppingList();
        } else {
          this.shoppingListRecipes = [];
          this.aggregatedIngredients = [];
          this.aggregatedPantryItems = [];
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
      } catch (err) {
        console.error('Failed to load shopping list:', err);
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
            const title = ingredient.title.toLowerCase().trim();
            
            // Skip if this is a pantry item
            if (pantryItemNames.has(title)) {
              return;
            }
            
            const amount = ingredient.amount?.trim() || '';

            if (!ingredientMap.has(title)) {
              ingredientMap.set(title, {
                title: ingredient.title,
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
        console.log(`Ingredient: ${item.title}`);
        console.log(`Amounts to combine:`, item.amounts);
        console.log(`Recipes:`, item.recipes);
        const combined = this.combineAmounts(item.amounts);
        console.log(`Combined result: "${combined}"`);
        return {
          title: item.title,
          totalAmount: combined,
          recipes: item.recipes,
          expanded: false
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
          expanded: false
        };
      });
    },

    combineAmounts(amounts) {
      // Simple combination logic - parse amounts with same units
      const amountMap = new Map();
      const asIsAmounts = new Set(); // Track which entries were kept as-is
      
      console.log('combineAmounts input:', amounts);
      
      // Check if any amounts are empty/null - if so, don't try to combine
      const hasEmptyAmounts = amounts.some(a => !a || a.trim() === '');
      if (hasEmptyAmounts) {
        console.log('Has empty amounts, returning empty string to show breakdown');
        return '';
      }
      
      amounts.forEach(amount => {
        if (!amount) return;
        
        // Try to parse using the unit parser
        const parsed = parseAmountWithUnit(amount);
        console.log(`Parsing "${amount}":`, parsed);
        
        if (parsed && parsed.unit) {
          // Successfully parsed with a unit
          const unit = parsed.unit.toLowerCase();
          
          if (!amountMap.has(unit)) {
            amountMap.set(unit, 0);
          }
          amountMap.set(unit, amountMap.get(unit) + parsed.value);
          console.log(`  → Added to unit "${unit}", new total: ${amountMap.get(unit)}`);
        } else {
          // Can't parse, keep as-is
          const key = amount;
          if (!amountMap.has(key)) {
            amountMap.set(key, 1);
            asIsAmounts.add(key);
          } else {
            amountMap.set(key, amountMap.get(key) + 1);
          }
          console.log(`  → Kept as-is: "${key}"`);
        }
      });

      console.log('amountMap:', amountMap);

      // Format combined amounts
      const results = [];
      amountMap.forEach((value, unit) => {
        console.log(`Formatting: value=${value} (type: ${typeof value}), unit="${unit}", asIs=${asIsAmounts.has(unit)}`);
        
        // Check if this was stored as-is (not parsed with a unit)
        if (asIsAmounts.has(unit)) {
          // This is a raw amount that couldn't be parsed
          if (value > 1) {
            const formatted = `${value}× ${unit}`;
            console.log(`  → Formatted as multiple: "${formatted}"`);
            results.push(formatted);
          } else {
            console.log(`  → Using amount as-is: "${unit}"`);
            results.push(unit);
          }
        } else if (typeof value === 'number' && !isNaN(value)) {
          // It's a parsed numeric amount with unit
          // Add space between number and unit if unit contains letters
          if (unit.match(/[a-zåäö]/i)) {
            const formatted = `${value} ${unit}`;
            console.log(`  → Formatted with space: "${formatted}"`);
            results.push(formatted);
          } else {
            const formatted = `${value}${unit}`;
            console.log(`  → Formatted without space: "${formatted}"`);
            results.push(formatted);
          }
        }
      });

      console.log('results array:', results);

      // If we have multiple different units/amounts that couldn't be combined,
      // return empty string so the breakdown is shown instead
      if (results.length > 1) {
        console.log('Multiple results, returning empty string');
        return '';
      }
      
      const finalResult = results.join(', ') || '';
      console.log('Final result:', finalResult);
      return finalResult;
    },

    async removeRecipe(recipeGuid) {
      try {
        await removeFromShoppingList(this.currentProfileGuid, recipeGuid);
        this.$message.success('Resepti poistettu ostoslistalta');
        this.loadShoppingList();
      } catch (err) {
        console.error('Failed to remove from shopping list:', err);
        this.$message.error('Poisto epäonnistui');
      }
    }
  }
};
</script>

<style scoped>
.ingredient-item {
  padding: 6px 0;
}
</style>
