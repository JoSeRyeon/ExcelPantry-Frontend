import { notification, Tabs, Table } from "antd";
import React, { useEffect, useState } from 'react'
import { fetchFileList } from "../services/calcService";

/* ---------- 공용 알림 ---------- */
const useNotify = () => {
    const [api, contextHolder] = notification.useNotification()
    const open = (ok = true) =>
        api.success({
            message: ok ? '저장 완료' : '저장 실패',
            description: ok ? '저장이 완료되었습니다.' : '저장에 실패했습니다.',
            placement: 'top',
            duration: 2,
        })
    return { notify: open, contextHolder }
}

/* ---------- 서버에서 JSON(or DB) 데이터 읽기 ---------- */
const fetchJson = async (fileName, setSearchFlag) => {
    setSearchFlag(true)
    try {
        const { data } = await fetchFileList(fileName);
        return data
    } finally {
        setSearchFlag(false)
    }
}

export default function CheckDb() {
    const [, setSearchFlag] = useState(false)
    const tabItems = [
        { key: 'menu', label: '식단표', children: <DataTable category="menu" setSearchFlag={setSearchFlag} /> },
        { key: 'ingredients', label: '식재료 품의내역', children: <DataTable category="ingredients" setSearchFlag={setSearchFlag} /> },
        { key: 'myFood', label: '내 요리', children: <DataTable category="myFood" setSearchFlag={setSearchFlag} /> },
    ]

    return (
        <div className="main-container">
            <Tabs defaultActiveKey="menu" items={tabItems} />
        </div>
    );
}

/* ---------- 테이블 ---------- */
function DataTable({ category, setSearchFlag }) {
    const [dataSource, setDataSource] = useState([])
    const [columns, setColumns] = useState([])
    const { contextHolder } = useNotify()

    useEffect(() => {
        (async () => {
            const excel = await fetchJson(category, setSearchFlag)
            if (!excel) return
            setColumns(
                excel.header.map((title, i) => ({
                    title,
                    dataIndex: `col_${i}`,
                    key: `col_${i}`,
                }))
            )
            setDataSource(
                excel.data.map((row, i) =>
                    row.reduce(
                        (acc, val, idx) => ({ ...acc, [`col_${idx}`]: val }),
                        { key: i }
                    )
                )
            )
        })()
    }, [category, setSearchFlag])

    return (
        <div>
            <Table columns={columns} dataSource={dataSource} />
            {contextHolder}
        </div>
    )
}


