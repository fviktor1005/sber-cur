import axios from "axios";

const API_URL = "https://api.exchangeratesapi.io";

const fetchRates = async (from, to, symbols, base = "RUB") => {
  try {
    const { data } = await axios.get(
      `${API_URL}/history?base=${base}&start_at=${from}&end_at=${to}&symbols=${symbols.join(
        ","
      )}`
    );
    return data;
  } catch {}
};

export { fetchRates };
