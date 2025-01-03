import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Add token to request headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Ensure token is stored after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Save a prototype form
export const savePrototypeForm = (formData) => API.post("/forms/prototype", formData);

// Save a filled form
export const saveFilledForm = (filledFormData) => API.post("/forms/filled", filledFormData);

// Get filled forms for a prototype form
export const getFilledForms = (prototypeFormId) => API.get(`/forms/${prototypeFormId}/filled`);
