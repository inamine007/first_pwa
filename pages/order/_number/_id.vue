<template>
  <div>
    <Header />
    <v-container>
      <v-card>
        <v-tabs
          v-model="tab"
          background-color="primary"
          dark
          grow
          show-arrows
        >
          <v-tab
            v-for="item in items"
            :key="item.tab">{{ item.tab }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item in items"
            :key="item.tab"
          >
            <Tab :item="item" :table="tableNumber" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
      <v-card class="mt-5 pt-3 pl-1 pb-3 pr-1">
        <v-card-title>注文状況</v-card-title>
        <Cart :menus="orders.f_menu" :table="tableNumber" />
        <Cart :menus="orders.d_menu" :table="tableNumber" />
        <v-divider class="mt-2"></v-divider>
        <div v-if="orders" class="total mb-3">
          合計：<span>{{ orders.total }}円</span>
        </div>
        <div v-else class="cart-total mb-3">
          合計：<span>0円</span>
        </div>
        <div class="btn-right"><v-btn @click="confirm()" color="primary">確認画面へ</v-btn></div>
        <div class="btn-right"><v-btn v-show="isCheck" @click="check()" class="mt-2" color="warning">お会計</v-btn></div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import SteinStore from 'stein-js-client'
import Cart from '../../../components/Cart.vue'
import Tab from '../../../components/Tab.vue'
import Header from '../../../components/Header.vue'


const store = new SteinStore(process.env.API_URL)

export default {
  components: {
    Cart,
    Tab,
    Header
  },
  data() {
    return {
      id: this.$route.params.id,
      tableNumber: this.$route.params.number,
      tab: null, 
    }
  },
  computed: {
    orders() { 
      const orders = this.$store.state.order.order.find(item => item.table === this.tableNumber);
      console.log(this.$store.state);
      return !orders ? false:orders;
    },
    isCheck() {
      let differs = false;
      if (this.orders) {
        for(let i=0; i < this.orders.f_menu.length; i++) {
          if (this.orders.f_menu[0].send_flg === '1') {
            differs = true;
            break;
          } else {
            differs = false;
          }
        }
        for(let i=0; i < this.orders.d_menu.length; i++) {
          if (this.orders.d_menu[0].send_flg === '1') {
            differs = true;
            break;
          } else {
            differs = false;
          }
        }
      }
      return differs;
    }
  },
  async asyncData() {
    const [antipast, pasta, pizza, main, dolce, drink] = await Promise.all(
      ['antipast', 'pasta', 'pizza', 'main', 'dolce', 'drink'].map((itemType) => {
        return store.read(itemType);
      })
    );
    return { 
      items: [
        { tab: 'antipast', contents: antipast },
        { tab: 'pasta',    contents: pasta },
        { tab: 'pizza',    contents: pizza },
        { tab: 'main',     contents: main },
        { tab: 'dolce',    contents: dolce },
        { tab: 'drink',    contents: drink },
      ]
    }
  },
  methods: {
    confirm() {
      this.$router.push({path: `/confirm/${this.tableNumber}/${this.id}`});
    },
    check() {
      this.$router.push({path: `/check/${this.tableNumber}/${this.id}`});
    }
  }
}
</script>

<style lang="scss">

</style>