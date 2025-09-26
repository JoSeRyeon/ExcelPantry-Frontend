import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Upload,
  Button,
  Typography,
  Divider,
  notification,
} from "antd";
import { InboxOutlined, CheckOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { fetchMultiFileList, setFileData } from "../services/calcService";

const { Dragger } = Upload;
const { Title } = Typography;

/* ---------- 공용 알림 ---------- */
const useNotify = () => {
  const [api, contextHolder] = notification.useNotification();
  const notify = (ok = true) =>
    api[ok ? "success" : "error"]({
      message: ok ? "저장 완료" : "저장 실패",
      description: ok ? "저장이 완료되었습니다." : "저장에 실패했습니다.",
      placement: "top",
      duration: 2,
    });
  return { notify, contextHolder };
};

/* ---------- 엑셀 파싱 ---------- */
function parseExcel(file, onParsed) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    const buffer = new Uint8Array(evt.target.result);
    const wb = XLSX.read(buffer, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (!json.length) return;
    const [header, ...rows] = json;
    onParsed({ fileName: file.name, header, data: rows });
  };
  reader.readAsArrayBuffer(file);
}

/* ---------- 개별 업로드 카드 ---------- */
function ExcelUploadCard({
  category,
  title,
  globalLoading,
  setGlobalLoading,
  latest,
  refresh,           // ✅ 부모의 initData
}) {
  const { notify, contextHolder } = useNotify();
  const [excelData, setExcelData] = useState({ fileName: "", header: [], data: [] });
  const [fileList, setFileList] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  // 파일 선택 시 엑셀 파싱
  const beforeUpload = (file) => {
    setDataReady(false);
    parseExcel(file, (parsed) => {
      setExcelData(parsed);
      setDataReady(true);
    });
    setFileList([file]);
    return false;
  };

  // 서버 저장
  const saveData = async () => {
    if (!dataReady) return;
    setGlobalLoading(true);
    try {
      await setFileData({
        category,
        fileName: excelData.fileName,
        data: excelData,
      });
      notify(true);

      // ✅ 저장 성공 후 최신 업로드 정보 재요청
      refresh();
      // 업로드 성공 후 입력 상태 초기화 (선택 사항)
      setFileList([]);
      setExcelData({ fileName: "", header: [], data: [] });
      setDataReady(false);
    } catch {
      notify(false);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <Card
      title={<Title level={5}>{title}</Title>}
      style={{ textAlign: "center", borderRadius: 16 }}
    >
      <Dragger
        name="file"
        accept=".xlsx,.xls"
        multiple={false}
        beforeUpload={beforeUpload}
        fileList={fileList}
        onRemove={() => {
          setFileList([]);
          setExcelData({ fileName: "", header: [], data: [] });
          setDataReady(false);
        }}
        style={{ borderRadius: 12 }}
      >
        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        <p className="ant-upload-text">파일을 끌어다 놓거나 클릭</p>
        <p className="ant-upload-hint">.xls / .xlsx 지원</p>
      </Dragger>

      {latest && latest.fileName && (
        <div style={{ marginTop: 12, fontSize: 13, color: "#555" }}>
          <div>마지막 업로드: <b>{latest.fileName}</b></div>
          <div>업로드 시간: {new Date(latest.uploadAt).toLocaleString()}</div>
        </div>
      )}

      <Button
        type="primary"
        shape="round"
        icon={<CheckOutlined />}
        style={{ marginTop: 16 }}
        onClick={saveData}
        loading={globalLoading}
        disabled={!dataReady}
      >
        등록
      </Button>

      {contextHolder}
      <Divider style={{ margin: "16px 0 0" }} />
    </Card>
  );
}

/* ---------- 메인 컴포넌트 ---------- */
export default function CheckUpload() {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [latestInfo, setLatestInfo] = useState({});

  const categories = [
    { key: "menu",        title: "식단표 업로드" },
    { key: "ingredients", title: "식재료 품의내역 업로드" },
    { key: "myFood",      title: "내 요리 업로드" },
  ];

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 최신 업로드 정보 조회
  const initData = async () => {
    setGlobalLoading(true);
    try {
      const res = await fetchMultiFileList(categories.map((c) => c.key));
      setLatestInfo(res.data || {});
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="check-upload-wrapper">
      <Row gutter={[24, 24]}>
        {categories.map(({ key, title }) => (
          <Col key={key} xs={24} md={8}>
            <ExcelUploadCard
              category={key}
              title={title}
              globalLoading={globalLoading}
              setGlobalLoading={setGlobalLoading}
              latest={latestInfo[key]}
              refresh={initData}          // ✅ 자식이 등록 후 호출
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
