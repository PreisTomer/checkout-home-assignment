<template>
  <v-app>
    <div class="page-container">
      <v-container>
        <Checkout />
      </v-container>
    </div>
  </v-app>
</template>

<script>
import Checkout from "./pages/Checkout.vue";

export default {
  name: "App",
  components: {
    Checkout,
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}
.page-container {
  background-image: url("@/assets/abstract-plastic-bag-concept-with-copy-space.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>
