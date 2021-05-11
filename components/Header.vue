<template>
  <div>
    <v-app-bar
      dense
      dark>
      <v-btn
        class="ma-2"
        dark
        @click="back()">
        <v-icon dark left>
          mdi-arrow-left
        </v-icon>Back
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title class="mr-4">{{ table }}</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      table: this.$route.params.number,
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
}
</script>