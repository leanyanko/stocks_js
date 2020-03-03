import axios from "axios";

const KEY ="GNBOFIS38GIFCV45";
const stock = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=`
const part = `&interval=1min&apikey=`

const stockService = {};

const url = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=aapl,msft,stwd,nflx,att&types=quote&token=pk_d620f6f7786d4c0b85979e5a527ef770`

stockService.get = (symbol) => {
    return axios.get(url);
};

export default stockService;
