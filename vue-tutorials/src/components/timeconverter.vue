<template>
  <v-app>
      <v-col sm="2">
        <v-text-field type="number" label="Days" v-model="decimalDays"></v-text-field>
        <v-text-field type="number" label="Time as decimal (hours)" v-model="decimalTime"></v-text-field>
        <v-text-field label="Time" v-model="convertedTime"></v-text-field>
      </v-col>
  </v-app>
</template>

<script>
export default {
    data() {
        return {
            decimalDays: "1",
            decimalTime: "1"
        }
    },
    computed: {
        convertedTime() {
            
            var inputTime = (this.decimalDays * this.decimalTime).toString().split(".")
            

            var days = 0
            var hours = inputTime[0]
            var minutes = Math.floor((this.decimalTime * this.decimalDays - inputTime[0]) * 60)

            while (hours >= 24) {
                days++
                hours -= 24
            }

            if (days > 0)
                return days + "d" + hours + "h" + minutes + "m"
            else if (hours > 0)
                return hours + "h" + minutes + "m"
            else
                return minutes + "m"
                
        }
    } 
}
</script>

<style>

</style>