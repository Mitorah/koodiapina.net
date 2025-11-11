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
                :value-key="'profile_guid'"
              >
                <el-option
                  v-for="profile in profiles"
                  :key="profile.profile_guid"
                  :label="profile.display_name || profile.username"
                  :value="profile.profile_guid || ''"
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
            
            <!-- Admin: Add New User -->
            <div v-if="currentProfileIsAdmin" class="admin-section">
              <el-button 
                type="primary" 
                size="small" 
                style="width: 100%; margin-top: 10px;"
                @click="showAddUserDialog = true"
              >
                + Lisää käyttäjä
              </el-button>
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
    
    <!-- Add User Dialog -->
    <el-dialog
      v-model="showAddUserDialog"
      title="Lisää uusi käyttäjä"
      width="500px"
    >
      <el-form :model="newUserForm" label-width="130px">
        <el-form-item label="Käyttäjänimi">
          <el-input v-model="newUserForm.username" placeholder="esim. matti"></el-input>
        </el-form-item>
        <el-form-item label="Näyttönimi">
          <el-input v-model="newUserForm.displayName" placeholder="esim. Matti Meikäläinen"></el-input>
        </el-form-item>
        <el-form-item label="Sähköposti">
          <el-input v-model="newUserForm.email" placeholder="valinnainen"></el-input>
        </el-form-item>
        <el-form-item label="Pääkäyttäjä">
          <el-checkbox v-model="newUserForm.isAdmin">Pääkäyttäjän oikeudet</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddUserDialog = false">Peruuta</el-button>
          <el-button type="primary" @click="createUser" :loading="creatingUser">
            Luo käyttäjä
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <el-container>
      <component :is="activeTabComponent" :currentProfileGuid="selectedProfile" :currentProfile="currentProfile" />
    </el-container>
  </el-container>
</template>

<script>
//import MainWindow from './views/MainWindow.vue'
//import AIWindow from './views/AIWindow.vue'

import Recipes from './views/Recipes.vue'
import Favorites from './views/Favorites.vue'
import ShoppingList from './views/ShoppingList.vue'
import AdminUsers from './views/AdminUsers.vue'
import { Menu, User, Star } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { fetchProfiles, createProfile } from './utils/api'

export default {
  name: 'App',
  components: {
    // MainWindow,
    // AIWindow,
    Recipes,
    Favorites,
    ShoppingList,
    AdminUsers,
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
      selectedProfile: undefined,
      showAddUserDialog: false,
      creatingUser: false,
      newUserForm: {
        username: '',
        displayName: '',
        email: '',
        isAdmin: false
      }
    }
  },
  async mounted() {
    this.tabs = [
      // { label: 'Main Window', name: 'main', component: 'MainWindow' },
      // { label: 'AI Window', name: 'ai', component: 'AIWindow' },
      { label: 'Reseptit', name: 'recipes', component: 'Recipes' },
      { label: 'Suosikit', name: 'favorites', component: 'Favorites' },
      { label: 'Ostoslista', name: 'shopping-list', component: 'ShoppingList' }
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
    currentProfile() {
      if (!this.selectedProfile || this.profiles.length === 0) {
        return null;
      }
      return this.profiles.find(p => p.profile_guid === this.selectedProfile);
    },
    currentProfileName() {
      if (!this.currentProfile) {
        return '';
      }
      return this.currentProfile.display_name || this.currentProfile.username || '';
    },
    currentProfileIsAdmin() {
      if (!this.currentProfile) {
        return false;
      }
      return this.currentProfile.is_admin === 1 || this.currentProfile.is_admin === true;
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
        // Sort: admins first, then by creation time (profile_guid as proxy for creation order)
        this.profiles = (data.profiles || []).sort((a, b) => {
          // Admin users first
          if (a.is_admin && !b.is_admin) return -1;
          if (!a.is_admin && b.is_admin) return 1;
          // Then sort by profile_guid (created earlier = smaller guid in hex)
          return a.profile_guid.localeCompare(b.profile_guid);
        });
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
    },
    async createUser() {
      if (!this.newUserForm.username || !this.newUserForm.displayName) {
        this.$message.warning('Käyttäjänimi ja näyttönimi ovat pakollisia');
        return;
      }

      this.creatingUser = true;
      try {
        await createProfile(
          this.newUserForm.username,
          this.newUserForm.displayName,
          this.newUserForm.email,
          this.newUserForm.isAdmin
        );
        
        this.$message.success('Käyttäjä luotu onnistuneesti');
        
        // Reset form
        this.newUserForm = {
          username: '',
          displayName: '',
          email: '',
          isAdmin: false
        };
        
        // Close dialog
        this.showAddUserDialog = false;
        
        // Reload profiles
        await this.loadProfiles();
      } catch (err) {
        console.error('Failed to create user:', err);
        this.$message.error(err.message || 'Käyttäjän luonti epäonnistui');
      } finally {
        this.creatingUser = false;
      }
    }
  }
}

</script>