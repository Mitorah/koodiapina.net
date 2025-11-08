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
                </el-table>
            </el-card>
        </div>
    </el-container>
</template>

<script>
import { fetchProfiles, createProfile } from '../utils/api.js';

export default {
  name: 'AdminUsers',
  props: {
    currentProfile: Object
  },
  data() {
    return {
      profiles: [],
      newUserForm: {
        username: '',
        displayName: '',
        email: '',
        isAdmin: false
      },
      creating: false
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
      } catch (err) {
        console.error('Failed to create user:', err);
        this.$message.error(err.message || 'Käyttäjän luonti epäonnistui');
      } finally {
        this.creating = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
