import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class Left extends Component {
    toggle = (e)=>{
        const a = document.querySelectorAll('.side-menus a');
        for(let item of a){  item.classList.remove('active') }
        e.target.classList.add('active');
    };
    render () {
        return (
            <div className="side content-lf content-xs-lf">
                <div className='side-top'>菜单</div>
                <div className='side-menus'>
                    {
                        this.props.menus.map(it=>{
                            return (
                                <NavLink to={`/content/${this.props.menusRouteMap[it.type].name}`}
                                         onClick={this.toggle}
                                         key={it.type}
                                >{it.desc}</NavLink>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        menus : state.user.menus,
        menusRouteMap: state.common.menusRouteMap,
    }
};

const ConnectLeft = connect(
    mapStateToProps,
)(Left);

export default ConnectLeft;
