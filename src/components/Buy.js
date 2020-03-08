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
        console.log("constructor buy props", this.props.user);
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
        // this.setState({user: this.props.user});
        console.log("buy props", this.props.user);
    }


    updateUser(user, ticker, qty, total) {
        user.cash -= total;
        const today = new Date().toISOString();
        const transaction = "buy";
        if (!user.stocks) user.stocks = [];
        const tmp = user.stocks.filter(stock => stock.ticker === ticker)[0];

        if (tmp) {
            // tmp.qty = parseInt(tmp.qty) + qty;
            tmp.qty += qty;
            tmp.total += total;
        }
         else
             user.stocks.push({ticker, qty, total});

        if (!user.transactions) user.transactions= [];
        user.transactions.push({ticker, qty, total, today, transaction});

        this.setState({
            user:user
        });
        if (!user.id) user.id = this.state.id;
        db.ref('users/' + this.state.id).set({
            cash: user.cash,
            email: user.email,
            stocks: user.stocks,
            transactions: user.transactions
        });
        this.props.updates(user);
    }

    buy(event) {
        event.preventDefault();
        // const that = this;
        const ticker = this.ticker.value;
        const qty = parseInt(this.qty.value);
        const total = this.state.total;
        const user = {...this.state.user};
        if (user.cash >= total) {
            this.updateUser(user, ticker, qty, total);
        }
    }

    getPrice(ticker) {
        stockService.getSingle(ticker)
            .then((promise) => this.setState({price: promise.data[ticker.toUpperCase()]["quote"]["latestPrice"].toFixed(2)}));
    }

    render() {
        // console.log("state", this.state);
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
