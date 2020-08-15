<template>
    <v-app>
    <v-container>
        <v-row no-gutters>
            <v-col v-for = "lands in landobjects"
            :key="lands.name">
                <land-button
                :key="lands.name"
                :landid="lands.mana"
                :landname="lands.name"
                @addlands="addlands"
                @removelands="removelands"
                ></land-button>
            </v-col>
        </v-row>
    </v-container>
        <show-lands :manaData="mana"></show-lands>
    </v-app>
</template>

<script>
import land_buttonVue from './land_button.vue'
import show_landsVue from './show_lands.vue'
export default {
    components: {
        'land-button': land_buttonVue,
        'show-lands': show_landsVue
    },
    data() {
        return {
            landobjects: [
                { name: "Island", mana: "u"},
                { name: "Mountain", mana: "r"},
                { name: "Swamp", mana: "b"},
                { name: "Watery Grave", mana: "ub"},
                { name: "Steam Vents", mana: "ur"},
                { name: "Blood Crypt", mana: "br"},
                { name: "Polluted Delta", mana: "ubr"},
                { name: "Scalding Tarn", mana: "ubr"},
                { name: "Creeping Tar Pit", mana: "ub"},
                { name: "Mystic Sanctuary", mana: "u"},
            ],
            
            mana: {
                u: 0,
                r: 0,
                g: 0,
                b: 0,
                w: 0
            }
        }
    },
    methods: {
        addlands(values) {
            console.log(values)
            values.split('').forEach(element => {
                this.mana[element] += 1
            });
        },
        removelands(values) {
            values.split('').forEach(element => {
                this.mana[element] -= 1
            });
        },

    }
}
</script>

<style>

</style>