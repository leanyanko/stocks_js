import React, { Component }  from 'react';
import './Buy.css';
import { fire, db } from '../services/firebase';
import stockService from "../services/stocksService";

class Buy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // user: this.props.user
            user: {},
            cost: 0,
            dict: ["aapl", "msft", "nflx"]
        };
        this.buy = this.buy.bind(this);
        this.getPrice = this.getPrice.bind(this);
        // const
    }



    componentDidMount() {
        // console.log(this.state);
        const refUser = db.ref().child('users');
        refUser.on('value', snap => {
            const user = snap.val().filter(user => user.email === this.props.user.email)[0];
            this.setState({user: user});
            console.log("userrr", user);
        });
    }

    buy(event) {
        event.preventDefault();
        const that = this;
        const ticker = this.ticker.value;
        const qty = this.qty.value;
        // stockService.getSingle(ticker)
        //     .then((promise) => that.setState({cost: promise.data[ticker.toUpperCase()]["quote"]["latestPrice"]}));
        const total = this.state.total;
        const user = {...this.state.user};
        if (user.cash >= total) {
            user.cash -= total;
            const today = new Date();
            const transaction = "buy";
            if (!user.stocks) user.stocks = [];
            user.stocks.push({ticker, qty, total});
            if (!user.transactions) user.transactions= [];
            user.transactions.push({ticker, qty, total, today, transaction});

            this.setState({
                user:user
            })
        }
    }

    getPrice(ticker) {
        stockService.getSingle(ticker)
            .then((promise) => this.setState({price: promise.data[ticker.toUpperCase()]["quote"]["latestPrice"]}));
    }

    render() {
        console.log(this.state);
        return (
            <div className="buy">
                {this.state.user.cash}

                <form onSubmit={(event) => {this.buy(event)}} ref={(form) => {this.buyForm = form}}>
                    <input style={{width: "100%"}}
                           className="pt-input" type="text"
                           ref={(ticker => { this.ticker = ticker})}
                           onChange={(ticker) => {
                               if (this.state.dict.includes(this.ticker.value)) {
                                   this.getPrice(this.ticker.value);
                               }
                            }}
                           placeholder="ticker" />

                    <input style={{width: "100%"}}
                           className="pt-input"
                           type="number"
                           ref={(qty => {this.qty = qty})}
                           onChange={(qty) => {
                               if (this.state.price && this.state.price > 0 && this.qty.value ) {
                                   this.setState({total: this.qty.value * this.state.price})
                               }
                           }}
                           placeholder="0"/>
                    <input style={{width: "100%"}} type="submit" className="pt-button pt-intent-primary" value="Buy"></input>
                </form>
                <div className="total">
                    {this.state.total ? this.state.total : ""}
                </div>
            </div>
        );
    }
}

export default Buy;
