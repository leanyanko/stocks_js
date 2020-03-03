import React, { Component } from "react";
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import Stocks from "./Stocks";
import Header from "./Header";
import {fire} from "../services/firebase";
import Spinner from "./Spinner";


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false
        }
    }

    componentDidMount() {
        this.removeAuthListener = fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authenticated: true,
                    currentUser: user,
                    loading: false,
                })
            } else {
                this.setState({
                    authenticated: false,
                    currentUser: null,
                    loading: false,
                })
            }
        })
    }

    componentWillUnmount() {
        this.removeAuthListener();
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%" }}>
                    <h3>Loading</h3>
                    <Spinner />
                </div>
            )
        }
        return(
            <div>
                <Header authenticated={this.state.authenticated}/>
                <Stocks />
            </div>
        );
    }
}

export default Dashboard;
