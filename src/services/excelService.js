import apiClient from '../api/axios';

// 서버 요청 모음
export const fetchFileList   = () => apiClient.get('/excel/fileList');

export const fetchHeaderList = () => apiClient.get('/excel/searchHeader', '');

export const runBatchFile    = (fileName, sheetName, cellAddress) =>
  apiClient.post('/excel/runBatchFile', { fileName, sheetName, cellAddress });

export const searchDbKeyword   = (params) =>
  apiClient.post('/excel/search', params);

export const deleteFile = (fileName) =>
  apiClient.delete(`/excel/file/${encodeURIComponent(fileName)}`);

