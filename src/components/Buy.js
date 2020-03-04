import React, { Component }  from 'react';
import './Buy.css';
import { fire, db } from '../services/firebase';

class Buy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // user: this.props.user
            user: {}
        };
        this.buy = this.buy.bind(this);
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
        const tiker = this.tiker.value;
        const qty = this.qty.value;
        console.log({tiker, qty});
    }

    render() {
        return (
            <div className="buy">
                {this.state.user.cash}

                <form onSubmit={(event) => {this.buy(event)}} ref={(form) => {this.buyForm = form}}>
                    <input style={{width: "100%"}} className="pt-input" type="text" ref={(tiker => {this.tiker = tiker})} placeholder="tikker" />
                    <input style={{width: "100%"}} className="pt-input" type="number" ref={(qty => {this.qty = qty})} placeholder="0"/>
                    <input style={{width: "100%"}} type="submit" className="pt-button pt-intent-primary" value="Buy"></input>
                </form>
            </div>
        );
    }
}

export default Buy;
