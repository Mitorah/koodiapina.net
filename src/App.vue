<template>
  <el-container class="app-container">
    <el-header>
      <el-row type="flex" align="middle" class="header-row">
        <el-button @click="onMenuClick" class="menu-button">
          <el-icon><Menu /></el-icon>
        </el-button>
        <span class="header-title">{{ currentHeader }}</span>
      </el-row>
    </el-header>
    <el-main class="app-main">
      <el-drawer
        title="Menu"
        v-model="drawerVisible"
        direction="ltr"
        size="240px"
        @close="drawerVisible = false"
      >
          <div class="drawer-menu">
            <div
              v-for="tab in tabs"
              :key="tab.name"
              @click="selectTab(tab.name)"
              :class="['drawer-menu-item', { active: activeTab === tab.name }]"
            >
              {{ tab.label }}
            </div>
          </div>
      </el-drawer>
    </el-main>
    <el-container>
      <component :is="activeTabComponent" />
    </el-container>
  </el-container>
</template>

<script>
//import MainWindow from './views/MainWindow.vue'
//import AIWindow from './views/AIWindow.vue'

import Recipes from './views/Recipes.vue'
import { Menu } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'

export default {
  name: 'App',
  components: {
    // MainWindow,
    // AIWindow,
    Recipes,
    Menu,
    ElIcon
  },
  data() {
    return {
      activeTab: 'recipes',
      tabs: [],
      drawerVisible: false,
    }
  },
  mounted() {
    this.tabs = [
      // { label: 'Main Window', name: 'main', component: 'MainWindow' },
      // { label: 'AI Window', name: 'ai', component: 'AIWindow' },
      { label: 'Recipes', name: 'recipes', component: 'Recipes' }
    ];
  },
  computed: {
    activeTabComponent() {
      const tab = this.tabs.find(t => t.name === this.activeTab);
      return tab ? tab.component : null;
    },
    currentHeader() {
      const tab = this.tabs.find(t => t.name === this.activeTab);
      return tab ? tab.label : '';
    }
  },
  methods: {
    onMenuClick() {
      this.drawerVisible = true;
    },
    selectTab(tabName) {
      this.activeTab = tabName;
      this.drawerVisible = false;
    }
  }
}

</script>