<template>
  <div>
    <v-container>
      <h1 v-show="!orders.length">伝票はありません。</h1>
      <div v-for="(order, key) in orders" :key="key">
        <v-card v-show="!order.served" class="pr-1 pl-1 pt-1 pb-1">
          <div class="table">{{ order.table }}</div>
          <div class="small">伝票ID:{{ order.id }}</div>
          <div class="count">人数:{{ order.people }}</div>
          <hr class="mb-2">
          <div v-for="(item, index) in order.order" :key="index" class="order d-flex justify-space-between">
            <span>{{ item.name }}</span>
            <span>x{{ item.amount }}</span>
          </div>
          <hr>
          <div class="time small">{{ order.send_time }}</div>
          <div class="btn-right mt-2"><v-btn @click="served(order)" color="primary">提供完了</v-btn></div>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import SteinStore from 'stein-js-client'

const store = new SteinStore(process.env.API_URL);

export default {
 data() {
   return {
     isFood: false
   }
 },
 async asyncData() {
   const denpyo = await store.read("denpyo", { search: {deleted_flg: '0'} }).then(data => {
      return data;
    });
    let orders = [];
    let table = '';
    let denpyo_id = '';
    let result_id = '';
    for(let i=0; i < denpyo.length; i++) {
      table = denpyo[i].id.split('-')[1];
      denpyo_id = denpyo[i].id;
      result_id = denpyo[i].result_id;
      function getOrder(sheet) {
        const order = store.read(sheet, { search: {denpyo_id: denpyo_id} }).then(data => {
          return data;
        });
        return order;
      }
      const d_order = await getOrder('d_orders');
      const f_order = await getOrder('f_orders');
      console.log(f_order);
      await store.read('results', { search: {id: result_id, table: table} }).then(data => {
        function pushOrder(order, kbn) {
          orders.push({
            id: denpyo_id,
            result_id: result_id,
            table: table,
            kbn: kbn,
            send_time: denpyo[i].updated_at,
            served: false,
            people: Number(data[0].men) + Number(data[0].women) + Number(data[0].others),
            order: order
          });
        }
        if (d_order.length) {
          if (f_order.length) {
            pushOrder(f_order, 1);
            pushOrder(d_order, 2);
          } else {
            pushOrder(d_order, 2);
          }
        } else {
          if (f_order.length) {
            pushOrder(f_order, 1);
          }
        }
      });
    }
    return { orders: orders };
 },
 methods: {
   served(order) {
      let orders = this.orders; 
      for(let i=0; i < orders.length; i++) {
        if (orders[i].id === order.id && orders[i].kbn === order.kbn) {
          orders[i].served = true;
          break;
        }
      }
      const check_order = orders.filter((element) => {
          return element.id === order.id;
      });
      let finished = false;
      check_order.forEach(function(value) {
        finished = value.served ? true : false;
      });
      if (finished) {
        store.edit('denpyo', {
          search: {id: order.id},
          set: {deleted_flg: '1'}
        }).then(res => {
          console.log(res);
        });
      }
    }
  }
}
</script>

<style lang="scss">
.table {
  font-size: 1.2rem;
}
.count {
  font-size: 1.2rem;
}
.time {
  text-align: right;
}
.order {
  font-size: 1.3rem;
}
</style>