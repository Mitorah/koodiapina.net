<template>
    <v-card>
        <v-col cols="auto">
            <v-btn 
            :disabled="authenticated"
            @click="$emit('auth-init', getAuthentication())"
            >
            {{ authenticationButton }}
            </v-btn>
        </v-col>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            authenticated: false,
            authenticationSuccesfull: "Authentication successfull.",
            buttonValue: this.authenticated ? "Authenticated" : "Authenticate"
        }
    },
    computed: {
        authenticationButton() {
            return this.authenticated ? "Logged in" : "Log in"
        }
    },
    methods: {
        getAuthentication() {
            this.authenticated = true
        }
    }
}
</script>

<style>

</style>