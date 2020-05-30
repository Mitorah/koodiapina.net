<template>
  <div>
      <button @[dynamicAttribute]="buttonfunction">{{ dynamicAttribute }}</button>
      <span> {{ message }}</span>
  </div>
</template>

<script>
export default {
    props: {
        'dynamicAttribute': String,
    },
    data() {
        return {
            message: '',
        }
    },
    methods: {
        buttonfunction() {
            this.message = this.dynamicAttribute + "!"
        }
    }


}
</script>

<style>

</style>