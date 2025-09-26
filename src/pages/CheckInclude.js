import { Row, Col, Card, Tooltip, Button } from "antd";
import React, { useEffect, useState } from "react";
import { fetchFileList } from "../services/calcService";

/* ---------- 서버에서 JSON(or DB) 데이터 읽기 ---------- */
const fetchJson = async (fileName, setSearchFlag) => {
  setSearchFlag(true);
  try {
    const { data } = await fetchFileList(fileName);
    return data;
  } finally {
    setSearchFlag(false);
  }
};

/* ---------- 카드 리스트 ---------- */
function CardList({ dataSource }) {
  return (
    <Row gutter={[16, 24]} /* 가로16, 세로24 간격 */>
      {dataSource.map((elm) => (
        <Col
          key={elm.date}
          xs={24}  // 모바일(≤576px) → 한 줄 1개
          sm={12}  // 작은 태블릿(>576px) → 2개
          md={8}   // 큰 태블릿(>768px) → 3개
          lg={6}   // 데스크톱(>992px) → 4개
          xl={6}   // 대형 화면에서도 4개
        >
          <Card title={elm.date} className="check-card">
            {elm.items.map((item, i) => {
              const info = elm.check?.[i];
              const fail = info && !info.result;
              return (
                <div key={`${elm.date}-${i}`} style={{ marginBottom: 8 }}>
                  {info?.included ? (
                    <Tooltip
                      title={
                        info.included.length
                          ? info.included.map((obj, idx) => (
                              <div key={idx}>
                                {obj[5]} : {obj[8]}
                                {obj[9]}
                              </div>
                            ))
                          : "❗필수지정없음"
                      }
                    >
                      <span className={fail ? "fail-highlight" : ""}>
                        {item}
                      </span>
                    </Tooltip>
                  ) : (
                    <span className={fail ? "fail-highlight" : ""}>{item}</span>
                  )}

                  {info && (
                    <span
                      className={info.result ? "success" : "fail"}
                      style={{ margin: "0 10px" }}
                    >
                      {info.result ? "OK" : "CHECK!"}
                    </span>
                  )}

                  {fail && (
                    <div
                      style={{
                        padding: "4px 12px",
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 4,
                      }}
                    >
                      🚨 포함되지 않은 항목
                      <div style={{ paddingLeft: 10 }}>
                        {info.notIncluded.join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        </Col>
      ))}
    </Row>
  );
}

/* ---------- 메인 컴포넌트 ---------- */
export default function CheckInclude() {
  const [searchFlag, setSearchFlag] = useState(false);

  return (
    <div className="main-container">
      <FoodInputCheck
        category="menu"
        searchFlag={searchFlag}
        setSearchFlag={setSearchFlag}
      />
    </div>
  );
}

/* ---------- 식재료 체크 ---------- */
function FoodInputCheck({ category, setSearchFlag }) {
  const [dataSource, setDataSource] = useState([]);
  const [myFood, setMyFood] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    (async () => {
      const menu = await fetchJson(category, setSearchFlag);
      const my = await fetchJson("myFood", setSearchFlag);
      const ing = await fetchJson("ingredients", setSearchFlag);

      if (!menu) return;
      // 날짜별 메뉴 그룹핑
      const grouped = menu.data.reduce((acc, [date, dish]) => {
        if (!dish) return acc;
        acc[date] = [...(acc[date] || []), dish];
        return acc;
      }, {});
      setDataSource(
        Object.entries(grouped).map(([date, items]) => ({ date, items }))
      );
      setMyFood(my);
      setIngredients(ing);
    })();
  }, [category, setSearchFlag]);

  const checkFoodInput = () => {
    const toDate = (d) => new Date(d).toDateString();
    const checked = dataSource.map((elm) => {
      const target = toDate(elm.date);
      const check = elm.items.map((menu) => {
        const menuRows = myFood.data.filter((r) => r[2] === menu);
        const required = menuRows
          .filter((r) => r[10] === "필수")
          .map((r) => r[6]);
        const ingRows = ingredients.data.filter(
          (r) => toDate(r[1]) === target
        );
        const includedNames = new Set(ingRows.map((r) => r[5]));
        const notIncluded = required.filter((x) => !includedNames.has(x));
        return {
          result: !notIncluded.length,
          notIncluded,
          included: ingRows.filter((r) => required.includes(r[5])),
        };
      });
      return { ...elm, check };
    });
    setDataSource(checked);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <Button type="primary" onClick={checkFoodInput}>
          체크하기
        </Button>
      </div>
      <CardList dataSource={dataSource} />
    </div>
  );
}
