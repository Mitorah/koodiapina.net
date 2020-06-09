<template>
    <div>
        <sync-child-boolean v-model="childBoolean">
        </sync-child-boolean>
        Boolean in parent: {{ childBoolean }}
        <br/>
        <br/>
        <sync-child-string v-model="childString">
        </sync-child-string>
        String in parent: {{ childString }}


    </div>
</template>

<script>
import syncchildVue from './syncchildboolean.vue'
import syncchildstringVue from './syncchildstring.vue'
export default {
    components: {
        'sync-child-boolean': syncchildVue,
        'sync-child-string': syncchildstringVue,
    },
    data() {
        return {
            childBoolean: true,
            childString: "New string"
        }
    }

}
</script>

<style>

</style>