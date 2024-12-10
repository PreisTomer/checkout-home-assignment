<template>
  <div class="cart-container">
    <v-row>
      <v-col cols="12">
        <v-card class="summary-card" color="#f9fafa">
          <v-card-title>Order Summary</v-card-title>
          <v-card-text>
            <div>Subtotal: ${{ orderSummary.subtotal }}</div>
            <div>Shipping: ${{ orderSummary.shipping }}</div>
            <div>Tax: ${{ orderSummary.tax }}</div>

            <div v-if="orderSummary.discount > 0" class="text-green">
              Discount Applied: ${{ orderSummary.discount }}
            </div>
            <div class="text-h6">Total: ${{ orderSummary.total }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col cols="12" v-for="item in cartItems" :key="item.id">
          <v-card class="mb-3" color="#f9fafa">
            <v-row align="center">
              <v-col cols="4" sm="5" md="5">
                <v-img
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="cart-image ml-2"
                ></v-img>
              </v-col>

              <v-col cols="8" sm="7">
                <v-card-title class="text-h6">{{ item.name }}</v-card-title>
                <v-card-subtitle>
                  <div>Size: {{ item.size }}</div>
                  <div>Color: {{ item.color }}</div>
                  <div>Quantity: {{ item.quantity }}</div>
                </v-card-subtitle>

                <v-card-text>
                  <span v-if="item.discountedPrice < item.price">
                    Price: <s>${{ item.price }}</s>
                    <span class="text-green ml-2"
                      >${{ item.discountedPrice }}</span
                    >
                  </span>
                  <span v-else class="price">Price: ${{ item.price }}</span>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  name: "CartComponent",
  props: ["cartItems", "orderSummary"],

  data() {
    return {
      appliedCouponCode: null,
    };
  },
};
</script>

<style>
.cart-image {
  max-width: 200px;
  max-height: 200px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5%;
}
.summary-card {
  padding: 6px;
  margin-bottom: 10px;
}
.text-green {
  color: green;
}
.price {
  font-size: medium;
}
.cart-container {
  padding-top: 10px;
  max-width: 94%;
  max-height: 550px;
}
</style>
