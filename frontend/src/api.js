import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:7071' });

export const getExperts = (page = 1, name = '', category = '') =>
  API.get(`/experts?page=${page}&name=${name}&category=${category}`);

export const getExpertById = (id) => API.get(`/experts/${id}`);

export const createBooking = (data) => API.post('/bookings', data);

export const getMyBookings = (email) => API.get(`/bookings?email=${email}`);

export const updateBookingStatus = (id, status) =>
  API.patch(`/bookings/${id}/status`, { status });