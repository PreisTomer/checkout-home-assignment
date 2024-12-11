import { apiRequest } from './service';

const PAYMENT_ENDPOINTS = {
  getOptions: 'api/Payment/options',
  getCreditCards: 'api/Payment/creditcards',
  addCreditCard: 'api/Payment/creditcards',
  getCreditCardsById: 'api/Payment/creditcards/{id}',
  deleteCreditCard: 'api/Payment/{id}',
  replaceCreditCardById: 'api/Payment/{id}',
  selectCreditCardMethod: 'api/Payment/creditcards/{cardId}',
  applyPurchaseOrderNumber: 'api/Payment/purchase-order/{purchaseOrderNumber}'
};

export const getPaymentOptions = () =>
  apiRequest('GET', PAYMENT_ENDPOINTS.getOptions);

export const getCreditCards = () =>
  apiRequest('GET', PAYMENT_ENDPOINTS.getCreditCards);

export const addCreditCard = (cardData) =>
  apiRequest('POST', PAYMENT_ENDPOINTS.addCreditCard, cardData);

export const getCreditCardsById = (id) =>
  apiRequest('GET', PAYMENT_ENDPOINTS.getCreditCardsById.replace('{id}', id));

export const deleteCreditCard = (id) =>
  apiRequest('DELETE', PAYMENT_ENDPOINTS.deleteCreditCard.replace('{id}', id));

export const replaceCreditCardById = (id, cardData) =>
  apiRequest(
    'PATCH',
    PAYMENT_ENDPOINTS.replaceCreditCardById.replace('{id}', id),
    cardData
  );

export const selectCreditCardMethod = (cardId) =>
  apiRequest(
    'PUT',
    PAYMENT_ENDPOINTS.selectCreditCardMethod.replace('{cardId}', cardId)
  );

export const applyPurchaseOrderNumber = async (purchaseOrderNumber) => {
  try {
    const response = await apiRequest(
      'PUT',
      PAYMENT_ENDPOINTS.applyPurchaseOrderNumber.replace(
        '{purchaseOrderNumber}',
        purchaseOrderNumber
      )
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
