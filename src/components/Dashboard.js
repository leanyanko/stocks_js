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
        }
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
            console.log("user ", this.state.user);
        });

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
            <div className="dashboard">
                <Header authenticated={this.state.authenticated}/>

                <div className="hello">
                  {this.state.user ? "Portfolio for " + this.state.user?.email : ""}
                </div>
                <div className="tableau">
                    <Stocks />
                    <Buy user={this.state.user}/>
                </div>

            </div>
        );
    }
}

export default Dashboard;
