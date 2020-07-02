<template>
        <v-text-field readonly v-model="handledMessage"></v-text-field>
</template>

<script>
export default {
    props: {
        message: String,
        reversed: Boolean
    },
    data() {
        return {
        }
    },
    computed: {
        handledMessage() {
            return this.reversed ? this.reversedMessage : this.message
        },
        reversedMessage() {
            return this.message.split('').reverse().join('');
        }
    }
}
</script>

<style>

</style>