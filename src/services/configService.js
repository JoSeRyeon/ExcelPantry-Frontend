import apiClient from '../api/axios';

export const getConfig = (params) => apiClient.get('/api/config', params);
export const saveConfig = (data) => apiClient.post('/api/config', data);