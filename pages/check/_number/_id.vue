<template>
  <div>
    <v-container>
      <h1>{{ tableNumber }}</h1>
      <div class="small">{{ now }}</div>
      <div class="small">取引ID:{{ id }}</div>
      <hr>
      <Check :orders="f_orders" />
      <Check :orders="d_orders" />
      <hr class="mb-2">
      <div class="d-flex justify-space-between">小計 <span>￥{{ beforeTaxTotal }}</span></div>
      <div class="d-flex justify-space-between">税 10% <span>￥{{ taxTotal }}</span></div>
      <div class="total">合計 <span>￥{{ afterTaxTotal }}</span></div>
      <v-text-field
        v-model="oadukari"
        name="oadukari"
        type="number"
        label="お預かり金額"
        placeholder="0"></v-text-field>
      <div class="total mb-3">お釣り <span>￥{{ otsuri.toLocaleString() }}</span></div>
      <div v-if="(isCheck)" class="btn-right"><v-btn @click="checkTable()" color="warning" x-large>お会計</v-btn></div>
      <div v-else class="btn-right"><v-btn disabled>お会計</v-btn></div>
    </v-container>
  </div>
</template>

<script>
import SteinStore from 'stein-js-client'
import Check from '../../../components/Check.vue'

const store = new SteinStore(process.env.API_URL)

export default {
  components: { Check },
  data() {
    return {
      id: this.$route.params.id,
      tableNumber: this.$route.params.number,
      isCheck: false,
      otsuri: 0,
      oadukari: '',
    }
  },
  async asyncData({ params, app }) {
    const results = await store.read("results", { search: {id: params.id, table: params.number} }).then(data => {
      return data[0];
    });
    const denpyo = await store.read("denpyo", { search: {result_id: params.id, table: params.number} }).then(data => {
      return data;
    });
    let d_orders = [];
    let f_orders = [];
    for(let i=0; i < denpyo.length; i++) {
      setOrder('d_orders', d_orders, i);
      setOrder('f_orders', f_orders, i);
    }
    async function setOrder(sheet, orders, i) {
      await store.read(sheet, { search: {denpyo_id: denpyo[i].id} }).then(data => {
        for(let j=0; j < data.length; j++) {
          let value = getOrderIndex(orders, data[j].name);
          if (value || value === 0) {
            orders[value].amount = Number(orders[value].amount) + Number(data[j].amount);
            orders[value].syokei = (orders[value].amount * Number(data[j].price)).toLocaleString();
          } else {
            orders.push({
              name: data[j].name,
              amount: data[j].amount,
              price: Number(data[j].price).toLocaleString(),
              syokei: (Number(data[j].amount) * Number(data[j].price)).toLocaleString(),
            });
          }
        }
      });
    }
    function getOrderIndex(orders, name) {
      if (!orders.length) return false;
      let value = '';
      for(let i=0; i < orders.length; i++) {
        if (orders[i].name === name) {
          value = i;
          break;
        } else {
          value = false;
        }
      }
      return value;
    }    
    return {
      results: results,
      d_orders: d_orders,
      f_orders: f_orders,
    }
  },
  computed: {
    now() {
      const d = new Date();
      return this.$getNow(d);
    },
    beforeTaxTotal() {
      return Number(this.results.before_tax_total).toLocaleString();
    },
    taxTotal() {
      return Number(this.results.tax_total).toLocaleString();
    },
    afterTaxTotal() {
      return Number(this.results.after_tax_total).toLocaleString();
    },
  },
  watch: {
    oadukari(value) {
      if (value >= Number(this.results.after_tax_total)) {
        this.isCheck = true;
        this.otsuri = value - Number(this.results.after_tax_total);
      } else {
        this.isCheck = false;
        this.otsuri = 0;
      }
    }
  },
  methods: {
    checkTable() {
      this.$store.commit('order/checkTable', {table: this.tableNumber, id: this.id});
      store.edit("results", {
        search: {id: this.id, table: this.tableNumber},
        set: {
          stat: '2',
          oadukari: this.oadukari,
          otsuri: this.otsuri
        }
      }).then(res => {
        console.log(res);
        store.edit("tables", {
          search: {name: this.tableNumber},
          set: {stat: '2'}
        }).then(res => {
          console.log(res);
          this.$router.push({path: `/finished/${this.tableNumber}/${this.id}`});
        });
      });
    }
  }
}
</script>