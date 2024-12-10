<template>
  <div class="address-form">
    <div class="mt-1">
      <v-select
        v-model="selectedAddressId"
        :items="formattedAddresses"
        item-value="id"
        item-text="display"
        label="Select an Address"
        @input="fillAddress"
      >
        <template v-slot:selection="{ item }">
          <span>{{ item.display }}</span>
          <v-icon
            small
            class="ml-2"
            color="red"
            @click.stop="confirmDeleteAddress(item.id)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-select>

      <div class="address-inputs">
        <v-select
          v-model="address.country"
          :items="countries"
          label="Country"
          outlined
          dense
        ></v-select>
        <v-select
          v-model="address.state"
          :items="states"
          label="State"
          outlined
          dense
          :disabled="!['USA', 'Canada'].includes(address.country)"
        ></v-select>
        <v-text-field v-model="address.city" label="City" outlined dense />
        <v-text-field
          v-model="address.zipCode"
          label="Zip Code"
          outlined
          dense
        />
        <v-text-field
          v-model="address.addressLine1"
          label="Address Line 1"
          outlined
          dense
        />
        <v-text-field
          v-model="address.addressLine2"
          label="Address Line 2 (Optional)"
          outlined
          dense
        />
      </div>
    </div>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this address?
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn text color="red" @click="deleteSelectedAddress">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { deleteAddress, getStatesByCountry } from "../api/address";

export default {
  name: "AddressForm",
  props: ["addresses", "countries"],
  data() {
    return {
      selectedAddressId: null,
      mockAddresses: [],
      deleteDialog: false,
      addressIdToDelete: null,
      address: {},
      states: [],
    };
  },
  watch: {
    isValid(newVal) {
      this.$emit("validity-change", newVal);
    },
    "address.country"(newVal) {
      if (newVal === "USA" || newVal === "Canada") {
        this.getStates(newVal);
      }
    },
  },

  computed: {
    formattedAddresses() {
      return this.addresses.map((addr) => ({
        id: addr.id,
        display: `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`,
      }));
    },
    isValid() {
      return !!(
        this.address.country &&
        this.address.city &&
        this.address.addressLine1 &&
        this.address.zipCode
      );
    },
  },

  methods: {
    fillAddress() {
      this.mockAddresses = [...this.addresses];
      const selectedAddress = this.mockAddresses.find(
        (addr) => addr.id === this.selectedAddressId
      );
      if (selectedAddress.id) {
        this.selectedAddressId = selectedAddress.id;
        this.address = selectedAddress;
      } else {
        this.address = {
          country: "",
          state: "",
          city: "",
          zipCode: "",
          addressLine1: "",
          addressLine2: "",
        };
      }
      this.emitAddress();
    },
    async getStates(country) {
      this.states = await getStatesByCountry(country);
    },
    emitAddress() {
      this.$emit("update-address", { ...this.address });
    },
    getAddressData() {
      return { ...this.address, id: this.selectedAddressId };
    },
    confirmDeleteAddress(id) {
      this.addressIdToDelete = id;
      this.deleteDialog = true;
    },

    async deleteSelectedAddress() {
      try {
        await deleteAddress(this.addressIdToDelete);
        this.mockAddresses = this.formattedAddresses.filter(
          (addr) => addr.id !== this.addressIdToDelete
        );
        this.deleteDialog = false;
        this.addressIdToDelete = null;
        if (this.selectedAddressId === this.addressIdToDelete) {
          this.selectedAddressId = null;
          this.fillAddress();
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        this.deleteDialog = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
