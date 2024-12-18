<template>
  <div class="checkout-container">
    <div v-if="!isLoaded" class="progress-container">
      <v-progress-circular
        :size="300"
        color="#6993e3"
        indeterminate
        width="20"
      ></v-progress-circular>
    </div>

    <v-card v-else class="mt-5 pt-4 pb-7 px-4" color="#f9fafa">
      <h2 class="mb-3 checkout-title">Checkout</h2>
      <v-row>
        <v-col cols="12" md="7">
          <v-card class="section-card">
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" lg="7">
                  <h3 class="section-title">Shipping Address</h3>
                  <AddressForm
                    @add-new-address="addNewAddress"
                    @update-address="updateAddress"
                    @address-deleted="addressDeleted"
                    :addresses="mockAddresses"
                    :countries="countries"
                  />
                </v-col>

                <v-col cols="12" sm="6" lg="5" class="pl-3 pr-5">
                  <h3 class="section-title mb-4">Payment</h3>
                  <PaymentForm
                    @update-payment="updatePayment"
                    @apply-order-number="applyOrderNumber"
                    @card-deleted="cardDeleted"
                    @add-credit-card="addCard"
                    :paymentOptions="paymentOptions"
                    :creditCards="creditCards"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <div class="submit-button-container">
            <v-btn
              block
              color="primary"
              min-width="200"
              :disabled="!isSubmitDisabled"
              @click="submitCheckout"
            >
              Place Order
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="5">
          <v-card elevation="2">
            <div class="cart-content">
              <Cart :cartItems="cartItems" :orderSummary="orderSummary" />
            </div>
          </v-card>

          <div class="coupon-container">
            <v-text-field
              filled
              class="mt-5 coupon-field"
              v-model="orderDetails.couponCode"
              label="Apply Coupon"
              outlined
              dense
              hide-details
            ></v-text-field>
            <v-btn
              color="primary"
              class="ml-3"
              :loading="couponLoading"
              @click="checkCoupon"
              >Apply</v-btn
            >
          </div>
          <span class="coupon-error" v-if="couponErrorMessage">{{
            couponErrorMessage
          }}</span>
          <div v-if="orderSummary.discount > 0" class="text-green">
            Coupon Applied!
          </div>
          <div :style="'height:24px;'" v-else></div>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title>{{ dialogTitle }}</v-card-title>
          <v-card-text>
            <p>{{ dialogMessage }}</p>
            <div class="dialog-details">
              <ul v-if="dialogSuccess">
                <h4>Items</h4>
                <li v-for="(item, index) in cartItems" :key="index">
                  {{ item.name }} - ${{ item.price }}
                </li>
                <span
                  :style="'color:green; font-style:bold;'"
                  v-if="orderSummary.discount"
                >
                  Discount - ${{ orderSummary.discount }}
                </span>
              </ul>
              <ul class="ml-12">
                <h4>Additional Costs</h4>
                <li>Tax - ${{ orderSummary.tax }}</li>
                <li>Shipping - ${{ orderSummary.shipping }}</li>
              </ul>
            </div>
            <div class="dialog-total">
              <p v-if="dialogSuccess" class="mt-5 text-h6">
                Total: ${{ orderSummary.total }}
              </p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>
  
  <script>
import AddressForm from "../components/AddressForm.vue";
import PaymentForm from "../components/PaymentForm.vue";
import Cart from "../components/Cart.vue";
import { getCart, applyCoupon } from "../api/cart";
import { addAddress, getAddresses, getCountries } from "../api/address";
import {
  getPaymentOptions,
  getCreditCards,
  addCreditCard,
  applyPurchaseOrderNumber,
  selectCreditCardMethod,
} from "../api/payment";
import { submitOrder, handleCheckout } from "../api/order";

export default {
  name: "CheckoutPage",
  components: {
    AddressForm,
    PaymentForm,
    Cart,
  },
  data() {
    return {
      selectedAddressId: {},
      paymentDetails: {},
      orderSummary: {},
      couponLoading: false,
      cartItems: [],
      countries: [],
      dialog: false,
      dialogTitle: "",
      dialogMessage: "",
      dialogSuccess: false,
      creditCards: [],
      paymentOptions: [],
      mockAddresses: [],
      orderDetails: {
        cartId: "",
        addressId: "",
        paymentMethod: "",
        couponCode: "",
        termsAndConditionsAccepted: true,
      },
      isAddressSelected: false,
      isPaymentSelected: false,
      couponErrorMessage: "",
    };
  },
  computed: {
    isSubmitDisabled() {
      return this.isAddressSelected && this.isPaymentSelected;
    },
    isLoaded() {
      return this.cartItems.length > 0;
    },
  },
  methods: {
    async checkCoupon() {
      this.couponLoading = true;
      this.couponErrorMessage = "";
      await applyCoupon(this.orderDetails.couponCode)
        .then(() => {
          this.fetchCart();
          this.couponLoading = false;
        })
        .catch(() => {
          this.couponLoading = false;
          this.couponErrorMessage = "coupon code not found";
        });
    },
    updateAddress(id) {
      this.selectedAddressId = id;
      this.isAddressSelected = true;
    },
    addressDeleted() {
      this.$emit("show-snackbar", {
        text: "Address Deleted",
        success: true,
      });
      this.fetchAddresses();
    },
    cardDeleted() {
      this.$emit("show-snackbar", {
        text: "Credit Card Deleted",
        success: true,
      });
      this.fetchCreditCards();
    },
    async addNewAddress(addressData) {
      await addAddress(addressData)
        .then(() => {
          this.fetchAddresses();
          this.$emit("show-snackbar", {
            text: "New Address Added",
            success: true,
          });
        })
        .catch((e) => {
          this.$emit("show-snackbar", {
            text: e.message,
            success: false,
          });
        });
    },
    async updatePayment(paymentDetails) {
      this.paymentDetails = paymentDetails;
      if (this.paymentDetails.method === "CreditCard") {
        try {
          await selectCreditCardMethod(paymentDetails.cardId);
          this.paymentDetails.paymentInfoId = paymentDetails.cardId;
          this.isPaymentSelected = true;
        } catch (error) {
          this.$emit("show-snackbar", {
            text: error.message,
            success: false,
          });
        }
      }
    },
    async addCard(cardData) {
      try {
        await addCreditCard(cardData).then(() => {
          this.fetchCreditCards();
          this.$emit("show-snackbar", {
            text: "Added New Credit Card",
            success: true,
          });
        });
        this.fetchCreditCards();
      } catch (error) {
        this.$emit("show-snackbar", {
          text: error.message,
          success: false,
        });
      }
    },
    async applyOrderNumber(number) {
      try {
        await applyPurchaseOrderNumber(number).then((res) => {
          this.$emit("show-snackbar", {
            text: "Purchase Order Number Applied",
            success: true,
          });
          this.paymentDetails.paymentInfoId = res.id;
          this.isPaymentSelected = true;
        });
      } catch (error) {
        this.$emit("show-snackbar", {
          text: error.message,
          success: false,
        });
      }
    },
    async fetchAddresses() {
      try {
        const response = await getAddresses();
        this.mockAddresses = response;
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    },
    async fetchCart() {
      try {
        const { cartItems, orderSummary, appliedCouponCode } = await getCart();
        this.cartItems = cartItems;
        this.orderSummary = orderSummary;
        this.appliedCouponCode = appliedCouponCode;
        this.orderDetails.cartId = orderSummary.id;
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    },
    async fetchPaymentOptions() {
      try {
        const options = await getPaymentOptions();
        this.paymentOptions = options;
      } catch (error) {
        console.error("Error fetching payment options:", error);
      }
    },
    async fetchCreditCards() {
      try {
        this.creditCards = await getCreditCards();
      } catch (error) {
        console.error("Error fetching credit cards:", error);
      }
    },
    async fetchCountries() {
      try {
        this.countries = await getCountries();
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    },

    async submitCheckout() {
      try {
        const finalizedOrderDetails = handleCheckout({
          paymentDetails: this.paymentDetails,
          addressId: this.selectedAddressId,
          orderDetails: this.orderDetails,
        });
        await submitOrder(finalizedOrderDetails)
          .then(() => {
            this.dialogTitle = "Order Placed Successfully!";
            this.dialogMessage =
              "Your order has been placed. Here are the details:";
            this.dialogSuccess = true;
          })
          .catch((error) => {
            this.dialogTitle = "Order Failed";
            this.dialogMessage = error.message;
            this.dialogSuccess = false;
          });
      } catch (error) {
        this.dialogTitle = "Order Failed";
        this.dialogMessage = error.message || "An error occurred";
        this.dialogSuccess = false;
      }

      this.dialog = true;
    },
  },
  async mounted() {
    await this.fetchPaymentOptions();
    await this.fetchAddresses();
    await this.fetchCart();
    await this.fetchCreditCards();
    await this.fetchCountries();
  },
};
</script>
  
<style scoped>
.progress-container {
  width: 100%;
  margin-top: 40px;
  height: 90vh;
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 100%
  );

  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-container {
  height: 100%;
}

.checkout-title {
  display: flex;
  justify-content: center;
  align-content: center;
  color: black;
}

.section-card {
  background-color: #ffffff;
  border-radius: 8px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.cart-title {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.cart-content {
  max-height: calc(100vh - 260px);
  padding: 6px 0 6px 6px;
  display: flex;
  align-content: center;
  overflow-y: auto;
  justify-content: center;
}

.coupon-container {
  display: flex;
  align-items: baseline;
}

.coupon-field {
  background-color: #e4eeff;
  background-size: cover;
  background-position: 50% 50%;
}

.coupon-error {
  margin-top: -10px;
  font-size: small;
  color: darkred;
}

.submit-button-container {
  margin-top: 10px;
}

.dialog-total {
  display: flex;
  justify-content: center;
}
.dialog-details {
  display: flex;
}
</style>
  