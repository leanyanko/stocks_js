import React, { Component }  from 'react';
import './Item.css';
import Transaction from "./Transaction";



class Transactions extends Component {
    constructor() {
        super();
        this.state = {
            transactions: [],
            flag: 1
        };
        this.click = this.click.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps != this.props)
            this.setState({transactions: this.props.transactions});
    }

    click() {
        this.setState({flag: this.state.flag * (-1)});
    }

    render() {
        return (
            <div className="transactions">
                <button onClick={() => this.click()}>
                    {this.state.flag > 0 ? "Show transactions" : "Hide transactions"}
                </button>
                {this.props.transactions && this.state.flag < 0? this.props.transactions.map(tr =>
                    <Transaction transaction={tr.transaction} ticker={tr.ticker} today={tr.today} total={tr.total} qty={tr.qty}/>) : ""}
            </div>
        );
    }
}
export default Transactions;
