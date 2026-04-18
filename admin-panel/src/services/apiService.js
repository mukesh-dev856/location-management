const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const apiService = {
  // Auth
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // States
  getStates: async (search = '', page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/states?search=${search}&page=${page}&limit=${limit}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createState: async (stateData) => {
    const response = await fetch(`${BASE_URL}/states`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(stateData),
    });
    return handleResponse(response);
  },

  updateState: async (id, stateData) => {
    const response = await fetch(`${BASE_URL}/states/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(stateData),
    });
    return handleResponse(response);
  },

  deleteState: async (id) => {
    const response = await fetch(`${BASE_URL}/states/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateStateStatus: async (id, status) => {
    const response = await fetch(`${BASE_URL}/states/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  // Cities
  getCities: async (search = '', page = 1, limit = 10) => {
    const response = await fetch(`${BASE_URL}/cities?search=${search}&page=${page}&limit=${limit}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createCity: async (cityData) => {
    const response = await fetch(`${BASE_URL}/cities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cityData),
    });
    return handleResponse(response);
  },

  updateCity: async (id, cityData) => {
    const response = await fetch(`${BASE_URL}/cities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(cityData),
    });
    return handleResponse(response);
  },

  deleteCity: async (id) => {
    const response = await fetch(`${BASE_URL}/cities/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateCityStatus: async (id, status) => {
    const response = await fetch(`${BASE_URL}/cities/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  getActiveStates: async () => {
    const response = await fetch(`${BASE_URL}/states/active`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
