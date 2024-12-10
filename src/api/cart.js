import { apiRequest } from './service';

const CART_ENDPOINTS = {
  getCart: 'api/Cart',
  applyCoupon: 'api/Cart/coupon?couponCode='
};

export const getCart = async () => {
  try {
    const response = await apiRequest('GET', CART_ENDPOINTS.getCart);
    const cartItems = response.items.map((item) => {
      const [size, color] = item.product.sizeColor.split('/');
      return {
        id: item.id,
        name: item.product.name,
        size,
        color,
        imageUrl: item.product.imageUrl,
        price: item.product.price,
        discountedPrice: item.product.discountedPrice,
        quantity: item.quantity
      };
    });

    const orderSummary = {
      subtotal: response.subtotal,
      shipping: response.shipping,
      total: response.total,
      discount: response.discount,
      tax: response.tax,
      id: response.id
    };

    const appliedCouponCode = response.appliedCouponCode;

    return { cartItems, orderSummary, appliedCouponCode };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const applyCoupon = (couponCode) =>
  apiRequest('POST', CART_ENDPOINTS.applyCoupon + couponCode);
