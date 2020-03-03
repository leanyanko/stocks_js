import React, { Component }  from 'react';
import './Item.css';

class Item extends Component {
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
            <div>
                {this.state.name}:     {this.state.price}
            </div>
        );
    }
}

export default Item;
