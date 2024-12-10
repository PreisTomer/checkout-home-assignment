<template>
  <div>
    <v-select
      v-model="paymentMethod"
      :items="paymentOptions"
      label="Select Payment Method"
      @change="handlePaymentMethodChange"
    ></v-select>

    <div v-if="paymentMethod === 'CreditCard'">
      <v-select
        v-model="selectedCreditCard"
        :items="creditCards"
        label="Select Credit Card"
        item-text="cardNumber"
        item-value="id"
        @change="populateCreditCardDetails"
      >
        <template v-slot:selection="{ item }">
          {{ item.cardNumber }}
          <v-icon
            small
            class="ml-2"
            color="red"
            @click.stop="openDeleteDialog(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-select>

      <v-text-field
        v-model="creditCard.cardHolderName"
        label="Cardholder Name"
        @input="emitPaymentDetails"
        outlined
        dense
      ></v-text-field>

      <v-text-field
        v-model="creditCard.cardNumber"
        label="Card Number"
        type="text"
        @input="emitPaymentDetails"
        outlined
        dense
      ></v-text-field>

      <v-layout>
        <v-flex xs6>
          <v-text-field
            v-model="creditCard.expiryMonth"
            label="Expiry Month"
            type="number"
            @input="emitPaymentDetails"
            min="1"
            max="12"
            outlined
            dense
          ></v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model="creditCard.expiryYear"
            label="Expiry Year"
            type="number"
            min="24"
            @input="emitPaymentDetails"
            outlined
            dense
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-text-field
        v-model="creditCard.cvv"
        label="CVV"
        type="text"
        maxlength="4"
        @input="emitPaymentDetails"
        outlined
        dense
      ></v-text-field>
    </div>

    <div v-if="paymentMethod === 'PurchaseOrder'">
      <v-text-field
        v-model="purchaseOrderNumber"
        label="Purchase Order Number"
        @input="emitPaymentDetails"
        outlined
        dense
      ></v-text-field>
    </div>

    <v-dialog v-model="deleteDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this credit card?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn text color="red" @click="confirmDelete"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { deleteCreditCard } from "../api/payment";

export default {
  name: "PaymentForm",
  props: ["paymentOptions", "creditCards"],
  data() {
    return {
      paymentMethod: "",
      selectedCreditCard: null,
      creditCard: {
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardHolderName: "",
        saved: false,
        id: "",
      },
      purchaseOrderNumber: "",
      minDate: new Date().toISOString().substr(0, 10),
      deleteDialog: false,
      cardToDelete: null,
    };
  },
  watch: {
    isValid(newVal) {
      this.$emit("validity-change", newVal);
    },
  },
  computed: {
    isValid() {
      if (this.paymentMethod.length) {
        if (this.paymentMethod === "CreditCard") {
          return !!(
            this.creditCard.expiryMonth &&
            this.creditCard.expiryYear &&
            this.creditCard.cvv &&
            this.creditCard.cardHolderName
          );
        } else {
          return !!this.purchaseOrderNumber;
        }
      } else {
        return false;
      }
    },
  },
  methods: {
    handlePaymentMethodChange() {
      this.emitPaymentDetails();
    },
    getPaymentData() {
      if (this.paymentMethod === "CreditCard") {
        return this.creditCard;
      } else {
        return {
          method: this.paymentMethod,
          purchaseOrderNumber: this.purchaseOrderNumber,
        };
      }
    },
    populateCreditCardDetails(cardId) {
      const card = this.creditCards.find((c) => c.id === cardId);
      if (card) {
        this.creditCard = { ...card };
        this.emitPaymentDetails();
      }
    },
    openDeleteDialog(card) {
      this.cardToDelete = card;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      try {
        if (this.cardToDelete && this.cardToDelete.id) {
          await deleteCreditCard(this.cardToDelete.id);
          this.deleteDialog = false;
          this.cardToDelete = null;
        }
        this.$emit("card-deleted");
      } catch (error) {
        console.error("Error deleting credit card:", error);
      }
    },
    emitPaymentDetails() {
      const paymentDetails =
        this.paymentMethod === "CreditCard"
          ? {
              method: "CreditCard",
              ...this.creditCard,
            }
          : {
              method: "PurchaseOrder",
              purchaseOrderNumber: this.purchaseOrderNumber,
            };

      this.$emit("update-payment", paymentDetails);
    },
  },
};
</script>
