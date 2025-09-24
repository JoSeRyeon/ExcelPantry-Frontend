import apiClient from '../api/axios';

// 서버 요청 모음
export const fetchFileList = (category) =>
  apiClient.get('/calc/getFileData', { params: { category } });

// 실제 요청: /calc/getFileData?category=menu&category=ingredients&category=myFood
export const fetchMultiFileList = (categories) =>
  apiClient.get('/calc/getMultiFileData', {
    params: { category: categories }, // 배열 전달
  });

export const setFileData = (params) => apiClient.post('/calc/setFileData', params);
