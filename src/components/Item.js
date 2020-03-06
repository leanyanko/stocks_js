import React, { Component }  from 'react';
import './Item.css';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            price: this.props.price,
        };
    }


    componentDidMount() {
        // console.log(this.state);
    }

    render() {
        return (
            <div className="item">
                <span>{this.state.name}</span>  <span>{this.state.price}</span> <span>{this.props.qty}</span>
            </div>
        );
    }
}

export default Item;
