import React, { Component } from "react";
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import Stocks from "./Stocks";
import Header from "./Header";
import {fire} from "../services/firebase";
import Spinner from "./Spinner";
import './Dashboard.css';
import Buy from "./Buy";


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false
        };
        this.getUserUpdates = this.getUserUpdates.bind(this);
    }

    componentDidMount() {
        this.removeAuthListener = fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authenticated: true,
                    currentUser: user,
                    loading: false,
                    user: user
                })
            } else {
                this.setState({
                    authenticated: false,
                    currentUser: null,
                    loading: false,
                    user: null
                })
            }
            // console.log("user ", this.state.user);
        });

    }

    componentWillUnmount() {
        this.removeAuthListener();
    }

    getUserUpdates(updated) {
        const user = {...this.state.user};
        // console.log("updating", updated);
        if (updated) {
            user.cash = updated.cash;
            user.stocks = updated.stocks;
            user.transactions = updated.transactions;
            // console.log("updated", user.stocks);
            this.setState({user: user})
        }
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
            <div className="dashboard">
                <Header authenticated={this.state.authenticated}/>

                <div className="hello">
                  {this.state.user ? "Portfolio for " + this.state.user?.email : ""}
                </div>
                <div className="tableau">
                    <Stocks stocks={(this.state.user) ? this.state.user.stocks : []}/>
                    <Buy user={this.state.user} updates={this.getUserUpdates}/>
                </div>

            </div>
        );
    }
}

export default Dashboard;
