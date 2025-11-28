<template>
    <el-container>
        <div v-if="!currentProfile || !currentProfile.is_admin" style="padding: 20px; text-align: center;">
            <p>Tämä sivu on vain pääkäyttäjille</p>
        </div>
        <div v-else class="admin-users-container">
            <!-- Edit/Create Form at Top (always visible) -->
            <el-card class="form-card">
                <template #header>
                    <div style="display: flex; justify-content: space-between; align-items: center; height: 28px;">
                        <span style="font-size: 14px;"><strong>{{ selectedUser ? 'Muokkaa käyttäjää' : 'Lisää uusi käyttäjä' }}</strong></span>
                        <el-button v-if="selectedUser" type="primary" size="small" @click="clearSelection">+ Lisää uusi</el-button>
                        <div v-else style="width: 96px; height: 28px;"></div>
                    </div>
                </template>
                
                <el-form :model="editForm" label-position="left">
                    <el-form-item label="Käyttäjänimi">
                        <el-input v-model="editForm.username" placeholder="esim. matti"></el-input>
                    </el-form-item>
                    <el-form-item label="Näyttönimi">
                        <el-input v-model="editForm.displayName" placeholder="esim. Matti Meikäläinen"></el-input>
                    </el-form-item>
                    <el-form-item label="Sähköposti">
                        <el-input v-model="editForm.email" placeholder="esim. matti@example.com (valinnainen)"></el-input>
                    </el-form-item>
                    <el-form-item label="PIN-koodi">
                        <el-input 
                            v-model="editForm.pin" 
                            :type="showPin ? 'text' : 'password'"
                            :placeholder="selectedUser ? '4-6 numeroa (tyhjä = ei muutosta)' : '4-6 numeroa (valinnainen)'" 
                            maxlength="6"
                        >
                            <template #suffix>
                                <el-button 
                                    v-if="editForm.pin" 
                                    @click="showPin = !showPin" 
                                    text
                                    size="small"
                                >
                                    {{ showPin ? 'Piilota' : 'Näytä' }}
                                </el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Vahvista PIN">
                        <el-input 
                            v-model="editForm.pinConfirm" 
                            :type="showPin ? 'text' : 'password'"
                            placeholder="Kirjoita PIN uudelleen" 
                            maxlength="6"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Pääkäyttäjä">
                        <el-checkbox 
                            v-model="editForm.isAdmin"
                            :disabled="selectedUser && selectedUser.profile_guid === currentProfile.profile_guid"
                        >
                            Pääkäyttäjän oikeudet
                        </el-checkbox>
                    </el-form-item>
                    
                    <!-- Action Buttons -->
                    <el-form-item>
                        <div class="action-buttons">
                            <el-button 
                                type="primary" 
                                @click="selectedUser ? saveUser() : createUser()" 
                                :loading="saving"
                            >
                                {{ selectedUser ? 'Tallenna' : 'Luo käyttäjä' }}
                            </el-button>
                            
                            <template v-if="selectedUser">
                                <el-button 
                                    v-if="selectedUser.is_active"
                                    type="danger" 
                                    @click="confirmDeleteUser(selectedUser)"
                                    :disabled="selectedUser.profile_guid === currentProfile.profile_guid"
                                >
                                    Poista
                                </el-button>
                                
                                <template v-else>
                                    <el-button 
                                        type="success" 
                                        @click="confirmReactivate(selectedUser)"
                                    >
                                        Aktivoi
                                    </el-button>
                                    <el-button 
                                        type="danger" 
                                        @click="confirmPermanentDelete(selectedUser)"
                                    >
                                        Poista pysyvästi
                                    </el-button>
                                </template>
                            </template>
                        </div>
                    </el-form-item>
                </el-form>
            </el-card>

            <!-- User List -->
            <el-card>
                <div class="users-list">
                    <div 
                        v-for="profile in profiles" 
                        :key="profile.profile_guid"
                        class="user-item"
                        :class="{ 'selected': selectedUser && selectedUser.profile_guid === profile.profile_guid }"
                        @click="selectUser(profile)"
                    >
                        <div class="user-info">
                            <div class="user-name">
                                <strong>{{ profile.display_name }}</strong>
                                <span class="username">{{ profile.username }}</span>
                            </div>
                            <div class="user-badges">
                                <el-tag v-if="profile.is_admin" type="danger" size="small">Pääkäyttäjä</el-tag>
                                <el-tag v-if="!profile.is_active" type="warning" size="small">Poistettu</el-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </el-container>
</template>

<script>
import { fetchProfiles, createProfile, updateProfile, deleteProfile, reactivateProfile, permanentDeleteProfile } from '../utils/api.js';
import { config } from '../config.js';

export default {
  name: 'AdminUsers',
  props: {
    currentProfile: Object
  },
  emits: ['profiles-changed'],
  data() {
    return {
      profiles: [],
      selectedUser: null,
      editForm: {
        profileGuid: '',
        username: '',
        displayName: '',
        email: '',
        pin: '',
        pinConfirm: '',
        isAdmin: false
      },
      saving: false,
      showPin: false,
      pinError: ''
    };
  },
  mounted() {
    if (this.currentProfile && this.currentProfile.is_admin) {
      this.loadProfiles();
    }
  },
  watch: {
    currentProfile: {
      handler(newProfile) {
        if (newProfile && newProfile.is_admin) {
          this.loadProfiles();
        }
      }
    }
  },
  methods: {
    async loadProfiles() {
      try {
        const data = await fetchProfiles();
        this.profiles = data.profiles || [];
      } catch (err) {
        this.$message({ message: 'Käyttäjien lataus epäonnistui', type: 'error', duration: config.message.duration });
      }
    },
    selectUser(profile) {
      this.selectedUser = profile;
      this.editForm = {
        profileGuid: profile.profile_guid,
        username: profile.username,
        displayName: profile.display_name,
        email: profile.email || '',
        pin: '',
        pinConfirm: '',
        isAdmin: !!profile.is_admin
      };
      this.pinError = '';
      this.showPin = false;
    },
    clearSelection() {
      this.selectedUser = null;
      this.editForm = {
        profileGuid: '',
        username: '',
        displayName: '',
        email: '',
        pin: '',
        pinConfirm: '',
        isAdmin: false
      };
      this.pinError = '';
      this.showPin = false;
    },
    async createUser() {
      if (!this.editForm.username || !this.editForm.displayName) {
        this.$message({ message: 'Käyttäjänimi ja näyttönimi ovat pakollisia', type: 'warning', duration: config.message.duration });
        return;
      }

      if (!this.validatePin()) {
        return;
      }

      this.saving = true;
      try {
        const result = await createProfile(
          this.editForm.username,
          this.editForm.displayName,
          this.editForm.email,
          this.editForm.isAdmin,
          this.editForm.pin
        );
        
        this.$message({ message: 'Käyttäjä luotu onnistuneesti', type: 'success', duration: config.message.duration });
        
        // Reload profiles
        await this.loadProfiles();
        
        // Select the newly created user
        if (result && result.profile_guid) {
          const newUser = this.profiles.find(p => p.profile_guid === result.profile_guid);
          if (newUser) {
            this.selectUser(newUser);
          }
        }
        
        // Emit event to parent
        this.$emit('profiles-changed');
      } catch (err) {
        this.$message({ message: err.message || 'Käyttäjän luonti epäonnistui', type: 'error', duration: config.message.duration });
      } finally {
        this.saving = false;
      }
    },
    async saveUser() {
      if (!this.editForm.username || !this.editForm.displayName) {
        this.$message({ message: 'Käyttäjänimi ja näyttönimi ovat pakollisia', type: 'warning', duration: config.message.duration });
        return;
      }

      if (!this.validatePin()) {
        return;
      }

      this.saving = true;
      try {
        await updateProfile(
          this.editForm.profileGuid,
          this.editForm.username,
          this.editForm.displayName,
          this.editForm.email,
          this.editForm.isAdmin,
          this.editForm.pin
        );
        
        this.$message({ message: 'Käyttäjä päivitetty onnistuneesti', type: 'success', duration: config.message.duration });
        
        // Reload profiles
        await this.loadProfiles();
        
        // Update selectedUser with fresh data
        if (this.selectedUser) {
          const updatedUser = this.profiles.find(p => p.profile_guid === this.selectedUser.profile_guid);
          if (updatedUser) {
            this.selectUser(updatedUser);
          }
        }
        
        // Emit event to parent
        this.$emit('profiles-changed');
      } catch (err) {
        this.$message({ message: err.message || 'Käyttäjän päivitys epäonnistui', type: 'error', duration: config.message.duration });
      } finally {
        this.saving = false;
      }
    },
    async confirmDeleteUser(profile) {
      this.$confirm(
        `Haluatko varmasti poistaa käyttäjän ${profile.display_name}? (Käyttäjä voidaan aktivoida uudelleen)`,
        'Vahvista poisto',
        {
          confirmButtonText: 'Poista',
          cancelButtonText: 'Peruuta',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await deleteProfile(profile.profile_guid);
          this.$message({ message: 'Käyttäjä poistettu onnistuneesti', type: 'success', duration: config.message.duration });
          
          // Reload profiles
          await this.loadProfiles();
          
          // Update selectedUser with fresh data
          if (this.selectedUser) {
            const updatedUser = this.profiles.find(p => p.profile_guid === this.selectedUser.profile_guid);
            if (updatedUser) {
              this.selectUser(updatedUser);
            }
          }
          
          // Emit event to parent
          this.$emit('profiles-changed');
        } catch (err) {
          this.$message({ message: err.message || 'Käyttäjän poisto epäonnistui', type: 'error', duration: config.message.duration });
        }
      }).catch(() => {
        // User cancelled
      });
    },
    async confirmReactivate(profile) {
      this.$confirm(
        `Haluatko varmasti aktivoida käyttäjän ${profile.display_name}?`,
        'Vahvista aktivointi',
        {
          confirmButtonText: 'Aktivoi',
          cancelButtonText: 'Peruuta',
          type: 'info'
        }
      ).then(async () => {
        try {
          await reactivateProfile(profile.profile_guid);
          this.$message({ message: 'Käyttäjä aktivoitu onnistuneesti', type: 'success', duration: config.message.duration });
          
          // Reload profiles
          await this.loadProfiles();
          
          // Update selectedUser with fresh data
          if (this.selectedUser) {
            const updatedUser = this.profiles.find(p => p.profile_guid === this.selectedUser.profile_guid);
            if (updatedUser) {
              this.selectUser(updatedUser);
            }
          }
          
          // Emit event to parent
          this.$emit('profiles-changed');
        } catch (err) {
          this.$message({ message: err.message || 'Käyttäjän aktivointi epäonnistui', type: 'error', duration: config.message.duration });
        }
      }).catch(() => {
        // User cancelled
      });
    },
    async confirmPermanentDelete(profile) {
      this.$confirm(
        `Haluatko varmasti poistaa käyttäjän ${profile.display_name} PYSYVÄSTI? Tätä toimintoa ei voi peruuttaa!`,
        'Vahvista pysyvä poisto',
        {
          confirmButtonText: 'Poista pysyvästi',
          cancelButtonText: 'Peruuta',
          type: 'error'
        }
      ).then(async () => {
        try {
          await permanentDeleteProfile(profile.profile_guid);
          this.$message({ message: 'Käyttäjä poistettu pysyvästi', type: 'success', duration: config.message.duration });
          
          // Clear selection
          this.clearSelection();
          
          // Reload profiles
          await this.loadProfiles();
          
          // Emit event to parent
          this.$emit('profiles-changed');
        } catch (err) {
          this.$message({ message: err.message || 'Käyttäjän pysyvä poisto epäonnistui', type: 'error', duration: config.message.duration });
        }
      }).catch(() => {
        // User cancelled
      });
    },
    validatePin() {
      const pin = this.editForm.pin;
      const pinConfirm = this.editForm.pinConfirm;
      
      if (!pin) {
        return true;
      }
      
      if (!/^\d+$/.test(pin)) {
        this.$message({ message: 'PIN voi sisältää vain numeroita', type: 'error', duration: config.message.duration });
        return false;
      }
      
      if (pin.length < 4 || pin.length > 6) {
        this.$message({ message: 'PIN:in tulee olla 4-6 numeroa', type: 'error', duration: config.message.duration });
        return false;
      }
      
      if (pin && pinConfirm && pin !== pinConfirm) {
        this.$message({ message: 'PIN-koodit eivät täsmää', type: 'error', duration: config.message.duration });
        return false;
      }
      
      return true;
    }
  }
};
</script>

<style scoped>
.admin-users-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
}

.admin-users-container > .el-card:first-child {
  flex: 0 0 auto;
  overflow-y: auto;
}

.admin-users-container > .el-card:first-child :deep(.el-card__header) {
  padding: 10px 20px;
}

.admin-users-container > .el-card:first-child :deep(.el-card__body) {
  padding: 12px;
}

.admin-users-container > .el-card:last-child {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.admin-users-container > .el-card:last-child :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.user-item {
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.user-item:hover {
  background: #f5f7fa;
  border-color: #409eff;
}

.user-item.selected {
  background: #ecf5ff;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.user-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.user-name strong {
  font-size: 14px;
  color: #303133;
}

.user-name .username {
  font-size: 12px;
  color: #909399;
}

.user-badges {
  display: flex;
  gap: 6px;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 1px;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-end;
}

.action-buttons .el-button {
  flex: 1 1 0;
  min-width: 0;
  max-width: 200px;
}

:deep(.el-form-item__label) {
  width: 100px;
  text-align: left;
}

@media (max-width: 768px) {
  :deep(.el-form-item__label) {
    text-align: left !important;
    width: 30% !important;
  }
}
</style>
