import React, { useEffect, useState, useRef } from "react";
import { addDays, format } from "date-fns";

import HistoryTable from "Components/HistoryTable";
import { fetchRates } from "Services/Currency";
import HistoryChart from "Components/HistoryChart";

const INTERVAL = 1000; //интервал каждую секунду
const symbols = ["USD", "EUR"]; // список отображаемых валют
const MAX_LENGTH = 30; // кол-во дней запроса исторических данных

const today = new Date();

const Main = () => {
  const [history, setHistory] = useState([]);
  const [active, setActive] = useState(false);

  const lastIntervalId = useRef();
  const lastDate = useRef(addDays(today, -MAX_LENGTH + 1));

  // при начальной загрузке подгружаем историю котировок
  // за прошлые с 60 по 30 дни
  useEffect(() => {
    fetchRates(
      format(addDays(today, -MAX_LENGTH * 2), "yyyy-MM-dd"),
      format(addDays(today, -MAX_LENGTH), "yyyy-MM-dd"),
      symbols
    ).then(data => {
      setHistory(
        Object.keys(data.rates)
          .map(date => ({
            date: new Date(date),
            ...data.rates[date]
          }))
          .sort((a, b) => a.date - b.date)
      );
      setActive(true);
    });
    return () => {
      clearInterval(lastIntervalId.current);
    };
  }, []);

  // начиная с 30 дней назад подгружаем историю каждую секунду по 1 дню до тек даты
  // эмулируя работу в реальном времени
  useEffect(() => {
    if (active) {
      let date = lastDate.current;
      lastIntervalId.current = setInterval(() => {
        if (date > today) {
          return setActive(false);
        }
        const day = format(date, "yyyy-MM-dd");
        fetchRates(day, day, symbols)
          .then(data => {
            if (data.error) {
              // в случае ошибки с кодом 200 останавливаем интервал
              setActive(false);
              return console.log(data.error);
            }

            // если ответ без данных значит выходной либо праздник, пропускаем день
            if (Object.keys(data.rates).length > 0) {
              setHistory(h => [...h, { date, ...data.rates[day] }]); // добавляем в историю новые данные
            }
            lastDate.current = addDays(lastDate.current, 1); // запоминаем последний загруженный день чтобы иметь возм. приостанавливать/возобновлять интервал с последнего дня
            date = addDays(date, 1); // сдвигаем дату на след день
          })
          .catch(er => {
            // в случае общей ошибки
            console.log(er);
            setActive(false);
          });
      }, INTERVAL);
    }
    if (!active) {
      clearInterval(lastIntervalId.current);
    }
  }, [active]);

  return (
    <div>
      <button onClick={() => setActive(!active)}>start/stop/continue</button>
      <HistoryChart history={history} symbols={symbols} />
      <HistoryTable history={history} symbols={symbols} />
    </div>
  );
};

export default Main;
