import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Button} from 'antd';
import {ApiRequestAsync} from '@/utils/fetch';
import {Redirect} from 'react-router-dom';
import {removeCookie, setCookie} from '../common/methods';
import Store from '@/store/index';
import {updateUser} from '@/action/user';
import IconPlane from '@/imgs/icon-plane.png';
import "./style.scss";

class Login extends Component {
    state = {
        isLogin: false, // 跳转页面状态
        error : '',
        username : '',
        password: '',
        loading : false,

        indexRoute : ''
    };

    componentDidMount() {
        removeCookie('Authorization');
        removeCookie('providerTypes');
    }
    clearError = ()=>{
        this.setState({error: ''});
    };
    submit = ()=>{
        this.check() && this.userLogin();
    };
    check = ()=>{
        const { username , password } = this.state;
        if(!username){
            this.setState({ error : '请输入用户名' });
            return false;
        }
        if(!password){
            this.setState({ error : '请输入密码' });
            return false;
        }
        return true;
    };

    async userLogin() {
        const { username , password } = this.state;
        this.setState({ loading : true });
        try{
            const res = await ApiRequestAsync("/users/login", "POST", { username, password },false);
            if (res.code === 0) {
                res.message.menus.sort( (a,b) => a.type > b.type );
                Store.dispatch(updateUser(Object.assign({}, res.message)));
                setCookie("Authorization", res.message.token);
                setCookie("providerTypes", JSON.stringify(res.message.providerTypes));
                setTimeout(()=>{
                    this.setState({
                        isLogin: true,
                        loading: false,
                        indexRoute : this.props.menusRouteMap[res.message.menus[0].type].name
                    });
                },50)
            }else{
                this.setState({ loading : false, error : res.message });
            }
        }catch (e) {
            this.setState({ loading : false, error: '网络错误，请稍后再试!' });
        }

    }

    render() {
        const {isLogin , indexRoute} = this.state;

        if (isLogin) {
            return <Redirect push to={`/content/${indexRoute}`} />
        }

        return (
            <div className="auth">
                <div className="auth-container">
                    <div className="auth-img">
                        <img src={IconPlane} alt=""/>
                    </div>
                    <div className='auth-main'>
                        <h1>短信管理系统</h1>
                        <p className='auth-tip'>
                            欢迎回来!
                        </p>
                        <div className='error'>{this.state.error}</div>
                        <div className='auth-form'>
                            <div className="auth-form-item">
                                <span><i className='material-icons'>person_outline</i></span>
                                <input type="text"
                                       placeholder='请输入用户名'
                                       onChange={v=> this.setState({ username : v.target.value }) }
                                       onKeyUp={this.clearError}  autoFocus />
                            </div>
                            <div className="auth-form-item">
                                <span><i className='material-icons'>lock</i></span>
                                <input type="password"
                                       placeholder='请输入密码'
                                       onChange={v=> this.setState({ password : v.target.value }) }
                                       onKeyUp={this.clearError} />
                            </div>
                        </div>
                        <div className='auth-login'>
                            <Button onClick={this.submit} loading={this.state.loading}>登 录</Button>
                        </div>

                        <div className='auth-forget'>
                            忘记密码?
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

const mapStateToProps = (state) => {
    return { menusRouteMap : state.common.menusRouteMap }
};
const ConnectLogin = connect(
    mapStateToProps,
)(Login);
export default ConnectLogin
