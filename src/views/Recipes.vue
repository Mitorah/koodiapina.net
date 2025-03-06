<template>
    <el-container>
        <el-header>
            {{ title }}
        </el-header>
        <el-card v-for="(recipe, index) in dummy_recipes" :key="index">
            <RecipeView :recipe="recipe" :recipe_title="recipe.title"/>
        </el-card>
    </el-container>
</template>

<script>
import RecipeView from './RecipeView.vue';
import json_dummy_data from '../test_data/recipe_test_json.json'

export default {
    name: 'Recipes',
    components: {
        RecipeView
    },
    data() {
        return {
        };
    },
    computed: {
        title() {
            return 'Recipes';
        },
        dummy_recipes() {
            let recipes = []
            
            for (let i = 0; i < 10; i++) {
                var foo = this.dummy_data()
                foo.title = 'Recipe title'
                recipes.push(foo)
            }
            return recipes
        },
    },
    methods: {
        dummy_data() {
            return Object(json_dummy_data)
        }
    },

};
</script>

<style>
@import '../styles/styles.css';
</style>