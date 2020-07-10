<template>
    <v-app>
        <inherited-component></inherited-component>
    </v-app>
</template>

<script>
import inheritedcomponentVue from './inheritedcomponent.vue'
export default {
    components: {
        'inherited-component': inheritedcomponentVue
    }
}
</script>

<style>

</style>