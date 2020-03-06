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
        console.log("in stocks", this.props.stocks);
        console.log("in previous stocks", this.state.stocks);

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
