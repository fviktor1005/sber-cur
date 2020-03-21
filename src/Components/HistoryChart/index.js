import React, { useMemo } from "react";
import { Chart } from "react-charts";

import "./HistoryChart.css";

const axes = [
  { primary: true, type: "utc", position: "bottom" },
  { type: "linear", position: "left" }
];

const HistoryChart = ({ history, symbols }) => {
  const data = useMemo(
    () =>
      symbols.map(s => ({
        label: s,
        data: history.map(h => ({ x: h.date, y: 1 / h[s] }))
      })),
    [history, symbols]
  );
  return (
    <div className="history-chart">
      <Chart data={data} axes={axes} tooltip />
    </div>
  );
};

export default HistoryChart;
