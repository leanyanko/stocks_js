import React, { Component }  from 'react';
import './Buy.css';
import { fire, db } from '../services/firebase';
import stockService from "../services/stocksService";
import userService from "../services/userService";

class Buy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            cost: 0,
            dict: ["aapl", "msft", "nflx", "stwd"]
        };
        this.buy = this.buy.bind(this);
        this.getPrice = this.getPrice.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.createNewUser = this.createNewUser.bind(this);
    }

    createNewUser(user, ticker, qty, total) {
        user.cash -= total;
        // user.cash = user.cash.toFixed(2);
        const today = new Date().toISOString();
        const transaction = "buy";
        if (!user.stocks) user.stocks = [];
        const tmp = user.stocks.filter(stock => stock.ticker === ticker)[0];
        total = parseFloat(total);
        if (tmp) {
            tmp.qty += qty;
            tmp.total += total;
        } else
            user.stocks.push({ticker, qty, total});

        if (!user.transactions) user.transactions = [];
        user.transactions.push({ticker, qty, total, today, transaction});
        return user;
    }

    updateUser(user, ticker, qty, total) {
        const newUser = this.createNewUser(user, ticker, qty, total);
        this.setState({
            user: newUser
        });
        if (!user.id) user.id = this.state.id;
        db.ref('users/' + this.state.id).set({
            cash: newUser.cash.toFixed(2),
            email: newUser.email,
            stocks: newUser.stocks,
            transactions: newUser.transactions
        });
        this.props.updates(newUser);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user && this.props != prevProps)
            this.setState({user: this.props.user, id: this.props.user.id});
    }

    buy(event) {
        event.preventDefault();
        const ticker = this.ticker.value;
        const qty = parseInt(this.qty.value);
        const total = parseFloat(this.state.total);
        const user = {...this.state.user};
        console.log("buying", this.state.id);
        if (user.cash >= total) {
            this.updateUser(user, ticker, qty, total);
        }
    }

    getPrice(ticker) {
        stockService.getSingle(ticker)
            .then((promise) =>
                this.setState({
                    price: promise.data[ticker.toUpperCase()]["quote"]["latestPrice"].toFixed(2)
                }));
    }

    render() {
        console.log("buy state", this.state)
        return (
            <div className="buy">
                {this.state.user ? <span>In cash: {parseFloat(this.state.user.cash).toFixed(2)}</span> : ""}

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
                                   this.setState({total: (this.qty.value * this.state.price).toFixed(2)})
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
