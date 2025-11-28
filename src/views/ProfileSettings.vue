<template>
    <el-container>
        <div v-if="!currentProfile" style="padding: 20px; text-align: center;">
            <p>Profiilia ei ole valittu</p>
        </div>
        <div v-else>
            <el-card>
                <template #header>
                    <span><strong>Profiiliasetukset</strong></span>
                </template>
                
                <el-form :model="profileForm" label-position="top">
                    <el-form-item label="Nimi">
                        <el-input v-model="profileForm.displayName" placeholder="esim. Matti Meikäläinen"></el-input>
                    </el-form-item>
                    <el-form-item label="Sähköposti">
                        <el-input v-model="profileForm.email" placeholder="esim. matti@example.com (valinnainen)"></el-input>
                    </el-form-item>
                    <el-form-item label="PIN-koodi">
                        <el-input 
                            v-model="profileForm.pin" 
                            :type="showPin ? 'text' : 'password'"
                            placeholder="4-6 numeroa (tyhjä = ei muutosta)" 
                            maxlength="6"
                        >
                            <template #suffix>
                                <el-button 
                                    v-if="profileForm.pin" 
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
                            v-model="profileForm.pinConfirm" 
                            :type="showPin ? 'text' : 'password'"
                            placeholder="Kirjoita PIN uudelleen" 
                            maxlength="6"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveProfile" :loading="saving">Tallenna muutokset</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </el-container>
</template>

<script>
import { updateProfile } from '../utils/api.js';
import { config } from '../config.js';

export default {
  name: 'ProfileSettings',
  props: {
    currentProfile: Object
  },
  data() {
    return {
      profileForm: {
        username: '',
        displayName: '',
        email: '',
        pin: '',
        pinConfirm: ''
      },
      saving: false,
      showPin: false,
      pinError: ''
    };
  },
  watch: {
    currentProfile: {
      immediate: true,
      handler(profile) {
        if (profile) {
          this.profileForm = {
            username: profile.username,
            displayName: profile.display_name,
            email: profile.email || '',
            pin: '',
            pinConfirm: ''
          };
        }
      }
    }
  },
  methods: {
    validatePin() {
      const pin = this.profileForm.pin;
      const pinConfirm = this.profileForm.pinConfirm;
      
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
    },
    async saveProfile() {
      if (!this.profileForm.displayName) {
        this.$message({ message: 'Näyttönimi on pakollinen', type: 'warning', duration: config.message.duration });
        return;
      }

      if (!this.validatePin()) {
        return;
      }

      this.saving = true;
      try {
        await updateProfile(
          this.currentProfile.profile_guid,
          this.profileForm.username,
          this.profileForm.displayName,
          this.profileForm.email,
          this.currentProfile.is_admin,
          this.profileForm.pin
        );
        
        this.$message({ message: 'Profiili päivitetty onnistuneesti', type: 'success', duration: config.message.duration });
        
        // Clear PIN fields after successful save
        this.profileForm.pin = '';
        this.profileForm.pinConfirm = '';
        
        // Emit event to parent to reload profiles
        this.$emit('profile-updated');
      } catch (err) {
        this.$message({ message: err.message || 'Profiilin päivitys epäonnistui', type: 'error', duration: config.message.duration });
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
