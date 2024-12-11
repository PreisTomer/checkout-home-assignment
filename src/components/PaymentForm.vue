<template>
  <div>
    <v-select
      v-model="paymentMethod"
      :items="paymentOptions"
      label="Select Payment Method"
    ></v-select>

    <div v-if="paymentMethod === 'CreditCard'">
      <v-text-field
        v-model="creditCard.cardHolderName"
        label="Cardholder Name"
        :readonly="readOnly"
        outlined
        dense
      ></v-text-field>

      <v-text-field
        v-model="creditCard.cardNumber"
        :readonly="readOnly"
        label="Card Number"
        type="text"
        outlined
        dense
      ></v-text-field>

      <v-layout>
        <v-flex xs6>
          <v-text-field
            v-model="creditCard.expiryMonth"
            :readonly="readOnly"
            label="Expiry Month"
            type="number"
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
            :readonly="readOnly"
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
        :readonly="readOnly"
        outlined
        dense
        hide-details
      ></v-text-field>
      <v-btn
        color="primary"
        class="mt-4"
        small
        :loading="addCardButtonLoader"
        :disabled="!isValid"
        @click="emitAddCardEvent"
        >Add</v-btn
      >
    </div>

    <div v-if="paymentMethod === 'PurchaseOrder'">
      <v-text-field
        v-model="purchaseOrderNumber"
        label="Purchase Order Number"
        maxlength="12"
        minlength="5"
        type="text"
        outlined
        dense
      ></v-text-field>
      <v-btn
        color="primary"
        class="mt-2"
        small
        :loading="applyOrderNumberLoader"
        :disabled="!isValid"
        @click="emitOrderNumber"
        >Apply Order Number</v-btn
      >
    </div>
    <div class="cc-container">
      <v-select
        v-if="paymentMethod === 'CreditCard'"
        v-model="selectedCreditCard"
        :items="mockCreditCards"
        label="Select Credit Card"
        item-text="cardNumber"
        item-value="id"
        @change="populateCreditCardDetails"
        class="cc-select-field"
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
      mockCreditCards: [],
      selectedCreditCard: null,
      creditCard: {
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardHolderName: "",
        saved: true,
      },
      readOnly: false,
      purchaseOrderNumber: "",
      minDate: new Date().toISOString().substr(0, 10),
      deleteDialog: false,
      cardToDelete: null,
      addCardButtonLoader: false,
      applyOrderNumberLoader: false,
    };
  },
  watch: {
    creditCards(newVal) {
      this.mockCreditCards = [...newVal];
      this.addCardButtonLoader = false;
    },
  },
  computed: {
    isValid() {
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
    },
  },
  methods: {
    emitAddCardEvent() {
      this.addCardButtonLoader = true;
      this.creditCard.saved = true;
      this.$emit("add-credit-card", this.creditCard);
    },
    emitOrderNumber() {
      this.$emit("apply-order-number", this.purchaseOrderNumber);
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
      const card = this.mockCreditCards.find((c) => c.id === cardId);
      if (card) {
        this.creditCard = { ...card };
        this.readOnly = true;
        this.emitPaymentDetails();
      }
    },
    openDeleteDialog(card) {
      this.cardToDelete = card;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      try {
        if (this.cardToDelete?.id) {
          await deleteCreditCard(this.cardToDelete.id);
          this.deleteDialog = false;
          this.cardToDelete = null;
        }
        this.$emit("card-deleted");
        this.resetFields();
      } catch (error) {
        console.error("Error deleting credit card:", error);
      }
    },
    resetFields() {
      this.creditCard = {
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardHolderName: "",
        saved: false,
        id: "",
      };
      this.readOnly = false;
    },
    emitPaymentDetails() {
      const paymentDetails =
        this.paymentMethod === "CreditCard"
          ? {
              method: "CreditCard",
              cardId: this.selectedCreditCard,
            }
          : {
              method: "PurchaseOrder",
              purchaseOrderNumber: this.purchaseOrderNumber,
            };

      this.$emit("update-payment", paymentDetails);
    },
  },
  mounted() {
    this.mockCreditCards = [...this.creditCards];
  },
};
</script>

<style class="scoped">
.cc-container {
  margin-top: 89px;
}
</style>
