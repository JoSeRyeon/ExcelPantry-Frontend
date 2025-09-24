import React, { useState, useEffect } from 'react';
import {
    Button, Spin, List, Popconfirm, message,
} from 'antd';
import { deleteFile, fetchFileList } from '../services/excelService';
import UploadExcel from '../components/UploadExcel';
import '../App.css';
import '../index.css';
import '../styles/SearchExcel.css';

export default function Upload() {

    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        setIsLoading(true);
        try {
            const filesRes = await fetchFileList();
            const success = filesRes.data.successFiles || [];
            setFiles(success);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="main-container">
            <Spin spinning={isLoading} size="large">
                <h2 style={{ marginTop: 0 }}>엑셀 파일 업로드</h2>
                <UploadExcel onListUpdate={initData} />
                <h3 style={{ marginTop: 24 }}>업로드된 파일 목록</h3>
                <List
                    bordered
                    dataSource={files}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Popconfirm
                                    title="이 파일을 삭제하시겠습니까?"
                                    onConfirm={async () => {
                                        try {
                                            await deleteFile(item.fileName);
                                            message.success('삭제 완료');
                                            // 다시 목록 로드
                                            initData();
                                        } catch {
                                            message.error('삭제 실패');
                                        }
                                    }}
                                >
                                    <Button danger size="small">삭제</Button>
                                </Popconfirm>
                            ]}
                        >
                            {item.fileName} (시트: {item.sheetList.join(', ')})
                        </List.Item>
                    )}
                />
            </Spin>
        </div>
    )
}