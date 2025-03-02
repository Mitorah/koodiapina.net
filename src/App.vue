<template>
  <el-container style="border: 1px solid #ebeef5;">
    <el-header>
      {{'HEADER'}}
    </el-header>
    <el-main style="border: 1px solid #ebeef5;">
      <el-tabs v-model="activeTab" tab-position="left" class="demo-tabs">
        <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name">
          <el-container>
            <component :is="tab.component" />
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import MainWindow from './views/MainWindow.vue'
import AIWindow from './views/AIWindow.vue'

export default {
  name: 'App',
  components: {
    MainWindow,
    AIWindow
  },
  data() {
    return {
      activeTab: 'main',
      tabs: [],
    }
  },
  mounted() {
    this.tabs = [
      { label: 'Main Window', name: 'main', component: 'MainWindow' },
      { label: 'AI Window', name: 'ai', component: 'AIWindow' }
    ]
  },
}

</script>