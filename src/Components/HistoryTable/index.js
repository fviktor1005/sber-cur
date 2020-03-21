import React from "react";
import { format } from "date-fns";

const HistoryTable = ({ history, symbols }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            {symbols.map(s => (
              <th key={s}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.date}>
              <td>{format(new Date(item.date), "yyyy-MM-dd")}</td>
              {symbols.map(s => (
                <td key={s}>{(1 / item[s]).toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
