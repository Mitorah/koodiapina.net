<template>
    <el-container>
        <el-card v-for="recipe in recipes" :key="recipe.recipe_guid">
            <RecipeView :recipe="recipe" :recipe_title="recipe.title" />
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
    </el-container>
</template>

<script>
import RecipeView from './RecipeView.vue';
import { fetchRecipes as fetchRecipesApi } from '../utils/api.js';

export default {
  name: 'Recipes',
  components: {
    RecipeView
  },
  data() {
    return {
      recipes: [],
      page: 1,
      limit: 20,
      total: 0,
      loading: false
    };
  },
  computed: {
    title() {
      return 'Recipes';
    }
  },
  methods: {
    async fetchRecipes(page = 1) {
      this.loading = true;
      try {
        const data = await fetchRecipesApi(page, this.limit);
        this.recipes = data.recipes || [];
        this.page = data.page;
        this.limit = data.limit;
        this.total = data.total;
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
      } finally {
        this.loading = false;
      }
    },
    handlePageChange(newPage) {
      this.fetchRecipes(newPage);
    }
  },
  mounted() {
    this.fetchRecipes(this.page);
  }
};
</script>

<style>
@import '../styles/styles.css';
</style>