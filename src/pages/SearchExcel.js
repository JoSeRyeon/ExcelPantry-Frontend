import '../App.css';
import '../index.css';
import '../styles/SearchExcel.css';
import { useState, useEffect } from 'react';
import {
  Input, Col, Row, notification,
  Spin, Select, Empty
} from 'antd';
import 'dayjs/locale/ko';

import {
  fetchFileList,
  fetchHeaderList,
  runBatchFile,
  // ⚡️새 DB 검색 API (백엔드 구현 필요)
  searchDbKeyword as searchKeyword
} from '../services/excelService';

import ResultCard from '../components/ResultCard';

export default function SearchExcel() {
  const { Search } = Input;
  const [notiApi, contextHolder] = notification.useNotification();

  // === State ===
  const [isLoading, setIsLoading] = useState(false);
  const [fileOptions, setFileOptions] = useState([]);
  const [sheetOptions, setSheetOptions] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [results, setResults] = useState([]);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [errorFiles, setErrorFiles] = useState([]);
  const [errorSheets, setErrorSheets] = useState([]);

  // === Effects ===
  useEffect(() => { 
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  useEffect(() => { 
    if (errorFiles.length) notify('error', '파일 문제', errorFiles); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorFiles]);
  useEffect(() => { 
    if (errorSheets.length) notify('warning', '시트 검색 실패', errorSheets); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorSheets]);

  // === Handlers ===
  const notify = (type, title, list) =>
    notiApi[type]({
      message: title,
      description: (
        <div>
          {list.map((d, i) => <div key={i}>★ {d}</div>)}
          <div>에서 문제가 발생했습니다.</div>
        </div>
      ),
      placement: 'top',
      duration: type === 'error' ? null : 4
    });

  const initData = async () => {
    setIsLoading(true);
    try {
      const [filesRes, headersRes] = await Promise.all([
        fetchFileList(),
        fetchHeaderList()
      ]);
      const success = filesRes.data.successFiles || [];
      setErrorFiles(filesRes.data.errorFiles || []);
      setFileOptions(success.map(f => ({
        value: f.fileName,
        label: `${f.fileName} (시트: ${f.sheetList.join(', ')})`,
        sheet: f.sheetList
      })));

      setHeaderInfo(headersRes.data.result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (_, selected) => {
    setSelectedFiles(selected);
    const sheets = selected.flatMap(obj =>
      obj.sheet.map(s => ({ key: s, label: s, file: obj.value, value: s }))
    );
    setSheetOptions(sheets);
    setSelectedSheets(prev => prev.filter(s => selected.some(f => f.value === s.file)));
  };

  const handleSearch = async (val) => {
    if (!val) { setResults([]); return; }

    setIsLoading(true);
    try {
      const res = await searchKeyword({
        keyword: val,
        selectedFileList: selectedFiles,
        selectedSheetList: selectedSheets
      });
      const data = res.data[0] || {};

      setResults(data.searchResult || []);
      setErrorSheets(data.errorSheetList || []);
    } finally {
      setIsLoading(false);
    }
  };

  const openFile = async (data) => {
    try { await runBatchFile(data.file, data.sheetName, data.cell); }
    catch (e) { console.error(e); }
  };

  // === Render ===
  return (
    <div className="main-container">
      <Spin spinning={isLoading} size="large">
        {contextHolder}

        <div>
          {/* 원래 자리의 검색창 (스크롤 맨 위에서는 이게 보임) */}
          <div className="search-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search
                placeholder="검색어를 입력하세요"
                allowClear
                enterButton="Search"
                onSearch={handleSearch}
                size='large'
                style={{ flex: 1 }}
              />
            </div>
            <div>
              <Select
                mode="multiple"
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Select FileName"
                options={fileOptions}
                value={selectedFiles}
                onChange={handleFileSelect}
                allowClear
              />
              <Select
                mode="multiple"
                style={{ width: '100%', marginTop: 12 }}
                placeholder="Select Sheet"
                options={sheetOptions}
                value={selectedSheets}
                onChange={(_, s) => setSelectedSheets(s)}
                allowClear
              />
            </div>
          </div>


          {/* 결과 */}
          <div className="result-offset">
            {results.length && headerInfo.length ? (
              <Row gutter={16} style={{ marginTop: 20 }}>
                {results.map((r, idx) => (
                  <Col key={idx} span={4}>
                    <ResultCard
                      data={r}
                      headerInfo={headerInfo}
                      onOpen={openFile}
                    />
                  </Col>
                ))}
              </Row>
            ) : !isLoading && <Empty className="blankContainer" description={false} />}
          </div>
        </div>

      </Spin>
    </div>
  );
}
