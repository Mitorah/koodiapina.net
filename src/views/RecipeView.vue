<template>
    <el-header @click="showCard = !showCard">
            {{ recipeTitle }}
    </el-header>
    <el-card v-if="showCard">
        <el-card>
            {{ingredients}}
        </el-card>
        <el-card>
            {{pantryItems}}
        </el-card>
        <el-card>
            {{steps}}
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
    computed: {
        recipeTitle() {
            return this.recipe_title ?? 'foo'
        },
        ingredients() {
            let ingredients = ""
            
            this.recipe.ingredientLists.forEach(element => {
                ingredients += element.title + "\n"
                
                element.ingredients.forEach(ingredient => {
                    ingredients += '- ' + (ingredient.amount ?? '') + ' ' + ingredient.title +'\n'
                });
            });
            
            return ingredients
        },
        pantryItems() {
            let pantryItems = ""
            
            this.recipe.pantryItems.forEach(ingredient => {
                pantryItems += '- ' + ingredient.title +'\n'
            });
            
            return pantryItems;
        },
        steps() {
            let steps = ""

            this.recipe.steps.forEach(step => {
                step.children.forEach(child => {
                    steps += '- ' + child.text + '\n'
                });
            });
            
            return steps
        },
    }

};
</script>

<style scoped>

</style>