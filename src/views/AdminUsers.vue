<template>
    <el-container>
        <div v-if="!currentProfile || !currentProfile.is_admin" style="padding: 20px; text-align: center;">
            <p>Tämä sivu on vain pääkäyttäjille</p>
        </div>
        <div v-else>
            <el-card style="margin-bottom: 20px;">
                <template #header>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span><strong>Lisää uusi käyttäjä</strong></span>
                    </div>
                </template>
                
                <el-form :model="newUserForm" label-width="150px">
                    <el-form-item label="Käyttäjänimi">
                        <el-input v-model="newUserForm.username" placeholder="esim. matti"></el-input>
                    </el-form-item>
                    <el-form-item label="Näyttönimi">
                        <el-input v-model="newUserForm.displayName" placeholder="esim. Matti Meikäläinen"></el-input>
                    </el-form-item>
                    <el-form-item label="Sähköposti">
                        <el-input v-model="newUserForm.email" placeholder="esim. matti@example.com (valinnainen)"></el-input>
                    </el-form-item>
                    <el-form-item label="Pääkäyttäjä">
                        <el-checkbox v-model="newUserForm.isAdmin">Pääkäyttäjän oikeudet</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="createUser" :loading="creating">Luo käyttäjä</el-button>
                    </el-form-item>
                </el-form>
            </el-card>

            <el-card>
                <template #header>
                    <span><strong>Käyttäjät</strong></span>
                </template>
                
                <el-table :data="profiles" style="width: 100%">
                    <el-table-column prop="username" label="Käyttäjänimi" width="180"></el-table-column>
                    <el-table-column prop="display_name" label="Näyttönimi" width="200"></el-table-column>
                    <el-table-column prop="email" label="Sähköposti"></el-table-column>
                    <el-table-column label="Rooli" width="120">
                        <template #default="scope">
                            <el-tag v-if="scope.row.is_admin" type="danger" size="small">Pääkäyttäjä</el-tag>
                            <el-tag v-else type="info" size="small">Käyttäjä</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="Toiminnot" width="180">
                        <template #default="scope">
                            <el-button size="small" @click="editUser(scope.row)">Muokkaa</el-button>
                            <el-button 
                                size="small" 
                                type="danger" 
                                @click="confirmDeleteUser(scope.row)"
                                :disabled="scope.row.profile_guid === currentProfile.profile_guid"
                            >Poista</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <!-- Edit User Dialog -->
            <el-dialog v-model="editDialogVisible" title="Muokkaa käyttäjää" width="500px">
                <el-form :model="editUserForm" label-width="150px">
                    <el-form-item label="Käyttäjänimi">
                        <el-input v-model="editUserForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="Näyttönimi">
                        <el-input v-model="editUserForm.displayName"></el-input>
                    </el-form-item>
                    <el-form-item label="Sähköposti">
                        <el-input v-model="editUserForm.email" placeholder="valinnainen"></el-input>
                    </el-form-item>
                    <el-form-item label="Pääkäyttäjä">
                        <el-checkbox v-model="editUserForm.isAdmin">Pääkäyttäjän oikeudet</el-checkbox>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="editDialogVisible = false">Peruuta</el-button>
                        <el-button type="primary" @click="saveUser" :loading="saving">Tallenna</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </el-container>
</template>

<script>
import { fetchProfiles, createProfile, updateProfile, deleteProfile } from '../utils/api.js';

export default {
  name: 'AdminUsers',
  props: {
    currentProfile: Object
  },
  emits: ['profiles-changed'],
  data() {
    return {
      profiles: [],
      newUserForm: {
        username: '',
        displayName: '',
        email: '',
        isAdmin: false
      },
      editUserForm: {
        profileGuid: '',
        username: '',
        displayName: '',
        email: '',
        isAdmin: false
      },
      creating: false,
      editDialogVisible: false,
      saving: false
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
        console.error('Failed to load profiles:', err);
        this.$message.error('Käyttäjien lataus epäonnistui');
      }
    },
    async createUser() {
      if (!this.newUserForm.username || !this.newUserForm.displayName) {
        this.$message.warning('Käyttäjänimi ja näyttönimi ovat pakollisia');
        return;
      }

      this.creating = true;
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
        
        // Reload profiles
        await this.loadProfiles();
        
        // Emit event to parent
        this.$emit('profiles-changed');
      } catch (err) {
        console.error('Failed to create user:', err);
        this.$message.error(err.message || 'Käyttäjän luonti epäonnistui');
      } finally {
        this.creating = false;
      }
    },
    editUser(profile) {
      this.editUserForm = {
        profileGuid: profile.profile_guid,
        username: profile.username,
        displayName: profile.display_name,
        email: profile.email || '',
        isAdmin: profile.is_admin
      };
      this.editDialogVisible = true;
    },
    async saveUser() {
      if (!this.editUserForm.username || !this.editUserForm.displayName) {
        this.$message.warning('Käyttäjänimi ja näyttönimi ovat pakollisia');
        return;
      }

      this.saving = true;
      try {
        await updateProfile(
          this.editUserForm.profileGuid,
          this.editUserForm.username,
          this.editUserForm.displayName,
          this.editUserForm.email,
          this.editUserForm.isAdmin
        );
        
        this.$message.success('Käyttäjä päivitetty onnistuneesti');
        this.editDialogVisible = false;
        
        // Reload profiles
        await this.loadProfiles();
        
        // Emit event to parent
        this.$emit('profiles-changed');
      } catch (err) {
        console.error('Failed to update user:', err);
        this.$message.error(err.message || 'Käyttäjän päivitys epäonnistui');
      } finally {
        this.saving = false;
      }
    },
    async confirmDeleteUser(profile) {
      this.$confirm(
        `Haluatko varmasti poistaa käyttäjän ${profile.display_name}?`,
        'Vahvista poisto',
        {
          confirmButtonText: 'Poista',
          cancelButtonText: 'Peruuta',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await deleteProfile(profile.profile_guid);
          this.$message.success('Käyttäjä poistettu onnistuneesti');
          
          // Reload profiles
          await this.loadProfiles();
          
          // Emit event to parent
          this.$emit('profiles-changed');
        } catch (err) {
          console.error('Failed to delete user:', err);
          this.$message.error(err.message || 'Käyttäjän poisto epäonnistui');
        }
      }).catch(() => {
        // User cancelled
      });
    }
  }
};
</script>

<style scoped>
</style>
