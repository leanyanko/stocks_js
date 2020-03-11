import React, { Component } from "react";
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import Stocks from "./Stocks";
import Header from "./Header";
import {db, fire} from "../services/firebase";
import Spinner from "./Spinner";
import './Dashboard.css';
import Buy from "./Buy";
import Transactions from "./Transactions";


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false
        };
        this.getUserUpdates = this.getUserUpdates.bind(this);
        this.getRespectiveUser = this.getRespectiveUser.bind(this);
    }

    componentDidMount() {
        this.removeAuthListener = fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authenticated: true,
                    loading: false,
                });
                this.getRespectiveUser(user);
            } else {
                this.setState({
                    authenticated: false,
                    loading: false,
                    user: null
                })
            }
        });
    }

    getRespectiveUser(user) {
        const oldUser = {...user};
        var dbUser = {};
        const refUser = db.ref().child('users');
        refUser.on('value', snap => {
            const users = snap.val();
            for (let [key, value] of Object.entries(users)) {
                if (value.email === oldUser.email) {
                    dbUser = value;
                    dbUser.id = key;
                    break;
                }
            }
            this.setState({user: dbUser});
        });
    }

    componentWillUnmount() {
        this.removeAuthListener();
    }

    getUserUpdates(updated) {
        const user = {...this.state.user};
        if (updated) {
            user.cash = updated.cash;
            user.stocks = updated.stocks;
            user.transactions = updated.transactions;
            user.id = updated.id;
            this.setState({user: updated});
        }
    }

    render() {
        console.log("dashbord", this.state);
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
                    <Buy user={this.state.user} updates={this.getUserUpdates}/>
                    <Stocks stocks={(this.state.user) ? this.state.user.stocks : []} id={this.state.user? this.state.user.id : ""}/>
                    <Transactions transactions ={this.state.user ? this.state.user.transactions : []}/>
                </div>

            </div>
        );
    }
}

export default Dashboard;
