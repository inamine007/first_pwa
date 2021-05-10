<template>
  <div v-if="isBlack" :class="'black'">
    <div v-for="(table, key) in tables" :key="key">
      <Top :table="table" />
    </div>
    <div class="clock" @click="checkDenpyou()">{{ now }}</div>
  </div>
</template>

<script>
import SteinStore from 'stein-js-client'
import Top from '../components/Top.vue';

const store = new SteinStore(process.env.API_URL);

export default {
  components: { Top },
 data() {
   return {
     now: 'wait.......',
     isBlack: true,
     isOutlined: false
   }
 },
 async asyncData() {
   const tables = await store.read("tables").then(data => {
      return data;
    });
    return { tables: tables };
 },
 created() {
   setInterval(() => {
     var d = new Date();
     this.now = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
                + ':' + d.getSeconds().toString().padStart(2, '0');
   }, 1000);
 },
 methods: {
   checkDenpyou() {
     this.$router.push({path: '/denpyo'})
   }
 }
}
</script>

<style lang="scss">
  .black {
    height: 100vh;
  }
  .clock {
    position: relative;
    color: white;
    font-size: 2.3rem;
    position: fixed;
    bottom: 0;
    right: 0;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    padding: 4% 1% 0% 1%;
    &::after {
      position: absolute;
      content: '伝票状況';
      top: 2px;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 1rem;
      color: red;
    }
  }
</style>