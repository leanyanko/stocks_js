import React, { Component }  from 'react';
import './Item.css';

class Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    componentDidMount() {

    }

    render() {
        return (
            <div className="item">
                <span>{this.props.transaction}</span>  <span>{this.props.ticker}</span> <span>{this.props.qty}</span>
                {/*<span>{this.props.today.getTime()}</span>*/}
                <span>{this.props.total}</span>

            </div>
        );
    }
}

export default Transaction;
