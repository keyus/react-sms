import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from '../components/login'
import Content from '../components/content'

class ViewRoute extends Component {
    render() {
        return (
            <Switch>
                <Redirect from='/' exact to='/login'/>
                <Route path="/login" component={Login}/>
                <Route path="/content" component={Content}/>
            </Switch>
        )
    }
}

export default ViewRoute;
