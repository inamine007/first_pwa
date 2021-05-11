<template>
  <div>
    <v-btn
      :ref="table.name"
      :class="['table', table.name]"
      @click="setTable(table)"
      :height="height"
      :width="width"
      :outlined= isOutlined
      :fab= isSmall
      :color="btnColor">{{ table.name }}</v-btn>
  </div>
</template>

<script>
import SteinStore from 'stein-js-client'

const store = new SteinStore(process.env.API_URL);
export default {
  name: 'Top',
  data() {
    return {
      isOutlined: false,
      isSmall: false,
      height: '15%',
      width: '40%'
    }
  },
  props: {
    table: {
      default: () => ({}),
      type: Object
    },
  },
  mounted() {
    let small = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];
    let large = ['T31', 'T32', 'T33'];
    if (small.includes(Object.keys(this.$refs)[0])) {
      this.isSmall = true;
      this.height = 50;
      this.width = 50;
    } else if (large.includes(Object.keys(this.$refs)[0])) {
      this.height = '22%';
      this.width = '30%';
    }
  },
  computed: {
    btnColor() {
      switch(this.table.stat) {
        case '0':
          this.isOutlined = true;
          return 'white';
        case '1':
          return 'success';
        case '2':
          return 'error';
      }
    }
  },
  methods: {
    setTable(table) {
      if (table.stat == '0') {
        this.$router.push({path: `/settable/${table.name}`});
      } else if (table.stat == '1') {
        store.read("results", { serach: { table: table.name, stat: '1' } }).then(data => {
          this.$router.push({path: `/order/${table.name}/${data[0].id}`});
        }).catch(error => {
          console.log(error);
        });
      } else {
        store.read("results", { serach: { table: table.name, stat: '2' } }).then(data => {
          this.$router.push({path: `/finished/${table.name}/${data[0].name}`});
        });
      }
    }
  }
}
</script>

<style lang="scss">
.table {
  position: fixed !important;
  @for $value from 1 through 8 {
    &.T#{$value} {
      left: 10%;
      top: 15% + $value * 9.5;
    }
  }
  @for $value from 1 through 4 {
    &.T2#{$value} {
      right: 10%;
      top: 8% + $value * 16;
    }
  }
  &.T32 {
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
  }
  &.T33 {
    top: 0;
    right: 0;
  }
}
</style>