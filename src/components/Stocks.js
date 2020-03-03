import React, { Component }  from 'react';
import stockService from "../services/stocksService";
import Item from './Item';
import './Stocks.css';

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
                const stocks = [
                    {name: "aapl", price: data.data["AAPL"]["quote"]["latestPrice"]},
                    {name: "msft", price: data.data["MSFT"]["quote"]["latestPrice"]},
                    {name: "stwd", price: data.data["STWD"]["quote"]["latestPrice"]},
                    {name: "nflx", price: data.data["NFLX"]["quote"]["latestPrice"]}
                ];
                this.setState({
                    stocks: stocks
                })
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state);
    }



    render() {

        return (
            <div className="stocksboard">
                {this.state.stocks.map((s, i) => <Item key={i} name={s.name} price={s.price}/>)}

            </div>
        );
    }
}

export default Stocks;
