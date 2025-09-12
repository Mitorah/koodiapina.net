<template>
  <el-container style="border: 1px solid #ebeef5;">
    <el-header>
      <el-row type="flex" align="middle" style="width: 100%; position: relative;">
  <el-button @click="onMenuClick" style="margin-left: 0; margin-right: 16px; background: transparent; border: none; box-shadow: none; display: flex; align-items: center; justify-content: center;">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="5" width="22" height="2" rx="1" fill="#606266"/>
            <rect y="10" width="22" height="2" rx="1" fill="#606266"/>
            <rect y="15" width="22" height="2" rx="1" fill="#606266"/>
          </svg>
        </el-button>
        <span style="position: absolute; left: 0; right: 0; margin: auto; text-align: center; width: 100%; pointer-events: none; font-weight: bold;">HEADER</span>
      </el-row>
    </el-header>
    <el-main style="border: 1px solid #ebeef5;">
      <el-drawer
        title="Menu"
        v-model="drawerVisible"
        direction="ltr"
        size="240px"
        @close="drawerVisible = false"
      >
          <div style="display: flex; flex-direction: column; width: 100%;">
            <div
              v-for="tab in tabs"
              :key="tab.name"
              @click="selectTab(tab.name)"
              :style="{
                padding: '16px',
                cursor: 'pointer',
                fontWeight: activeTab === tab.name ? 'bold' : 'normal',
                color: activeTab === tab.name ? '#409EFF' : '#333',
                background: activeTab === tab.name ? '#f5f7fa' : 'transparent',
                borderRadius: '4px',
                marginBottom: '4px',
                textAlign: 'left'
              }"
            >
              {{ tab.label }}
            </div>
          </div>
      </el-drawer>
      <el-container>
        <component :is="activeTabComponent" />
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
//import MainWindow from './views/MainWindow.vue'
//import AIWindow from './views/AIWindow.vue'
import Recipes from './views/Recipes.vue'

export default {
  name: 'App',
  components: {
    // MainWindow,
    // AIWindow,
    Recipes
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