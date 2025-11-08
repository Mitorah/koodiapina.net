<template>
  <el-container class="app-container">
    <el-header>
      <el-row type="flex" align="middle" class="header-row">
        <el-button @click="onMenuClick" class="menu-button">
          <el-icon><Menu /></el-icon>
        </el-button>
        <div class="profile-indicator">
          <el-icon v-if="currentProfileIsAdmin" style="color: #F56C6C;">
            <Star />
          </el-icon>
          <el-icon v-else style="color: #909399;">
            <User />
          </el-icon>
          <span class="profile-name">{{ currentProfileName }}</span>
        </div>
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
            <!-- Profile Selector -->
            <div class="profile-selector">
              <label class="profile-label">Profiili:</label>
              <el-select
                v-model="selectedProfile"
                placeholder="Valitse profiili"
                @change="onProfileChange"
                style="width: 100%"
              >
                <el-option
                  v-for="profile in profiles"
                  :key="profile.profile_guid"
                  :label="profile.display_name || profile.username"
                  :value="profile.profile_guid"
                >
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <el-icon v-if="profile.is_admin" style="color: #F56C6C;">
                      <Star />
                    </el-icon>
                    <el-icon v-else style="color: #909399;">
                      <User />
                    </el-icon>
                    <span>{{ profile.display_name || profile.username }}</span>
                  </span>
                </el-option>
              </el-select>
            </div>
            
            <el-divider />
            
            <!-- Menu Items -->
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
      <component :is="activeTabComponent" :currentProfileGuid="selectedProfile" />
    </el-container>
  </el-container>
</template>

<script>
//import MainWindow from './views/MainWindow.vue'
//import AIWindow from './views/AIWindow.vue'

import Recipes from './views/Recipes.vue'
import Favorites from './views/Favorites.vue'
import { Menu, User, Star } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { fetchProfiles } from './utils/api'

export default {
  name: 'App',
  components: {
    // MainWindow,
    // AIWindow,
    Recipes,
    Favorites,
    Menu,
    User,
    Star,
    ElIcon
  },
  data() {
    return {
      activeTab: 'recipes',
      tabs: [],
      drawerVisible: false,
      profiles: [],
      selectedProfile: null,
    }
  },
  async mounted() {
    this.tabs = [
      // { label: 'Main Window', name: 'main', component: 'MainWindow' },
      // { label: 'AI Window', name: 'ai', component: 'AIWindow' },
      { label: 'Reseptit', name: 'recipes', component: 'Recipes' },
      { label: 'Suosikit', name: 'favorites', component: 'Favorites' }
    ];
    
    // Load profiles
    await this.loadProfiles();
    
    // Load selected profile from cookie or select first
    this.loadSelectedProfile();
  },
  computed: {
    activeTabComponent() {
      const tab = this.tabs.find(t => t.name === this.activeTab);
      return tab ? tab.component : null;
    },
    currentHeader() {
      const tab = this.tabs.find(t => t.name === this.activeTab);
      return tab ? tab.label : '';
    },
    currentProfileName() {
      if (!this.selectedProfile || this.profiles.length === 0) {
        return '';
      }
      const profile = this.profiles.find(p => p.profile_guid === this.selectedProfile);
      return profile?.display_name || profile?.username || '';
    },
    currentProfileIsAdmin() {
      if (!this.selectedProfile || this.profiles.length === 0) {
        return false;
      }
      const profile = this.profiles.find(p => p.profile_guid === this.selectedProfile);
      return profile?.is_admin === 1 || profile?.is_admin === true;
    }
  },
  methods: {
    onMenuClick() {
      this.drawerVisible = true;
    },
    selectTab(tabName) {
      this.activeTab = tabName;
      this.drawerVisible = false;
    },
    async loadProfiles() {
      try {
        const data = await fetchProfiles();
        this.profiles = data.profiles || [];
      } catch (error) {
        console.error('Failed to load profiles:', error);
        this.$message.error('Profiilien lataus epäonnistui');
      }
    },
    loadSelectedProfile() {
      // Try to load from cookie
      const savedProfile = this.getCookie('selected_profile');
      if (savedProfile && this.profiles.some(p => p.profile_guid === savedProfile)) {
        this.selectedProfile = savedProfile;
      } else if (this.profiles.length > 0) {
        // Select first profile by default
        this.selectedProfile = this.profiles[0].profile_guid;
        this.saveProfileToCookie(this.selectedProfile);
      }
    },
    onProfileChange(profileGuid) {
      this.saveProfileToCookie(profileGuid);
      const profile = this.profiles.find(p => p.profile_guid === profileGuid);
      const displayName = profile?.display_name || profile?.username || 'tuntematon';
      this.$message.success(`Vaihdettu profiiliin: ${displayName}`);
    },
    saveProfileToCookie(profileGuid) {
      // Save for 365 days
      const expires = new Date();
      expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
      document.cookie = `selected_profile=${profileGuid}; expires=${expires.toUTCString()}; path=/`;
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }
  }
}

</script>