import React, { Component }  from 'react';
import stockService from "../services/stocksService";
import Item from './Item';
import './Stocks.css';
import {db} from '../services/firebase'



class Stocks extends Component {
    constructor() {
        super();
        this.state = {
            stocks: []
        };
        this.calculateTotal = this.calculateTotal.bind(this);

    }

    componentDidMount() {
        stockService.get('MSFT')
            .then(data => {
                const tickers = {
                    "aapl" :  data.data["AAPL"]["quote"]["latestPrice"],
                    "msft": data.data["MSFT"]["quote"]["latestPrice"],
                    "stwd": data.data["STWD"]["quote"]["latestPrice"],
                    "nflx": data.data["NFLX"]["quote"]["latestPrice"]
                };
                this.setState({
                    tickers: tickers
                })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.calculateTotal();

    }

    calculateTotal() {
        const stocks = this.props.stocks ? [...this.props.stocks] : [];
        var flag = false;
        stocks.map(stock => {
            if (stock) {
                stock.price =  this.state.tickers[stock.ticker];
                const total = stock.qty ? (stock.qty * stock.price).toFixed(2) : 0;
                if (total != stock.total) {
                    flag = true;
                    stock.total = total;
                }
            }
            return stock;
        });

        if (flag) {
            const reducer = (acc, current) =>  acc + parseFloat(current.total);
            const total = stocks.reduce(reducer, 0).toFixed(2);
            this.setState({stocks : stocks, total : total});
        }
    }



    render() {

        return (
            <div className="stocksboard">
                In stocks: {this.state.total}
                {this.state.stocks ? this.state.stocks.map((s, i) => <Item key={i} name={s.ticker} price={s.total} qty={s.qty}/> ) : ""}

            </div>
        );
    }
}
export default Stocks;
