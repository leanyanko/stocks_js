import React, { Component } from "react";
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Login from "./Login";
import Logout from "./Logout";
import './Header.css';

class Header extends Component {
    render() {
        return(
            <div className="main-content" style={{padding: "1em"}}>
                <div className="workspace">
                    <nav>
                        <Router>
                            <span className="pt-navbar-divider"></span>
                            {this.props.authenticated ?
                                (<div>
                                    <Link to="/logout">Logout</Link>

                                </div>) :
                                <Link to="/login">Login/Register</Link>
                            }
                            <Switch>
                                <Route path="/login" component={Login}/>
                                <Route path="/logout" component={Logout}/>
                                <Route path="/" component={Home}/>
                            </Switch>
                        </Router>
                    </nav>
                </div>
            </div>
        );
    }
}

function Home (){
    return <div></div>
}

export default Header;
