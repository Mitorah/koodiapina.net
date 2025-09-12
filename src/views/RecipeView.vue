<template>
    <el-header @click="showCard = !showCard">
            {{ recipeTitle }}
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