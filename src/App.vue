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
        <div v-if="activeTab === 'recipes'" class="search-container">
          <el-button 
            v-if="!searchExpanded" 
            @click="searchExpanded = true" 
            circle 
            class="search-toggle"
          >
            <el-icon><Search /></el-icon>
          </el-button>
          <div v-else class="search-box">
            <el-input
              v-model="searchQueryInput"
              placeholder="Hae reseptejä..."
              @keyup.enter="handleSearch"
              @clear="handleClearSearch"
              clearable
              class="search-input"
              ref="searchInput"
            >
              <template #suffix>
                <el-button 
                  @click="handleSearch" 
                  type="primary" 
                  size="small"
                  :disabled="!searchQueryInput.trim()"
                >
                  Hae
                </el-button>
              </template>
            </el-input>
            <el-button 
              @click="closeSearch" 
              circle 
              size="small" 
              class="close-search"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>
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
    
    <!-- Profile Selection Dialog (First Visit) -->
    <el-dialog
      v-model="showProfileSelectionDialog"
      title="Valitse profiili"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form label-width="100px">
        <el-form-item label="Profiili">
          <el-select
            v-model="tempSelectedProfile"
            placeholder="Valitse profiili"
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
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button 
            type="primary" 
            @click="confirmProfileSelection" 
            :disabled="!tempSelectedProfile"
          >
            OK
          </el-button>
        </span>
      </template>
    </el-dialog>
    
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
      <Recipes 
        v-if="activeTab === 'recipes'"
        :currentProfileGuid="selectedProfile" 
        :searchQuery="searchQuery"
        @search-cleared="searchQuery = ''"
      />
      <Favorites 
        v-else-if="activeTab === 'favorites'"
        :currentProfileGuid="selectedProfile" 
        :currentProfile="currentProfile" 
      />
      <HiddenRecipes 
        v-else-if="activeTab === 'hidden'"
        :currentProfileGuid="selectedProfile" 
        :currentProfile="currentProfile" 
      />
      <ShoppingList 
        v-else-if="activeTab === 'shopping-list'"
        :currentProfileGuid="selectedProfile" 
        :currentProfile="currentProfile" 
      />
      <AdminUsers 
        v-else-if="activeTab === 'admin-users'"
        :currentProfileGuid="selectedProfile" 
        :currentProfile="currentProfile" 
      />
    </el-container>
  </el-container>
</template>

<script>
//import MainWindow from './views/MainWindow.vue'
//import AIWindow from './views/AIWindow.vue'

import Recipes from './views/Recipes.vue'
import Favorites from './views/Favorites.vue'
import HiddenRecipes from './views/HiddenRecipes.vue'
import ShoppingList from './views/ShoppingList.vue'
import AdminUsers from './views/AdminUsers.vue'
import { Menu, User, Star, Search, Close } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { fetchProfiles, createProfile } from './utils/api'

export default {
  name: 'App',
  components: {
    // MainWindow,
    // AIWindow,
    Recipes,
    Favorites,
    HiddenRecipes,
    ShoppingList,
    AdminUsers,
    Menu,
    User,
    Star,
    Search,
    Close,
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
      showProfileSelectionDialog: false,
      tempSelectedProfile: undefined,
      creatingUser: false,
      searchExpanded: false,
      searchQueryInput: '',
      searchQuery: '',
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
      { label: 'Piilotetut', name: 'hidden', component: 'HiddenRecipes' },
      { label: 'Ostoslista', name: 'shopping-list', component: 'ShoppingList' }
    ];
    
    // Load profiles
    await this.loadProfiles();
    
    // Check for saved profile in cookie
    const savedProfile = this.getCookie('selected_profile');
    
    if (savedProfile && this.profiles.some(p => p.profile_guid === savedProfile)) {
      // User has a valid saved profile - use it
      this.selectedProfile = savedProfile;
    } else {
      // First visit or invalid cookie - show profile selection dialog
      this.showProfileSelectionDialog = true;
    }
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
    confirmProfileSelection() {
      if (this.tempSelectedProfile) {
        this.selectedProfile = this.tempSelectedProfile;
        this.saveProfileToCookie(this.selectedProfile);
        this.showProfileSelectionDialog = false;
        
        const profile = this.profiles.find(p => p.profile_guid === this.tempSelectedProfile);
        const displayName = profile?.display_name || profile?.username || 'tuntematon';
        this.$message.success(`Profiili valittu: ${displayName}`);
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
    },
    handleSearch() {
      // If empty, clear the search
      if (!this.searchQueryInput.trim()) {
        this.searchQuery = '';
        return;
      }
      
      // Trigger search by updating searchQuery prop
      this.searchQuery = this.searchQueryInput.trim();
    },
    handleClearSearch() {
      // Called when user clicks the X in the input field
      this.searchQueryInput = '';
      this.searchQuery = '';
    },
    closeSearch() {
      this.searchExpanded = false;
      this.searchQueryInput = '';
      this.searchQuery = '';
    }
  },
  watch: {
    searchExpanded(newVal) {
      if (newVal) {
        // Focus input when expanded
        this.$nextTick(() => {
          this.$refs.searchInput?.focus();
        });
      }
    },
    activeTab(newTab) {
      // Close search when leaving recipes tab
      if (newTab !== 'recipes') {
        this.searchExpanded = false;
        this.searchQueryInput = '';
        this.searchQuery = '';
      }
    }
  }
}

</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.search-container {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-toggle {
  transition: all 0.3s ease;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  animation: expandSearch 0.3s ease;
}

@keyframes expandSearch {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.search-input {
  width: 300px;
}

.close-search {
  flex-shrink: 0;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .header-row {
    gap: 8px;
  }

  .profile-indicator {
    max-width: 120px;
    overflow: hidden;
  }

  .profile-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .search-container {
    position: static;
  }

  .search-box {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: expandSearchMobile 0.3s ease;
  }

  @keyframes expandSearchMobile {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .search-input {
    width: 100%;
    flex: 1;
  }

  .close-search {
    position: relative;
  }
}
</style>