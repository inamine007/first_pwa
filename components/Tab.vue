<template>
  <div>
    <v-card :class="['pl-1', 'pr-1', 'pb-3', isMain ? '' : 'card-space']">
      <v-btn
        class="mt-3"
        :color="btnColor"
        width="49%"
        x-large
        :block="isMain"
        dark v-for="(content, key) in item.contents" :key="key" @click="insert(content)">{{ content.name }}</v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  data() {
    return {
      isMain: false
    }
  },
  props: {
    item: {
      default: () => ({}),
      type: Object
    },
    table: String
  },
  computed: {
    btnColor() {
      switch(this.item.tab) {
        case 'antipast':
          return '#F44336';
        case 'pasta':
          return '#2196F3';
        case 'pizza':
          return '#009688';
        case 'main':
          this.isMain = true;
          return '#4CAF50';
        case 'dolce':
          return '#FF9800';
        case 'drink':
          return '#795548';
      }
    }
  },
  methods: {
    insert(content) {
      this.$store.commit('order/insert', {name: content.name, price: content.price, id: content.id, kbn: content.kbn, table: this.table});
    },
  }
}
</script>

<style lang="scss">
.card-space {
  .v-btn:nth-child(even) {    
    margin-left: 5px;
  }
}
</style>