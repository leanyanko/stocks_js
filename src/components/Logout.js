import React, { Component }  from 'react';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import Spinner from "./Spinner";
import { Redirect } from 'react-router-dom';
import {fire} from '../services/firebase';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }


    componentDidMount() {
        fire.auth().signOut().then(user => {
            this.setState({redirect: true});
        });
    }

    render() {
        if (this.state.redirect === true) {
            return <Redirect to="/"/>
        }

        return (
            <div style={{textAlign: "center", position: "absolute", top: "25%", left: "50%"}}>
                <h3>Logging Out</h3>
                <Spinner/>
            </div>
        )
    }
}

export default Logout;
