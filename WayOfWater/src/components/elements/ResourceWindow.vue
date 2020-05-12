<template>
    <div >
        <div>
        {{ resourceWindowTitle }}

        <ul v-for="(resourcename, index) in resources"
        v-bind:key = resourcename>
        <ui-resource-element v-bind:title = resourcename></ui-resource-element>
        <button @click="resources.splice(index,1)">-</button>
        </ul>
        <br>
        <button @click="resources.push('')">New Resource</button>
        
        <ul v-for="(rulename, index) in rules"
        v-bind:key = rulename>
        <ui-rule-element v-bind:title = rulename></ui-rule-element>
        <button @click="resources.splice(index,1)">-</button>
        </ul>
        <br>
        <button @click="rules.push('')">New rule</button>
        
        
        </div>
    </div>
</template>

<script>
import ResourceElement from './ResourceElement'
import RuleElement from './RuleElement'

export default {
    props: {
        resourceWindowTitle: String,
    },
    data() {
        return {
            resources: [
            ],
            rules: [

            ]
        }
    },
    components: {
        'ui-resource-element': ResourceElement,
        'ui-rule-element': RuleElement
    }
}
</script>