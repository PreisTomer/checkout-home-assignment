import { apiRequest } from './service';

const ORDER_ENDPOINTS = {
  submitOrder: 'api/Order'
};

export const handleCheckout = ({ addressId, paymentDetails, orderDetails }) => {
  let orderData = {
    addressId: addressId,
    paymentMethod: orderDetails.paymentMethod,
    purchaseOrderNumber: paymentDetails.purchaseOrderNumber,
    paymentInfoId: paymentDetails?.paymentInfoId,
    cartId: orderDetails.cartId,
    termsAndConditionsAccepted: true,
    couponCode: orderDetails.couponCode
  };
  return orderData;
};

export const submitOrder = async (orderDetails) =>
  apiRequest('POST', ORDER_ENDPOINTS.submitOrder, orderDetails);
