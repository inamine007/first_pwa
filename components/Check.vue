<template>
  <div>
    <div v-for="(order, key) in orders" :key="key" class="check d-flex justify-space-between">
      <span>{{ order.name }}
      @{{ order.price }} x {{ order.amount }}</span>
      <span>￥{{ order.syokei }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Check',
  props: {
    orders: {
      default: () => [],
      type: Array
    },
 },
}
</script>

<style lang="scss">
.check {
  font-size: 1rem;
  letter-spacing: -0.08rem;
}
</style>