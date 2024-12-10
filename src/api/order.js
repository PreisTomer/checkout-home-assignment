import { apiRequest } from './service';
import { addAddress, selectAddressForCheckout } from './address';
import {
  selectCreditCardMethod,
  applyPurchaseOrderNumber,
  addCreditCard
} from './payment';

const ORDER_ENDPOINTS = {
  submitOrder: 'api/Order'
};

export const handleCheckout = async ({
  selectedAddress,
  paymentDetails,
  orderDetails
}) => {
  try {
    // handle address
    if (!selectedAddress?.id) {
      // if no id, add the new address to get id from server
      selectedAddress.saved = true;
      const addressResponse = await addAddress(selectedAddress);
      selectedAddress.id = addressResponse.id;
    }
    // select the address for order
    const selectedAddressResponse = await selectAddressForCheckout(
      selectedAddress.id
    );
    orderDetails.addressId = selectedAddressResponse.id;

    // handle payment logic
    if (paymentDetails?.purchaseOrderNumber) {
      orderDetails.paymentMethod = 'PurchaseOrder';
      orderDetails.purchaseOrderNumber = paymentDetails.purchaseOrderNumber;
      await applyPurchaseOrderNumber(paymentDetails.purchaseOrderNumber);
    } else {
      orderDetails.paymentMethod = 'CreditCard';
      if (!paymentDetails?.id) {
        // if no id, add the new card to get id from server
        const creditCardResponse = await addCreditCard({
          ...paymentDetails,
          saved: true
        });
        paymentDetails.id = creditCardResponse.id;
      }
      await selectCreditCardMethod(paymentDetails.id);
      orderDetails.paymentInfoId = paymentDetails.id;
    }
    return orderDetails;
    // coupon already included in ordeDetails if exists
  } catch (error) {
    throw error.response?.data || error.message || 'An error occurred';
  }
};

export const submitOrder = async (orderDetails) =>
  apiRequest('POST', ORDER_ENDPOINTS.submitOrder, orderDetails);
