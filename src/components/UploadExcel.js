import { Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { fetchFileList } from '../services/excelService';
import apiClient from '../api/axios';

export default function UploadExcel({ onListUpdate }) {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 선택만 하고 바로 서버로 안 보냄
  const props = {
    name: 'excelFile',
    multiple: true,
    beforeUpload: file => {
      setFileList(prev => [...prev, file]);
      return false; // false → 자동 업로드 막고 수동 업로드
    },
    onRemove: file => {
      setFileList(prev => prev.filter(f => f.uid !== file.uid));
    },
    accept: '.xls,.xlsx'
  };

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    setUploading(true);

    try {
      // 여러 파일을 순차 또는 병렬 업로드
      const uploads = fileList.map(file => {
        const form = new FormData();
        form.append('excelFile', file);
        return apiClient.post('/excel/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      });

      await Promise.all(uploads);
      message.success('모든 파일이 업로드되었습니다.');

      // 서버에서 최신 파일 리스트 가져오기
      const res = await fetchFileList();
      onListUpdate?.(res.data.successFiles || []);

      setFileList([]); // 선택 목록 비우기
    } catch (err) {
      console.error(err);
      message.error('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: 200, textAlign: 'center' }}>
      <Upload.Dragger {...props} fileList={fileList} style={{ marginBottom: 16 }}>
        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        <p className="ant-upload-text">엑셀 파일을 선택하거나 드래그하세요</p>
        <p className="ant-upload-hint">여러 개 선택 가능 (등록 버튼을 눌러 업로드)</p>
      </Upload.Dragger>

      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
      >
        등록
      </Button>
    </div>
  );
}
