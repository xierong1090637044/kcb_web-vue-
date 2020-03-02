<template>

</template>

<script>
  let that;
  export default {
    
    mounted() {
      that = this;
      const query = Bmob.Query("_User");
      query.find().then(res => {
          console.log(res)
      });
    },
  }
</script>

<style>
</style>
