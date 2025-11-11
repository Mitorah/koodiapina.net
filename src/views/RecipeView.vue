<template>
    <el-header @click="showCard = !showCard" style="position: relative; display: flex; justify-content: center; align-items: center; cursor: pointer;">
        <span style="flex: 1; text-align: center;">{{ recipeTitle }}</span>
        <div style="position: absolute; right: 10px; display: flex; gap: 8px;">
            <el-button 
                @click.stop="toggleShoppingList"
                :loading="shoppingListLoading"
                circle
                :type="isInShoppingList ? 'success' : 'default'"
                size="small"
            >
                <el-icon>
                    <ShoppingCartFull v-if="isInShoppingList" />
                    <ShoppingCart v-else />
                </el-icon>
            </el-button>
            <el-button 
                @click.stop="toggleFavorite"
                :loading="favoriteLoading"
                circle
                :type="isFavorite ? 'warning' : 'default'"
                size="small"
            >
                <el-icon>
                    <StarFilled v-if="isFavorite" />
                    <Star v-else />
                </el-icon>
            </el-button>
        </div>
    </el-header>
    <div v-if="showCard">
        <el-card>
            <div v-if="ingredients.length">
                <b>Ainekset:</b>
                <div v-for="(groupIngredients, group) in groupedIngredients" :key="group" class="ingredient-group">
                    <div class="ingredient-group-title">{{ group.replace(/:$/, '') }}:</div>
                    <div v-for="(ingredient, idx) in groupIngredients" :key="idx" class="ingredient-item">
                        {{ ingredient.amount }}{{ ingredient.amount ? ' ' : '' }}{{ ingredient.title }}
                    </div>
                </div>
            </div>
            <div v-else>
                Ei aineksia.
            </div>
        </el-card>
        <el-card>
            <div v-if="pantryItems.length">
                <b>Omat ainesosat:</b>
                <ul>
                    <li v-for="(item, idx) in pantryItems" :key="idx">
                        {{ item.amount }} {{ item.title }}
                    </li>
                </ul>
            </div>
            <div v-else>
                Ei omia ainesosia.
            </div>
        </el-card>
        <el-card>
            <div v-if="steps.length">
                <b>Ohjeet:</b>
                <span v-if="preparationTime"> (Valmistusaika: {{ preparationTime }})</span>
                <ol>
                    <li v-for="(step, idx) in steps" :key="idx">
                        {{ step.text }}
                    </li>
                </ol>
            </div>
            <div v-else>
                Ei ohjeita.
            </div>
        </el-card>
    </div>
</template>

<script>
import { addFavorite, removeFavorite, addToShoppingList, removeFromShoppingList } from '../utils/api.js';
import { Star, StarFilled, ShoppingCart, ShoppingCartFull } from '@element-plus/icons-vue';

export default {
    name: 'Recipe view',
    components: {
        Star,
        StarFilled,
        ShoppingCart,
        ShoppingCartFull
    },
    emits: ['favorite-added', 'favorite-removed', 'shopping-list-added', 'shopping-list-removed'],
    props: {
        recipe: {
            type: Object,
            required: true
        },
        recipe_title: {
            type: String,
            required: false,
            default: ''
        },
        isFavorite: {
            type: Boolean,
            default: false
        },
        isInShoppingList: {
            type: Boolean,
            default: false
        },
        currentProfileGuid: {
            type: String,
            required: false,
            default: null
        }
    },
    data() {
        return {
            showCard: false,
            favoriteLoading: false,
            shoppingListLoading: false
        };
    },
    methods: {
        async toggleFavorite() {
            if (!this.currentProfileGuid) {
                this.$message.error('Profiilia ei valittu');
                return;
            }

            this.favoriteLoading = true;
            try {
                if (this.isFavorite) {
                    await removeFavorite(this.currentProfileGuid, this.recipe.recipe_guid);
                    this.$emit('favorite-removed', this.recipe.recipe_guid);
                    this.$message.success('Poistettu suosikeista');
                } else {
                    await addFavorite(this.currentProfileGuid, this.recipe.recipe_guid);
                    this.$emit('favorite-added', this.recipe.recipe_guid);
                    this.$message.success('Lisätty suosikkeihin');
                }
            } catch (error) {
                console.error('Failed to toggle favorite:', error);
                this.$message.error('Suosikin päivitys epäonnistui');
            } finally {
                this.favoriteLoading = false;
            }
        },
        async toggleShoppingList() {
            if (!this.currentProfileGuid) {
                this.$message.error('Profiilia ei valittu');
                return;
            }

            this.shoppingListLoading = true;
            try {
                if (this.isInShoppingList) {
                    await removeFromShoppingList(this.currentProfileGuid, this.recipe.recipe_guid);
                    this.$emit('shopping-list-removed', this.recipe.recipe_guid);
                    this.$message.success('Poistettu ostoslistalta');
                } else {
                    await addToShoppingList(this.currentProfileGuid, this.recipe.recipe_guid);
                    this.$emit('shopping-list-added', this.recipe.recipe_guid);
                    this.$message.success('Lisätty ostoslistalle');
                }
            } catch (error) {
                console.error('Failed to toggle shopping list:', error);
                this.$message.error('Ostoslistan päivitys epäonnistui');
            } finally {
                this.shoppingListLoading = false;
            }
        }
    },
    computed: {
        preparationTime() {
            const prep = this.recipe?.details?.preparationTime ?? '';
            const minutes = typeof prep === 'string' ? parseInt(prep) : prep;
            if (!minutes || isNaN(minutes)) return prep;
            if (minutes >= 60) {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return mins === 0
                    ? `${hours} h`
                    : `${hours} h ${mins} min`;
            }
            return `${minutes} min`;
        },
        recipeTitle() {
            return this.recipe_title ?? 'foo'
        },
        ingredients() {
            if (!this.recipe || !this.recipe.instructions || !this.recipe.instructions.ingredientLists) return [];
            const parsed = [];
            this.recipe.instructions.ingredientLists.forEach(list => {
                list.ingredients.forEach(ingredient => {
                    parsed.push({
                        group: list.title,
                        amount: ingredient.amount ?? '',
                        title: ingredient.title,
                        isDeliverable: ingredient.isDeliverable ?? false,
                        productInformation: ingredient.productInformation ?? null
                    });
                });
            });
            return parsed;
        },
        pantryItems() {
            if (!this.recipe || !this.recipe.instructions || !this.recipe.instructions.pantryItems) return [];
            return this.recipe.instructions.pantryItems.map(ingredient => ({
                title: ingredient.title,
                amount: ingredient.amount ?? '',
                isDeliverable: ingredient.isDeliverable ?? false,
                productInformation: ingredient.productInformation ?? null
            }));
        },
        steps() {
            if (!this.recipe || !this.recipe.instructions || !this.recipe.instructions.steps) return [];
            const parsed = [];
            this.recipe.instructions.steps.forEach(step => {
                if (step.children && Array.isArray(step.children)) {
                    step.children.forEach(child => {
                        parsed.push({
                            group: step.title ?? '',
                            text: child.text ?? ''
                        });
                    });
                }
            });
            return parsed;
        },
        groupedIngredients() {
            // Group ingredients by their 'group' field
            const groups = {};
            this.ingredients.forEach(ingredient => {
                const group = ingredient.group || 'Other';
                if (!groups[group]) groups[group] = [];
                groups[group].push(ingredient);
            });
            return groups;
        },
    }

};
</script>