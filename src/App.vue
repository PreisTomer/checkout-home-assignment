<template>
  <v-app>
    <div class="page-container">
      <v-snackbar
        :value="showMessage"
        timeout="5000"
        :color="snackbarMessageColor"
        top
        >{{ snackBarText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="showMessage = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-container>
        <Checkout @show-snackbar="showSnackbar" />
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
  data() {
    return {
      showMessage: false,
      snackBarText: "",
      snackbarMessageColor: "",
    };
  },
  methods: {
    showSnackbar(data) {
      this.snackBarText = data.text;
      this.snackbarMessageColor = data.success ? "success" : "red";
      this.showMessage = true;
    },
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
