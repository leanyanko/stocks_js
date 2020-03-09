import React, { Component }  from 'react';
import './Buy.css';
import { fire, db } from '../services/firebase';
import stockService from "../services/stocksService";
import userService from "../services/userService";

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
        this.updateUser = this.updateUser.bind(this);
        // console.log("constructor buy props", this.props.user);
        this.createNewUser = this.createNewUser.bind(this);
    }




    componentDidMount() {
        const refUser = db.ref().child('users');
        refUser.on('value', snap => {
            const users = snap.val();
            var user = {};
            var index = 0;
            for (index; index < users.length; index++) {
                if (users[index].email === this.props.user.email) {
                    user = users[index];
                    break;
                }
            }
            this.setState({user: user, id: index});
        });
    }


    createNewUser(user, ticker, qty, total) {
        user.cash -= total;
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

    buy(event) {
        event.preventDefault();
        const ticker = this.ticker.value;
        const qty = parseInt(this.qty.value);
        const total = parseFloat(this.state.total);
        const user = {...this.state.user};
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
        return (
            <div className="buy">
                In cash: {this.state.user.cash}

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
