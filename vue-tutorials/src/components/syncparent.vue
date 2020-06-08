<template>
    <div>
        sync-parent not implemented
        <sync-child></sync-child>
    </div>
</template>

<script>
import syncchildVue from './syncchild.vue'
export default {
    components: {
        'sync-child': syncchildVue,
    },
    data() {
        return {

        }
    }

}
</script>

<style>

</style>