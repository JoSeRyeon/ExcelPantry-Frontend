// import { Card, Button, Tooltip } from 'antd';
import { Card, Tooltip } from 'antd';
import React from 'react';

// export default function ResultCard({ data, headerInfo, onOpen }) {
export default function ResultCard({ data, headerInfo }) {
const sheetHeader =
    headerInfo.find(
      (e) =>
        e.sheetInfo.fileName === data.file &&
        e.sheetInfo.sheetName === data.sheetName
    )?.headerCell || [];

  return (
    <Card
      title={
        <Tooltip title={<div><div>{`파일명 : ${data.file}`}</div><div>{`시트명 : ${data.sheetName}`}</div></div>}>
          <span>{`파일명 : ${data.file}  시트명 : ${data.sheetName}`}</span>
        </Tooltip>}
      style={{ margin: '10px' }}
    >

      <div>
        {/* <Button danger onClick={() => onOpen(data)}>
          OPEN FILE
        </Button> */}
        <div style={{ background: '#FEF2F4', marginTop: 6 }}>
          <b>시트명 :</b> {data.sheetName}
        </div>
        <div style={{ background: '#FEF2F4' }}>
          <b>셀 위치 :</b> {data.cell}
        </div>
        <br />

        {data.value.split('\n').map((m, i) => (
          <p key={i} style={{ margin: 0, background: 'lavender' }}>
            {m}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        {data.list.map((m, idx) => (
          <p key={idx} style={{ margin: 4 }}>
            {sheetHeader[idx] ? (
              <span style={{ marginRight: 5, fontWeight: 600 }}>
                {sheetHeader[idx]} :
              </span>
            ) : null}
            {m}
          </p>
        ))}
      </div>
    </Card>
  );
}
