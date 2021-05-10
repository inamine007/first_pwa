<template>
  <div>
    <v-container class="container">
      <h1>{{ tableNumber }}</h1>
      <h2>お会計は終了しました。</h2>
      <div class="mt-3"><v-btn @click="risetTable()" color="error" x-large>案内可能にする</v-btn></div>
      <div class="mt-3"><v-btn @click="linkTable()" color="secondary" x-large>テーブル画面に移動</v-btn></div>
    </v-container>
  </div>
</template>

<script>
import SteinStore from 'stein-js-client'

const store = new SteinStore(process.env.API_URL)

export default {
  data() {
    return {
      id: this.$route.params.id,
      tableNumber: this.$route.params.number,
    }
  },
  methods: {
    risetTable() {
      store.edit("results", {
        search: {id: this.id, table: this.tableNumber},
        set: {stat: '0'}
      }).then(res => {
        console.log(res);
        store.edit("tables", {
          search: {name: this.tableNumber},
          set: {stat: '0'}
        }).then(res => {
          this.$router.push({path: '/'});
        });
      });
    },
    linkTable() {
      this.$router.push({path: '/'});
    }
  }
}
</script>

<style lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>