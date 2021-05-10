<template>
  <div>
    <v-container>
      <h1>{{ tableNumber }}</h1>
      <h3 class="mb-2">以下の内容で確定しますか？</h3>
      <Confirm :menus="orders.f_menu" />
      <Confirm :menus="orders.d_menu" />
      <v-divider class="mt-2 mb-2"></v-divider>
      <div class="total">
        合計：<span>{{ orders.total }}円</span>
      </div>
      <div class="btn-right mt-3"><v-btn @click="sendOrder(orders, tableNumber, id)" color="primary">確定</v-btn></div>
    </v-container>
  </div>
</template>

<script>
import SteinStore from 'stein-js-client'
import Confirm from '../../../components/Confirm.vue'

const store = new SteinStore(process.env.API_URL)

export default {
  components: { Confirm },
  data() {
    return {
      id: this.$route.params.id,
      tableNumber: this.$route.params.number,
    }
  },
  computed: {
    orders() { 
      const orders = this.$store.state.order.order.find(item => item.table === this.tableNumber);
      return !orders ? false:orders;
    }
  },
  methods: {
    sendOrder(orders, tableNumber, result_id) {
      const d = new Date();
      const now = this.$getNow(d);
      const fmt = this.$getNowById(d);
      const after_tax_total = this.orders.total;
      store.edit("results", {
        search: {id: this.id, table: this.tableNumber},
        set: {
          updated_at: now,
          after_tax_total: after_tax_total,
          before_tax_total: this.$taxExcl(after_tax_total),
          tax_total: after_tax_total - this.$taxExcl(after_tax_total),
        }
      }).then(res => {
        console.log(res);
        let d_total = this.$store.getters['order/getTotal'](this.tableNumber, 'D', this);
        let f_total = this.$store.getters['order/getTotal'](this.tableNumber, 'F', this);
        store.append("denpyo", [
          d_total ?
          {
            result_id: this.id,
            table: this.tableNumber,
            id: 'D' + '-' + this.tableNumber + '-' + fmt,
            created_at: now,
            updated_at: now,
            total: d_total,
            deleted_flg: '0'
          } : {},
          f_total ?
          {
            result_id: this.id,
            table: this.tableNumber,
            id: 'F' + '-' + this.tableNumber + '-' + fmt,
            created_at: now,
            updated_at: now,
            total: f_total,
            deleted_flg: '0'
          } : {}
        ]).then(res => {
          console.log(res);
          let promise = Promise.resolve();
          let d_last = this.orders.d_menu.length;
          for(let i=0; i < d_last; i++) {
            promise = promise.then(task.bind(this, i, this.$store, orders.d_menu, 'd_orders', 'D'));
          }
          let f_last = this.orders.f_menu.length;
          for(let i=0; i < f_last; i++) {
            promise = promise.then(task.bind(this, i, this.$store, orders.f_menu, 'f_orders', 'F'));
          }
          this.$router.push({path: '/'});
          function task(val, order, menus, sheet, kbn) {
            if (menus[val].send_flg === '0') {
              return new Promise(function(resolve, reject) {
                setTimeout(function() {
                  store.append(sheet, [
                    {
                      result_id: result_id,
                      denpyo_id: kbn + '-' + tableNumber + '-' + fmt,
                      id: val + 1,
                      name: menus[val].name,
                      amount: menus[val].amount,
                      price: menus[val].price,
                      kbn: menus[val].kbn
                    }
                  ]).then(res => {
                    console.log(res);
                    order.commit('order/sended', {table: tableNumber, id: menus[val].id, name: menus[val].name, kbn: kbn});
                  }).catch(error => {
                    console.log(error);
                  })
                  resolve();              
                }, 1000);
              });
            }
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
</script>