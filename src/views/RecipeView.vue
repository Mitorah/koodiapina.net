<template>
    <el-header @click="toggleCard" class="recipe-header">
        <div v-if="preparationTime" class="recipe-prep-time">
            {{ preparationTime }}
        </div>
        <span class="recipe-title">{{ recipeTitle }}</span>
        <div class="recipe-buttons">
            <el-button 
                @click.stop="toggleShoppingList"
                :loading="shoppingListLoading"
                circle
                :type="isInShoppingList ? 'success' : 'default'"
            >
                <el-icon v-if="!shoppingListLoading">
                    <ShoppingCartFull v-if="isInShoppingList" />
                    <ShoppingCart v-else />
                </el-icon>
            </el-button>
            <el-button 
                v-if="!isHidden"
                @click.stop="toggleFavorite"
                @mousedown.stop="startLongPress"
                @mouseup.stop="cancelLongPress"
                @mouseleave="cancelLongPress"
                @touchstart.stop.passive="startLongPress"
                @touchmove.stop.passive="cancelLongPress"
                @touchend.stop.passive="cancelLongPress"
                @touchcancel.stop.passive="cancelLongPress"
                :loading="favoriteLoading || hiddenLoading"
                circle
                :type="isFavorite ? 'warning' : 'default'"
            >
                <el-icon v-if="!favoriteLoading && !hiddenLoading">
                    <StarFilled v-if="isFavorite" />
                    <Star v-else />
                </el-icon>
            </el-button>
            <el-button 
                v-else
                @click.stop="toggleHidden"
                :loading="hiddenLoading"
                circle
                type="info"
            >
                <el-icon v-if="!hiddenLoading">
                    <View />
                </el-icon>
            </el-button>
        </div>
    </el-header>
    <div v-if="showCardState">
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
import { addFavorite, removeFavorite, addToShoppingList, removeFromShoppingList, addHidden, removeHidden } from '../utils/api.js';
import { Star, StarFilled, ShoppingCart, ShoppingCartFull, Hide, View } from '@element-plus/icons-vue';

export default {
    name: 'Recipe view',
    components: {
        Star,
        StarFilled,
        ShoppingCart,
        ShoppingCartFull,
        Hide,
        View
    },
    emits: ['favorite-added', 'favorite-removed', 'shopping-list-added', 'shopping-list-removed', 'hidden-added', 'hidden-removed'],
    props: {
    recipe: {
      type: Object,
      required: true
    },
    recipe_title: {
      type: String,
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    isInShoppingList: {
      type: Boolean,
      default: false
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    currentProfileGuid: {
      type: String,
      default: null
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    showCard: {
      type: Boolean,
      default: true
    }
  },
    data() {
        return {
            cardExpanded: this.isExpanded,
            favoriteLoading: false,
            shoppingListLoading: false,
            hiddenLoading: false,
            longPressTimer: null,
            longPressTriggered: false,
            wakeLock: null
        };
    },
    mounted() {
        // Initialize local state from prop
        this.cardExpanded = this.isExpanded;
        // Request wake lock when recipe is expanded by default
        if (this.isExpanded && this.showCard) {
            this.requestWakeLock();
        }
    },
    beforeUnmount() {
        // Release wake lock when component is destroyed
        this.releaseWakeLock();
    },
    methods: {
        toggleCard() {
            // If isExpanded is true, don't allow toggling
            if (!this.isExpanded) {
                this.cardExpanded = !this.cardExpanded;
                
                // Request wake lock when expanding, release when collapsing
                if (this.cardExpanded) {
                    this.requestWakeLock();
                } else {
                    this.releaseWakeLock();
                }
            }
        },
        async requestWakeLock() {
            try {
                if ('wakeLock' in navigator) {
                    this.wakeLock = await navigator.wakeLock.request('screen');
                    
                    // Re-acquire wake lock when page becomes visible again
                    document.addEventListener('visibilitychange', async () => {
                        if (this.wakeLock !== null && document.visibilityState === 'visible' && this.cardExpanded) {
                            this.wakeLock = await navigator.wakeLock.request('screen');
                        }
                    });
                }
            } catch (err) {
                // Wake lock request failed - not critical, just continue
                console.log('Wake lock request failed:', err);
            }
        },
        releaseWakeLock() {
            if (this.wakeLock !== null) {
                this.wakeLock.release()
                    .then(() => {
                        this.wakeLock = null;
                    });
            }
        },
        startLongPress(event) {
            this.longPressTriggered = false;
            // Clear any existing timer
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
            }
            this.longPressTimer = setTimeout(() => {
                this.longPressTriggered = true;
                this.toggleHidden();
            }, 500); // 500ms for long press
        },
        cancelLongPress() {
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        },
        async toggleFavorite() {
            // Don't toggle favorite if long press was triggered
            if (this.longPressTriggered) {
                this.longPressTriggered = false;
                return;
            }

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
                this.$message.error('Ostoslistan päivitys epäonnistui');
            } finally {
                this.shoppingListLoading = false;
            }
        },
        async toggleHidden() {
            if (!this.currentProfileGuid) {
                this.$message.error('Profiilia ei valittu');
                return;
            }

            this.hiddenLoading = true;
            try {
                if (this.isHidden) {
                    await removeHidden(this.currentProfileGuid, this.recipe.recipe_guid);
                    this.$emit('hidden-removed', this.recipe.recipe_guid);
                    this.$message.success('Resepti näytetään taas');
                } else {
                    // Remove from favorites if it's a favorite
                    if (this.isFavorite) {
                        await removeFavorite(this.currentProfileGuid, this.recipe.recipe_guid);
                        this.$emit('favorite-removed', this.recipe.recipe_guid);
                    }
                    await addHidden(this.currentProfileGuid, this.recipe.recipe_guid);
                    this.$emit('hidden-added', this.recipe.recipe_guid);
                    this.$message.success('Resepti piilotettu');
                }
            } catch (error) {
                this.$message.error('Piilotuksen päivitys epäonnistui');
            } finally {
                this.hiddenLoading = false;
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
                    ? `${hours}:00`
                    : `${hours}:${mins.toString().padStart(2, '0')}`;
            }
            return `${minutes}`;
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
        showCardState() {
            return this.showCard && this.cardExpanded;
        }
    }

};
</script>