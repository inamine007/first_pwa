<template>
  <div>
    <div v-for="(menu, key) in menus" :key="key">
      <div class="cart mb-1">
        {{ menu.name }}：
        <span>{{ menu.amount }}</span>
      </div>
      <div v-if="menu.send_flg === '0'" class="d-flex justify-space-between mb-3">
        <v-btn @click="countUp(menu)" width="30%"><v-icon>mdi-arrow-up</v-icon></v-btn>
        <v-btn @click="countDown(menu)" width="30%"><v-icon>mdi-arrow-down</v-icon></v-btn>
        <v-btn @click="chancelItem(menu)" color="error">削除</v-btn>
      </div>
      <div v-else class="mb-3 sended">
        送信済 {{ menu.send_time }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: {
    menus: {
      default: () => [],
      type: Array
    },
    table: String
 },
 methods: {
    countUp(menu) {      
      this.$store.commit('order/countUp', {name: menu.name, id: menu.id, kbn: menu.kbn, table: this.table});
    },
    countDown(menu) {
      this.$store.commit('order/countDown', {name: menu.name, id: menu.id, kbn: menu.kbn, table: this.table});
    },
    chancelItem(menu) {
      this.$store.commit('order/chancelItem', {name: menu.name, id: menu.id, kbn: menu.kbn, table: this.table});
    },
  }
}
</script>

<style lang="scss">
.cart {
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 1.5rem;
  }
}
.sended {
  color: red;
  font-size: 0.9rem;
  text-align: right;
}
</style>