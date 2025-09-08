<template>
    <el-header @click="showCard = !showCard">
            {{ recipeTitle }}
    </el-header>
    <el-card v-if="showCard">
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
    </el-card>
</template>

<script>
export default {
    name: 'Recipe view',
    props: {
        recipe: Object,
        recipe_title: String
    },
    data() {
        return {
            showCard: false
        };
    },
    created() {
        // Parse details from JSON if needed
        if (this.recipe && typeof this.recipe.details === 'string') {
            try {
                this.recipe.details = JSON.parse(this.recipe.details);
            } catch (e) {
                // If parsing fails, leave as is
                console.error('Failed to parse recipe.details:', e);
            }
        }
    },
    computed: {
        recipeTitle() {
            return this.recipe_title ?? 'foo'
        },
        ingredients() {
            // Returns a parsed array of ingredient objects for all ingredient lists in details
            if (!this.recipe || !this.recipe.details || !this.recipe.details.ingredientLists) return [];
            const parsed = [];
            this.recipe.details.ingredientLists.forEach(list => {
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
                // Returns a parsed array of pantry item objects from details
                if (!this.recipe || !this.recipe.details || !this.recipe.details.pantryItems) return [];
                return this.recipe.details.pantryItems.map(ingredient => ({
                    title: ingredient.title,
                    amount: ingredient.amount ?? '',
                    isDeliverable: ingredient.isDeliverable ?? false,
                    productInformation: ingredient.productInformation ?? null
                }));
        },
        steps() {
                // Returns a parsed array of step objects from details
                if (!this.recipe || !this.recipe.details || !this.recipe.details.steps) return [];
                const parsed = [];
                this.recipe.details.steps.forEach(step => {
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