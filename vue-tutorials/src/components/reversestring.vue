<template>
    <div>
        <v-col sm="2">
        <v-text-field v-model="message">
        </v-text-field>
        <v-text-field readonly v-model="reversedMessage">
        </v-text-field>
        </v-col>
        <br/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'This is message!',
        }
    },
    methods: {
        reversemessage() {
            this.message = this.message.split('').reverse().join('');        
        }
    },
    computed: {
        reversedMessage: function() {
            return this.message.split('').reverse().join('');
        },
    }
}
</script>