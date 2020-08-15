<template>
    <v-app>
        <v-row no-gutters>
            <v-col>
                <v-card max-width="500">
                    <v-list-item-content>
                        <v-list-item-title align="center">
                        Total: {{totalMana}}
                        </v-list-item-title>
                    <v-spacer></v-spacer>
                        <v-list-item-title align="center">
                        <show-lands v-if="totalMana > 0" :manaData="mana"></show-lands>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-card>
            </v-col>

            <v-col>
                <v-virtual-scroll 
                :items="landobjects"
                :item-height="80"
                max-width="400"
                height="600">
                    <template v-slot= "{item}">
                        <land-button
                        :landname="item.name"
                        :landid="item.mana"
                        @addlands="addlands"
                        @removelands="removelands"
                        >
                        </land-button>
                    </template>
                </v-virtual-scroll>
            </v-col>
            
        </v-row>
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
            },

            totalMana: 0
        }
    },
    methods: {
        addlands(values) {
            this.totalMana++
            values.split('').forEach(element => {
                this.mana[element] += 1
            });
        },
        removelands(values) {
            this.totalMana--
            values.split('').forEach(element => {
                this.mana[element] -= 1
            });
        },

    }
}
</script>

<style>

</style>