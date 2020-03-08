import React, { Component } from "react";
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import Stocks from "./Stocks";
import Header from "./Header";
import {db, fire} from "../services/firebase";
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
        this.getRespectiveUser = this.getRespectiveUser.bind(this);
    }

    componentDidMount() {
        this.removeAuthListener = fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authenticated: true,
                    // currentUser: user,
                    loading: false,
                    user: user
                })
                this.getRespectiveUser(user);
            } else {
                this.setState({
                    authenticated: false,
                    currentUser: null,
                    loading: false,
                    user: null
                })
            }
            console.log("user_done ", this.state.user);
        });

    }

    getRespectiveUser(user) {
        const oldUser = {...user};
        const refUser = db.ref().child('users');
        refUser.on('value', snap => {
            const users = snap.val();
            var dbUser = {};
            var index = 0;
            for (index; index < users.length; index++) {
                if (users[index].email === oldUser.email) {
                    dbUser = users[index];
                    break;
                }
            }
            if (dbUser.stocks) oldUser.stocks = dbUser.stocks;
            if (dbUser.transactions) oldUser.transactions = dbUser.transactions;
            dbUser.id = index;
            this.setState({user: dbUser});
            // console.log("done", this.state.user);
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
            console.log("updated", user.stocks);
            // this.setState({user: user})
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
        console.log(this.state.user)
        return(

            <div className="dashboard">
                <Header authenticated={this.state.authenticated}/>

                <div className="hello">
                  {this.state.user ? "Portfolio for " + this.state.user?.email : ""}
                </div>
                <div className="tableau">
                    {/*{this.state.user && this.state.user.id ?*/}
                        <Stocks stocks={(this.state.user) ? this.state.user.stocks : []} id={this.state.user? this.state.user.id : ""}/>
                        {/*: "" }*/}
                    <Buy user={this.state.user} updates={this.getUserUpdates}/>
                </div>

            </div>
        );
    }
}

export default Dashboard;
