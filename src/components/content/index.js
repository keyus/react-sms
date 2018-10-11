import React, { Component } from 'react';
import Left from '../common/left';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import logo from '@/imgs/logo.png';
import avatar from '@/imgs/u3.png';
import Store from '@/store';
import { clearUser } from '@/action/user';
import { type, addTodo } from '@/action';
import './style.scss';

import Merchant from '@/components/content/merchant';
import Provider from '@/components/content/provider';
import ProviderModule from '@/components/content/providerModule';
import SmsHistory from '@/components/content/smsHistory';
import SpecialRules from '@/components/content/specialRules';

class Content extends Component {
    constructor(props){
        super(props);
        this.state = {
            logout : false
        }
    }
    closeLf = () => {
        let lf = document.querySelector('.content-lf');
        if (lf.classList.contains('active')) {
            Store.dispatch(addTodo(type['UPDATE_LF'], { updateLf: true }))
        }
    };

    logout = ()=>{
        this.props.clearUser();
        this.setState({ logout : true})
    };

    render () {
        const {match} = this.props;
        if(this.state.logout){
            return <Redirect to="/" />
        }
        return (
            <section className='app'>
                <div className='sidebar'>
                    <div className="sidebar-logo">
                        <img src={logo} alt=""/>
                    </div>
                    <ul>
                        <li className="active"><i className="material-icons">inbox</i></li>
                        <li onClick={this.logout} title="退出"><i className="material-icons">adjust</i></li>
                    </ul>
                    <div className='sidebar-user'>
                        <span title={ this.props.state.user.username }><img src={avatar} alt=""/><em></em></span>
                    </div>
                </div>
                <Left />
                <div className="content-rt mains" onClick={this.closeLf}>
                    <div className='main-top'>
                        <h1 className="main-top-title">控制台 > </h1>
                        <div className="main-top-user">
                            <ul>
                                <li><a href="javascript:;"  onClick={this.logout} >注销</a></li>
                                <li><a href="javascript:;">{this.props.state.user.username}</a></li>
                                <li><a href="javascript:;"><img src={avatar} alt=""/></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className='main-body'>
                        <Switch>
                            <Route path={`${match.path}/Merchant`}  component={Merchant}/>
                            <Route path={`${match.path}/Provider`} component={Provider}/>
                            <Route path={`${match.path}/ProviderModule`} component={ProviderModule}/>
                            <Route path={`${match.path}/SmsHistory`} component={SmsHistory}/>
                            <Route path={`${match.path}/SpecialRules`} component={SpecialRules}/>
                        </Switch>
                    </div>
                </div>
            </section>
        )

    }
}

const mapStateToProps = (state) => {
    return { state }
};
const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: () => {
            dispatch(clearUser());
        }
    }
}

const ConnectContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Content);

export default ConnectContent ;
