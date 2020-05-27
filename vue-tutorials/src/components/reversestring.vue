<template>
    <div>
        <button @click="reversemessage">Reverse
        </button>
        {{ message }}
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
    }
}
</script>