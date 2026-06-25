import api from './axios';

export const uploadDocuments = (formData, onUploadProgress) =>
  api.post('/upload/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
    onUploadProgress,
  });

export const getUploadStatus = (itineraryId) =>
  api.get(`/upload/status/${itineraryId}`);

export const generateItinerary = (itineraryId) =>
  api.post('/itinerary/generate', { itineraryId });

export const getItineraryStatus = (id) =>
  api.get(`/itinerary/${id}/status`);

export const getAllItineraries = (params = {}) =>
  api.get('/itinerary', { params });

export const getItinerary = (id) =>
  api.get(`/itinerary/${id}`);

export const deleteItinerary = (id) =>
  api.delete(`/itinerary/${id}`);

export const toggleShare = (id) =>
  api.patch(`/itinerary/${id}/share`);

export const getSharedItinerary = (token) =>
  api.get(`/share/${token}`);
