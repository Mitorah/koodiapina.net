<template>
    <div>
        <span v-if="reversed">{{ reversedMessage }}</span>
        <span v-else>{{ message }}</span>
    </div>
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
        reversedMessage: function() {
            return this.message.split('').reverse().join('');
        }
    }
}
</script>

<style>

</style>