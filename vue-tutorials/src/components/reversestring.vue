<template>
    <div>
        <input v-model="message">
        <br/>
        <span>{{ reversedMessage }}</span>
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
        }
    }
}
</script>