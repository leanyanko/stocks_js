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

    }

    componentDidMount() {
        stockService.get('MSFT')
            .then(data => {
                const tickers = [
                    {name: "aapl", price: data.data["AAPL"]["quote"]["latestPrice"]},
                    {name: "msft", price: data.data["MSFT"]["quote"]["latestPrice"]},
                    {name: "stwd", price: data.data["STWD"]["quote"]["latestPrice"]},
                    {name: "nflx", price: data.data["NFLX"]["quote"]["latestPrice"]}
                ];
                this.setState({
                    tickers: tickers
                })
            })
    }



    componentDidUpdate(prevProps, prevState, snapshot) {
        const stocks = this.props.stocks ? this.props.stocks.map(stock => {
            return this.state.tickers[stock.ticker] ?
            stock.price = this.state.tickers[stock.ticker].price
                : 0
        }) : [];
        console.log("tickers", this.state.tickers);
        console.log(this.props.stocks);
        console.log("new prices", stocks);
        // console.log("in previous stocks", this.state.stocks);

    }



    render() {

        return (
            <div className="stocksboard">
                {/*{this.props.stocks}*/}
                {/*{this.state.stocks.map((s, i) => <Item key={i} name={s.name} price={s.price}/>)}*/}
                {this.props.stocks ? this.props.stocks.map((s, i) => <Item key={i} name={s.ticker} price={s.total} qty={s.qty}/> ) : ""}

            </div>
        );
    }
}

export default Stocks;
