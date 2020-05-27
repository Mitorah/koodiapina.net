<template>
    <div>
        <button @click="scramblestring">Scramble</button>
        {{ message }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: "This is message that will be scrambled!"
        }
    },
    methods: {
        scramblestring() {
            let result = [];
            let splitted = this.message.split('');

            while (splitted.length > 0)
            {
                let rng = Math.floor(Math.random() * splitted.length);
                result.push(splitted[rng]);
                splitted.splice(rng, 1);
            }

            this.message = result.join('');
            
        }
    }
}
</script>

<style>

</style>