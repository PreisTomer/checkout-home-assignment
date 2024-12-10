import { apiRequest } from './service';

const ADDRESS_ENDPOINTS = {
  getAddress: 'api/Address',
  addAddress: 'api/Address',
  getAddressById: 'api/Address/{id}',
  deleteAddress: 'api/Address',
  replaceAddressById: 'api/Address/{id}',
  selectAddressForCheckout: 'api/Address/select/{id}',
  getCountries: 'api/Address/countries',
  getStatesByCountry: 'api/Address/states/{country}'
};

export const getAddresses = () =>
  apiRequest('GET', ADDRESS_ENDPOINTS.getAddress);

export const addAddress = (data) =>
  apiRequest('POST', ADDRESS_ENDPOINTS.addAddress, data);

export const getAddressById = (id) =>
  apiRequest('GET', ADDRESS_ENDPOINTS.getAddressById.replace('{id}', id));

export const deleteAddress = (id) =>
  apiRequest('DELETE', `${ADDRESS_ENDPOINTS.deleteAddress}/${id}`);

export const replaceAddressById = (id, data) =>
  apiRequest(
    'PATCH',
    ADDRESS_ENDPOINTS.replaceAddressById.replace('{id}', id),
    data
  );

export const selectAddressForCheckout = (id) =>
  apiRequest(
    'PUT',
    ADDRESS_ENDPOINTS.selectAddressForCheckout.replace('{id}', id)
  );

export const getCountries = () =>
  apiRequest('GET', ADDRESS_ENDPOINTS.getCountries);

export const getStatesByCountry = (country) =>
  apiRequest(
    'GET',
    ADDRESS_ENDPOINTS.getStatesByCountry.replace('{country}', country)
  );
