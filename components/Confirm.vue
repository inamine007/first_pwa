<template>
  <div>
    <div v-for="(menu, key) in menus" :key="key" class="d-flex justify-space-between confirm mb-2">
      <span>{{ menu.name }}：
      x{{ menu.amount }}</span>
      <span>{{ menu.amount * menu.price }}円</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    menus: {
      default: () => [],
      type: Array
    },
 },
}
</script>

<style lang="scss">
.confirm {
  font-size: 1.1rem;
}
</style>