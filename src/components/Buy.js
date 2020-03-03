import React, { Component }  from 'react';
import './Buy.css';

class Buy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            price: this.props.price
        };
    }


    componentDidMount() {
        console.log(this.state);
    }

    render() {
        return (
            <div className="buy">
                <span>{this.state.name}</span>  <span>{this.state.price}</span> <span>3</span>
            </div>
        );
    }
}

export default Buy;
