import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import { type, addTodo } from '@/action';
import Merchant from '../../content/merchant';
import Provider from '../../content/provider';
import ProviderModule from '../../content/providerModule';
import SmsHistory from '../../content/smsHistory';
import SpecialRules from '../../content/specialRules';
const TabPane = Tabs.TabPane;


class HeadTabs extends Component {
    onChange = (activeKey) => {
        let { tabsList } = this.props;
        tabsList.activeKey = activeKey;
        this.props.updatedTabsList(Object.assign({},tabsList));
    }

    onRemove = (targetKey, action) => {
        if(action === 'remove'){
            let { tabsList } = this.props;
            let index = tabsList.list.findIndex(it=>it.type === Number(targetKey) );
            tabsList.list.splice(index ,1);
            if(targetKey === tabsList.activeKey ){
                if( index === 0 ){
                    tabsList.activeKey = '';
                }else{
                    tabsList.activeKey =  tabsList.list[index-1].type.toString();
                }
            }
            this.props.updatedTabsList(Object.assign({},tabsList));
        }
    }

    render () {
        const { tabsList } = this.props;

        return (
            <header className="head-top__box">
                <Tabs
                    hideAdd
                    tabBarGutter={8}
                    onChange={this.onChange}
                    activeKey={tabsList.activeKey}
                    type="editable-card"
                    onEdit={this.onRemove}
                >
                    {
                        tabsList.list.map(item =>
                            <TabPane tab={item.desc} key={item.type} style={{ marginTop: 20 }}>
                                {
                                    item.type === 1
                                    ?
                                    <Merchant />
                                    :
                                    item.type === 2
                                    ?
                                    <Provider />
                                    :
                                    item.type === 3
                                    ?
                                    <ProviderModule />
                                    :
                                    item.type === 4
                                    ?
                                    <SpecialRules />
                                    :
                                    item.type === 5
                                    ?
                                    <SmsHistory />
                                    :
                                    ''
                                }
                            </TabPane>
                        )
                    }
                </Tabs>
            </header>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        tabsList: state.common.tabsList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updatedTabsList: (tabsList) => {
            dispatch(addTodo(type['TABS_LIST'], { tabsList }))
        }
    }
}

const ConnectHeadTabs = connect(
    mapStateToProps,
    mapDispatchToProps
)(HeadTabs);

export default ConnectHeadTabs;
